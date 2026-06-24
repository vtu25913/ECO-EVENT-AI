import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import CertificationBadge from '../components/sustainability/CertificationBadge.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useSidebar } from '../context/SidebarContext.jsx'
import { getScoreLevel } from '../utils/sustainabilityEngine.js'
import { FiDownload, FiTrash2, FiEye, FiPrinter, FiShare2, FiSearch, FiX, FiCheck, FiTrendingUp, FiAward, FiBarChart2, FiUsers, FiTool } from 'react-icons/fi'

const scoreColors = {
  carbon: '#22c55e',
  water: '#06b6d4',
  waste: '#eab308',
  energy: '#f97316',
  environmental: '#a855f7',
}

export default function Reports() {
  const { analyses, deleteAnalysis } = useApp()
  const [viewing, setViewing] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])

  // Deduplicate by event name and show only unique events (max 12)
  const uniqueAnalyses = useMemo(() => {
    const seen = new Set()
    return analyses.filter(a => {
      const name = (a.formData.eventName || '').toLowerCase().trim()
      if (!name || seen.has(name)) return false
      seen.add(name)
      return true
    }).slice(0, 12)
  }, [analyses])

  const filteredAnalyses = useMemo(() => {
    let list = uniqueAnalyses
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(a =>
        (a.formData.eventName || '').toLowerCase().includes(q) ||
        (a.formData.organization || '').toLowerCase().includes(q) ||
        (a.formData.location || '').toLowerCase().includes(q) ||
        (a.formData.category || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [uniqueAnalyses, searchQuery])

  const handleDownloadPDF = async (analysis) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFillColor(5, 46, 22)
    doc.rect(0, 0, pageWidth, 60, 'F')
    doc.setTextColor(34, 197, 94)
    doc.setFontSize(24)
    doc.text('EcoEvent AI', pageWidth / 2, 30, { align: 'center' })
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text('Comprehensive Sustainability Report', pageWidth / 2, 45, { align: 'center' })

    let y = 80
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('1. Event Summary', 20, y)
    y += 12

    doc.setFontSize(11)
    const fields = [
      ['Event Name', analysis.formData.eventName],
      ['Organization', analysis.formData.organization],
      ['Location', analysis.formData.location],
      ['Date', new Date(analysis.date).toLocaleDateString()],
      ['Category', analysis.formData.category],
      ['Participants', analysis.formData.participants],
      ['Duration', `${analysis.formData.duration} days`],
    ]
    fields.forEach(([label, value]) => {
      doc.text(`${label}: ${value || 'N/A'}`, 25, y)
      y += 8
    })

    if (y > 200) { doc.addPage(); y = 30 }
    y += 10
    doc.setFontSize(16)
    doc.text('2. Sustainability Assessment', 20, y)
    y += 12

    doc.setFontSize(11)
    const scoresList = [
      ['Overall Score', `${analysis.scores.overall}/100`],
      ['Carbon Score', `${analysis.scores.carbon}/100`],
      ['Water Score', `${analysis.scores.water}/100`],
      ['Waste Score', `${analysis.scores.waste}/100`],
      ['Energy Score', `${analysis.scores.energy}/100`],
      ['Environmental Impact', `${analysis.scores.environmental}/100`],
    ]
    scoresList.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 25, y)
      y += 8
    })

    if (y > 200) { doc.addPage(); y = 30 }
    y += 10
    doc.setFontSize(16)
    doc.text('3. Environmental Impact', 20, y)
    y += 12

    doc.setFontSize(11)
    const impacts = [
      ['Carbon Emissions', `${analysis.impact.carbonEmissions} kg CO₂e`],
      ['Paper Consumption', `${analysis.impact.paperConsumption} kg`],
      ['Plastic Consumption', `${analysis.impact.plasticConsumption} items`],
      ['Water Usage', `${analysis.impact.waterUsage} L`],
      ['Energy Usage', `${analysis.impact.energyUsage} kWh`],
      ['Waste Generated', `${analysis.impact.wasteGenerated} kg`],
    ]
    impacts.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 25, y)
      y += 8
    })

    if (y > 220) { doc.addPage(); y = 30 }
    y += 10
    doc.setFontSize(16)
    doc.text('4. Recommendations', 20, y)
    y += 12

    doc.setFontSize(11)
    if (analysis.recommendations.length === 0) {
      doc.text('No improvements needed.', 25, y)
    } else {
      analysis.recommendations.slice(0, 6).forEach((rec, i) => {
        doc.text(`${i + 1}. ${rec.title}`, 25, y)
        y += 7
        doc.setFontSize(10)
        doc.text(`   Impact: ${rec.impact}% | Difficulty: ${rec.difficulty}`, 30, y)
        y += 7
        doc.setFontSize(11)
        if (y > 270) { doc.addPage(); y = 30 }
      })
    }

    y = Math.max(y + 10, 270)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Report generated on ${new Date().toLocaleDateString()} by EcoEvent AI`, 20, y)
    doc.text(`Verification: ${analysis.certification.verificationCode}`, 20, y + 6)

    doc.save(`EcoEvent-Report-${analysis.formData.eventName || 'event'}.pdf`)
  }

  const handleShare = async (analysis) => {
    if (navigator.share) {
      navigator.share({
        title: `EcoEvent AI - ${analysis.formData.eventName}`,
        text: `Check out the sustainability report for ${analysis.formData.eventName}: Score ${analysis.scores.overall}/100 - ${analysis.certification.levelName}`,
        url: window.location.origin,
      })
    }
  }

  const toggleCompare = (analysis) => {
    setSelectedForCompare(prev => {
      if (prev.find(a => a.id === analysis.id)) {
        return prev.filter(a => a.id !== analysis.id)
      }
      if (prev.length >= 2) return prev
      return [...prev, analysis]
    })
  }

  const clearCompare = () => {
    setCompareMode(false)
    setSelectedForCompare([])
  }

  const { sidebarCollapsed } = useSidebar()
  const sidebarOffset = sidebarCollapsed ? '0px' : '256px'
  const level = viewing ? getScoreLevel(viewing.scores.overall) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Sustainability{' '}
            <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
              Reports
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate, compare, and download detailed sustainability reports for your events.
          </p>
        </div>

        {/* Search + Compare Toggle */}
        {analyses.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by event name, organization, location, or category..."
                  className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Button
                variant={compareMode ? 'primary' : 'ghost'}
                size="md"
                onClick={() => { setCompareMode(!compareMode); if (compareMode) setSelectedForCompare([]) }}
                className="shrink-0 ml-auto"
              >
                <FiUsers className="w-4 h-4" />
                {compareMode ? 'Done' : 'Compare'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {filteredAnalyses.length} of {uniqueAnalyses.length} unique events shown
              </p>
              {compareMode && (
                <p className="text-xs text-gray-500">
                  {selectedForCompare.length === 0
                    ? 'Select 2 events to compare'
                    : selectedForCompare.length === 1
                    ? 'Select one more event'
                    : `${selectedForCompare.length} selected`}
                </p>
              )}
            </div>

            {/* Compare Action Bar */}
            <AnimatePresence>
              {compareMode && selectedForCompare.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-center"
                >
                  <motion.div
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-eco-500/10 to-emerald-500/10 border border-eco-500/20 backdrop-blur-sm"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <FiTool className="w-5 h-5 text-eco-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comparing: <strong className="text-eco-600 dark:text-eco-400">{selectedForCompare[0].formData.eventName}</strong>
                      {' '}vs{' '}
                      <strong className="text-eco-600 dark:text-eco-400">{selectedForCompare[1].formData.eventName}</strong>
                    </span>
                    <button
                      onClick={clearCompare}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/10 transition-all"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {analyses.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reports Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Analyze an event to generate sustainability reports.</p>
            <Button to="/analyze">Analyze Your Event</Button>
          </Card>
        ) : filteredAnalyses.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Results Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No reports match your search "{searchQuery}".</p>
            <Button variant="ghost" onClick={() => setSearchQuery('')}>Clear Search</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis, i) => {
              const isSelected = selectedForCompare.find(a => a.id === analysis.id)
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className={`flex items-center justify-between ${
                      isSelected ? 'ring-2 ring-eco-500/50 border-eco-500/30' : ''
                    } ${compareMode && !isSelected && selectedForCompare.length >= 2 ? 'opacity-50' : ''}`}
                    hover={!compareMode}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {compareMode && (
                        <button
                          onClick={() => toggleCompare(analysis)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-eco-500 border-eco-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-eco-500/50'
                          }`}
                        >
                          {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                        style={{ backgroundColor: getScoreLevel(analysis.scores.overall).color }}
                      >
                        {analysis.scores.overall}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {analysis.formData.eventName || 'Untitled Event'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {analysis.formData.organization} · {analysis.formData.category} · {new Date(analysis.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(analysis)}>
                        <FiEye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(analysis)}>
                        <FiDownload className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(analysis)}>
                        <FiShare2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { if (confirm('Delete this report?')) deleteAnalysis(analysis.id) }}
                      >
                        <FiTrash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* View Modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Report Details" size="lg">
        {viewing && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Event Details</h4>
                <div className="space-y-2 text-sm">
                  {[
                    ['Event', viewing.formData.eventName],
                    ['Organization', viewing.formData.organization],
                    ['Location', viewing.formData.location],
                    ['Date', new Date(viewing.date).toLocaleDateString()],
                    ['Category', viewing.formData.category],
                    ['Participants', viewing.formData.participants],
                    ['Duration', `${viewing.formData.duration} days`],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-gray-500">{l}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{v || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <CertificationBadge certification={viewing.certification} size="lg" />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Scores</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Overall', viewing.scores.overall, level?.color],
                  ['Carbon', viewing.scores.carbon, '#22c55e'],
                  ['Water', viewing.scores.water, '#06b6d4'],
                  ['Waste', viewing.scores.waste, '#eab308'],
                  ['Energy', viewing.scores.energy, '#f97316'],
                  ['Environment', viewing.scores.environmental, '#a855f7'],
                ].map(([l, v, c]) => (
                  <div key={l} className="text-center p-3 rounded-xl bg-gray-100 dark:bg-white/[0.03]">
                    <div className="text-lg font-bold" style={{ color: c }}>{v}</div>
                    <div className="text-xs text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {viewing.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {viewing.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl bg-eco-500/5 border border-eco-500/10">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</div>
                      <div className="text-xs text-gray-500">Impact: {rec.impact}% · Difficulty: {rec.difficulty}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => handleDownloadPDF(viewing)}>
                <FiDownload className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                <FiPrinter className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Comparison Modal */}
      <Modal isOpen={selectedForCompare.length === 2} onClose={clearCompare} title="Event Comparison" size="xl" containerStyle={{
          paddingLeft: window.innerWidth >= 1024 ? sidebarOffset : '0px',
          transition: 'padding-left 300ms ease',
        }}>
        {selectedForCompare.length === 2 && (() => {
          const [a, b] = selectedForCompare
          const scoresA = a.scores
          const scoresB = b.scores
          const winner = scoresA.overall > scoresB.overall ? a : scoresB.overall > scoresA.overall ? b : null
          const diff = scoresA.overall - scoresB.overall

          return (
            <div className="space-y-8">
              {/* Header - Winner Announcement */}
              {winner && (
                <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-eco-500/10 to-emerald-500/10 border border-eco-500/20">
                  <FiAward className="w-10 h-10 text-eco-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {winner.formData.eventName} leads by {Math.abs(diff)} points!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {diff > 0
                      ? `${a.formData.eventName} scores higher overall`
                      : `${b.formData.eventName} scores higher overall`}
                  </p>
                </div>
              )}

              {/* Event Info Side by Side */}
              <div className="grid lg:grid-cols-2 gap-6">
                {[a, b].map((event, i) => (
                  <Card key={event.id} className="text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      i === 0 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}>
                      {i === 0 ? 'Event A' : 'Event B'}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{event.formData.eventName}</h3>
                    <p className="text-sm text-gray-500">{event.formData.organization}</p>
                    <p className="text-xs text-gray-400 mt-1">{event.formData.location} · {event.formData.category}</p>
                    <p className="text-xs text-gray-400">
                      {event.formData.participants} participants · {event.formData.duration} days
                    </p>
                    <div className="mt-3">
                      <CertificationBadge certification={event.certification} size="sm" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Scores Comparison */}
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <FiBarChart2 className="w-5 h-5 text-eco-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Score Comparison</h3>
                </div>

                {/* Overall Score Highlight */}
                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${getScoreLevel(scoresA.overall).color}10` }}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{a.formData.eventName}</div>
                    <div className="text-3xl font-bold" style={{ color: getScoreLevel(scoresA.overall).color }}>
                      {scoresA.overall}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{getScoreLevel(scoresA.overall).label}</div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${getScoreLevel(scoresB.overall).color}10` }}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{b.formData.eventName}</div>
                    <div className="text-3xl font-bold" style={{ color: getScoreLevel(scoresB.overall).color }}>
                      {scoresB.overall}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{getScoreLevel(scoresB.overall).label}</div>
                  </div>
                </div>

                {/* Dimension Bars */}
                <div className="space-y-4">
                  {[
                    { key: 'carbon', label: 'Carbon', color: scoreColors.carbon },
                    { key: 'water', label: 'Water', color: scoreColors.water },
                    { key: 'waste', label: 'Waste', color: scoreColors.waste },
                    { key: 'energy', label: 'Energy', color: scoreColors.energy },
                    { key: 'environmental', label: 'Environmental', color: scoreColors.environmental },
                  ].map((dim) => {
                    const valA = scoresA[dim.key]
                    const valB = scoresB[dim.key]
                    const dimWinner = valA > valB ? 'A' : valB > valA ? 'B' : null
                    return (
                      <div key={dim.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dim.label}</span>
                            {dimWinner && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                style={{
                                  backgroundColor: `${dim.color}20`,
                                  color: dim.color,
                                }}
                              >
                                +{Math.abs(valA - valB)}pts
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="font-semibold text-gray-900 dark:text-white w-8 text-right">{valA}</span>
                            <span className="w-8 text-center text-gray-400">vs</span>
                            <span className="font-semibold text-gray-900 dark:text-white w-8">{valB}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-2.5 rounded-full bg-gray-200/50 dark:bg-white/[0.05] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(valA / 100) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: dim.color, opacity: dimWinner === 'A' ? 1 : 0.5 }}
                            />
                          </div>
                          <div className="h-2.5 rounded-full bg-gray-200/50 dark:bg-white/[0.05] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(valB / 100) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: dim.color, opacity: dimWinner === 'B' ? 1 : 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Environmental Impact Comparison */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="w-5 h-5 text-eco-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Environmental Impact</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-gray-100 dark:border-white/5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <span>Metric</span>
                  <span className="text-right">{a.formData.eventName}</span>
                  <span className="text-right">{b.formData.eventName}</span>
                </div>
                {[
                  { label: 'Carbon Emissions', key: 'carbonEmissions', unit: 'kg', better: 'lower' },
                  { label: 'Paper Consumption', key: 'paperConsumption', unit: 'kg', better: 'lower' },
                  { label: 'Plastic Consumption', key: 'plasticConsumption', unit: 'items', better: 'lower' },
                  { label: 'Water Usage', key: 'waterUsage', unit: 'L', better: 'lower' },
                  { label: 'Energy Usage', key: 'energyUsage', unit: 'kWh', better: 'lower' },
                  { label: 'Waste Generated', key: 'wasteGenerated', unit: 'kg', better: 'lower' },
                  { label: 'Impact Reduction', key: 'reduction', unit: '%', better: 'higher' },
                ].map(({ label, key, unit, better }) => {
                  const v1 = a.impact[key] || 0
                  const v2 = b.impact[key] || 0
                  const diff = v2 - v1
                  const isBetter = better === 'lower' ? diff < 0 : diff > 0
                  const isTie = v1 === v2
                  return (
                    <div key={key} className="grid grid-cols-3 gap-4 py-2.5 border-b border-gray-100 dark:border-white/5 last:border-0">
                      <span className="text-sm text-gray-500">{label}</span>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${isBetter === false && !isTie ? 'text-red-400' : 'text-gray-900 dark:text-white'}`}>
                          {v1} {unit}
                        </span>
                        {!isTie && better === 'lower' && (
                          <span className={`ml-1 text-[10px] ${diff < 0 ? 'text-eco-500' : 'text-red-400'}`}>
                            {diff < 0 ? '↓' : '↑'}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${isBetter && !isTie ? 'text-eco-500' : 'text-gray-900 dark:text-white'}`}>
                          {v2} {unit}
                        </span>
                        {!isTie && better === 'lower' && (
                          <span className={`ml-1 text-[10px] ${diff > 0 ? 'text-red-400' : 'text-eco-500'}`}>
                            {diff > 0 ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {a.impact.reduction > 0 || b.impact.reduction > 0 ? (
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-eco-500/5 to-emerald-500/5 border border-eco-500/10 text-center">
                    <p className="text-xs text-gray-500">
                      <strong>{a.formData.eventName}</strong> reduced impact by <strong className="text-eco-500">{a.impact.reduction}%</strong>
                      {' · '}
                      <strong>{b.formData.eventName}</strong> reduced impact by <strong className="text-eco-500">{b.impact.reduction}%</strong>
                    </p>
                  </div>
                ) : null}
              </Card>

              {/* Initiates & SDG Comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">{a.formData.eventName}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sustainability Initiatives</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(a.formData.initiatives || []).length > 0
                          ? a.formData.initiatives.map(init => (
                              <span key={init} className="text-[10px] px-2 py-1 rounded-lg bg-eco-500/10 text-eco-600 dark:text-eco-400 border border-eco-500/20">
                                {init.replace(/-/g, ' ')}
                              </span>
                            ))
                          : <span className="text-xs text-gray-400">No initiatives</span>
                        }
                      </div>
                    </div>
                    {a.sdgImpact && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">SDG Impact</p>
                        <div className="text-sm font-semibold text-eco-500">{a.sdgImpact.averageImpact}% avg. contribution</div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendations</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.recommendations.length} suggestions</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">{b.formData.eventName}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sustainability Initiatives</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(b.formData.initiatives || []).length > 0
                          ? b.formData.initiatives.map(init => (
                              <span key={init} className="text-[10px] px-2 py-1 rounded-lg bg-eco-500/10 text-eco-600 dark:text-eco-400 border border-eco-500/20">
                                {init.replace(/-/g, ' ')}
                              </span>
                            ))
                          : <span className="text-xs text-gray-400">No initiatives</span>
                        }
                      </div>
                    </div>
                    {b.sdgImpact && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">SDG Impact</p>
                        <div className="text-sm font-semibold text-eco-500">{b.sdgImpact.averageImpact}% avg. contribution</div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendations</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{b.recommendations.length} suggestions</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button onClick={() => handleDownloadPDF(a)}>
                  <FiDownload className="w-4 h-4" /> Download {a.formData.eventName}
                </Button>
                <Button variant="secondary" onClick={() => handleDownloadPDF(b)}>
                  <FiDownload className="w-4 h-4" /> Download {b.formData.eventName}
                </Button>
                <Button variant="ghost" onClick={clearCompare}>
                  <FiX className="w-4 h-4" /> Close
                </Button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
