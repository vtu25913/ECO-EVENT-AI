/**
 * /api/analyses*
 * CRUD for event analyses. Verifies JWT by making a test Supabase REST query.
 */
const SUPABASE_URL = process.env.SUPABASE_URL
const ANON_KEY = process.env.SUPABASE_ANON_KEY

function extractUserId(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64').toString()).sub
  } catch {
    return null
  }
}

async function makeAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
    'Content-Type': 'application/json',
  }
}

async function isTokenValid(token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/analyses?select=id&limit=1`, {
    headers: await makeAuthHeaders(token),
  })
  return res.ok
}

function getAnalysisId(req) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const path = url.pathname.replace(/\/$/, '')
  return path === '/api/analyses' ? '' : path.split('/api/analyses/')[1] || ''
}

function parseRequestBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
}

async function fetchJson(url, options) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error((data && data.message) || `HTTP ${res.status}`)
  return data
}

async function handleGet(headers, analysisId) {
  if (analysisId && analysisId !== 'analyses') {
    const data = await fetchJson(
      `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}&select=*`,
      { headers }
    )
    if (!data || data.length === 0) {
      const err = new Error('Analysis not found')
      err.status = 404
      throw err
    }
    return data[0]
  }

  return await fetchJson(
    `${SUPABASE_URL}/rest/v1/analyses?select=*&order=created_at.desc`,
    { headers }
  ) || []
}

async function handlePost(headers, userId, req) {
  const body = parseRequestBody(req)
  const insertData = {
    user_id: userId,
    organization: body.organization || '',
    location: body.location || '',
    event_date: body.date || '',
    participants: Number.parseInt(body.participants, 10) || 0,
    duration: Number.parseFloat(body.duration) || 1,
    category: body.category || '',
    form_data: body.formData || {},
    scores: body.scores || {},
    impact: body.impact || {},
    recommendations: body.recommendations || [],
    sdg_impact: body.sdgImpact || {},
    certification: body.certification || {},
  }

  return await fetchJson(`${SUPABASE_URL}/rest/v1/analyses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(insertData),
  })
}

async function handleDelete(headers, analysisId) {
  if (!analysisId || analysisId === 'analyses') {
    const err = new Error('Analysis ID required')
    err.status = 400
    throw err
  }

  const res_ = await fetch(
    `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}`,
    { method: 'DELETE', headers }
  )
  if (!res_.ok) {
    const errData = await res_.json().catch(() => ({}))
    const err = new Error(errData.message || `HTTP ${res_.status}`)
    err.status = res_.status
    throw err
  }
  return { success: true }
}

export default async function handler(req, res) {
  try {
    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization header' })
    }

    if (!await isTokenValid(token)) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const userId = extractUserId(token)
    const analysisId = getAnalysisId(req)
    const headers = await makeAuthHeaders(token)

    switch (req.method) {
      case 'GET':
        return res.json(await handleGet(headers, analysisId))
      case 'POST':
        return res.status(201).json(await handlePost(headers, userId, req))
      case 'DELETE':
        return res.json(await handleDelete(headers, analysisId))
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error('Analyses error:', err.message)
    if (err.status === 400 || err.status === 404) {
      return res.status(err.status).json({ error: err.message })
    }
    return res.status(500).json({ error: err.message })
  }
}
