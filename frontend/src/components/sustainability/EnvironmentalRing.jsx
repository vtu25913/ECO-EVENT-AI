import { motion } from 'framer-motion'

export default function EnvironmentalRing({ label, value, color, icon, size = 'md' }) {
  const dimensions = size === 'lg' ? 100 : 80
  const strokeWidth = size === 'lg' ? 8 : 6
  const radius = (dimensions - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimensions, height: dimensions }}>
        <svg width={dimensions} height={dimensions} className="transform -rotate-90">
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-white/5"
          />
          <motion.circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">{value}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
    </div>
  )
}
