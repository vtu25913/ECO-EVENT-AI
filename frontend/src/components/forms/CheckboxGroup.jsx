import { motion } from 'framer-motion'

export default function CheckboxGroup({ label, name, options, selected = [], onChange, icon: Icon }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(name, next)
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {Icon && <span>{Icon}</span>}
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all border ${
                isSelected
                  ? 'bg-eco-50 dark:bg-eco-500/10 border-eco-500/30 text-eco-700 dark:text-eco-300'
                  : 'bg-white/30 dark:bg-white/[0.03] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/10'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-eco-500 border-eco-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
