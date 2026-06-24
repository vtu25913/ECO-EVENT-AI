import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiStar, FiHeart, FiShield } from 'react-icons/fi'

const benefits = [
  { icon: '🤖', label: 'AI-Powered Analysis', desc: 'Get instant sustainability scores' },
  { icon: '📊', label: 'Beautiful Dashboards', desc: 'Visualize your impact' },
  { icon: '🏆', label: 'Certifications', desc: 'Platinum, Gold & Silver badges' },
  { icon: '🌍', label: 'UN SDG Alignment', desc: 'Map to 6 global goals' },
]

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signUp, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, fullName)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-eco-50/30 dark:from-gray-950 dark:to-eco-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-eco-500/10 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-eco-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/60 dark:border-white/10 rounded-3xl p-10 text-center shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-eco-500/20">
                🎉
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                We've sent a confirmation link to
              </p>
              <p className="text-lg font-semibold text-eco-600 dark:text-eco-400 mb-6">{email}</p>
              <div className="p-4 rounded-2xl bg-eco-500/5 border border-eco-500/10 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <p className="flex items-center gap-2 justify-center">
                  <span>📧</span>
                  Please check your inbox and click the confirmation link to activate your account.
                </p>
              </div>
              <Button onClick={() => navigate('/login')} size="lg" className="w-full">
                <FiArrowRight className="w-5 h-5" /> Go to Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* ===== LEFT: Decorative Side ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0 bg-[url('https://static.vecteezy.com/system/resources/previews/022/506/525/large_2x/green-energy-sustainable-industry-environmental-social-and-corporate-governance-concept-free-photo.jpg')] bg-cover bg-center" />
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
                Start Your{' '}
                <span className="bg-gradient-to-r from-eco-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Sustainability Journey
                </span>
              </h1>
              <p className="mt-4 text-lg text-eco-100/80 max-w-md leading-relaxed">
                Join organizations using AI to analyze, improve, and certify their events for a greener planet.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-2xl">{benefit.icon}</span>
                  <h3 className="mt-2 text-sm font-semibold text-white">{benefit.label}</h3>
                  <p className="text-xs text-eco-200/60 mt-0.5">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8"
            >
              {[
                { value: '10K+', label: 'Events Analyzed' },
                { value: '50K+', label: 'kg CO₂ Tracked' },
                { value: '95%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[11px] text-eco-200/60">{stat.label}</div>
                </div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Join for free and start analyzing</p>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Free forever. No credit card needed.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3.5 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500/50 text-sm transition-all"
                  />
                </div>

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
                      placeholder="Create a strong password"
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
                  {/* Password hint */}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FiCheck className="w-3 h-3" />
                    At least 6 characters
                  </p>
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

                {/* Terms */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-eco-600 dark:text-eco-400 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-eco-600 dark:text-eco-400 hover:underline">Privacy Policy</a>.
                </p>

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
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Free Account
                      <FiArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Trust badges */}
              <div className="flex justify-center gap-6 mt-8">
                {[
                  { icon: FiShield, label: 'Encrypted' },
                  { icon: FiHeart, label: 'Free Forever' },
                  { icon: FiStar, label: 'AI-Powered' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <item.icon className="w-3.5 h-3.5 text-eco-500" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Sign in link */}
              <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-eco-600 dark:text-eco-400 hover:text-eco-700 dark:hover:text-eco-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
