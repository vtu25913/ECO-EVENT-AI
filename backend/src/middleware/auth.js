import { getSupabaseClient } from '../index.js'

/**
 * Middleware to verify Supabase JWT from Authorization header.
 * Attaches `req.user` (verified user) and `req.supabaseClient` (authenticated
 * Supabase client that respects RLS as the current user).
 */
export async function authenticateRequest(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const supabase = getSupabaseClient(token)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    req.supabaseClient = supabase
    next()
  } catch (err) {
    console.error('Auth error:', err)
    return res.status(500).json({ error: 'Authentication error' })
  }
}
