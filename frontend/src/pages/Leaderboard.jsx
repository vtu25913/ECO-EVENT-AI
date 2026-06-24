import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import LeaderboardRow from '../components/gamification/LeaderboardRow.jsx'
import AchievementBadge from '../components/sustainability/AchievementBadge.jsx'
import { useApp } from '../context/AppContext.jsx'
import { getAllBadges } from '../utils/badges.js'
import Button from '../components/common/Button.jsx'
import { FiRefreshCw } from 'react-icons/fi'

export default function Leaderboard() {
  const { leaderboard, badges, stats } = useApp()
  const earnedIds = badges.filter(b => b.earned).map(b => b.id)
  const allBadges = getAllBadges(earnedIds)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Sustainability{' '}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See how events rank on sustainability. Earn badges and climb the rankings!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Events Ranked', value: leaderboard.length, icon: '📊' },
            { label: 'Avg Score', value: leaderboard.length > 0 ? Math.round(leaderboard.reduce((s, a) => s + a.scores.overall, 0) / leaderboard.length) : 0, icon: '🎯' },
            { label: 'Badges Earned', value: badges.length, icon: '🏅' },
            { label: 'Top Score', value: leaderboard.length > 0 ? leaderboard[0].scores.overall : 0, icon: '👑' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">🏆 Rankings</h2>
                <span className="text-xs text-gray-500">{leaderboard.length} events</span>
              </div>
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-gray-500 dark:text-gray-400">No events ranked yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Analyze your first event to join the leaderboard!</p>
                  <Button to="/analyze" size="sm" className="mt-4">
                    Analyze Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((analysis, i) => (
                    <LeaderboardRow key={analysis.id} analysis={analysis} index={i} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Badges */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">🎖️ Badges</h2>
              <div className="grid grid-cols-2 gap-3">
                {allBadges.map((badge) => (
                  <AchievementBadge
                    key={badge.id}
                    badge={badge}
                    unlocked={badge.earned}
                  />
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Events Analyzed</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Average Score</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.avgScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Badges Earned</span>
                  <span className="font-bold text-gray-900 dark:text-white">{badges.length}/{allBadges.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Carbon Saved</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.carbonSaved} kg</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
