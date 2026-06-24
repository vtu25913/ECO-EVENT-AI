/**
 * POST /api/ai-advisor/chat
 *
 * Hybrid AI Sustainability Advisor chat.
 * - Uses OpenAI API when AI_API_KEY env var is configured
 * - Falls back to built-in rule-based responses when AI is unavailable
 */

/**
 * Build the system prompt for the AI with optional event context.
 */
function buildSystemPrompt(context) {
  let prompt = `You are AI Sustainability Advisor, an expert assistant specialized in environmental sustainability, green event planning, and UN Sustainable Development Goals (SDGs). You work for EcoEvent AI, a platform that helps organizations measure and improve the environmental impact of events.

Key areas of expertise:
- Event sustainability scoring and certification (Bronze, Silver, Gold, Platinum)
- Carbon footprint measurement and reduction strategies
- Waste management and circular economy principles
- Water conservation and responsible usage
- Energy efficiency and renewable energy adoption
- SDG alignment (SDGs 6, 7, 11, 12, 13, 15)
- Sustainable transportation and logistics
- Green materials and supply chain

Response guidelines:
- Be comprehensive, specific, and actionable
- Use clear formatting with bullet points and sections
- Include specific metrics and data where relevant
- Reference the user's event context when provided
- Keep responses professional but approachable
- Use emojis sparingly for visual organization
- Keep responses concise (under 500 words)`

  if (context?.scores && context?.formData) {
    const { scores, formData, impact, certification } = context
    prompt += `\n\nCurrent event being analyzed:\n- Event Name: ${formData.eventName || 'N/A'}\n- Organization: ${formData.organization || 'N/A'}\n- Category: ${formData.category || 'N/A'}\n- Participants: ${formData.participants || 'N/A'}\n- Duration: ${formData.duration || 'N/A'} days\n\nSustainability Scores (0-100):\n- Overall: ${scores.overall || 'N/A'}\n- Carbon: ${scores.carbon || 'N/A'}\n- Water: ${scores.water || 'N/A'}\n- Waste: ${scores.waste || 'N/A'}\n- Energy: ${scores.energy || 'N/A'}\n- Environmental Impact: ${scores.environmental || 'N/A'}\n\nCertification: ${certification?.levelName || certification?.level || 'N/A'}\nCarbon Impact: ${impact?.carbonEmissions || 'N/A'} kg CO₂e\n\nCurrent initiatives: ${(formData.initiatives || []).join(', ') || 'None'}\nTransport: ${formData.transport || 'N/A'}\nWater source: ${formData.water || 'N/A'}\nFood service: ${formData.food || 'N/A'}\nEnergy level: ${formData.energy || 'N/A'}\nRegistration: ${formData.registration || 'N/A'}\nCertificates: ${formData.certificates || 'N/A'}\nWaste segregation: ${formData.wasteSegregation || 'N/A'}`
  }

  return prompt
}

/**
 * Call OpenAI chat completions API.
 */
async function callOpenAI(message, context) {
  const apiKey = process.env.AI_API_KEY
  const systemPrompt = buildSystemPrompt(context)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || null
}

/**
 * Get a rule-based fallback response when OpenAI is unavailable.
 */
function getLocalResponse(lower, context) {
  if (context?.scores && context?.formData) {
    const { scores, formData, certification } = context

    if (lower.includes('score') || lower.includes('rating') || lower.includes('how did i do')) {
      return `📊 **Your Sustainability Score: ${scores.overall}/100**\n\n` +
        `Here's your breakdown:\n💨 **Carbon:** ${scores.carbon}/100\n💧 **Water:** ${scores.water}/100\n🗑️ **Waste:** ${scores.waste}/100\n⚡ **Energy:** ${scores.energy}/100\n🌿 **Environmental:** ${scores.environmental}/100\n\n` +
        `🏅 **Certification:** ${certification?.level || 'N/A'}\n` +
        `Your event **${formData.eventName || 'Untitled'}** by ${formData.organization || 'your organization'} is performing ` +
        `${scores.overall >= 75 ? '🌟 excellently!' : scores.overall >= 50 ? '👍 well' : '📈 with room for improvement'}.`
    }

    if (lower.includes('improve') || lower.includes('better')) {
      return `📈 **Improvement Suggestions**\n\n` +
        `Based on your analysis, here are top ways to improve:\n\n` +
        `1. **Transportation** — Choose sustainable transport options\n` +
        `2. **Waste Management** — Implement proper segregation\n` +
        `3. **Energy Efficiency** — Switch to LED and renewable energy\n` +
        `4. **Digital Transformation** — Reduce paper usage\n\n` +
        `💡 Start with the easiest changes for quick wins!`
    }

    if (lower.includes('carbon') || lower.includes('emission')) {
      return `💨 **Carbon Impact Analysis**\n\n**Score: ${scores.carbon}/100**\n\n` +
        `Your event scores well in carbon management.\n🎯 Aim to reduce emissions by choosing sustainable transport and energy.`
    }

    if (lower.includes('certification') || lower.includes('badge') || lower.includes('level')) {
      const levels = [
        { min: 90, label: 'Platinum', emoji: '🥇' },
        { min: 75, label: 'Gold', emoji: '🥇' },
        { min: 60, label: 'Silver', emoji: '🥈' },
        { min: 40, label: 'Bronze', emoji: '🥉' },
      ]
      const current = levels.find(l => scores.overall >= l.min) || { label: 'Unsustainable', emoji: '📉' }
      return `🏅 **Certification: ${current.emoji} ${current.label}**\n\n` +
        `Your event scored **${scores.overall}/100** with certification level **${certification?.level || 'N/A'}**.\n\n` +
        `${scores.overall >= 90 ? '🎉 You\'ve achieved the highest tier — Platinum!' :
          scores.overall >= 75 ? '🎉 Great job reaching Gold! Push for Platinum next time.' :
          scores.overall >= 60 ? '👍 Good start at Silver! Aim for Gold.' :
          '💪 Keep working on improvements to reach the next tier.'}`
    }
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey') || lower === 'hi') {
    return `👋 **Hello! I'm the AI Sustainability Advisor.**\n\n` +
      `I can help you with:\n📊 **Analyze your event scores**\n💡 **Get improvement tips**\n🌍 **Learn about sustainability**\n🏅 **Check certifications**\n\nHow can I assist you today? 🌿`
  }

  if (lower.includes('waste') || lower.includes('reduc') || lower.includes('recycl')) {
    return `♻️ **Waste Reduction Strategies**\n\n` +
      `1. **Digital Transformation** — QR codes, digital certificates, e-invitations\n` +
      `2. **Waste Management** — Segregation stations, composting, recycling partners\n` +
      `3. **Single-Use Alternatives** — Refill stations, reusable/biodegradable materials`
  }

  if (lower.includes('carbon neutral') || lower.includes('net zero') || lower.includes('offset')) {
    return `🌍 **Achieving Carbon Neutrality**\n\n` +
      `1. **Measure** your footprint with our Event Analyzer\n` +
      `2. **Reduce** energy, transport, and material usage\n` +
      `3. **Offset** remaining emissions through verified programs`
  }

  if (lower.includes('energy') || lower.includes('solar') || lower.includes('renewable')) {
    return `☀️ **Sustainable Energy Solutions**\n\n` +
      `• **Solar Power** — Portable generators, charging stations\n• **LED Lighting** — 90% less energy consumption\n• **Smart Controls** — Thermostats, motion sensors\n• **Green Tariffs** — Choose renewable energy providers`
  }

  if (lower.includes('plastic')) {
    return `🚰 **Plastic-Free Alternatives**\n\n` +
      `• **Water Refill Stations** — Install portable dispensers\n• **Bulk Dispensers** — Reduce packaging waste by 90%\n• **Compostable Alternatives** — Plant-based bottles\n• **Aluminum Bottles** — Infinitely recyclable`
  }

  if (lower.includes('sdg') || lower.includes('sustainable development goal') || lower.includes('un ')) {
    return `🌍 **UN Sustainable Development Goals**\n\n` +
      `**SDG 6** 💧 Clean Water — Use refill stations\n**SDG 7** ⚡ Clean Energy — Renewable sources\n` +
      `**SDG 11** 🏙️ Sustainable Cities — Accessible venues\n**SDG 12** 🔄 Responsible Consumption — Minimize waste\n` +
      `**SDG 13** 🌍 Climate Action — Measure carbon footprint\n**SDG 15** 🌳 Life on Land — Eco-friendly venues`
  }

  return `🌿 **Sustainability Insights**\n\n` +
    `Great question! Here are best practices for sustainable events:\n\n` +
    `1. Use our **Event Analyzer** to assess your event\n` +
    `2. **Go digital** — reduce paper with QR codes\n` +
    `3. **Choose sustainable materials** — reusable or compostable\n` +
    `4. **Encourage green transportation** — public transit, carpooling\n` +
    `5. **Select eco-venues** with green certifications\n\n` +
    `Would you like me to elaborate on any specific area?`
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { message, context } = body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const lower = message.toLowerCase()
    let response = ''
    let source = 'local'

    // Try OpenAI if API key is configured
    const apiKey = process.env.AI_API_KEY
    if (apiKey) {
      try {
        const aiResponse = await callOpenAI(message, context)
        if (aiResponse) {
          response = aiResponse
          source = 'ai'
        }
      } catch (err) {
        console.warn('OpenAI call failed, using local fallback:', err.message)
      }
    }

    // Fall back to rule-based responses
    if (!response) {
      response = getLocalResponse(lower, context)
    }

    res.json({ success: true, response, source })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
