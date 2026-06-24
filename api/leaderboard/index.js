/**
 * GET /api/leaderboard
 *
 * Calls the get_leaderboard() SECURITY DEFINER function via RPC.
 * This bypasses RLS so the public API can read all users' scores.
 */
const supabaseUrl = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY

export default async function handler(req, res) {
  try {
    const url = `${supabaseUrl}/rest/v1/rpc/get_leaderboard`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit_count: 50 }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }

    const data = await response.json()

    const board = (Array.isArray(data) ? data : []).map((item) => ({
      id: item.id,
      eventName: item.event_name || '',
      organization: item.organization || '',
      score: parseInt(item.score) || 0,
      certification: item.certification_level || 'bronze',
      date: item.created_at,
      rank: item.rank,
    }))

    res.json(board)
  } catch (err) {
    console.error('Leaderboard error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
