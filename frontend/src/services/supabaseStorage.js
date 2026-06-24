import { supabase } from '../lib/supabase.js'

/**
 * Save an analysis to Supabase
 */
export async function saveAnalysisToSupabase(analysis, userId) {
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      event_name: analysis.formData?.eventName || 'Untitled Event',
      organization: analysis.formData?.organization || '',
      location: analysis.formData?.location || '',
      event_date: analysis.formData?.date || '',
      participants: parseInt(analysis.formData?.participants) || 0,
      duration: parseFloat(analysis.formData?.duration) || 1,
      category: analysis.formData?.category || '',
      form_data: analysis.formData || {},
      scores: analysis.scores || {},
      impact: analysis.impact || {},
      recommendations: analysis.recommendations || [],
      sdg_impact: analysis.sdgImpact || {},
      certification: analysis.certification || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase save error:', error)
    return null
  }
  return { ...analysis, id: data.id, date: data.created_at }
}

/**
 * Get all analyses for a user
 */
export async function getUserAnalyses(userId) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
    return []
  }

  return (data || []).map(normalizeAnalysis)
}

/**
 * Delete an analysis
 */
export async function deleteAnalysisFromSupabase(id) {
  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase delete error:', error)
    return false
  }
  return true
}

/**
 * Get leaderboard data
 */
export async function getLeaderboardFromSupabase() {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, user_id, event_name, organization, scores, certification, created_at')
    .not('scores', 'is', null)
    .order('scores->>overall', { ascending: false, nullsFirst: false })
    .limit(50)

  if (error) {
    console.error('Supabase leaderboard error:', error)
    return []
  }

  return (data || []).map((item) => {
    const scores = item.scores || {}
    const cert = item.certification || { level: 'bronze', levelName: 'Bronze' }
    return {
      id: item.id,
      formData: { eventName: item.event_name, organization: item.organization },
      scores,
      certification: cert,
      date: item.created_at,
    }
  })
}

/**
 * Save earned badges
 */
export async function saveBadgeToSupabase(userId, badgeId) {
  const { error } = await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badgeId })

  // PG unique violation code (duplicate badge) - not an error for us
  if (error && error.code !== '23505') {
    console.error('Supabase badge save error:', error)
  }
}

/**
 * Get user badges
 */
export async function getUserBadges(userId) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Supabase badges fetch error:', error)
    return []
  }

  return (data || []).map((b) => b.badge_id)
}

/**
 * Get global stats
 */
export async function getGlobalStats() {
  const { count: total, error: countError } = await supabase
    .from('analyses')
    .select('id', { count: 'exact', head: true })

  const { data: scoreData, error: scoreError } = await supabase
    .from('analyses')
    .select('scores, impact')

  if (countError || scoreError) {
    return { total: 0, avgScore: 0, carbonSaved: 0 }
  }

  let totalScore = 0
  let scoreCount = 0
  let carbonSaved = 0

  (scoreData || []).forEach((row) => {
    const scores = row.scores || {}
    const impact = row.impact || {}
    if (scores.overall) {
      totalScore += scores.overall
      scoreCount++
    }
    if (impact.reduction) {
      carbonSaved += impact.reduction
    }
  })

  return {
    total: total || 0,
    avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
    carbonSaved: Math.round(carbonSaved * 10) / 10,
  }
}

/**
 * Normalize an analysis from Supabase format to app format
 * Supabase JS client automatically parses JSONB fields into objects
 */
function normalizeAnalysis(item) {
  return {
    id: item.id,
    date: item.created_at,
    formData: item.form_data || {},
    scores: item.scores || {},
    impact: item.impact || {},
    recommendations: item.recommendations || [],
    sdgImpact: item.sdg_impact || {},
    certification: item.certification || {},
  }
}
