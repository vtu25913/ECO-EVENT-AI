import { motion } from 'framer-motion'

export default function AchievementBadge({ badge, unlocked = false, size = 'md' }) {
  const isLarge = size === 'lg'
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-eco-500/10 to-emerald-500/5 border-eco-500/30'
          : 'bg-gray-100/50 dark:bg-white/[0.02] border-gray-200 dark:border-white/5 opacity-50'
      }`}
    >
      <div className={`relative ${unlocked ? 'animate-bounce-gentle' : 'grayscale'}`}>
        <span className={isLarge ? 'text-4xl' : 'text-2xl'}>{badge.icon}</span>
        {unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-eco-500 rounded-full"
          />
        )}
      </div>
      <h4 className={`font-semibold text-center ${isLarge ? 'text-sm' : 'text-xs'} ${
        unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
      }`}>
        {badge.name}
      </h4>
      {isLarge && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
          {badge.description}
        </p>
      )}
    </motion.div>
  )
}
