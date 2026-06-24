import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import AreaChart from '../components/charts/AreaChart.jsx'
import { useApp } from '../context/AppContext.jsx'
import { calculateScores } from '../utils/sustainabilityEngine.js'
import { calculateCarbonImpact } from '../utils/carbonCalculator.js'
import {
  registrationMethods, certificateTypes, marketingTypes,
  transportTypes, waterTypes, foodTypes, energyLevels,
  wasteOptions, sustainabilityInitiatives
} from '../data/eventCategories.js'
import { FiRotateCcw, FiCheck } from 'react-icons/fi'

export default function CarbonSimulator() {
  const { currentResult } = useApp()
  const [showComparison, setShowComparison] = useState(false)
  const [simulated, setSimulated] = useState(null)
  const [changes, setChanges] = useState({})

  const original = currentResult?.formData || null
  const originalScores = currentResult?.scores || null
  const originalImpact = currentResult?.impact || null

  const fields = [
    { key: 'transport', label: 'Transportation', options: transportTypes },
    { key: 'water', label: 'Water Distribution', options: waterTypes },
    { key: 'food', label: 'Food Serving', options: foodTypes },
    { key: 'energy', label: 'Energy Usage', options: energyLevels },
    { key: 'registration', label: 'Registration', options: registrationMethods },
    { key: 'certificates', label: 'Certificates', options: certificateTypes },
    { key: 'marketing', label: 'Marketing', options: marketingTypes },
    { key: 'wasteSegregation', label: 'Waste Segregation', options: wasteOptions },
  ]

  const handleChange = (key, value) => {
    setChanges((prev) => ({ ...prev, [key]: value }))
  }

  const runSimulation = () => {
    if (!original) return
    const modified = { ...original, ...changes }
    const scores = calculateScores(modified)
    const impact = calculateCarbonImpact(modified)
    setSimulated({ scores, impact })
    setShowComparison(true)
  }

  const reset = () => {
    setChanges({})
    setSimulated(null)
    setShowComparison(false)
  }

  const areaData = showComparison ? {
    labels: ['Carbon', 'Water', 'Waste', 'Energy', 'Environmental'],
    datasets: [
      {
        label: 'Before',
        data: originalScores ? [
          originalScores.carbon, originalScores.water,
          originalScores.waste, originalScores.energy, originalScores.environmental,
        ] : [],
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#ef4444',
        pointBackgroundColor: '#ef4444',
      },
      {
        label: 'After',
        data: [
          simulated.scores.carbon, simulated.scores.water,
          simulated.scores.waste, simulated.scores.energy, simulated.scores.environmental,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: '#22c55e',
        pointBackgroundColor: '#22c55e',
      },
    ],
  } : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Carbon Impact{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Simulator
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Modify sustainability decisions and see how your event's environmental impact changes in real-time.
          </p>
        </div>

        {!original ? (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Analysis Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              First, analyze an event to use the simulator.
            </p>
            <Button to="/analyze">Analyze Your Event</Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">🔧 Modify Parameters</h2>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                      <select
                        value={changes[field.key] || original[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-500/50"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value} className="dark:bg-gray-800">
                            {opt.icon} {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={runSimulation} size="lg" className="flex-1">
                    <FiCheck className="w-5 h-5" />
                    Run Simulation
                  </Button>
                  <Button variant="ghost" onClick={reset}>
                    <FiRotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {showComparison && (
                <>
                  {/* Score comparison */}
                  <Card>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Before</div>
                        <div className="text-2xl font-bold text-red-500">{originalScores.overall}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-eco-500/5 border border-eco-500/10">
                        <div className="text-xs text-gray-500 dark:text-gray-400">After</div>
                        <div className="text-2xl font-bold text-eco-500">{simulated.scores.overall}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-lg font-bold text-eco-500">
                        +{simulated.scores.overall - originalScores.overall} points improvement
                      </span>
                    </div>
                  </Card>

                  {/* Chart */}
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Before vs After</h3>
                    <AreaChart data={areaData} />
                  </Card>

                  {/* Impact comparison */}
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Impact Comparison</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Carbon Emissions', before: originalImpact.carbonEmissions, after: simulated.impact.carbonEmissions, unit: 'kg CO₂e' },
                        { label: 'Paper Consumption', before: originalImpact.paperConsumption, after: simulated.impact.paperConsumption, unit: 'kg' },
                        { label: 'Plastic Consumption', before: originalImpact.plasticConsumption, after: simulated.impact.plasticConsumption, unit: 'items' },
                        { label: 'Water Usage', before: originalImpact.waterUsage, after: simulated.impact.waterUsage, unit: 'L' },
                        { label: 'Energy Usage', before: originalImpact.energyUsage, after: simulated.impact.energyUsage, unit: 'kWh' },
                      ].map((item) => {
                        const diff = ((item.before - item.after) / item.before * 100).toFixed(0)
                        return (
                          <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-red-400 line-through">{item.before}</span>
                              <span className="text-sm font-bold text-eco-500">{item.after} {item.unit}</span>
                              {diff > 0 && (
                                <span className="text-xs font-medium text-eco-500">-{diff}%</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
