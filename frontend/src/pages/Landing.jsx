import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { FiArrowRight, FiTrendingUp, FiAward, FiGlobe, FiSun, FiMoon, FiChevronDown } from 'react-icons/fi'

const features = [
  {
    icon: '📊',
    title: 'AI Sustainability Analyzer',
    desc: 'Comprehensive event assessment with real-time AI-powered scoring across carbon, water, waste, energy, and environmental impact.',
    color: '#22c55e',
  },
  {
    icon: '🌍',
    title: 'Carbon Impact Simulation',
    desc: 'Modify event parameters and instantly see how your sustainability score changes with interactive before/after comparisons.',
    color: '#06b6d4',
  },
  {
    icon: '🤖',
    title: 'AI Sustainability Advisor',
    desc: 'AI-powered environmental insights and recommendations for sustainable events. Get prioritized improvement roadmaps.',
    color: '#a855f7',
  },
  {
    icon: '🏆',
    title: 'Certification & Badges',
    desc: 'Earn Bronze, Silver, Gold, or Platinum sustainability certifications. Gamified achievements motivate continuous improvement.',
    color: '#eab308',
  },
  {
    icon: '📈',
    title: 'Real-Time Analytics',
    desc: 'Beautiful dashboards with detailed charts, leaderboards, and SDG impact mapping for data-driven sustainability decisions.',
    color: '#f97316',
  },
  {
    icon: '🌱',
    title: 'Environmental Education',
    desc: 'Learn about waste segregation, carbon neutrality, renewable energy, and sustainable practices through interactive content.',
    color: '#3b82f6',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // If already authenticated, go to app
  if (isAuthenticated) {
    return (
      <div className="min-h-screen relative bg-[url('https://thumbs.dreamstime.com/b/beautiful-planet-earth-green-lush-nature-environmental-image-eco-life-pure-world-fresh-370312020.jpg')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/85 via-white/80 to-eco-50/85 dark:from-gray-950/88 dark:via-gray-900/85 dark:to-eco-950/88" />
        <div className="relative z-10">
          <LandingContent
            scrolled={scrolled}
            isDark={isDark}
            toggleTheme={toggleTheme}
            isAuthenticated={true}
            navigate={navigate}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-[url('https://thumbs.dreamstime.com/b/beautiful-planet-earth-green-lush-nature-environmental-image-eco-life-pure-world-fresh-370312020.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/85 via-white/80 to-eco-50/85 dark:from-gray-950/88 dark:via-gray-900/85 dark:to-eco-950/88" />
      <div className="relative z-10">
        <LandingContent
          scrolled={scrolled}
          isDark={isDark}
          toggleTheme={toggleTheme}
          isAuthenticated={false}
          navigate={navigate}
        />
      </div>
    </div>
  )
}

function LandingContent({ scrolled, isDark, toggleTheme, isAuthenticated, navigate }) {
  return (
    <>
      {/* Fixed top bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-eco-500/20"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-xl leading-none">🌿</span>
              </motion.div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-eco-500 to-emerald-600 bg-clip-text text-transparent">
                  EcoEvent AI
                </span>
                <span className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-500 font-medium tracking-wider uppercase -mt-0.5">
                  Sustainability Intelligence
                </span>
              </div>
            </Link>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              </motion.button>

              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} size="md">
                  <FiArrowRight className="w-4 h-4" />
                  Enter App
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-eco-500 to-emerald-600 hover:from-eco-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-eco-500/25 hover:shadow-eco-500/40 transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60 dark:from-gray-950/60 dark:via-transparent dark:to-gray-950/80 z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-[1]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-600 dark:text-eco-400 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-eco-500 animate-pulse" />
              AI-Powered Sustainability Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight"
          >
            Plan Smarter.{' '}
            <span className="bg-gradient-to-r from-eco-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Waste Less.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-eco-500 bg-clip-text text-transparent">
              Create Impact.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            The intelligent platform that helps organizations design environmentally sustainable events 
            with real-time AI analysis, carbon simulation, and expert recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} size="xl">
                <FiArrowRight className="w-5 h-5" />
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/signup">
                  <motion.div
                    className="relative px-8 py-4 text-lg font-bold text-white rounded-2xl overflow-hidden group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-eco-500 via-emerald-500 to-teal-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div
                    className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm backdrop-blur-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.div>
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { icon: '💧', label: 'SDG 6', color: '#26BDE2' },
              { icon: '⚡', label: 'SDG 7', color: '#FDB714' },
              { icon: '🏙️', label: 'SDG 11', color: '#F39D27' },
              { icon: '🔄', label: 'SDG 12', color: '#CF8D2A' },
              { icon: '🌍', label: 'SDG 13', color: '#3F7E44' },
              { icon: '🌳', label: 'SDG 15', color: '#56C02B' },
            ].map((sdg, i) => (
              <motion.div
                key={sdg.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-lg"
                  style={{ backgroundColor: `${sdg.color}20` }}
                >
                  <span>{sdg.icon}</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                  {sdg.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs font-medium">Explore features</span>
            <FiChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
                Sustainable Events
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From AI-powered analysis to certification, we provide all the tools to make your events environmentally responsible.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/5 hover:border-gray-300/60 dark:hover:border-white/10 transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}08, transparent 40%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-500/5 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-500/10 via-emerald-500/5 to-teal-500/10 dark:from-eco-500/10 dark:via-emerald-500/5 dark:to-teal-500/10 border border-eco-500/20 dark:border-eco-500/10 p-8 sm:p-16"
          >
            <div className="relative">
              <div className="text-5xl mb-6">🌿</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Make Your Events Sustainable?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Join organizations using AI to reduce environmental impact. Start your first analysis in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated ? (
                  <Button onClick={() => navigate('/dashboard')} size="xl">
                    <FiTrendingUp className="w-5 h-5" />
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Link to="/signup">
                      <motion.div
                        className="relative px-8 py-4 text-lg font-bold text-white rounded-2xl overflow-hidden group"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-eco-500 to-emerald-600" />
                        <span className="relative z-10 flex items-center gap-2">
                          Get Started Free
                          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </motion.div>
                    </Link>
                    <Link to="/about">
                      <motion.div
                        className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all backdrop-blur-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiAward className="w-5 h-5" />
                        Learn More
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-gray-200/50 dark:border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <span className="text-lg">🌿</span>
              <span>EcoEvent AI — Sustainability Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-600">
              <Link to="/about" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">About</Link>
              <Link to="/settings" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Privacy</Link>
              <span className="text-gray-400 dark:text-gray-600">Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
