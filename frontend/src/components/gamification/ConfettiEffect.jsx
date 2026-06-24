import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#22c55e', '#06b6d4', '#eab308', '#f97316', '#a855f7', '#ec4899', '#22d3ee']

export default function ConfettiEffect({ active = false, duration = 3000 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      xEnd: (Math.random() - 0.5) * 40,
      yEnd: 100 + Math.random() * 20,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
    }))
    setParticles(items)

    const timer = setTimeout(() => setParticles([]), duration)
    return () => clearTimeout(timer)
  }, [active, duration])

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              rotate: p.rotation,
              opacity: 1,
            }}
            animate={{
              x: `${p.x + p.xEnd}vw`,
              y: `${p.yEnd}vh`,
              rotate: p.rotation + 360,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
