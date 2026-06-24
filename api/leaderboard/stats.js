/**
 * GET /api/leaderboard/stats
 *
 * Uses Supabase RPC to call the get_global_stats() function
 * which is SECURITY DEFINER (bypasses RLS).
 */
const supabaseUrl = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY

export default async function handler(req, res) {
  try {
    // Call the get_global_stats() function via Supabase RPC
    const url = `${supabaseUrl}/rest/v1/rpc/get_global_stats`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`)

    // The function returns: { total_analyses, avg_score, carbon_saved }
    res.json({
      totalAnalyses: data.total_analyses || 0,
      avgScore: data.avg_score || 0,
      carbonSaved: data.carbon_saved || 0,
    })
  } catch (err) {
    console.error('Stats error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
