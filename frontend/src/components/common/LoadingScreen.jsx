import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingScreen({ type = 'earth', message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-eco-50 dark:from-gray-950 dark:to-eco-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 rounded-full border-4 border-eco-200 dark:border-eco-800 border-t-eco-500"
      />
      
      {type === 'tree' && (
        <motion.div
          className="mt-8 text-6xl"
          animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌱
        </motion.div>
      )}
      
      {type === 'earth' && (
        <motion.div
          className="mt-8 text-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          🌍
        </motion.div>
      )}
      
      {type === 'energy' && (
        <motion.div className="mt-8 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-8 bg-eco-500 rounded-full"
              animate={{
                height: [8, 32, 8],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.p
        className="mt-6 text-gray-600 dark:text-gray-400 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  )
}
