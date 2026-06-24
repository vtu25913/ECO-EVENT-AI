import { getScoreLevel } from './sustainabilityEngine.js'

export function getCertification(scores) {
  const level = getScoreLevel(scores.overall)
  return {
    level: level.label.split(' ')[0].toLowerCase(),
    levelName: level.label,
    score: scores.overall,
    color: level.color,
    badgeBg: level.bg,
    date: new Date().toISOString().split('T')[0],
    verificationCode: generateVerificationCode(),
  }
}

function generateVerificationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'ECO-'
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-'
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
