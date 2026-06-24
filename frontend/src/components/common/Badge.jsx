export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300',
    success: 'bg-eco-100 dark:bg-eco-500/20 text-eco-700 dark:text-eco-300',
    warning: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    platinum: 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-500/20 dark:to-amber-500/20 text-yellow-700 dark:text-yellow-300',
    gold: 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-500/20 dark:to-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    silver: 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-400/20 dark:to-slate-400/10 text-slate-600 dark:text-slate-300',
    bronze: 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-500/10 text-orange-700 dark:text-orange-300',
  }

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
