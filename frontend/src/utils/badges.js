import { badges } from '../data/badges.js'

/**
 * Check which badges are unlocked based on the current scores and analysis count.
 * @param {object} scores - The sustainability scores
 * @param {number} analysisCount - Total number of analyses
 * @param {string[]} initiatives - List of sustainability initiatives
 * @param {string[]} earnedIds - Array of already-earned badge IDs (from Supabase)
 * @returns {{ earned: string[], unlocked: object[] }}
 */
export function checkBadges(scores, analysisCount, initiatives, earnedIds = []) {
  const unlocked = []

  badges.forEach((badge) => {
    if (!earnedIds.includes(badge.id) && badge.condition(scores, analysisCount, initiatives)) {
      earnedIds.push(badge.id)
      unlocked.push(badge)
    }
  })

  return { earned: earnedIds, unlocked }
}

/**
 * Get all badges with their earned status.
 * @param {string[]} earnedIds - Array of earned badge IDs (from Supabase)
 * @returns {object[]}
 */
export function getAllBadges(earnedIds = []) {
  return badges.map((b) => ({
    ...b,
    earned: earnedIds.includes(b.id),
  }))
}

/**
 * Get the full badge objects for earned IDs.
 * @param {string[]} earnedIds
 * @returns {object[]}
 */
export function getEarnedBadgesByIds(earnedIds = []) {
  return badges.filter((b) => earnedIds.includes(b.id))
}
