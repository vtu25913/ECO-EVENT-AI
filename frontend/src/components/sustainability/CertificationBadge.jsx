import { motion } from 'framer-motion'

const certStyles = {
  platinum: {
    gradient: 'from-yellow-300 via-amber-300 to-yellow-400',
    bg: 'from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10',
    border: 'border-yellow-300 dark:border-yellow-500/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    badge: '🏆',
  },
  gold: {
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-500/5',
    border: 'border-yellow-400 dark:border-yellow-500/20',
    text: 'text-yellow-700 dark:text-yellow-300',
    badge: '🥇',
  },
  silver: {
    gradient: 'from-slate-300 to-slate-400',
    bg: 'from-slate-50 to-slate-100 dark:from-slate-400/10 dark:to-slate-400/5',
    border: 'border-slate-300 dark:border-slate-400/20',
    text: 'text-slate-600 dark:text-slate-300',
    badge: '🥈',
  },
  bronze: {
    gradient: 'from-orange-300 to-orange-400',
    bg: 'from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-500/5',
    border: 'border-orange-300 dark:border-orange-400/20',
    text: 'text-orange-700 dark:text-orange-300',
    badge: '🥉',
  },
}

export default function CertificationBadge({ certification, size = 'md' }) {
  const style = certStyles[certification.level] || certStyles.bronze
  const isLarge = size === 'lg'

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.bg} border ${style.border} ${isLarge ? 'p-8' : 'p-5'}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="flex flex-col items-center text-center gap-3">
        <span className={isLarge ? 'text-5xl' : 'text-3xl'}>{style.badge}</span>
        <div>
          <h3 className={`font-bold ${style.text} ${isLarge ? 'text-2xl' : 'text-lg'} capitalize`}>
            {certification.levelName}
          </h3>
          <p className={`text-gray-500 dark:text-gray-400 ${isLarge ? 'text-sm' : 'text-xs'} mt-1`}>
            Verified Sustainable Event
          </p>
        </div>
        {certification.score && (
          <div className={`font-bold bg-white/50 dark:bg-white/5 rounded-full px-4 py-1 ${style.text}`}>
            Score: {certification.score}/100
          </div>
        )}
      </div>
    </motion.div>
  )
}
