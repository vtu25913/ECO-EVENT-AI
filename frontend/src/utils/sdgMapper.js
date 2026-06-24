import { sdgs } from '../data/sdgs.js'

const initiativeSDGMap = {
  'tree-plantation': 15,
  'plastic-free': 12,
  'solar-power': 7,
  'digital-invitations': 12,
  'carbon-offset': 13,
  'waste-recycling': 12,
  'community-awareness': 11,
  'reusable-decorations': 12,
}

const formFieldSDGMap = {
  water: [6],
  registration: [12],
  certificates: [12],
  marketing: [12],
  transport: [11, 13],
  food: [12],
  energy: [7, 13],
  wasteSegregation: [12],
}

export function mapSDGImpact(formData, scores) {
  const contributions = {}
  sdgs.forEach((sdg) => {
    contributions[sdg.id] = 0
  })

  const initiatives = formData.initiatives || []
  initiatives.forEach((init) => {
    const sdgId = initiativeSDGMap[init]
    if (sdgId) contributions[sdgId] += 20
  })

  Object.entries(formFieldSDGMap).forEach(([field, sdgIds]) => {
    const value = formData[field]
    if (value) {
      const impactScore = value === 'low' || value === 'digital' || value === 'refill-stations' || value === 'reusable-bottles' || value === 'biodegradable' || value === 'reusable' || value === 'carpool' || value === 'social-media' || value === 'available'
        ? 15
        : value === 'medium' || value === 'hybrid' || value === 'public'
        ? 10
        : 5
      sdgIds.forEach((id) => {
        contributions[id] += impactScore
      })
    }
  })

  const maxPossible = Object.keys(contributions).length * 35
  Object.keys(contributions).forEach((key) => {
    contributions[key] = Math.min(Math.round((contributions[key] / 35) * 100), 100)
  })

  const totalContribution = Object.values(contributions).reduce((a, b) => a + b, 0)
  const avgContribution = Math.round(totalContribution / Object.keys(contributions).length)

  return {
    contributions,
    averageImpact: avgContribution,
    topSDGs: Object.entries(contributions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id, val]) => ({
        sdg: sdgs.find((s) => s.id === parseInt(id)),
        contribution: val,
      })),
  }
}
