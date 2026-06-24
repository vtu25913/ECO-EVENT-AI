import { sustainabilityInitiatives } from '../data/eventCategories.js'
import { SCORE_LEVELS } from './constants.js'

function calcCategoryScore(value, impactMap) {
  const impact = impactMap[value]
  if (impact === 'low') return 90
  if (impact === 'medium') return 60
  if (impact === 'high') return 20
  if (impact === 'none') return 100
  return 50
}

const registrationImpact = { paper: 'high', digital: 'low' }
const certificateImpact = { printed: 'high', digital: 'low' }
const marketingImpact = { printed: 'high', 'social-media': 'low', hybrid: 'medium' }
const transportImpact = { private: 'high', public: 'medium', carpool: 'low', hybrid: 'medium' }
const waterImpact = { 'plastic-bottles': 'high', 'refill-stations': 'low', 'reusable-bottles': 'low' }
const foodImpact = { disposable: 'high', reusable: 'low', biodegradable: 'low', none: 'none' }
const energyImpact = { low: 'low', medium: 'medium', high: 'high' }
const wasteImpact = { available: 'low', 'not-available': 'high' }

export function calculateScores(formData) {
  const carbonScore = Math.round(
    calcCategoryScore(formData.transport, transportImpact) * 0.3 +
    calcCategoryScore(formData.energy, energyImpact) * 0.4 +
    (formData.initiatives?.length || 0) * 3
  )

  const waterScore = Math.round(
    calcCategoryScore(formData.water, waterImpact) * 0.6 +
    (formData.initiatives?.includes('tree-plantation') ? 20 : 0) +
    (formData.initiatives?.includes('plastic-free') ? 20 : 0)
  )

  const wasteScore = Math.round(
    calcCategoryScore(formData.registration, registrationImpact) * 0.15 +
    calcCategoryScore(formData.certificates, certificateImpact) * 0.15 +
    calcCategoryScore(formData.food, foodImpact) * 0.35 +
    calcCategoryScore(formData.wasteSegregation, wasteImpact) * 0.35
  )

  const energyScore = Math.round(
    calcCategoryScore(formData.energy, energyImpact) * 0.5 +
    (formData.initiatives?.includes('solar-power') ? 30 : 0) +
    (formData.initiatives?.includes('carbon-offset') ? 20 : 0)
  )

  const envImpactScore = Math.round(
    (waterScore + wasteScore + energyScore) / 3 +
    (formData.initiatives?.includes('tree-plantation') ? 10 : 0) +
    (formData.initiatives?.includes('waste-recycling') ? 10 : 0)
  )

  const initiativeBonus = Math.min((formData.initiatives?.length || 0) * 2.5, 15)
  const baseOverall = (carbonScore + waterScore + wasteScore + energyScore + envImpactScore) / 5
  const overall = Math.min(Math.round(baseOverall * 0.7 + initiativeBonus * 2), 100)

  return {
    carbon: Math.min(carbonScore, 100),
    water: Math.min(waterScore, 100),
    waste: Math.min(wasteScore, 100),
    energy: Math.min(energyScore, 100),
    environmental: Math.min(envImpactScore, 100),
    overall,
    initiativeBonus,
  }
}

export function getScoreLevel(score) {
  if (score >= 90) return SCORE_LEVELS.platinum
  if (score >= 75) return SCORE_LEVELS.gold
  if (score >= 60) return SCORE_LEVELS.silver
  if (score >= 40) return SCORE_LEVELS.bronze
  return SCORE_LEVELS.unsustainable
}

export function getOrbColor(score) {
  if (score >= 75) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}
