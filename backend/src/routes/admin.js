import { Router } from 'express'
import { supabaseAdmin } from '../index.js'

const router = Router()

// ─── Admin Auth Middleware ────────────────────────────────────────────────────
// Simple secret-key based admin authentication.
// The ADMIN_SECRET in .env must match the X-Admin-Secret header sent by the frontend.

function requireAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret']
  const expected = process.env.ADMIN_SECRET

  if (!expected) {
    return res.status(503).json({ error: 'Admin not configured. Set ADMIN_SECRET in backend .env' })
  }

  if (!secret || secret !== expected) {
    return res.status(401).json({ error: 'Invalid admin secret' })
  }

  next()
}

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
// Overall platform statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      { count: totalAnalyses },
      { count: totalBadges },
      { data: scoreData },
    ] = await Promise.all([
      supabaseAdmin.from('analyses').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('user_badges').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('analyses').select('scores, impact, certification, created_at'),
    ])

    let totalScore = 0, scoreCount = 0, carbonSaved = 0
    const certCounts = { platinum: 0, gold: 0, silver: 0, bronze: 0, unsustainable: 0 }
    const dailyCounts = {}

    ;(scoreData || []).forEach(row => {
      if (row.scores?.overall) { totalScore += row.scores.overall; scoreCount++ }
      if (row.impact?.reduction) carbonSaved += row.impact.reduction
      const level = row.certification?.level || 'unsustainable'
      certCounts[level] = (certCounts[level] || 0) + 1
      const day = row.created_at?.split('T')[0]
      if (day) dailyCounts[day] = (dailyCounts[day] || 0) + 1
    })

    res.json({
      totalAnalyses: totalAnalyses || 0,
      totalBadges: totalBadges || 0,
      avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
      certificationBreakdown: certCounts,
      dailyActivity: Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, count]) => ({ date, count })),
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
// List all users with their analysis counts
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers()
    if (authErr) throw authErr

    const { data: analyses } = await supabaseAdmin
      .from('analyses')
      .select('user_id, scores, created_at')
      .order('created_at', { ascending: false })

    // Group analyses by user
    const userMap = {}
    ;(analyses || []).forEach(a => {
      if (!userMap[a.user_id]) userMap[a.user_id] = { count: 0, avgScore: 0, totalScore: 0, lastActivity: null }
      userMap[a.user_id].count++
      userMap[a.user_id].totalScore += (a.scores?.overall || 0)
      if (!userMap[a.user_id].lastActivity) userMap[a.user_id].lastActivity = a.created_at
    })

    const users = (authUsers?.users || []).map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.user_metadata?.full_name || '-',
      createdAt: u.created_at,
      confirmedAt: u.email_confirmed_at,
      isConfirmed: !!u.email_confirmed_at,
      lastSignIn: u.last_sign_in_at,
      analysisCount: userMap[u.id]?.count || 0,
      avgScore: userMap[u.id]?.count > 0
        ? Math.round(userMap[u.id].totalScore / userMap[u.id].count)
        : 0,
      lastActivity: userMap[u.id]?.lastActivity || null,
    }))

    res.json({ users, total: users.length })
  } catch (err) {
    console.error('Admin users error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/admin/users/:id/confirm ───────────────────────────────────────
// Manually confirm a user's email (bypass the email link)
router.post('/users/:id/confirm', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      req.params.id,
      { email_confirm: true }
    )
    if (error) throw error
    res.json({ success: true, user: data.user })
  } catch (err) {
    console.error('Confirm user error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
// Delete a user and all their data
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    // Delete analyses first
    await supabaseAdmin.from('analyses').delete().eq('user_id', req.params.id)
    await supabaseAdmin.from('user_badges').delete().eq('user_id', req.params.id)
    // Delete auth user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('Delete user error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/admin/analyses ──────────────────────────────────────────────────
// All analyses across all users
router.get('/analyses', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('analyses')
      .select('id, user_id, event_name, organization, category, scores, certification, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    res.json({ analyses: data || [], total: data?.length || 0 })
  } catch (err) {
    console.error('Admin analyses error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /api/admin/analyses/:id ──────────────────────────────────────────
router.delete('/analyses/:id', requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('analyses').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/admin/verify ───────────────────────────────────────────────────
// Verify the admin secret is valid (used on login)
router.post('/verify', (req, res) => {
  const { secret } = req.body
  const expected = process.env.ADMIN_SECRET
  if (!expected) return res.status(503).json({ error: 'Admin not configured' })
  if (secret === expected) {
    res.json({ success: true, message: 'Admin access granted' })
  } else {
    res.status(401).json({ error: 'Invalid admin secret' })
  }
})

export default router
