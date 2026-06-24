import { motion } from 'framer-motion'

export default function ScoreGauge({ score = 0, label = 'Score', size = 'md', showLabel = true }) {
  const radius = size === 'lg' ? 70 : size === 'sm' ? 40 : 55
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return '#22c55e'
    if (s >= 60) return '#eab308'
    if (s >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="relative flex flex-col items-center gap-2">
      <svg width={radius * 2.6} height={radius * 2.6} className="transform -rotate-90">
        <circle
          cx={radius * 1.3}
          cy={radius * 1.3}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={size === 'lg' ? 8 : 6}
          className="text-gray-200 dark:text-white/5"
        />
        <motion.circle
          cx={radius * 1.3}
          cy={radius * 1.3}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={size === 'lg' ? 8 : 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: 'rotate(0deg)' }}
      >
        <span className={`font-bold ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'}`}
          style={{ color: getColor(score) }}>
          {score}
        </span>
        {showLabel && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        )}
      </div>
    </div>
  )
}
