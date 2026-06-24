import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, duration = 2, className = '' }) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => {
    return prefix + Number(latest.toFixed(decimals)).toLocaleString() + suffix
  })

  const spring = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
    duration,
  })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  )
}
