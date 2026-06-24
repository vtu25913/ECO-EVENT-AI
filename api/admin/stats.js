/**
 * GET /api/admin/stats
 * Admin platform statistics. Requires X-Admin-Secret header.
 */
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

async function supabaseFetch(path) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

export default async function handler(req, res) {
  try {
    const adminSecret = process.env.ADMIN_SECRET
    const headerSecret = req.headers['x-admin-secret']

    if (adminSecret && (!headerSecret || headerSecret !== adminSecret)) {
      return res.status(401).json({ error: 'Invalid admin secret' })
    }

    // Count analyses
    const analyses = await supabaseFetch('/rest/v1/analyses?select=id&limit=1000')
    const totalAnalyses = analyses?.length || 0

    // Count badges
    const badges = await supabaseFetch('/rest/v1/user_badges?select=id&limit=1000')
    const totalBadges = badges?.length || 0

    res.json({
      totalAnalyses,
      totalBadges,
      message: 'Admin stats fetched successfully',
    })
  } catch (err) {
    console.error('Admin stats error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
