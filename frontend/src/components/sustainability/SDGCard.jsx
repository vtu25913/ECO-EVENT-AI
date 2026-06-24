import { motion } from 'framer-motion'

export default function SDGCard({ sdg, contribution = 0, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl p-5 border border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/[0.03] backdrop-blur-sm hover:shadow-lg transition-all group"
      style={{ borderColor: `${sdg.color}20` }}
    >
      <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: sdg.color }} />
      
      <div className="flex items-start gap-4">
        <div className="text-3xl">{sdg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: sdg.color }}
            >
              {sdg.id}
            </span>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {sdg.short}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {sdg.description}
          </p>

          {/* Contribution bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Contribution</span>
              <span className="font-semibold" style={{ color: sdg.color }}>{contribution}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${contribution}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className="h-full rounded-full transition-all"
                style={{ backgroundColor: sdg.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
