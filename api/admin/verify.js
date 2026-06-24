/**
 * POST /api/admin/verify
 * Verify admin secret.
 */
export default async function handler(req, res) {
  const { secret } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const expected = process.env.ADMIN_SECRET

  if (!expected) {
    return res.status(503).json({ error: 'Admin not configured' })
  }

  if (secret === expected) {
    res.json({ success: true, message: 'Admin access granted' })
  } else {
    res.status(401).json({ error: 'Invalid admin secret' })
  }
}
