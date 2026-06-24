import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import ScrollReveal from '../components/common/ScrollReveal.jsx'
import { sdgs } from '../data/sdgs.js'

const team = [
  { name: 'EcoEvent AI', role: 'AI-Powered Platform', icon: '🤖' },
  { name: 'AI Advisor', role: 'Sustainability Intelligence', icon: '🤖' },
  { name: 'UN SDGs', role: 'Framework Alignment', icon: '🌍' },
]

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Mission */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
              EcoEvent AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make every event sustainable. EcoEvent AI provides 
            intelligent, AI-powered tools to measure, analyze, and improve the environmental 
            impact of events of all sizes.
          </p>
        </section>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ScrollReveal>
            <Card gradient className="h-full">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The Problem</h2>
              <ul className="space-y-3">
                {[
                  'Plastic bottle waste from thousands of attendees',
                  'Paper waste from printed materials and registration',
                  'Excess food waste from poor planning',
                  'High energy consumption at venues',
                  'Carbon emissions from attendee transportation',
                  'No tools to measure sustainability before events',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card gradient glow className="h-full">
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Solution</h2>
              <ul className="space-y-3">
                {[
                  'AI-powered sustainability assessment engine',
                  'Real-time carbon impact calculator',
                  'Personalized recommendations for improvement',
                  'Green event certification system',
                  'SDG impact mapping and reporting',
                  'Interactive what-if scenario simulator',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-eco-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </ScrollReveal>
        </div>

        {/* SDGs */}
        <ScrollReveal className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Supporting the UN Sustainable Development Goals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform directly contributes to six key SDGs through actionable sustainability metrics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdgs.map((sdg) => (
              <Card key={sdg.id}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {sdg.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.id}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{sdg.short}</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sdg.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Built With Modern Technology
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['⚛️', 'React', 'UI Framework'],
              ['🎨', 'Tailwind CSS', 'Styling'],
              ['🎬', 'Framer Motion', 'Animations'],
              ['🌐', 'Three.js', '3D Graphics'],
              ['📊', 'Chart.js', 'Visualizations'],
              ['📄', 'jsPDF', 'PDF Reports'],
              ['📱', 'PWA', 'Offline Support'],
              ['🤖', 'AI Advisor', 'Sustainability AI'],
            ].map(([icon, name, desc]) => (
              <Card key={name} className="text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{name}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">{desc}</div>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal>
          <Card gradient glow className="text-center p-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Join organizations worldwide using EcoEvent AI to create sustainable, impactful events.
            </p>
            <div className="grid grid-cols-3 gap-8 mb-8">
              {[
                ['🌿', 'AI-Powered', 'Smart Analysis'],
                ['🏆', 'Certified', 'Green Events'],
                ['🌍', 'SDG Aligned', 'Global Impact'],
              ].map(([icon, title, sub]) => (
                <div key={title}>
                  <div className="text-3xl mb-1">{icon}</div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </motion.div>
    </div>
  )
}
