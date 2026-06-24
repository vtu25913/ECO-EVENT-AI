import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  fetchUserAnalyses,
  createAnalysis,
  removeAnalysis,
  fetchLeaderboard,
  fetchGlobalStats,
  seedSampleDataToCloud,
} from '../services/apiService.js'
import { saveBadgeToSupabase, getUserBadges } from '../services/supabaseStorage.js'
import { calculateScores } from '../utils/sustainabilityEngine.js'
import { calculateCarbonImpact } from '../utils/carbonCalculator.js'
import { generateRecommendations } from '../utils/recommendations.js'
import { mapSDGImpact } from '../utils/sdgMapper.js'
import { getCertification } from '../utils/certification.js'
import { checkBadges } from '../utils/badges.js'
import { badges as allBadges } from '../data/badges.js'

const AppContext = createContext()

// Normalize analysis rows coming from the backend (snake_case → camelCase)
function normalizeBackendAnalysis(item) {
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

// Normalize leaderboard rows from the backend to match the format
// expected by LeaderboardRow, LeaderboardPage, and Dashboard components.
function normalizeLeaderboardItem(item) {
  const levelNameMap = {
    platinum: 'Platinum Sustainable Event',
    gold: 'Gold Sustainable Event',
    silver: 'Silver Sustainable Event',
    bronze: 'Bronze Sustainable Event',
  }
  const certLevel = item.certification || item.certification_level || 'bronze'
  return {
    id: item.id,
    date: item.date || item.created_at,
    formData: {
      eventName: item.eventName || item.event_name || '',
      organization: item.organization || '',
    },
    scores: {
      overall: item.score || 0,
    },
    certification: {
      level: certLevel,
      levelName: levelNameMap[certLevel] || 'Bronze Sustainable Event',
    },
    rank: item.rank,
  }
}

export function AppProvider({ children }) {
  const { user, isAuthenticated, session } = useAuth()
  const autoSeedAttempted = useRef(false)
  const [analyses, setAnalyses] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const [stats, setStats] = useState({
    total: 0, avgScore: 0, carbonSaved: 0,
    treesProtected: 0, plasticAvoided: 0, waterConserved: 0,
  })
  const [leaderboard, setLeaderboard] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(true)

  // True when Supabase is properly configured (not the placeholder)
  const hasSupabase = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
  )

  // ─── Load from Backend API → Supabase (authenticated) ────────────────────
  const loadBackendData = useCallback(async (accessToken) => {
    try {
      const [rawAnalyses, lb, gs, userBadgeIds] = await Promise.all([
        fetchUserAnalyses(accessToken),
        fetchLeaderboard(),
        fetchGlobalStats(),
        getUserBadges(user.id),
      ])

      const normalized = (rawAnalyses || []).map(normalizeBackendAnalysis)

      // Auto-seed sample data on first login when user has no analyses yet
      if (normalized.length === 0 && !autoSeedAttempted.current && user?.id) {
        autoSeedAttempted.current = true
        try {
          await seedSampleDataToCloud(user.id, accessToken)
          // Recursively reload data — autoSeedAttempted ref prevents re-seeding
          await loadBackendData(accessToken)
          return
        } catch (seedErr) {
          console.warn('Auto-seed failed:', seedErr.message)
        }
      }

      setAnalyses(normalized)
      setLeaderboard((lb || []).map(normalizeLeaderboardItem))

      setStats({
        total: gs.totalAnalyses ?? gs.total ?? 0,
        avgScore: gs.avgScore ?? 0,
        carbonSaved: gs.carbonSaved ?? 0,
        treesProtected: Math.round((gs.totalAnalyses ?? gs.total ?? 0) * 0.3),
        plasticAvoided: Math.round((gs.totalAnalyses ?? gs.total ?? 0) * 5),
        waterConserved: Math.round((gs.totalAnalyses ?? gs.total ?? 0) * 100),
      })

      setBadges(
        userBadgeIds && userBadgeIds.length > 0
          ? allBadges.filter(b => userBadgeIds.includes(b.id)).map(b => ({ ...b, earned: true }))
          : []
      )

      setBackendOnline(true)
    } catch (err) {
      console.warn('Backend unreachable:', err.message)
      setBackendOnline(false)
    }
  }, [user])

  // ─── Main data loader ────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (isAuthenticated && hasSupabase && session?.access_token) {
        await loadBackendData(session.access_token)
      }
    } catch (err) {
      console.error('loadData error:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, hasSupabase, session, loadBackendData])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ─── Run Analysis ─────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async (formData) => {
    const scores = calculateScores(formData)
    const impact = calculateCarbonImpact(formData)
    const recommendations = generateRecommendations(formData)
    const sdgImpact = mapSDGImpact(formData, scores)
    const certification = getCertification(scores)

    // Get existing badge IDs from state to check against
    const existingBadgeIds = badges.filter(b => b.earned).map(b => b.id)
    const { unlocked } = checkBadges(scores, analyses.length + 1, formData.initiatives, existingBadgeIds)

    const result = { formData, scores, impact, recommendations, sdgImpact, certification, unlocked }

    if (isAuthenticated && hasSupabase && session?.access_token) {
      try {
        const saved = await createAnalysis(
          {
            eventName: formData.eventName || '',
            organization: formData.organization || '',
            location: formData.location || '',
            date: formData.date || '',
            participants: formData.participants,
            duration: formData.duration,
            category: formData.category || '',
            formData,
            scores,
            impact,
            recommendations,
            sdgImpact,
            certification,
          },
          session.access_token
        )

        result.id = saved.id
        result.date = saved.created_at
        setBackendOnline(true)
      } catch (err) {
        console.warn('Backend save failed:', err.message)
        setBackendOnline(false)
      }

      // Save newly unlocked badges via Supabase
      for (const badge of unlocked) {
        await saveBadgeToSupabase(user.id, badge.id).catch(() => {})
      }
    }

    setCurrentResult(result)
    await loadData()
    return result
  }, [isAuthenticated, hasSupabase, session, user, badges, analyses.length, loadData])

  // ─── Delete Analysis ──────────────────────────────────────────────────────
  const handleDeleteAnalysis = useCallback(async (id) => {
    if (isAuthenticated && hasSupabase && session?.access_token) {
      try {
        await removeAnalysis(id, session.access_token)
      } catch (err) {
        console.warn('Backend delete failed:', err.message)
      }
    }
    await loadData()
  }, [isAuthenticated, hasSupabase, session, loadData])

  return (
    <AppContext.Provider value={{
      analyses,
      currentResult,
      stats,
      leaderboard,
      badges,
      loading,
      backendOnline,
      runAnalysis,
      setCurrentResult,
      deleteAnalysis: handleDeleteAnalysis,
      refreshData: loadData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
