import { motion } from 'framer-motion'
import { FiTarget, FiTrendingUp, FiAlertTriangle, FiAward, FiClock, FiZap, FiBarChart2, FiGlobe } from 'react-icons/fi'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import { getScoreLevel } from '../../utils/sustainabilityEngine.js'

const improvementRoadmap = [
  { period: 'Immediate', color: '#ef4444', icon: '⚡', items: [] },
  { period: 'Short-Term', color: '#eab308', icon: '📅', items: [] },
  { period: 'Long-Term', color: '#22c55e', icon: '🎯', items: [] },
]

function getEnvironmentalInsights(scores, formData) {
  const insights = []

  if (scores.carbon < 60) {
    insights.push({
      category: 'Carbon Emissions',
      severity: scores.carbon < 40 ? 'critical' : 'warning',
      explanation: `${formData.transport === 'private' ? 'Private vehicle transportation' : 'Current transportation choices'} contribute significantly to your event's carbon footprint. Transportation is typically the largest source of event emissions.`,
      benefit: 'Switching to carpooling or public transport can reduce emissions by up to 60%.',
      icon: '💨',
      priority: 'high',
    })
  }

  if (scores.water < 60) {
    insights.push({
      category: 'Water Waste',
      severity: scores.water < 40 ? 'critical' : 'warning',
      explanation: formData.water === 'plastic-bottles'
        ? 'Single-use plastic bottles create both water waste and plastic pollution. Each attendee typically uses 2-3 bottles per day.'
        : 'Current water distribution methods could be more sustainable. Consider refill stations.',
      benefit: 'Installing refill stations can reduce plastic bottle waste by 80% and improve water efficiency.',
      icon: '💧',
      priority: 'high',
    })
  }

  if (scores.waste < 60) {
    insights.push({
      category: 'Waste Generation',
      severity: scores.waste < 40 ? 'critical' : 'warning',
      explanation: `${formData.food === 'disposable' ? 'Disposable serving materials' : 'Current waste management practices'} are contributing to landfill waste. ${formData.wasteSegregation === 'not-available' ? 'Without waste segregation, recyclable materials are lost.' : ''}`,
      benefit: 'Implementing waste segregation and using reusable/biodegradable materials can cut waste by 70%.',
      icon: '🗑️',
      priority: 'medium',
    })
  }

  if (scores.energy < 60) {
    insights.push({
      category: 'Energy Consumption',
      severity: scores.energy < 40 ? 'critical' : 'warning',
      explanation: `${formData.energy === 'high' ? 'High energy usage levels' : 'Current energy consumption'} are contributing to carbon emissions. ${formData.initiatives?.includes('solar-power') ? '' : 'Renewable energy sources are not being utilized.'}`,
      benefit: 'Adopting LED lighting and renewable energy can reduce energy consumption by up to 50%.',
      icon: '⚡',
      priority: 'medium',
    })
  }

  if (formData.certificates === 'printed') {
    insights.push({
      category: 'Paper Consumption',
      severity: 'warning',
      explanation: 'Printed certificates consume significant paper resources. For an event with ' + (formData.participants || 'many') + ' attendees, this adds up to substantial paper waste.',
      benefit: 'Switching to digital certificates eliminates paper waste entirely and reduces delivery emissions.',
      icon: '📄',
      priority: 'low',
    })
  }

  return insights
}

function generateRoadmap(recommendations, scores) {
  const roadmap = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
  }

  recommendations.forEach((rec) => {
    if (rec.difficulty === 'easy') {
      roadmap.immediate.push(rec)
    } else if (rec.difficulty === 'medium') {
      roadmap.shortTerm.push(rec)
    } else {
      roadmap.longTerm.push(rec)
    }
  })

  return roadmap
}

function getTopPriorities(insights, recommendations) {
  const highPriority = insights.filter((i) => i.priority === 'high').slice(0, 3)
  const recs = recommendations.slice(0, 2)

  return {
    priorities: highPriority.length > 0
      ? highPriority.map((i) => ({ title: i.category, desc: i.explanation.split('.')[0] + '.', icon: i.icon }))
      : recs.map((r) => ({ title: r.title, desc: r.description.split('.')[0] + '.', icon: '💡' })),
    biggestRisk: insights[0]?.category || 'None identified',
    fastestImprovement: recommendations.find((r) => r.difficulty === 'easy')?.title || 'Review recommendations',
    costEffective: recommendations[0]?.title || 'Check recommendations above',
  }
}

export default function AIAdvisor({ scores, formData, recommendations, certifications, sdgImpact }) {
  const insights = getEnvironmentalInsights(scores, formData)
  const roadmap = generateRoadmap(recommendations, scores)
  const priorities = getTopPriorities(insights, recommendations)
  const level = getScoreLevel(scores.overall)

  const coaches = [
    { label: 'Top 3 Priorities', value: priorities.priorities.length, icon: <FiTarget className="w-4 h-4" />, color: '#ef4444' },
    { label: 'Biggest Risk', value: priorities.biggestRisk, icon: <FiAlertTriangle className="w-4 h-4" />, color: '#f97316' },
    { label: 'Fastest Fix', value: priorities.fastestImprovement, icon: <FiZap className="w-4 h-4" />, color: '#eab308' },
    { label: 'Best Value', value: priorities.costEffective, icon: <FiTrendingUp className="w-4 h-4" />, color: '#22c55e' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-eco-600/10 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-eco-500/10 border border-blue-500/20 dark:border-blue-500/10 p-6 lg:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-eco-500/10 to-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20 shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Sustainability Advisor</h2>
              <Badge variant="info" size="sm">AI-Powered</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Intelligent sustainability analysis powered by AI. Below are personalized insights and recommendations based on your event data.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sustainability Coach - Quick Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {coaches.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 hover:border-gray-300/50 dark:hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-2 mb-2" style={{ color: item.color }}>
              {item.icon}
              <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Environmental Insights */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <FiBarChart2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Sustainability Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Excellent sustainability performance!</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Your event shows strong environmental practices across all categories.</p>
            </div>
          ) : (
            insights.map((insight, i) => (
              <motion.div
                key={insight.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${
                  insight.severity === 'critical'
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-yellow-500/5 border-yellow-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{insight.category}</h4>
                      <Badge variant={insight.severity === 'critical' ? 'danger' : 'warning'} size="xs">
                        {insight.severity === 'critical' ? 'Critical' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.explanation}</p>
                    <div className="flex items-start gap-1.5 text-sm">
                      <span className="text-eco-500 font-medium shrink-0">Expected Benefit:</span>
                      <span className="text-gray-500 dark:text-gray-400">{insight.benefit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Improvement Roadmap */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <FiClock className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Improvement Roadmap</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Immediate */}
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⚡</span>
              <h4 className="font-semibold text-red-500 text-sm">Immediate</h4>
            </div>
            {roadmap.immediate.length > 0 ? (
              <ul className="space-y-2">
                {roadmap.immediate.map((rec) => (
                  <li key={rec.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                    <span className="text-eco-500 mt-0.5">•</span>
                    <span>{rec.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No immediate actions needed</p>
            )}
          </div>

          {/* Short-Term */}
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📅</span>
              <h4 className="font-semibold text-yellow-500 text-sm">Short-Term</h4>
            </div>
            {roadmap.shortTerm.length > 0 ? (
              <ul className="space-y-2">
                {roadmap.shortTerm.map((rec) => (
                  <li key={rec.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                    <span className="text-eco-500 mt-0.5">•</span>
                    <span>{rec.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No short-term actions needed</p>
            )}
          </div>

          {/* Long-Term */}
          <div className="p-4 rounded-xl bg-eco-500/5 border border-eco-500/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <h4 className="font-semibold text-eco-500 text-sm">Long-Term</h4>
            </div>
            {roadmap.longTerm.length > 0 ? (
              <ul className="space-y-2">
                {roadmap.longTerm.map((rec) => (
                  <li key={rec.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                    <span className="text-eco-500 mt-0.5">•</span>
                    <span>{rec.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No long-term actions needed</p>
            )}
          </div>
        </div>
      </Card>

      {/* SDG Impact Explanation */}
      {sdgImpact && sdgImpact.topSDGs?.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <FiGlobe className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">SDG Impact Analysis</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your event decisions directly impact the following UN Sustainable Development Goals:
            </p>
            {sdgImpact.topSDGs.map((item, i) => (
              <motion.div
                key={item.sdg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/20 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${item.sdg.color}20` }}
                >
                  {item.sdg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: item.sdg.color }}>SDG {item.sdg.id}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.sdg.short}</h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.contribution}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.sdg.color }}
                      />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: item.sdg.color }}>{item.contribution}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
