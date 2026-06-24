import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/common/Button.jsx'
import AnimatedCounter from '../components/common/AnimatedCounter.jsx'
import ScrollReveal from '../components/common/ScrollReveal.jsx'
import Card from '../components/common/Card.jsx'
import { FiArrowRight, FiTrendingUp, FiAward, FiGlobe } from 'react-icons/fi'
import { getStats } from '../utils/storage.js'

const floatingStats = [
  { label: 'Events Analyzed', key: 'total', icon: '📊', suffix: '+', color: '#22c55e' },
  { label: 'Carbon Saved', key: 'carbonSaved', icon: '🌍', suffix: ' kg', color: '#06b6d4' },
  { label: 'Trees Protected', key: 'treesProtected', icon: '🌳', suffix: '+', color: '#22c55e' },
  { label: 'Plastic Avoided', key: 'plasticAvoided', icon: '♻️', suffix: ' kg', color: '#eab308' },
  { label: 'Water Conserved', key: 'waterConserved', icon: '💧', suffix: ' L', color: '#3b82f6' },
]

const features = [
  { icon: '📊', title: 'Event Analyzer', desc: 'Comprehensive sustainability assessment for events of any scale.', color: '#22c55e' },
  { icon: '🌍', title: 'Carbon Impact', desc: 'Advanced carbon footprint calculator with real-time insights.', color: '#06b6d4' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Chat with EcoAI for personalized sustainability recommendations.', color: '#a855f7' },
  { icon: '🏆', title: 'Certification', desc: 'Earn Bronze, Silver, Gold, or Platinum sustainability certifications.', color: '#eab308' },
  { icon: '🔄', title: 'Impact Simulator', desc: 'Simulate changes and see your sustainability score improve.', color: '#f97316' },
  { icon: '📈', title: 'Analytics', desc: 'Detailed charts and reports for data-driven sustainability decisions.', color: '#3b82f6' },
]

export default function Home() {
  const [stats, setStats] = useState(getStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const sdgLogos = [
    { id: 6, icon: '💧', color: '#26BDE2' },
    { id: 7, icon: '⚡', color: '#FDB714' },
    { id: 11, icon: '🏙️', color: '#F39D27' },
    { id: 12, icon: '🔄', color: '#CF8D2A' },
    { id: 13, icon: '🌍', color: '#3F7E44' },
    { id: 15, icon: '🌳', color: '#56C02B' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white dark:via-gray-950/50 dark:to-gray-950 z-[1]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-600 dark:text-eco-400 text-sm font-medium mb-6">
                  <span className="animate-pulse">●</span>
                  AI-Powered Sustainability Platform
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Plan Smarter.{' '}
                <span className="bg-gradient-to-r from-eco-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Waste Less.
                </span>{' '}
                Create Impact.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                The AI-powered platform that helps organizations design environmentally 
                sustainable events with real-time impact analysis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Button to="/analyze" size="xl" icon={FiArrowRight}>
                  Analyze Your Event
                </Button>
                <Button to="/assistant" variant="secondary" size="xl">
                  Meet EcoAI
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex gap-4 justify-center lg:justify-start"
              >
                {sdgLogos.map((sdg) => (
                  <span
                    key={sdg.id}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-lg"
                    style={{ backgroundColor: sdg.color }}
                    title={`SDG ${sdg.id}`}
                  >
                    {sdg.icon}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right side - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {floatingStats.map((stat) => (
                <Card key={stat.key} glow className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                    <AnimatedCounter
                      value={stats[stat.key] || 0}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs">Scroll to explore</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
                Sustainable Events
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From AI-powered analysis to certification, we provide all the tools to make your events environmentally responsible.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Card hover className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-24 relative bg-gradient-to-b from-transparent to-eco-50/30 dark:to-eco-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Supporting UN{' '}
              <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
                Sustainable Development Goals
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every analysis is mapped to the UN SDGs, helping you understand your contribution to global sustainability targets.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdgLogos.map((sdg, i) => (
              <ScrollReveal key={sdg.id} delay={i * 0.08}>
                <Card className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {sdg.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold opacity-60" style={{ color: sdg.color }}>SDG {sdg.id}</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {sdg.id === 6 && 'Clean Water'}
                      {sdg.id === 7 && 'Clean Energy'}
                      {sdg.id === 11 && 'Sustainable Cities'}
                      {sdg.id === 12 && 'Responsible Consumption'}
                      {sdg.id === 13 && 'Climate Action'}
                      {sdg.id === 15 && 'Life on Land'}
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-12">
            <Link
              to="/sdg-impact"
              className="inline-flex items-center gap-2 text-eco-600 dark:text-eco-400 font-medium hover:gap-3 transition-all"
            >
              <FiGlobe className="w-5 h-5" />
              Explore SDG Impact Center
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <Card glow gradient className="p-12 sm:p-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Make Your Events Sustainable?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Start your first sustainability analysis and discover how AI can help you reduce environmental impact.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button to="/analyze" size="xl" icon={FiTrendingUp}>
                  Analyze Your Event
                </Button>
                <Button to="/about" variant="secondary" size="xl" icon={FiAward}>
                  Learn More
                </Button>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
