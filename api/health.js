/**
 * GET /api/health
 *
 * Uses Supabase REST API directly via fetch (no npm dependencies).
 */
export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/rest/v1/analyses?select=id&limit=1`, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
    })

    const dbConnected = response.ok

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        url: supabaseUrl,
        db: { connected: dbConnected },
      },
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message,
    })
  }
}
