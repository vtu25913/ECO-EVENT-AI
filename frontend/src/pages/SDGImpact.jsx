import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import SDGCard from '../components/sustainability/SDGCard.jsx'
import SDGWheel from '../components/sustainability/SDGWheel.jsx'
import ScrollReveal from '../components/common/ScrollReveal.jsx'
import { sdgs } from '../data/sdgs.js'
import { useApp } from '../context/AppContext.jsx'
import { mapSDGImpact } from '../utils/sdgMapper.js'

export default function SDGImpact() {
  const { analyses } = useApp()
  const latest = analyses[0]

  const sdgData = latest ? mapSDGImpact(latest.formData, latest.scores) : null

  const totalContributions = sdgData?.contributions || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            SDG{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Impact Center
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how your events contribute to the UN Sustainable Development Goals.
          </p>
        </div>

        {!latest ? (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Data Yet</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Analyze an event to see its SDG impact mapping.
            </p>
          </Card>
        ) : (
          <>
            {/* SDG Wheel */}
            <div className="flex justify-center mb-12">
              <Card className="inline-flex items-center justify-center">
                <SDGWheel contributions={totalContributions} />
              </Card>
            </div>

            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <Card gradient className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-2xl font-bold text-eco-500">{sdgData.averageImpact}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Average SDG Contribution</div>
              </Card>
              <Card gradient className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-ocean-500">{sdgData.topSDGs.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">SDGs Most Impacted</div>
              </Card>
              <Card gradient className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-purple-500">
                  {Object.entries(totalContributions).filter(([, v]) => v > 50).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">SDGs with 50%+ Contribution</div>
              </Card>
            </div>

            {/* Top SDGs */}
            <ScrollReveal className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🎯 Top SDG Contributions
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdgData.topSDGs.map((item) => (
                  <SDGCard
                    key={item.sdg.id}
                    sdg={item.sdg}
                    contribution={item.contribution}
                  />
                ))}
              </div>
            </ScrollReveal>

            {/* All SDGs */}
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🌍 All SDG Contributions
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdgs.map((sdg) => (
                  <SDGCard
                    key={sdg.id}
                    sdg={sdg}
                    contribution={totalContributions[sdg.id] || 0}
                  />
                ))}
              </div>
            </ScrollReveal>

            {/* Benefits */}
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {[
                { icon: '🌿', title: 'Environmental Benefits', desc: 'Reduced carbon footprint, waste management, water conservation, and renewable energy adoption through sustainable event practices.' },
                { icon: '🤝', title: 'Social Benefits', desc: 'Community engagement, awareness campaigns, educational opportunities, and inclusive participation in sustainability initiatives.' },
                { icon: '🏘️', title: 'Community Benefits', desc: 'Local economic support, green job creation, public health improvements, and resilient community infrastructure.' },
              ].map((benefit) => (
                <Card key={benefit.title} gradient>
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
