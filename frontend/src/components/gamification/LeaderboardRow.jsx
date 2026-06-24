import { motion } from 'framer-motion'
import { getScoreLevel } from '../../utils/sustainabilityEngine.js'
import Badge from '../common/Badge.jsx'

const rankStyles = {
  1: { bg: 'from-yellow-300 to-amber-400', icon: '👑', glow: true },
  2: { bg: 'from-slate-300 to-slate-400', icon: '🥈', glow: false },
  3: { bg: 'from-orange-300 to-orange-400', icon: '🥉', glow: false },
}

export default function LeaderboardRow({ analysis, index }) {
  const rank = index + 1
  const style = rankStyles[rank] || { bg: '', icon: `#${rank}`, glow: false }
  const level = getScoreLevel(analysis.scores.overall)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        style.glow
          ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20'
          : 'bg-white/20 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 hover:bg-white/30 dark:hover:bg-white/[0.05]'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        rank <= 3 ? `bg-gradient-to-br ${style.bg} text-white shadow-lg` : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
      }`}>
        {style.icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
          {analysis.formData.eventName || 'Untitled Event'}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {analysis.formData.organization || 'Unknown'} · {new Date(analysis.date).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right">
        <div className="font-bold text-lg" style={{ color: level.color }}>
          {analysis.scores.overall}
        </div>
        <Badge variant={analysis.certification.level} size="xs">
          {analysis.certification.levelName.split(' ')[0]}
        </Badge>
      </div>
    </motion.div>
  )
}
