/**
 * AI Advisor Service
 * 
 * Hybrid AI model with:
 * - Mode 1: Local Sustainability Assistant (simple/FAQ questions)
 * - Mode 2: AI Expert Mode (complex sustainability analysis)
 * - Response caching to minimize AI API calls
 * - Context awareness (passes event analysis data to the AI)
 * - Graceful fallback when AI is unavailable
 */

// ─── Cache ───────────────────────────────────────────────────────────────────
const responseCache = new Map()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function getCachedResponse(question) {
  const cacheKey = question.toLowerCase().trim().replace(/\s+/g, ' ')
  const cached = responseCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.response
  }
  if (cached) responseCache.delete(cacheKey)
  return null
}

function setCachedResponse(question, response) {
  const cacheKey = question.toLowerCase().trim().replace(/\s+/g, ' ')
  responseCache.set(cacheKey, { response, timestamp: Date.now() })
}

// ─── Question Classification ─────────────────────────────────────────────────

/**
 * Simple/greeting patterns that NEVER need the AI
 */
const SIMPLE_PATTERNS = [
  /^(hello|hi|hey|greetings|good\s+(morning|afternoon|evening))\b/i,
  /^(thanks|thank\s+(you|u))(\s|$)/i,
  /^(who\s+are\s+you|what\s+can\s+you\s+do|help)\b/i,
  /^(great|awesome|nice|cool|perfect)\s*(!|$)/i,
  /^(ok|okay|bye|goodbye)\b/i,
]

/**
 * Local-sustainability keywords we handle without the AI
 */
const LOCAL_KEYWORDS = [
  'score', 'rating', 'carbon', 'emission', 'co2',
  'waste', 'recycle', 'recycl', 'water',
  'energy', 'solar', 'renewable',
  'certification', 'badge', 'level',
  'plastic', 'bottle',
  'sdg', 'sustainable development goal',
  'improve', 'how can i', 'better',
  'reduce', 'reduc',
  'carbon neutral', 'net zero', 'offset',
  'green',
]

/**
 * Complex/problem-solving keywords that trigger AI expert mode
 */
const COMPLEX_KEYWORDS = [
  'expert', 'analyze', 'recommendation', 'recommend',
  'suggest', 'framework', 'strategy', 'strategies',
  'detailed', 'comprehensive', 'roadmap',
  'scoring', 'evaluat', 'assess',
  'impact analysis', 'environmental impact',
  '20', 'list of', 'generate',
]

/**
 * Determines whether a question is complex enough for AI expert mode.
 * 
 * Mode 1 (Local) – for simple FAQs, greetings, common sustainability knowledge
 * Mode 2 (AI) – for complex analysis, recommendations, scoring frameworks
 */
export function isComplexQuestion(question) {
  const lower = question.toLowerCase().trim()

  // Check for simple patterns first
  for (const pattern of SIMPLE_PATTERNS) {
    if (pattern.test(lower)) return false
  }

  // Check for expert/complex keywords
  for (const keyword of COMPLEX_KEYWORDS) {
    if (lower.includes(keyword)) return true
  }

  // Longer, detailed questions are complex
  const wordCount = lower.split(/\s+/).length

  // If it has sustainability context but is long (>20 words), it's complex
  const hasLocalContext = LOCAL_KEYWORDS.some(k => lower.includes(k))

  if (wordCount > 20 && !hasLocalContext) return true
  if (wordCount > 12 && lower.includes('how') && lower.includes('can')) return true
  if (wordCount > 15 && lower.includes('what') && lower.includes('impact')) return true

  // Questions asking for multiple items (numbered lists, etc.)
  if (/\b\d+\s+(recommendation|suggestion|tip|strategy|way|idea)\b/i.test(lower)) return true

  return false
}

// ─── Local Fallback Response Engine ──────────────────────────────────────────

function getLocalScoreResponse(context) {
  const { scores, certification } = context
  return `📊 **Your Sustainability Score: ${scores.overall}/100**\n\n` +
    `Here's your breakdown across all categories:\n\n` +
    `💨 **Carbon:** ${scores.carbon}/100\n` +
    `💧 **Water:** ${scores.water}/100\n` +
    `🗑️ **Waste:** ${scores.waste}/100\n` +
    `⚡ **Energy:** ${scores.energy}/100\n` +
    `🌿 **Environmental:** ${scores.environmental}/100\n\n` +
    `🏅 **Certification:** ${certification?.level || 'N/A'}\n` +
    `🔖 **Verification:** ${certification?.verificationCode || 'N/A'}`
}

function getLocalFallbackResponse(question, context) {
  const lower = question.toLowerCase()

  // Context-aware responses
  if (context?.scores) {
    if (lower.includes('score') || lower.includes('rating') || lower.includes('how did i do')) {
      return getLocalScoreResponse(context)
    }

    if (lower.includes('improve') || lower.includes('better') || lower.includes('how can i')) {
      const recs = context.recommendations || []
      return `📈 **Improvement Suggestions**\n\n` +
        (recs.length > 0
          ? recs.slice(0, 4).map((r, i) => `${i + 1}. **${r.title}** — +${r.improvement || 'N/A'}% improvement (${r.difficulty || 'moderate'})`).join('\n\n')
          : '1. **Transportation** — Choose sustainable transport\n2. **Waste Management** — Implement proper segregation\n3. **Energy Efficiency** — Switch to LED and renewable\n4. **Digital Transformation** — Reduce paper usage') +
        '\n\n💡 Start with the easiest changes for quick wins!'
    }
  }

  // General sustainability knowledge
  if (lower.includes('waste') || lower.includes('reduc') || lower.includes('recycl')) {
    return '♻️ **Waste Reduction Strategies**\n\n' +
      '**Digital Transformation** 📱\n• Replace paper with QR codes\n• Use digital certificates\n• Send digital invitations\n\n' +
      '**Waste Management** 🚮\n• Set up segregation stations\n• Partner with recycling facilities\n• Compost food waste\n\n' +
      '**Single-Use Alternatives** 🥤\n• Replace plastic bottles with refill stations\n• Use reusable/biodegradable materials'
  }

  if (lower.includes('carbon neutral') || lower.includes('net zero') || lower.includes('offset')) {
    return '🌍 **Achieving Carbon Neutrality**\n\n' +
      '1. **Measure Your Footprint** 📊\n2. **Reduce Energy** 🔋 — LED, renewable, efficient HVAC\n3. **Sustainable Transport** 🚗 — Carpooling, public transit\n4. **Offset Remaining** 🌳 — Verified carbon offset programs'
  }

  if (lower.includes('plastic') || lower.includes('bottle')) {
    return '🚰 **Plastic-Free Alternatives**\n\n' +
      '• **Water Refill Stations** — Install portable dispensers\n• **Bulk Dispensers** — Reduce packaging waste by 90%\n• **Compostable Alternatives** — Plant-based bottles (PLA)\n• **Aluminum Bottles** — Infinitely recyclable'
  }

  if (lower.includes('energy') || lower.includes('solar') || lower.includes('renewable')) {
    return '☀️ **Sustainable Energy Solutions**\n\n' +
      '• **Solar Power** — Portable generators, charging stations\n• **LED Lighting** — 90% less energy consumption\n• **Smart Controls** — Thermostats, motion sensors\n• **Green Tariffs** — Choose renewable energy providers'
  }

  if (lower.includes('sdg') || lower.includes('sustainable development goal') || lower.includes('un')) {
    return '🌍 **UN Sustainable Development Goals**\n\n' +
      '**SDG 6** 💧 Clean Water — Use refill stations\n**SDG 7** ⚡ Clean Energy — Renewable sources\n' +
      '**SDG 11** 🏙️ Sustainable Cities — Accessible venues\n**SDG 12** 🔄 Responsible Consumption — Minimize waste\n' +
      '**SDG 13** 🌍 Climate Action — Measure carbon footprint\n**SDG 15** 🌳 Life on Land — Eco-friendly venues'
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey') || lower === 'hi') {
    return `👋 **Hello! I'm your AI Sustainability Advisor.**\n\n` +
      `I can help you with:\n` +
      `📊 **Analyze your event scores**\n💡 **Get improvement tips**\n🌍 **Learn about sustainability**\n🏅 **Check certifications**\n♻️ **Eco-friendly alternatives**\n\nHow can I assist you today? 🌿`
  }

  // Default fallback
  return `🌿 **Sustainability Insights**\n\n` +
    `Great question! Here are general best practices for sustainable events:\n\n` +
    `1. **Conduct a sustainability assessment** using our Event Analyzer\n` +
    `2. **Go digital** — reduce paper waste with QR codes\n` +
    `3. **Choose sustainable materials** — reusable, biodegradable\n` +
    `4. **Encourage green transportation** — public transit, carpooling\n` +
    `5. **Select eco-venues** — venues with green certifications\n` +
    `6. **Partner locally** — reduce transportation emissions\n` +
    `7. **Measure and offset** — calculate carbon footprint\n` +
    `8. **Educate attendees** — spread sustainability awareness\n\n` +
    `📊 Ask me about waste reduction, carbon neutrality, or energy efficiency!`
}

// ─── Main API ────────────────────────────────────────────────────────────────

/**
 * Ask AI Advisor with context awareness and caching.
 * 
 * @param {string} question - The user's question
 * @param {object|null} eventContext - Event analysis context (scores, formData, etc.)
 * @returns {Promise<string>} The response text
 */
export async function askAIAdvisor(question, eventContext = null) {
  // 1. Check cache first
  const cached = getCachedResponse(question)
  if (cached) return cached

  // 2. Determine if this needs the AI or can be answered locally
  const needsExpert = isComplexQuestion(question)

  // 3. For simple questions, try local first
  if (!needsExpert) {
    // Check if we have context and can answer from it
    if (eventContext?.scores && (
      question.toLowerCase().includes('score') ||
      question.toLowerCase().includes('how did i do')
    )) {
      const localResponse = getLocalScoreResponse(eventContext)
      setCachedResponse(question, localResponse)
      return localResponse
    }
  }

  // 4. Call the backend (which handles AI or returns server-side smart responses)
  try {
    const { sendChatMessage } = await import('./apiService.js')
    const data = await sendChatMessage(question, eventContext, needsExpert)
    const response = data.response || data.text || ''

    if (response) {
      setCachedResponse(question, response)
    }

    return response
  } catch (err) {
    console.warn('AI API call failed, using local fallback:', err.message)
    const fallback = getLocalFallbackResponse(question, eventContext)
    setCachedResponse(question, fallback)
    return fallback
  }
}

/**
 * Clear the response cache
 */
export function clearCache() {
  responseCache.clear()
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    size: responseCache.size,
    entries: Array.from(responseCache.keys()),
  }
}
