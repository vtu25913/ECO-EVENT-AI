/**
 * AI Advisor Service
 *
 * Connects to actual AI APIs for genuine sustainability responses.
 * Supports multiple AI providers via environment variable configuration.
 *
 * Providers:
 *   - watsonx:  IBM watsonx.ai
 *   - openai:   OpenAI-compatible API (works with many providers)
 *
 * Environment variables:
 *   AI_API_KEY           - API key for the AI provider
 *   AI_API_URL           - Custom API endpoint URL (optional, has defaults per provider)
 *   AI_MODEL             - Model ID to use (optional, has defaults per provider)
 *   AI_PROVIDER          - 'watsonx' | 'openai' (default: 'openai')
 *   AI_PROJECT_ID        - watsonx project ID (required for watsonx provider)
 *
 * When no API key is configured, the service returns null and the
 * caller falls back to the existing hardcoded response logic.
 */

const AI_PROVIDERS = {
  WATSONX: 'watsonx',
  OPENAI: 'openai',
}

const DEFAULT_MODELS = {
  [AI_PROVIDERS.WATSONX]: 'ibm/granite-3-8b-instruct',
  [AI_PROVIDERS.OPENAI]: 'gpt-4o-mini',
}

const DEFAULT_URLS = {
  [AI_PROVIDERS.WATSONX]: 'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation',
  [AI_PROVIDERS.OPENAI]: 'https://api.openai.com/v1/chat/completions',
}

// ─── IAM Token Cache ────────────────────────────────────────────────────────
// watsonx IAM tokens expire after 60 minutes. We cache them in-memory
// and refresh 5 minutes before expiry to avoid fetching on every request.
// The in-flight promise pattern prevents race conditions when multiple
// concurrent requests arrive while the cache is expired.

const TOKEN_CACHE_TTL_MS = 55 * 60 * 1000 // 55 minutes (refresh 5 min early)

let cachedToken = null
let cachedTokenExpiry = 0
let cachedApiKeyPrefix = '' // First 12 chars of API key to track cache validity
let inflightTokenPromise = null // Prevents race conditions on concurrent refreshes

/**
 * Get a cached IAM token, or fetch a new one if expired/missing.
 * watsonx uses IAM token auth rather than direct API key auth.
 * Tokens expire after ~60 minutes; we refresh at 55 minutes.
 *
 * Uses an in-flight promise pattern so concurrent callers share
 * a single token fetch instead of each making their own request.
 */
async function getWatsonxToken(apiKey) {
  const keyPrefix = apiKey.slice(0, 12)
  const now = Date.now()

  // Return cached token if still valid and for the same API key
  if (cachedToken && cachedTokenExpiry > now && cachedApiKeyPrefix === keyPrefix) {
    return cachedToken
  }

  // If there's already an in-flight fetch, join it (race condition prevention)
  if (inflightTokenPromise) {
    return inflightTokenPromise
  }

  // Start a new token fetch and cache the promise so concurrent callers await it
  inflightTokenPromise = (async () => {
    const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: apiKey,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`watsonx auth failed: ${res.status} ${err}`)
    }

    const data = await res.json()

    if (!data.access_token) {
      throw new Error('watsonx auth response missing access_token')
    }

    // Cache the token with expiry
    cachedToken = data.access_token
    cachedTokenExpiry = now + TOKEN_CACHE_TTL_MS
    cachedApiKeyPrefix = keyPrefix

    console.debug('[AI Advisor] Fetched new watsonx IAM token (cached for ~55 min)')

    return cachedToken
  })()

  try {
    return await inflightTokenPromise
  } finally {
    // Clear the in-flight promise after it settles so subsequent
    // expiry-triggered fetches create a new one
    inflightTokenPromise = null
  }
}

/**
 * Clear the cached IAM token (useful for testing or key rotation).
 */
export function clearTokenCache() {
  cachedToken = null
  cachedTokenExpiry = 0
  cachedApiKeyPrefix = ''
  inflightTokenPromise = null
  console.debug('[AI Advisor] IAM token cache cleared')
}

/**
 * Check if the AI service is configured and ready.
 */
export function isAiConfigured() {
  return !!process.env.AI_API_KEY
}

/**
 * Get the AI provider configuration.
 */
function getProviderConfig() {
  const provider = (process.env.AI_PROVIDER || AI_PROVIDERS.OPENAI).toLowerCase()
  const apiKey = process.env.AI_API_KEY || ''
  const apiUrl = process.env.AI_API_URL || DEFAULT_URLS[provider] || DEFAULT_URLS[AI_PROVIDERS.OPENAI]
  const model = process.env.AI_MODEL || DEFAULT_MODELS[provider] || DEFAULT_MODELS[AI_PROVIDERS.OPENAI]
  const projectId = process.env.AI_PROJECT_ID || ''

  return { provider, apiKey, apiUrl, model, projectId }
}

/**
 * Build the system prompt for sustainability expertise.
 */
function buildSystemPrompt(context) {
  let prompt = `You are AI Sustainability Advisor, an expert AI assistant specialized in environmental sustainability, green event planning, and UN Sustainable Development Goals (SDGs). You work for EcoEvent AI, a platform that helps organizations measure and improve the environmental impact of events.

Key areas of expertise:
- Event sustainability scoring and certification
- Carbon footprint measurement and reduction strategies
- Waste management and circular economy principles
- Water conservation and responsible usage
- Energy efficiency and renewable energy adoption
- SDG alignment (SDGs 6, 7, 11, 12, 13, 15)
- Sustainable transportation and logistics
- Green materials and supply chain
- Regulatory compliance and reporting

Response guidelines:
- Be comprehensive, specific, and actionable
- Use clear formatting with bullet points and sections
- Include specific metrics and data where relevant
- Reference the user's event context when provided
- Keep responses professional but approachable
- Use emojis sparingly for visual organization`

  // Add event context if available
  if (context?.scores && context?.formData) {
    const { scores, formData, impact, certification } = context
    prompt += `\n\nCurrent event being analyzed:
- Event Name: ${formData.eventName || 'N/A'}
- Organization: ${formData.organization || 'N/A'}
- Category: ${formData.category || 'N/A'}
- Participants: ${formData.participants || 'N/A'}
- Duration: ${formData.duration || 'N/A'} days

Sustainability Scores (0-100):
- Overall: ${scores.overall || 'N/A'}
- Carbon: ${scores.carbon || 'N/A'}
- Water: ${scores.water || 'N/A'}
- Waste: ${scores.waste || 'N/A'}
- Energy: ${scores.energy || 'N/A'}
- Environmental Impact: ${scores.environmental || 'N/A'}

Certification: ${certification?.levelName || certification?.level || 'N/A'}
Carbon Impact: ${impact?.carbonEmissions || 'N/A'} kg CO₂e

Current initiatives: ${(formData.initiatives || []).join(', ') || 'None'}

Transport: ${formData.transport || 'N/A'}
Water source: ${formData.water || 'N/A'}
Food service: ${formData.food || 'N/A'}
Energy level: ${formData.energy || 'N/A'}
Registration: ${formData.registration || 'N/A'}
Certificates: ${formData.certificates || 'N/A'}
Waste segregation: ${formData.wasteSegregation || 'N/A'}`
  }

  return prompt
}

/**
 * Build the user message with context summary.
 */
function buildUserMessage(question, context) {
  let message = question

  // Add a brief context summary if available
  if (context?.scores) {
    const { scores } = context
    const weaknesses = []
    if (scores.carbon < 60) weaknesses.push(`Carbon (${scores.carbon})`)
    if (scores.water < 60) weaknesses.push(`Water (${scores.water})`)
    if (scores.waste < 60) weaknesses.push(`Waste (${scores.waste})`)
    if (scores.energy < 60) weaknesses.push(`Energy (${scores.energy})`)

    if (weaknesses.length > 0) {
      message += `\n\n[Context: The event scored ${scores.overall}/100 overall. Weak areas: ${weaknesses.join(', ')}.]`
    }
  }

  return message
}

/**
 * Call the OpenAI-compatible chat completions API.
 */
async function callOpenAi(prompt, message, config) {
  const { apiKey, apiUrl, model } = config

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: message },
      ],
      max_tokens: 2048,
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
 * Call IBM watsonx.ai text generation API.
 */
async function callWatsonx(prompt, message, config) {
  const { apiKey, apiUrl, model, projectId } = config

  if (!projectId) {
    throw new Error('AI_PROJECT_ID is required for watsonx provider')
  }

  // Get IAM token from API key
  const token = await getWatsonxToken(apiKey)

  // Build the full input with system prompt and user message
  const input = `${prompt}\n\nUser question: ${message}\n\nResponse:`

  const res = await fetch(`${apiUrl}?version=2024-05-10`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      input,
      model_id: model,
      project_id: projectId,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`watsonx API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.results?.[0]?.generated_text || null
}

/**
 * Main function: ask the AI for a sustainability response.
 *
 * @param {string} question - The user's question
 * @param {object|null} context - Event analysis context
 * @returns {Promise<string|null>} AI response or null if not configured / error
 */
export async function askAi(question, context = null) {
  const config = getProviderConfig()

  if (!config.apiKey) {
    return null // Not configured, caller should use fallback
  }

  const systemPrompt = buildSystemPrompt(context)
  const userMessage = buildUserMessage(question, context)

  try {
    let response = null

    if (config.provider === AI_PROVIDERS.WATSONX) {
      response = await callWatsonx(systemPrompt, userMessage, config)
    } else {
      // Default to OpenAI-compatible
      response = await callOpenAi(systemPrompt, userMessage, config)
    }

    return response
  } catch (err) {
    console.error(`[AI Advisor] ${config.provider} API error:`, err.message)
    return null // Fall back to hardcoded responses
  }
}

/**
 * Get the current AI provider status info (for debugging/admin).
 */
export function getAiStatus() {
  const config = getProviderConfig()
  return {
    configured: !!config.apiKey,
    provider: config.provider,
    model: config.model,
    apiUrl: config.apiUrl ? config.apiUrl.replace(/\/?$/, '') + '/***' : null,
    hasApiKey: !!config.apiKey,
    hasProjectId: !!config.projectId,
  }
}
