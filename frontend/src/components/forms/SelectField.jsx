import { motion } from 'framer-motion'

export default function SelectField({ label, name, value, onChange, options, icon: Icon, placeholder = 'Select...', required }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {Icon && <span>{Icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-sm backdrop-blur-sm"
        >
          <option value="" className="text-gray-400">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-gray-800">
              {opt.icon || ''} {opt.label || opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
