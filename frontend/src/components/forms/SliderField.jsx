export default function SliderField({ label, name, value, onChange, min = 0, max = 100000, step = 1, suffix = '', icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {Icon && <span>{Icon}</span>}
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-eco-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-eco-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-eco-500/30"
        />
        <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[4rem] text-right">
          {parseInt(value).toLocaleString()}{suffix}
        </span>
      </div>
    </div>
  )
}
