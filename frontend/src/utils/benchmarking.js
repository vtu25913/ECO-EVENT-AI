// Benchmark data for different event categories
// These represent average sustainability scores per category
const benchmarks = {
  'college-fest': {
    label: 'College Fest',
    icon: '🎓',
    scores: { carbon: 45, water: 50, waste: 40, energy: 55, environmental: 48, overall: 48 },
    impact: { carbonEmissions: 250, paperConsumption: 15, plasticConsumption: 80, waterUsage: 400, energyUsage: 180, wasteGenerated: 25 },
  },
  'ngo-event': {
    label: 'NGO Event',
    icon: '🤝',
    scores: { carbon: 65, water: 60, waste: 58, energy: 62, environmental: 63, overall: 62 },
    impact: { carbonEmissions: 120, paperConsumption: 5, plasticConsumption: 30, waterUsage: 200, energyUsage: 100, wasteGenerated: 10 },
  },
  conference: {
    label: 'Conference',
    icon: '🎤',
    scores: { carbon: 55, water: 52, waste: 48, energy: 50, environmental: 50, overall: 51 },
    impact: { carbonEmissions: 350, paperConsumption: 25, plasticConsumption: 100, waterUsage: 500, energyUsage: 250, wasteGenerated: 30 },
  },
  workshop: {
    label: 'Workshop',
    icon: '🔧',
    scores: { carbon: 70, water: 68, waste: 65, energy: 72, environmental: 68, overall: 69 },
    impact: { carbonEmissions: 80, paperConsumption: 3, plasticConsumption: 20, waterUsage: 150, energyUsage: 70, wasteGenerated: 8 },
  },
}

/**
 * Get benchmark data for a specific event category
 */
export function getBenchmarkForCategory(category) {
  return benchmarks[category] || null
}

/**
 * Get all available benchmark categories
 */
export function getAllBenchmarks() {
  return Object.entries(benchmarks).map(([key, value]) => ({
    id: key,
    ...value,
  }))
}

/**
 * Compare an event's scores against a benchmark and return detailed comparison
 */
export function compareWithBenchmark(eventScores, category) {
  const benchmark = benchmarks[category]
  if (!benchmark) return null

  const comparison = {}
  let totalDiff = 0
  let count = 0

  const dimensions = ['carbon', 'water', 'waste', 'energy', 'environmental', 'overall']
  dimensions.forEach((dim) => {
    const eventVal = eventScores[dim] || 0
    const benchVal = benchmark.scores[dim] || 0
    const diff = eventVal - benchVal
    comparison[dim] = {
      event: eventVal,
      benchmark: benchVal,
      difference: diff,
      status: diff > 10 ? 'above' : diff >= -5 ? 'average' : 'below',
      label: diff > 10 ? 'Above Average' : diff >= -5 ? 'Average' : 'Below Average',
    }
    totalDiff += diff
    count++
  })

  const avgDiff = count > 0 ? totalDiff / count : 0
  let overallStatus
  if (avgDiff > 8) overallStatus = 'above'
  else if (avgDiff >= -5) overallStatus = 'average'
  else overallStatus = 'below'

  const labels = {
    above: { text: 'Above Average', color: '#22c55e', icon: '📈' },
    average: { text: 'Average', color: '#eab308', icon: '📊' },
    below: { text: 'Below Average', color: '#ef4444', icon: '📉' },
  }

  return {
    benchmark: benchmark.label,
    benchmarkIcon: benchmark.icon,
    overallStatus: labels[overallStatus],
    avgDifference: Math.round(avgDiff * 10) / 10,
    dimensions: comparison,
  }
}

/**
 * Compare an event against the best-matched category based on its category field
 */
export function getAutoBenchmark(eventFormData, eventScores) {
  const category = eventFormData.category
  if (category && benchmarks[category]) {
    return compareWithBenchmark(eventScores, category)
  }
  // If no matching category, compare against the closest benchmark
  const bestMatch = findClosestCategory(eventScores)
  return bestMatch ? compareWithBenchmark(eventScores, bestMatch.id) : null
}

/**
 * Find which benchmark category the event scores are closest to
 */
function findClosestCategory(scores) {
  let closest = null
  let smallestDiff = Infinity

  Object.entries(benchmarks).forEach(([id, data]) => {
    let totalDiff = 0
    const dims = ['carbon', 'water', 'waste', 'energy', 'environmental', 'overall']
    dims.forEach((dim) => {
      totalDiff += Math.abs((scores[dim] || 0) - (data.scores[dim] || 0))
    })
    if (totalDiff < smallestDiff) {
      smallestDiff = totalDiff
      closest = { id, ...data }
    }
  })

  return closest
}
