import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  glow = false,
  hover = true,
  gradient = false,
  padding = true,
  onClick,
  tilt = true,
}) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!tilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
  }, [tilt])

  const handleMouseLeave = useCallback(() => {
    if (!tilt || !cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
  }, [tilt])

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative rounded-2xl border border-white/10 dark:border-white/5
        ${gradient
          ? 'bg-gradient-to-br from-white/40 to-white/5 dark:from-white/[0.08] dark:to-white/[0.02]'
          : 'bg-white/30 dark:bg-white/[0.05]'
        }
        backdrop-blur-xl
        ${padding ? 'p-6' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'shadow-lg'}
        ${hover ? 'hover:shadow-xl hover:border-white/20 dark:hover:border-white/10' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-transform duration-200
        ${className}
      `}
      style={{ transformStyle: 'preserve-3d' }}
      whileHover={hover ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  )
}
