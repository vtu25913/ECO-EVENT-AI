import { motion } from 'framer-motion'

export default function RecommendationCard({ recommendation, index = 0 }) {
  const priorityColors = {
    high: { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'High Priority' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', label: 'Medium Priority' },
    low: { bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400', label: 'Low Priority' },
  }

  const difficultyColors = {
    easy: { color: '#22c55e', label: 'Easy' },
    medium: { color: '#eab308', label: 'Medium' },
    hard: { color: '#ef4444', label: 'Hard' },
  }

  const pc = priorityColors[recommendation.priority] || priorityColors.medium
  const dc = difficultyColors[recommendation.difficulty] || difficultyColors.medium

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 hover:border-eco-500/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-eco-500 transition-colors">
          {recommendation.title}
        </h3>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`}>
          {pc.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {recommendation.description}
      </p>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Impact:</span>
          <span className="font-semibold text-eco-500">{recommendation.impact}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Difficulty:</span>
          <span className="font-semibold" style={{ color: dc.color }}>{dc.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Improvement:</span>
          <span className="font-semibold text-eco-500">+{recommendation.improvement}%</span>
        </div>
      </div>
    </motion.div>
  )
}
