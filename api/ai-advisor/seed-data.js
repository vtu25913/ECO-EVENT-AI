/**
 * POST /api/ai-advisor/seed-data
 *
 * Seeds 12 sample events for the authenticated user.
 * Uses Supabase REST API with the user's JWT for RLS.
 */
const SUPABASE_URL = process.env.SUPABASE_URL
const ANON_KEY = process.env.SUPABASE_ANON_KEY

const sampleEvents = [
  { eventName: 'GreenTech Conference 2026', organization: 'GreenTech Innovations', location: 'Bangalore, India', category: 'conference', participants: 500, duration: 2, transport: 'public', water: 'refill-stations', food: 'biodegradable', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['solar-power', 'carbon-offset', 'tree-plantation', 'digital-invitations', 'waste-recycling'] },
  { eventName: 'University Climate Summit', organization: 'IIT Delhi', location: 'Delhi, India', category: 'college-fest', participants: 1200, duration: 3, transport: 'public', water: 'refill-stations', food: 'reusable', energy: 'medium', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['plastic-free', 'digital-invitations', 'waste-recycling', 'community-awareness'] },
  { eventName: 'Eco-Fest 2026', organization: 'Green Earth NGO', location: 'Mumbai, India', category: 'ngo-event', participants: 800, duration: 2, transport: 'carpool', water: 'reusable-bottles', food: 'biodegradable', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'hybrid', wasteSegregation: 'available', initiatives: ['tree-plantation', 'plastic-free', 'solar-power', 'carbon-offset', 'waste-recycling', 'reusable-decorations'] },
  { eventName: 'Corporate Sustainability Workshop', organization: 'Infosys Ltd', location: 'Pune, India', category: 'workshop', participants: 150, duration: 1, transport: 'carpool', water: 'reusable-bottles', food: 'reusable', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['solar-power', 'digital-invitations', 'waste-recycling'] },
  { eventName: 'National Tech Expo', organization: 'Tech Mahindra', location: 'Hyderabad, India', category: 'conference', participants: 2000, duration: 3, transport: 'private', water: 'plastic-bottles', food: 'disposable', energy: 'high', registration: 'paper', certificates: 'printed', marketing: 'printed', wasteSegregation: 'not-available', initiatives: [] },
  { eventName: 'Rural Education Camp', organization: 'Pratham Foundation', location: 'Rajasthan, India', category: 'ngo-event', participants: 200, duration: 5, transport: 'carpool', water: 'refill-stations', food: 'biodegradable', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['tree-plantation', 'community-awareness', 'plastic-free'] },
  { eventName: 'Startup Pitch Fest', organization: 'YC Alumni India', location: 'Gurugram, India', category: 'seminar', participants: 300, duration: 1, transport: 'hybrid', water: 'plastic-bottles', food: 'disposable', energy: 'medium', registration: 'digital', certificates: 'digital', marketing: 'hybrid', wasteSegregation: 'available', initiatives: ['digital-invitations'] },
  { eventName: 'Community Clean-Up Drive', organization: 'Local Municipality', location: 'Chennai, India', category: 'community-gathering', participants: 600, duration: 1, transport: 'carpool', water: 'reusable-bottles', food: 'none', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['tree-plantation', 'waste-recycling', 'community-awareness', 'plastic-free'] },
  { eventName: 'AI & ML Hackathon', organization: 'Google Developer Groups', location: 'Bengaluru, India', category: 'hackathon', participants: 400, duration: 2, transport: 'public', water: 'refill-stations', food: 'biodegradable', energy: 'medium', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['solar-power', 'carbon-offset', 'digital-invitations', 'waste-recycling'] },
  { eventName: 'Traditional Arts & Culture Fest', organization: 'Ministry of Culture', location: 'Jaipur, India', category: 'cultural-event', participants: 1500, duration: 4, transport: 'private', water: 'plastic-bottles', food: 'disposable', energy: 'high', registration: 'paper', certificates: 'printed', marketing: 'printed', wasteSegregation: 'not-available', initiatives: [] },
  { eventName: 'Renewable Energy Summit', organization: 'IRENA Partners', location: 'Gandhinagar, India', category: 'conference', participants: 350, duration: 2, transport: 'carpool', water: 'refill-stations', food: 'biodegradable', energy: 'low', registration: 'digital', certificates: 'digital', marketing: 'hybrid', wasteSegregation: 'available', initiatives: ['solar-power', 'carbon-offset', 'tree-plantation', 'plastic-free', 'waste-recycling', 'reusable-decorations'] },
  { eventName: 'Medical Camp for Rural Health', organization: 'AIIMS Outreach', location: 'Bihar, India', category: 'ngo-event', participants: 800, duration: 3, transport: 'public', water: 'reusable-bottles', food: 'biodegradable', energy: 'medium', registration: 'digital', certificates: 'digital', marketing: 'social-media', wasteSegregation: 'available', initiatives: ['tree-plantation', 'community-awareness', 'waste-recycling'] },
]

const registrationImpact = { paper: 'high', digital: 'low' }
const certificateImpact = { printed: 'high', digital: 'low' }
const transportImpact = { private: 'high', public: 'medium', carpool: 'low', hybrid: 'medium' }
const waterImpact = { 'plastic-bottles': 'high', 'refill-stations': 'low', 'reusable-bottles': 'low' }
const foodImpact = { disposable: 'high', reusable: 'low', biodegradable: 'low', none: 'none' }
const energyImpact = { low: 'low', medium: 'medium', high: 'high' }
const wasteImpact = { available: 'low', 'not-available': 'high' }

function calcScore(value, map) { const i = map[value]; if (i === 'low') return 90; if (i === 'medium') return 60; if (i === 'high') return 20; if (i === 'none') return 100; return 50 }

function computeScores(fd) {
  const cs = Math.round(calcScore(fd.transport, transportImpact) * 0.3 + calcScore(fd.energy, energyImpact) * 0.4 + (fd.initiatives?.length || 0) * 3)
  const ws = Math.round(calcScore(fd.water, waterImpact) * 0.6 + (fd.initiatives?.includes('tree-plantation') ? 20 : 0) + (fd.initiatives?.includes('plastic-free') ? 20 : 0))
  const was = Math.round(calcScore(fd.registration, registrationImpact) * 0.15 + calcScore(fd.certificates, certificateImpact) * 0.15 + calcScore(fd.food, foodImpact) * 0.35 + calcScore(fd.wasteSegregation, wasteImpact) * 0.35)
  const es = Math.round(calcScore(fd.energy, energyImpact) * 0.5 + (fd.initiatives?.includes('solar-power') ? 30 : 0) + (fd.initiatives?.includes('carbon-offset') ? 20 : 0))
  const env = Math.round((ws + was + es) / 3 + (fd.initiatives?.includes('tree-plantation') ? 10 : 0) + (fd.initiatives?.includes('waste-recycling') ? 10 : 0))
  const ib = Math.min((fd.initiatives?.length || 0) * 2.5, 15)
  const overall = Math.min(Math.round(((cs + ws + was + es + env) / 5) * 0.7 + ib * 2), 100)
  return { carbon: Math.min(cs, 100), water: Math.min(ws, 100), waste: Math.min(was, 100), energy: Math.min(es, 100), environmental: Math.min(env, 100), overall, initiativeBonus: ib }
}

function getCert(scores) {
  const levels = [
    { min: 90, level: 'platinum', levelName: 'Platinum Sustainable Event', color: '#22c55e' },
    { min: 75, level: 'gold', levelName: 'Gold Sustainable Event', color: '#eab308' },
    { min: 60, level: 'silver', levelName: 'Silver Sustainable Event', color: '#94a3b8' },
    { min: 40, level: 'bronze', levelName: 'Bronze Sustainable Event', color: '#cd7f32' },
  ]
  const f = levels.find(l => scores.overall >= l.min) || { level: 'unsustainable', levelName: 'Unsustainable Event', color: '#ef4444' }
  return { ...f, score: scores.overall, date: new Date().toISOString().split('T')[0], verificationCode: 'ECO-' + Array.from({ length: 12 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('').replace(/(.{4})/g, '$1-').slice(0, 14) }
}

function computeImpact(fd) {
  const p = parseInt(fd.participants) || 100; const d = parseFloat(fd.duration) || 1
  const tCO2 = { private: p*d*2.5, public: p*d*0.8, carpool: p*d*0.6, hybrid: p*d*1.2 }[fd.transport] || 100
  const eCO2 = { low: p*d*0.5, medium: p*d*1.5, high: p*d*3.0 }[fd.energy] || 150
  const paper = (fd.registration === 'paper' ? p * 0.5 : p * 0.05) + (fd.certificates === 'printed' ? p * 0.2 : 0)
  const plastic = fd.water === 'plastic-bottles' ? p * d * 2 : 0
  const foodW = fd.food === 'disposable' ? p * 0.3 : fd.food === 'biodegradable' ? p * 0.1 : 0
  const waste = foodW + (fd.wasteSegregation === 'not-available' ? p * 0.2 : 0)
  const waterU = fd.water === 'refill-stations' ? p * 2 : fd.water === 'reusable-bottles' ? p * 1 : p * 5
  let reduction = 0; const inits = fd.initiatives || []
  if (inits.includes('solar-power')) reduction += 15; if (inits.includes('carbon-offset')) reduction += 20; if (inits.includes('tree-plantation')) reduction += 10; if (inits.includes('digital-invitations')) reduction += 5; if (inits.includes('waste-recycling')) reduction += 10
  return { carbonEmissions: Math.round((tCO2 + eCO2 + paper * 0.5 + plastic * 0.3) * 10) / 10, paperConsumption: Math.round(paper * 10) / 10, plasticConsumption: Math.round(plastic), waterUsage: Math.round(waterU), energyUsage: Math.round(eCO2 * 10) / 10, wasteGenerated: Math.round(waste * 10) / 10, riskScore: Math.max(0, Math.min(Math.round(((tCO2 + eCO2 + paper * 0.5 + plastic * 0.3) / (p * d * 5)) * 100), 100) - reduction), reduction, unit: 'kg CO₂e' }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing authorization' })

    // Verify token
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
    })
    const user = await userRes.json()
    if (!userRes.ok || !user?.id) return res.status(401).json({ error: 'Invalid token' })

    const userId = user.id
    const headers = { 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY, 'Content-Type': 'application/json' }

    // Delete existing analyses for this user
    await fetch(`${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${userId}`, {
      method: 'DELETE', headers,
    })

    // Insert 12 sample events
    const inserts = sampleEvents.map((evt) => {
      const fd = { ...evt, participants: String(evt.participants), duration: String(evt.duration) }
      const scores = computeScores(fd)
      const daysAgo = Math.floor(Math.random() * 90)
      return {
        user_id: userId,
        event_name: evt.eventName,
        organization: evt.organization,
        location: evt.location,
        event_date: '',
        participants: evt.participants,
        duration: evt.duration,
        category: evt.category,
        form_data: fd,
        scores,
        impact: computeImpact(fd),
        recommendations: [],
        sdg_impact: {},
        certification: getCert(scores),
        created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      }
    })

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/analyses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(inserts),
    })

    if (!insertRes.ok) {
      const errData = await insertRes.json().catch(() => ({}))
      throw new Error(errData.message || `HTTP ${insertRes.status}`)
    }

    res.json({ success: true, message: `Seeded ${inserts.length} sample events`, count: inserts.length })
  } catch (err) {
    console.error('Seed error:', err.message)
    res.status(500).json({ error: err.message })
  }
}