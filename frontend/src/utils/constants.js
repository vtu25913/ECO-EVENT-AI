export const SCORE_LEVELS = {
  platinum: { min: 90, max: 100, label: 'Platinum Sustainable Event', color: '#22c55e', bg: 'from-yellow-300 to-amber-400' },
  gold: { min: 75, max: 89, label: 'Gold Sustainable Event', color: '#eab308', bg: 'from-yellow-400 to-amber-500' },
  silver: { min: 60, max: 74, label: 'Silver Sustainable Event', color: '#94a3b8', bg: 'from-slate-300 to-slate-400' },
  bronze: { min: 40, max: 59, label: 'Bronze Sustainable Event', color: '#cd7f32', bg: 'from-orange-300 to-orange-400' },
  unsustainable: { min: 0, max: 39, label: 'Unsustainable Event', color: '#ef4444', bg: 'from-red-400 to-red-500' },
}

export const IMPACT_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
}

export const ORB_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
}

export const CERTIFICATION_LEVELS = ['bronze', 'silver', 'gold', 'platinum']

export const STORAGE_KEYS = {
  analyses: 'eco-event-analyses',
  badges: 'eco-event-badges',
  theme: 'eco-event-theme',
  preferences: 'eco-event-preferences',
}
