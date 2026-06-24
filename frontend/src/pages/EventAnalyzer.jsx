import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import EventForm from '../components/forms/EventForm.jsx'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import ScoreGauge from '../components/sustainability/ScoreGauge.jsx'
import RecommendationCard from '../components/sustainability/RecommendationCard.jsx'
import CertificationBadge from '../components/sustainability/CertificationBadge.jsx'
import ConfettiEffect from '../components/gamification/ConfettiEffect.jsx'
import DoughnutChart from '../components/charts/DoughnutChart.jsx'
import AreaChart from '../components/charts/AreaChart.jsx'
import { useApp } from '../context/AppContext.jsx'
import { calculateScores } from '../utils/sustainabilityEngine.js'
import { calculateCarbonImpact } from '../utils/carbonCalculator.js'
import {
  registrationMethods, certificateTypes, marketingTypes,
  transportTypes, waterTypes, foodTypes, energyLevels,
  wasteOptions
} from '../data/eventCategories.js'
import { FiArrowRight, FiBarChart2, FiRotateCcw, FiCheck, FiRefreshCcw, FiTrendingUp, FiDownload, FiStar, FiClock } from 'react-icons/fi'
import { getScoreLevel } from '../utils/sustainabilityEngine.js'
import { getAutoBenchmark, getAllBenchmarks, compareWithBenchmark } from '../utils/benchmarking.js'
import { saveTemplate, getSimilarAnalyses } from '../utils/storage.js'

export default function EventAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [simMode, setSimMode] = useState(false)
  const [simChanges, setSimChanges] = useState({})
  const [simResult, setSimResult] = useState(null)
  const [savedAsTemplate, setSavedAsTemplate] = useState(false)
  const [similarAnalyses, setSimilarAnalyses] = useState([])
  const { runAnalysis, currentResult } = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    setLoading(true)
    setTimeout(async () => {
      try {
        const result = await runAnalysis(formData)
        setLoading(false)
        setSimMode(false)
        setSimChanges({})
        setSimResult(null)
        if (result?.unlocked?.length > 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3500)
        }
        // Check for similar past analyses (year-over-year)
        if (result?.formData?.eventName) {
          setSimilarAnalyses(getSimilarAnalyses(result.formData.eventName).filter(a => a.id !== result.id))
        }
        setSavedAsTemplate(false)
      } catch (err) {
        console.error('Analysis failed:', err)
        setLoading(false)
      }
    }, 1500)
  }

  const handleDownloadPDF = async () => {
    if (!currentResult) return
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const pw = doc.internal.pageSize.getWidth()

    doc.setFillColor(5, 46, 22)
    doc.rect(0, 0, pw, 60, 'F')
    doc.setTextColor(34, 197, 94)
    doc.setFontSize(24)
    doc.text('EcoEvent AI', pw / 2, 30, { align: 'center' })
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text('Sustainability Analysis Report', pw / 2, 45, { align: 'center' })

    let y = 80
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('Event Summary', 20, y); y += 12
    doc.setFontSize(11)
    const fields = [
      ['Event', currentResult.formData.eventName],
      ['Organization', currentResult.formData.organization],
      ['Location', currentResult.formData.location],
      ['Date', new Date().toLocaleDateString()],
      ['Category', currentResult.formData.category],
      ['Participants', currentResult.formData.participants],
      ['Duration', `${currentResult.formData.duration} days`],
      ['Overall Score', `${currentResult.scores.overall}/100`],
      ['Certification', currentResult.certification.levelName],
    ]
    fields.forEach(([l, v]) => { doc.text(`${l}: ${v || 'N/A'}`, 25, y); y += 8 })

    y += 10
    doc.setFontSize(16)
    doc.text('Score Breakdown', 20, y); y += 12
    doc.setFontSize(11)
    const scoresList = [['Carbon', currentResult.scores.carbon], ['Water', currentResult.scores.water], ['Waste', currentResult.scores.waste], ['Energy', currentResult.scores.energy], ['Environmental', currentResult.scores.environmental]]
    scoresList.forEach(([l, v]) => { doc.text(`${l}: ${v}/100`, 25, y); y += 8 })

    y += 10
    doc.setFontSize(16)
    doc.text('Environmental Impact', 20, y); y += 12
    doc.setFontSize(11)
    const impacts = [
      ['Carbon Emissions', `${currentResult.impact.carbonEmissions} kg CO₂e`],
      ['Paper Consumption', `${currentResult.impact.paperConsumption} kg`],
      ['Plastic Consumption', `${currentResult.impact.plasticConsumption} items`],
      ['Water Usage', `${currentResult.impact.waterUsage} L`],
      ['Energy Usage', `${currentResult.impact.energyUsage} kWh`],
      ['Waste Generated', `${currentResult.impact.wasteGenerated} kg`],
    ]
    impacts.forEach(([l, v]) => { doc.text(`${l}: ${v}`, 25, y); y += 8 })

    if (currentResult.recommendations.length > 0) {
      y = Math.max(y + 10, y)
      if (y > 240) { doc.addPage(); y = 30 }
      doc.setFontSize(16)
      doc.text('Recommendations', 20, y); y += 12
      doc.setFontSize(11)
      currentResult.recommendations.slice(0, 6).forEach((rec, i) => {
        if (y > 270) { doc.addPage(); y = 30 }
        doc.text(`${i + 1}. ${rec.title}`, 25, y); y += 7
        doc.setFontSize(10)
        doc.text(`   Impact: ${rec.impact}% | Difficulty: ${rec.difficulty}`, 30, y); y += 7
        doc.setFontSize(11)
      })
    }

    y = Math.max(y + 10, 270)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated by EcoEvent AI on ${new Date().toLocaleDateString()}`, 20, y)
    doc.text(`Verification: ${currentResult.certification.verificationCode || 'N/A'}`, 20, y + 6)
    doc.save(`EcoEvent-${currentResult.formData.eventName || 'Report'}.pdf`)
  }

  const handleSaveTemplate = () => {
    if (!currentResult) return
    saveTemplate({
      name: currentResult.formData.eventName || 'Untitled',
      category: currentResult.formData.category,
      formData: currentResult.formData,
    })
    setSavedAsTemplate(true)
    setTimeout(() => setSavedAsTemplate(false), 2000)
  }

  const handleSimChange = (key, value) => {
    setSimChanges((prev) => ({ ...prev, [key]: value }))
  }

  const runSimulation = () => {
    if (!currentResult) return
    const modified = { ...currentResult.formData, ...simChanges }
    const scores = calculateScores(modified)
    const impact = calculateCarbonImpact(modified)
    setSimResult({ scores, impact })
  }

  const resetSim = () => {
    setSimChanges({})
    setSimResult(null)
  }

  const simFields = [
    { key: 'transport', label: 'Transportation', options: transportTypes },
    { key: 'water', label: 'Water Distribution', options: waterTypes },
    { key: 'food', label: 'Food Serving', options: foodTypes },
    { key: 'energy', label: 'Energy Usage', options: energyLevels },
    { key: 'registration', label: 'Registration', options: registrationMethods },
    { key: 'certificates', label: 'Certificates', options: certificateTypes },
    { key: 'marketing', label: 'Marketing', options: marketingTypes },
    { key: 'wasteSegregation', label: 'Waste Segregation', options: wasteOptions },
  ]

  const areaData = simResult && currentResult ? {
    labels: ['Carbon', 'Water', 'Waste', 'Energy', 'Environmental'],
    datasets: [
      {
        label: 'Current',
        data: [
          currentResult.scores.carbon, currentResult.scores.water,
          currentResult.scores.waste, currentResult.scores.energy, currentResult.scores.environmental,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#ef4444',
        pointBackgroundColor: '#ef4444',
      },
      {
        label: 'Improved',
        data: [
          simResult.scores.carbon, simResult.scores.water,
          simResult.scores.waste, simResult.scores.energy, simResult.scores.environmental,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: '#22c55e',
        pointBackgroundColor: '#22c55e',
      },
    ],
  } : null

  return (
    <div className="max-w-7xl mx-auto">
      <ConfettiEffect active={showConfetti} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Event Sustainability{' '}
            <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Assess your event's environmental impact and get AI-powered recommendations from our sustainability intelligence.
          </p>
        </div>

        {!currentResult && (
          <div className="max-w-3xl mx-auto">
            <EventForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {currentResult && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Score Overview */}
              <div className="grid lg:grid-cols-5 gap-6">
                <Card glow gradient className="lg:col-span-2 text-center">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Score</h2>
                  <div className="relative inline-flex">
                    <ScoreGauge score={currentResult.scores.overall} label="Overall" size="lg" />
                  </div>
                  <div className="mt-4">
                    <span
                      className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: `${getScoreLevel(currentResult.scores.overall).color}20`,
                        color: getScoreLevel(currentResult.scores.overall).color,
                      }}
                    >
                      {getScoreLevel(currentResult.scores.overall).label}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => setSimMode(!simMode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        simMode
                          ? 'bg-eco-500/20 text-eco-600 dark:text-eco-400 border border-eco-500/30'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300'
                      }`}
                    >
                      🔄 Simulate Improvements
                    </button>
                  </div>
                </Card>

                <Card className="lg:col-span-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
                  <div className="flex justify-center">
                    <div className="w-64">
                      <DoughnutChart
                        data={[
                          currentResult.scores.carbon,
                          currentResult.scores.water,
                          currentResult.scores.waste,
                          currentResult.scores.energy,
                          currentResult.scores.environmental,
                        ]}
                        labels={['Carbon', 'Water', 'Waste', 'Energy', 'Environmental']}
                        colors={['#22c55e', '#06b6d4', '#eab308', '#f97316', '#a855f7']}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-4 text-center">
                    {[
                      { label: 'Carbon', value: currentResult.scores.carbon, color: '#22c55e' },
                      { label: 'Water', value: currentResult.scores.water, color: '#06b6d4' },
                      { label: 'Waste', value: currentResult.scores.waste, color: '#eab308' },
                      { label: 'Energy', value: currentResult.scores.energy, color: '#f97316' },
                      { label: 'Environment', value: currentResult.scores.environmental, color: '#a855f7' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Benchmarking Comparison */}
              {(() => {
                const benchmark = getAutoBenchmark(currentResult.formData, currentResult.scores)
                const allBenchmarks = getAllBenchmarks()
                if (!benchmark) return null
                return (
                  <Card glow gradient>
                    <div className="flex items-center gap-3 mb-6">
                      <FiTrendingUp className="w-6 h-6 text-eco-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Sustainability Benchmarking
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Your event compared to {benchmark.benchmarkIcon} <strong className="text-gray-900 dark:text-white">{benchmark.benchmark}</strong> standards
                    </p>

                    <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl"
                      style={{
                        backgroundColor: `${benchmark.overallStatus.color}12`,
                        borderColor: `${benchmark.overallStatus.color}30`,
                      }}
                    >
                      <span className="text-3xl">{benchmark.overallStatus.icon}</span>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Overall Performance</div>
                        <div className="text-xl font-bold" style={{ color: benchmark.overallStatus.color }}>
                          {benchmark.overallStatus.text}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {benchmark.avgDifference > 0
                            ? `${benchmark.avgDifference} points above benchmark`
                            : `${Math.abs(benchmark.avgDifference)} points below benchmark`}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {['carbon', 'water', 'waste', 'energy', 'environmental', 'overall'].map((dim) => {
                        const d = benchmark.dimensions[dim]
                        if (!d) return null
                        return (
                          <div key={dim} className="text-center p-3 rounded-xl"
                            style={{
                              backgroundColor: `${d.status === 'above' ? '#22c55e' : d.status === 'average' ? '#eab308' : '#ef4444'}10`,
                              borderColor: `${d.status === 'above' ? '#22c55e' : d.status === 'average' ? '#eab308' : '#ef4444'}25`,
                            }}
                          >
                            <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                              {dim.charAt(0).toUpperCase() + dim.slice(1)}
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{d.event}</span>
                              <span className="text-[10px] text-gray-400">/ {d.benchmark}</span>
                            </div>
                            <div className="text-[10px] font-semibold mt-1"
                              style={{
                                color: d.status === 'above' ? '#22c55e' : d.status === 'average' ? '#eab308' : '#ef4444'
                              }}
                            >
                              {d.label}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <details className="mt-4 group">
                      <summary className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">
                        Compare with other benchmarks
                      </summary>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {allBenchmarks.filter(b => b.id !== currentResult.formData.category).map((b) => {
                          // Show the benchmark card with their avg score
                          return (
                            <div key={b.id} className="p-3 rounded-xl bg-eco-500/5 border border-eco-500/10 text-center">
                              <span className="text-lg">{b.icon}</span>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{b.label}</div>
                              <div className="text-lg font-bold text-eco-500">{b.scores.overall}</div>
                              <div className="text-[10px] text-gray-400">avg. score</div>
                            </div>
                          )
                        })}
                      </div>
                    </details>
                  </Card>
                )
              })()}

              {/* Certification & Impact */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏅 Certification</h3>
                  <CertificationBadge certification={currentResult.certification} size="lg" />
                  <div className="mt-4 p-4 rounded-xl bg-gray-100/50 dark:bg-white/[0.03]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verification Code</div>
                    <code className="text-sm font-mono font-bold text-eco-600 dark:text-eco-400">
                      {currentResult.certification.verificationCode}
                    </code>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌍 Environmental Impact</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Carbon Emissions', value: currentResult.impact.carbonEmissions, unit: 'kg CO₂e', icon: '💨' },
                      { label: 'Paper Consumption', value: currentResult.impact.paperConsumption, unit: 'kg', icon: '📄' },
                      { label: 'Plastic Consumption', value: currentResult.impact.plasticConsumption, unit: 'items', icon: '🧴' },
                      { label: 'Water Usage', value: currentResult.impact.waterUsage, unit: 'L', icon: '💧' },
                      { label: 'Energy Usage', value: currentResult.impact.energyUsage, unit: 'kWh', icon: '⚡' },
                      { label: 'Waste Generated', value: currentResult.impact.wasteGenerated, unit: 'kg', icon: '🗑️' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                  {currentResult.impact.reduction > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-eco-500/10 border border-eco-500/20 text-center">
                      <span className="text-sm font-medium text-eco-600 dark:text-eco-400">
                        🌿 Initiatives reduced impact by {currentResult.impact.reduction}%
                      </span>
                    </div>
                  )}
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">💡 AI Recommendations</h3>
                <div className="space-y-4">
                  {currentResult.recommendations.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Great job! No significant improvements needed. Your event is already highly sustainable!
                    </p>
                  ) : (
                    currentResult.recommendations.map((rec, i) => (
                      <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                    ))
                  )}
                </div>
              </Card>

              {/* Simulator Section - Merged into Analyzer */}
              {simMode && currentResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">🔧 Modify Parameters</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {simFields.map((field) => (
                          <div key={field.key} className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{field.label}</label>
                            <select
                              value={simChanges[field.key] || currentResult.formData[field.key] || ''}
                              onChange={(e) => handleSimChange(field.key, e.target.value)}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-eco-500/50"
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
                        <Button onClick={runSimulation} size="md" className="flex-1">
                          <FiCheck className="w-4 h-4" /> Simulate
                        </Button>
                        <Button variant="ghost" size="md" onClick={resetSim}>
                          <FiRotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    {simResult && (
                      <div className="space-y-4">
                        <Card>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Current</div>
                              <div className="text-2xl font-bold text-red-500">{currentResult.scores.overall}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-eco-500/5 border border-eco-500/10">
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Improved</div>
                              <div className="text-2xl font-bold text-eco-500">{simResult.scores.overall}</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="inline-flex items-center gap-1 text-lg font-bold text-eco-500">
                              +{simResult.scores.overall - currentResult.scores.overall} points improvement
                            </span>
                          </div>
                        </Card>

                        <Card>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Before vs After</h3>
                          <AreaChart data={areaData} />
                        </Card>

                        <Card>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Impact Comparison</h3>
                          <div className="space-y-2">
                            {[
                              { label: 'Carbon', before: currentResult.impact.carbonEmissions, after: simResult.impact.carbonEmissions, unit: 'kg' },
                              { label: 'Paper', before: currentResult.impact.paperConsumption, after: simResult.impact.paperConsumption, unit: 'kg' },
                              { label: 'Plastic', before: currentResult.impact.plasticConsumption, after: simResult.impact.plasticConsumption, unit: 'items' },
                              { label: 'Water', before: currentResult.impact.waterUsage, after: simResult.impact.waterUsage, unit: 'L' },
                              { label: 'Energy', before: currentResult.impact.energyUsage, after: simResult.impact.energyUsage, unit: 'kWh' },
                            ].map((item) => {
                              const diff = item.before > 0 ? ((item.before - item.after) / item.before * 100).toFixed(0) : 0
                              return (
                                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0">
                                  <span className="text-xs text-gray-500">{item.label}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-400 line-through">{item.before}</span>
                                    <span className="text-xs font-semibold text-eco-500">{item.after} {item.unit}</span>
                                    {diff > 0 && <span className="text-[10px] font-medium text-eco-500">-{diff}%</span>}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Year-over-Year Comparison */}
              {similarAnalyses.length > 0 && (
                <Card glow gradient>
                  <div className="flex items-center gap-3 mb-4">
                    <FiClock className="w-5 h-5 text-eco-500" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">📊 Year-over-Year Comparison</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This event name matches <strong>{similarAnalyses.length}</strong> past analysis{similarAnalyses.length > 1 ? 'es' : ''}. See how scores have changed:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {similarAnalyses.slice(0, 4).map((prev) => {
                      const scoreDiff = currentResult.scores.overall - (prev.scores?.overall || 0)
                      const date = new Date(prev.date).toLocaleDateString()
                      return (
                        <div key={prev.id} className="p-4 rounded-xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">{prev.formData?.eventName || 'Past event'}</span>
                            <span className="text-[10px] text-gray-400">{date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{prev.scores?.overall || 'N/A'}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-lg font-bold text-eco-500">{currentResult.scores.overall}</span>
                            {scoreDiff !== 0 && (
                              <span className={`text-sm font-semibold ${scoreDiff > 0 ? 'text-eco-500' : 'text-red-400'}`}>
                                {scoreDiff > 0 ? '↑' : '↓'} {Math.abs(scoreDiff)} pts
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
                  <FiBarChart2 className="w-5 h-5" /> View Dashboard
                </Button>
                <Button variant="secondary" size="lg" onClick={handleDownloadPDF}>
                  <FiDownload className="w-5 h-5" /> Download PDF
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/advisor')}>
                  <FiArrowRight className="w-5 h-5" /> AI Advisor
                </Button>
                <Button
                  variant={savedAsTemplate ? 'primary' : 'ghost'}
                  size="lg"
                  onClick={handleSaveTemplate}
                >
                  <FiStar className={`w-5 h-5 ${savedAsTemplate ? 'fill-current' : ''}`} />
                  {savedAsTemplate ? 'Saved as Template!' : 'Save as Template'}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => window.location.reload()}>
                  <FiRefreshCcw className="w-4 h-4" /> Analyze Another
                </Button>
              </div>

              {/* Unlocked Badges */}
              {currentResult.unlocked.length > 0 && (
                <Card gradient glow>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎉 New Badges Unlocked!</h3>
                  <div className="flex gap-4 flex-wrap">
                    {currentResult.unlocked.map((badge) => (
                      <div key={badge.id} className="text-center p-4 rounded-xl bg-eco-500/10 border border-eco-500/20">
                        <div className="text-3xl mb-1">{badge.icon}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
