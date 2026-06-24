import { motion } from 'framer-motion'
import { sdgs } from '../../data/sdgs.js'

export default function SDGWheel({ contributions = {} }) {
  const radius = 120
  const center = 140
  const segmentAngle = (2 * Math.PI) / sdgs.length

  return (
    <svg width={center * 2} height={center * 2} className="transform">
      {sdgs.map((sdg, i) => {
        const angle = i * segmentAngle - Math.PI / 2
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        const contribution = contributions[sdg.id] || 0
        const innerRadius = 30 + (contribution / 100) * 70

        return (
          <motion.g
            key={sdg.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.08, type: 'spring' }}
          >
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={sdg.color}
              strokeWidth="2"
              opacity="0.2"
            />
            <motion.circle
              cx={x}
              cy={y}
              r={12}
              fill={sdg.color}
              opacity="0.9"
              initial={{ r: 0 }}
              animate={{ r: 12 }}
              transition={{ delay: i * 0.08 + 0.3 }}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-bold fill-white"
              fontSize="10"
            >
              {sdg.id}
            </text>
            <motion.circle
              cx={x}
              cy={y}
              r={16 + (contribution / 100) * 20}
              fill="none"
              stroke={sdg.color}
              strokeWidth="2"
              opacity="0.3"
              initial={{ r: 0 }}
              animate={{ r: 16 + (contribution / 100) * 20 }}
              transition={{ delay: i * 0.08 + 0.5 }}
            />
          </motion.g>
        )
      })}
      
      {/* Center circle */}
      <circle cx={center} cy={center} r={25} className="fill-white/30 dark:fill-white/5 stroke-gray-300 dark:stroke-white/10" strokeWidth="1" />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-lg font-bold fill-gray-900 dark:fill-white"
      >
        SDG
      </text>
    </svg>
  )
}
