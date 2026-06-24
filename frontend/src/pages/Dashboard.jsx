import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import EnvironmentalRing from '../components/sustainability/EnvironmentalRing.jsx'
import DoughnutChart from '../components/charts/DoughnutChart.jsx'
import RadarChart from '../components/charts/RadarChart.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'
import { useApp } from '../context/AppContext.jsx'
import { FiTrendingUp, FiBarChart2, FiActivity } from 'react-icons/fi'
import { getScoreLevel } from '../utils/sustainabilityEngine.js'

export default function Dashboard() {
  const { analyses, stats, loading } = useApp()
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const latest = selectedAnalysis || (analyses.length > 0 ? analyses[0] : null)

  const level = latest ? getScoreLevel(latest.scores.overall) : null

  const radarData = latest ? {
    labels: ['Carbon', 'Water', 'Waste', 'Energy', 'Environmental'],
    datasets: [{
      label: 'Your Scores',
      data: [
        latest.scores.carbon,
        latest.scores.water,
        latest.scores.waste,
        latest.scores.energy,
        latest.scores.environmental,
      ],
      backgroundColor: 'rgba(34,197,94,0.2)',
      borderColor: '#22c55e',
      pointBackgroundColor: '#22c55e',
    }],
  } : null

  // Show loading while data is being fetched (especially after login)
  if (loading) {
    return <LoadingScreen type="earth" message="Loading your sustainability dashboard..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Sustainability{' '}
            <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor your sustainability metrics and track progress across all analyzed events.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Events Analyzed', value: analyses.length, icon: '📊', color: '#22c55e' },
            { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '🎯', color: '#06b6d4' },
            { label: 'Carbon Saved', value: `${stats.carbonSaved}kg`, icon: '🌍', color: '#eab308' },
            { label: 'Badges Earned', value: analyses.length, icon: '🏆', color: '#a855f7' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Environmental Rings */}
          <Card className="lg:col-span-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Environmental Health</h3>
            {latest ? (
              <div className="grid grid-cols-5 gap-2">
                <EnvironmentalRing label="Carbon" value={latest.scores.carbon} color="#22c55e" icon="💨" />
                <EnvironmentalRing label="Water" value={latest.scores.water} color="#06b6d4" icon="💧" />
                <EnvironmentalRing label="Waste" value={latest.scores.waste} color="#eab308" icon="🗑️" />
                <EnvironmentalRing label="Energy" value={latest.scores.energy} color="#f97316" icon="⚡" />
                <EnvironmentalRing label="Nature" value={latest.scores.environmental} color="#a855f7" icon="🌿" />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">Analyze an event to see environmental health data</p>
            )}

            {latest && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-eco-500/10 border border-eco-500/20">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Certification</div>
                  <div className="font-bold text-lg capitalize" style={{ color: level?.color }}>
                    {level?.label}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-ocean-500/10 border border-ocean-500/20">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Initiative Bonus</div>
                  <div className="font-bold text-lg text-ocean-500">+{latest.scores.initiativeBonus || 0}%</div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Score Distribution</h3>
            {latest ? (
              <div className="flex justify-center">
                <div className="w-72">
                  <DoughnutChart
                    data={[
                      latest.scores.carbon,
                      latest.scores.water,
                      latest.scores.waste,
                      latest.scores.energy,
                      latest.scores.environmental,
                    ]}
                    labels={['Carbon', 'Water', 'Waste', 'Energy', 'Environmental']}
                    colors={['#22c55e', '#06b6d4', '#eab308', '#f97316', '#a855f7']}
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">No data available yet</p>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Multi-Dimension Analysis</h3>
            {radarData ? (
              <RadarChart {...radarData} />
            ) : (
              <p className="text-gray-400 text-center py-12">No data available yet</p>
            )}
          </Card>
        </div>

        {/* History */}
        {analyses.length > 0 && (
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Analyses</h3>
            <div className="space-y-2">
              {analyses.slice(0, 5).map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all ${
                    selectedAnalysis?.id === analysis.id
                      ? 'bg-eco-500/10 border border-eco-500/30'
                      : 'bg-gray-100/50 dark:bg-white/[0.03] border border-transparent hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                      {analysis.formData.eventName || 'Untitled Event'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {analysis.formData.organization} · {new Date(analysis.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg" style={{ color: getScoreLevel(analysis.scores.overall).color }}>
                      {analysis.scores.overall}
                    </div>
                    <div className="text-[10px] text-gray-400 capitalize">{analysis.certification.level}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
