import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiTrendingUp, FiAward, FiShield } from 'react-icons/fi'

const perks = [
  { icon: '🤖', label: 'AI Sustainability Analysis', desc: 'Get instant environmental scores' },
  { icon: '📊', label: 'Real-Time Dashboards', desc: 'Track your sustainability impact' },
  { icon: '🏆', label: 'Certifications & Badges', desc: 'Earn Platinum, Gold & Silver' },
  { icon: '🌍', label: 'SDG Impact Mapping', desc: 'Align with UN goals' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* ===== LEFT: Decorative Side ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0 bg-[url('https://static.vecteezy.com/system/resources/previews/026/746/188/large_2x/illustration-image-nature-and-sustainability-eco-friendly-living-and-conservation-concept-art-of-earth-and-animal-life-in-different-environments-generative-ai-illustration-free-photo.jpg')] bg-cover bg-center" />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/70 to-gray-950/50" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-eco-500/30">
              🌿
            </div>
            <div>
              <span className="text-xl font-bold text-white">EcoEvent AI</span>
              <span className="block text-[11px] text-eco-200 font-medium tracking-wider uppercase">Sustainability Platform</span>
            </div>
          </motion.div>

          {/* Center content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-black text-white leading-tight">
                Welcome Back to{' '}
                <span className="bg-gradient-to-r from-eco-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Sustainable Events
                </span>
              </h1>
              <p className="mt-4 text-lg text-eco-100/80 max-w-md leading-relaxed">
                Continue your journey toward environmentally responsible event planning with AI-powered insights.
              </p>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-2xl">{perk.icon}</span>
                  <h3 className="mt-2 text-sm font-semibold text-white">{perk.label}</h3>
                  <p className="text-xs text-eco-200/60 mt-0.5">{perk.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-eco-200/50"
          >
            © 2026 EcoEvent AI — AI-Powered Sustainability Intelligence
          </motion.p>
        </div>
      </div>

      {/* ===== RIGHT: Form Side ===== */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 relative bg-gradient-to-br from-gray-50 to-eco-50/30 dark:from-gray-950 dark:to-eco-950/30">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-eco-500/5 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-600 dark:text-eco-400 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
              EcoEvent AI Platform
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to continue your journey</p>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-eco-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/60 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
              {/* Desktop header */}
              <div className="hidden lg:block text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-eco-500/20">
                  🌿
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3.5 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500/50 text-sm transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FiLock className="w-4 h-4 text-gray-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 pr-12 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500/50 text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Forgot password hint */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-eco-600 dark:text-eco-400 hover:text-eco-700 dark:hover:text-eco-300 font-medium transition-colors"
                      onClick={() => {/* TODO: password reset */}}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <span>⚠️</span>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full !py-3.5 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <FiArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">or continue with</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex justify-center gap-6">
                {[
                  { icon: FiShield, label: 'Secure' },
                  { icon: FiCheck, label: 'Free' },
                  { icon: FiTrendingUp, label: 'AI-Powered' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <item.icon className="w-3.5 h-3.5 text-eco-500" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Sign up link */}
              <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-eco-600 dark:text-eco-400 hover:text-eco-700 dark:hover:text-eco-300 font-semibold transition-colors"
                >
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
