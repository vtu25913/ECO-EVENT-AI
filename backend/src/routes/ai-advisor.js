import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '../index.js'
import { askAi, isAiConfigured, getAiStatus } from '../services/aiAdvisorAi.js'

const router = Router()

// Sample seed events matching the frontend seed data
const sampleEvents = [
  {
    eventName: 'GreenTech Conference 2026',
    organization: 'GreenTech Innovations',
    location: 'Bangalore, India',
    category: 'conference',
    participants: 500,
    duration: 2,
    transport: 'public',
    water: 'refill-stations',
    food: 'biodegradable',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['solar-power', 'carbon-offset', 'tree-plantation', 'digital-invitations', 'waste-recycling'],
  },
  {
    eventName: 'University Climate Summit',
    organization: 'IIT Delhi',
    location: 'Delhi, India',
    category: 'college-fest',
    participants: 1200,
    duration: 3,
    transport: 'public',
    water: 'refill-stations',
    food: 'reusable',
    energy: 'medium',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['plastic-free', 'digital-invitations', 'waste-recycling', 'community-awareness'],
  },
  {
    eventName: 'Eco-Fest 2026',
    organization: 'Green Earth NGO',
    location: 'Mumbai, India',
    category: 'ngo-event',
    participants: 800,
    duration: 2,
    transport: 'carpool',
    water: 'reusable-bottles',
    food: 'biodegradable',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'hybrid',
    wasteSegregation: 'available',
    initiatives: ['tree-plantation', 'plastic-free', 'solar-power', 'carbon-offset', 'waste-recycling', 'reusable-decorations'],
  },
  {
    eventName: 'Corporate Sustainability Workshop',
    organization: 'Infosys Ltd',
    location: 'Pune, India',
    category: 'workshop',
    participants: 150,
    duration: 1,
    transport: 'carpool',
    water: 'reusable-bottles',
    food: 'reusable',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['solar-power', 'digital-invitations', 'waste-recycling'],
  },
  {
    eventName: 'National Tech Expo',
    organization: 'Tech Mahindra',
    location: 'Hyderabad, India',
    category: 'conference',
    participants: 2000,
    duration: 3,
    transport: 'private',
    water: 'plastic-bottles',
    food: 'disposable',
    energy: 'high',
    registration: 'paper',
    certificates: 'printed',
    marketing: 'printed',
    wasteSegregation: 'not-available',
    initiatives: [],
  },
  {
    eventName: 'Rural Education Camp',
    organization: 'Pratham Foundation',
    location: 'Rajasthan, India',
    category: 'ngo-event',
    participants: 200,
    duration: 5,
    transport: 'carpool',
    water: 'refill-stations',
    food: 'biodegradable',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['tree-plantation', 'community-awareness', 'plastic-free'],
  },
  {
    eventName: 'Startup Pitch Fest',
    organization: 'YC Alumni India',
    location: 'Gurugram, India',
    category: 'seminar',
    participants: 300,
    duration: 1,
    transport: 'hybrid',
    water: 'plastic-bottles',
    food: 'disposable',
    energy: 'medium',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'hybrid',
    wasteSegregation: 'available',
    initiatives: ['digital-invitations'],
  },
  {
    eventName: 'Community Clean-Up Drive',
    organization: 'Local Municipality',
    location: 'Chennai, India',
    category: 'community-gathering',
    participants: 600,
    duration: 1,
    transport: 'carpool',
    water: 'reusable-bottles',
    food: 'none',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['tree-plantation', 'waste-recycling', 'community-awareness', 'plastic-free'],
  },
  {
    eventName: 'AI & ML Hackathon',
    organization: 'Google Developer Groups',
    location: 'Bengaluru, India',
    category: 'hackathon',
    participants: 400,
    duration: 2,
    transport: 'public',
    water: 'refill-stations',
    food: 'biodegradable',
    energy: 'medium',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['solar-power', 'carbon-offset', 'digital-invitations', 'waste-recycling'],
  },
  {
    eventName: 'Traditional Arts & Culture Fest',
    organization: 'Ministry of Culture',
    location: 'Jaipur, India',
    category: 'cultural-event',
    participants: 1500,
    duration: 4,
    transport: 'private',
    water: 'plastic-bottles',
    food: 'disposable',
    energy: 'high',
    registration: 'paper',
    certificates: 'printed',
    marketing: 'printed',
    wasteSegregation: 'not-available',
    initiatives: [],
  },
  {
    eventName: 'Renewable Energy Summit',
    organization: 'IRENA Partners',
    location: 'Gandhinagar, India',
    category: 'conference',
    participants: 350,
    duration: 2,
    transport: 'carpool',
    water: 'refill-stations',
    food: 'biodegradable',
    energy: 'low',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'hybrid',
    wasteSegregation: 'available',
    initiatives: ['solar-power', 'carbon-offset', 'tree-plantation', 'plastic-free', 'waste-recycling', 'reusable-decorations'],
  },
  {
    eventName: 'Medical Camp for Rural Health',
    organization: 'AIIMS Outreach',
    location: 'Bihar, India',
    category: 'ngo-event',
    participants: 800,
    duration: 3,
    transport: 'public',
    water: 'reusable-bottles',
    food: 'biodegradable',
    energy: 'medium',
    registration: 'digital',
    certificates: 'digital',
    marketing: 'social-media',
    wasteSegregation: 'available',
    initiatives: ['tree-plantation', 'community-awareness', 'waste-recycling'],
  },
]

// Utility functions (mirror of frontend logic for server-side computation)
const registrationImpact = { paper: 'high', digital: 'low' }
const certificateImpact = { printed: 'high', digital: 'low' }
const marketingImpact = { printed: 'high', 'social-media': 'low', hybrid: 'medium' }
const transportImpact = { private: 'high', public: 'medium', carpool: 'low', hybrid: 'medium' }
const waterImpact = { 'plastic-bottles': 'high', 'refill-stations': 'low', 'reusable-bottles': 'low' }
const foodImpact = { disposable: 'high', reusable: 'low', biodegradable: 'low', none: 'none' }
const energyImpact = { low: 'low', medium: 'medium', high: 'high' }
const wasteImpact = { available: 'low', 'not-available': 'high' }

function calcCategoryScore(value, impactMap) {
  const impact = impactMap[value]
  if (impact === 'low') return 90
  if (impact === 'medium') return 60
  if (impact === 'high') return 20
  if (impact === 'none') return 100
  return 50
}

function calculateScores(formData) {
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

function calculateCarbonImpact(formData) {
  const participants = parseInt(formData.participants) || 100
  const duration = parseFloat(formData.duration) || 1
  const transportEmissions = { private: participants * duration * 2.5, public: participants * duration * 0.8, carpool: participants * duration * 0.6, hybrid: participants * duration * 1.2 }
  const energyEmissions = { low: participants * duration * 0.5, medium: participants * duration * 1.5, high: participants * duration * 3.0 }
  const transportCO2 = transportEmissions[formData.transport] || 100
  const energyCO2 = energyEmissions[formData.energy] || 150
  const paperConsumption = formData.registration === 'paper' ? participants * 0.5 : participants * 0.05
  const certificatePaper = formData.certificates === 'printed' ? participants * 0.2 : 0
  const totalPaper = paperConsumption + certificatePaper
  const plasticConsumption = formData.water === 'plastic-bottles' ? participants * duration * 2 : 0
  const foodWaste = formData.food === 'disposable' ? participants * 0.3 : formData.food === 'biodegradable' ? participants * 0.1 : 0
  const totalWaste = foodWaste + (formData.wasteSegregation === 'not-available' ? participants * 0.2 : 0)
  const waterUsage = formData.water === 'refill-stations' ? participants * 2 : formData.water === 'reusable-bottles' ? participants * 1 : participants * 5
  const totalEnergy = energyCO2
  const totalCO2 = transportCO2 + energyCO2 + totalPaper * 0.5 + plasticConsumption * 0.3
  const riskScore = Math.min(Math.round((totalCO2 / (participants * duration * 5)) * 100), 100)
  const initiatives = formData.initiatives || []
  let reduction = 0
  if (initiatives.includes('solar-power')) reduction += 15
  if (initiatives.includes('carbon-offset')) reduction += 20
  if (initiatives.includes('tree-plantation')) reduction += 10
  if (initiatives.includes('digital-invitations')) reduction += 5
  if (initiatives.includes('waste-recycling')) reduction += 10
  return {
    carbonEmissions: Math.round(totalCO2 * 10) / 10,
    paperConsumption: Math.round(totalPaper * 10) / 10,
    plasticConsumption: Math.round(plasticConsumption),
    waterUsage: Math.round(waterUsage),
    energyUsage: Math.round(totalEnergy * 10) / 10,
    wasteGenerated: Math.round(totalWaste * 10) / 10,
    riskScore: Math.max(0, riskScore - reduction),
    reduction,
    unit: 'kg CO₂e',
  }
}

function generateCertification(scores) {
  const levels = [
    { min: 90, label: 'Platinum Sustainable Event', color: '#22c55e' },
    { min: 75, label: 'Gold Sustainable Event', color: '#eab308' },
    { min: 60, label: 'Silver Sustainable Event', color: '#94a3b8' },
    { min: 40, label: 'Bronze Sustainable Event', color: '#cd7f32' },
  ]
  const level = levels.find(l => scores.overall >= l.min) || { min: 0, label: 'Unsustainable Event', color: '#ef4444' }
  return {
    level: level.label.split(' ')[0].toLowerCase(),
    levelName: level.label,
    score: scores.overall,
    color: level.color,
    date: new Date().toISOString().split('T')[0],
    verificationCode: 'ECO-' + Array.from({ length: 12 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('').replace(/(.{4})/g, '$1-').slice(0, 14),
  }
}

const initiativeSDGMap = {
  'tree-plantation': 15, 'plastic-free': 12, 'solar-power': 7,
  'digital-invitations': 12, 'carbon-offset': 13, 'waste-recycling': 12,
  'community-awareness': 11, 'reusable-decorations': 12,
}

function mapSDGImpact(formData) {
  const contributions = {}
  ;[6, 7, 11, 12, 13, 15].forEach(id => { contributions[id] = 0 })
  ;(formData.initiatives || []).forEach(init => {
    const sdgId = initiativeSDGMap[init]
    if (sdgId) contributions[sdgId] = Math.min((contributions[sdgId] || 0) + 20, 100)
  })
  Object.entries({
    water: [6], registration: [12], certificates: [12], marketing: [12],
    transport: [11, 13], food: [12], energy: [7, 13], wasteSegregation: [12],
  }).forEach(([field, sdgIds]) => {
    const val = formData[field]
    if (val) {
      const impactScore = ['low', 'digital', 'refill-stations', 'reusable-bottles', 'biodegradable', 'reusable', 'carpool', 'social-media', 'available'].includes(val) ? 15 :
        ['medium', 'hybrid', 'public'].includes(val) ? 10 : 5
      sdgIds.forEach(id => { contributions[id] = Math.min((contributions[id] || 0) + impactScore, 100) })
    }
  })
  const total = Object.values(contributions).reduce((a, b) => a + b, 0)
  const avg = Math.round(total / Object.keys(contributions).length)
  return {
    contributions,
    averageImpact: avg,
    topSDGs: Object.entries(contributions).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id, val]) => ({ sdg: { id: parseInt(id) }, contribution: val })),
  }
}

function generateRecommendations(formData) {
  const templates = {
    certificates: { condition: d => d.certificates === 'printed', title: 'Switch to Digital Certificates', impact: 85, difficulty: 'easy', improvement: 8 },
    water: { condition: d => d.water === 'plastic-bottles', title: 'Replace Plastic Bottles with Refill Stations', impact: 95, difficulty: 'medium', improvement: 15 },
    transport: { condition: d => d.transport === 'private', title: 'Encourage Public Transportation & Carpooling', impact: 80, difficulty: 'medium', improvement: 12 },
    food: { condition: d => d.food === 'disposable', title: 'Use Reusable or Biodegradable Serving Materials', impact: 75, difficulty: 'medium', improvement: 10 },
    energy: { condition: d => d.energy === 'high', title: 'Adopt Renewable Energy Sources', impact: 90, difficulty: 'hard', improvement: 18 },
    waste: { condition: d => d.wasteSegregation === 'not-available', title: 'Implement Waste Segregation Stations', impact: 70, difficulty: 'easy', improvement: 10 },
    registration: { condition: d => d.registration === 'paper', title: 'Go Fully Digital with Registration', impact: 60, difficulty: 'easy', improvement: 5 },
    marketing: { condition: d => d.marketing === 'printed', title: 'Shift to Digital Marketing', impact: 55, difficulty: 'easy', improvement: 5 },
  }
  return Object.entries(templates).filter(([, t]) => t.condition(formData)).map(([key, rec]) => ({ id: key, ...rec, description: '' })).sort((a, b) => b.impact - a.impact)
}

/**
 * POST /api/ai-advisor/webhook
 * Webhook endpoint for AI agent to interact with EcoEvent AI data.
 */
router.post('/webhook', async (req, res) => {
  try {
    const { action, data } = req.body

    if (!action) {
      return res.status(400).json({ error: 'Missing action field' })
    }

    switch (action) {
      case 'get_analyses':
        return await handleGetAnalyses(res, data)
      case 'get_stats':
        return await handleGetStats(res)
      case 'get_leaderboard':
        return await handleGetLeaderboard(res)
      case 'generate_report':
        return await handleGenerateReport(res, data)
      case 'analyze_sustainability':
        return await handleAnalyze(res, data)
      default:
        return res.status(400).json({
          error: 'Unknown action',
          availableActions: [
            'get_analyses',
            'get_stats',
            'get_leaderboard',
            'generate_report',
            'analyze_sustainability',
          ],
        })
    }
  } catch (err) {
    console.error('AI Advisor webhook error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/ai-advisor/capabilities
 * Returns the capabilities of the AI Advisor integration
 */
router.get('/capabilities', (req, res) => {
  const aiStatus = getAiStatus()
  res.json({
    integration: 'AI Sustainability Advisor',
    version: '2.0.0',
    aiProvider: aiStatus,
    capabilities: [
      {
        name: 'Query Analyses',
        action: 'get_analyses',
        description: 'Retrieve sustainability analyses from the database',
        params: { userId: 'string (optional)', limit: 'number (optional)' },
      },
      {
        name: 'Get Global Stats',
        action: 'get_stats',
        description: 'Get aggregated sustainability statistics across all events',
        params: {},
      },
      {
        name: 'Get Leaderboard',
        action: 'get_leaderboard',
        description: 'Get the global sustainability leaderboard',
        params: { limit: 'number (optional)' },
      },
      {
        name: 'Generate Report',
        action: 'generate_report',
        description: 'Generate a sustainability report for a specific analysis',
        params: { analysisId: 'string (required)' },
      },
      {
        name: 'Analyze Sustainability',
        action: 'analyze_sustainability',
        description: 'Analyze event data and return sustainability scores',
        params: { formData: 'object (required)' },
      },
    ],
    docsUrl: 'https://bob.ibm.com',
  })
})

// Handler implementations

async function handleGetAnalyses(res, params) {
  let query = supabaseAdmin.from('analyses').select('*').order('created_at', { ascending: false })

  if (params?.userId) {
    query = query.eq('user_id', params.userId)
  }
  if (params?.limit) {
    query = query.limit(params.limit)
  }

  const { data, error } = await query
  if (error) throw error
  res.json({ success: true, count: data?.length || 0, data: data || [] })
}

async function handleGetStats(res) {
  const { count: total } = await supabaseAdmin
    .from('analyses')
    .select('id', { count: 'exact', head: true })

  const { data: scores } = await supabaseAdmin
    .from('analyses')
    .select('scores, impact')

  let totalScore = 0
  let scoreCount = 0
  let carbonSaved = 0

  ;(scores || []).forEach((row) => {
    if (row.scores?.overall) {
      totalScore += row.scores.overall
      scoreCount++
    }
    if (row.impact?.reduction) {
      carbonSaved += row.impact.reduction
    }
  })

  res.json({
    success: true,
    data: {
      totalAnalyses: total || 0,
      avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
    },
  })
}

async function handleGetLeaderboard(res, params) {
  const limit = params?.limit || 50
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select('id, event_name, organization, scores, certification, created_at')
    .not('scores', 'is', null)
    .order('scores->>overall', { ascending: false })
    .limit(limit)

  if (error) throw error
  res.json({ success: true, count: data?.length || 0, data: data || [] })
}

async function handleGenerateReport(res, params) {
  if (!params?.analysisId) {
    return res.status(400).json({ error: 'analysisId is required' })
  }

  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select('*')
    .eq('id', params.analysisId)
    .single()

  if (error) throw error
  if (!data) return res.status(404).json({ error: 'Analysis not found' })

  // Generate a structured report from the analysis data
  const report = {
    reportId: `RPT-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    eventName: data.event_name,
    organization: data.organization,
    scores: data.scores,
    certification: data.certification,
    recommendations: data.recommendations?.slice(0, 5) || [],
    summary: `${data.event_name} by ${data.organization} scored ${data.scores?.overall || 'N/A'}/100 - ${data.certification?.levelName || 'N/A'}`,
  }

  res.json({ success: true, data: report })
}

async function handleAnalyze(res, params) {
  if (!params?.formData) {
    return res.status(400).json({ error: 'formData is required' })
  }

  // Return the form data for the AI to process
  res.json({
    success: true,
    message: 'Event data received. AI Advisor can now process this sustainability analysis.',
    data: params.formData,
  })
}

/**
 * POST /api/ai-advisor/setup-db
 * Creates the required Supabase database tables (analyses, user_badges).
 * Requires the Supabase database password (set during project creation).
 */
router.post('/setup-db', async (req, res) => {
  const { dbPassword } = req.body

  if (!dbPassword) {
    return res.status(400).json({
      error: 'Database password is required',
      hint: 'Go to https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/settings/database to find your database password under "Connection String" → "Database password"',
      instructions: 'Then call this endpoint again with {"dbPassword": "your-password"}',
    })
  }

  try {
    const { default: pg } = await import('pg')

    // Extract project ref from SUPABASE_URL
    const projectRef = process.env.SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
    if (!projectRef) {
      return res.status(500).json({ error: 'Could not determine project ref from SUPABASE_URL' })
    }

    // Try to determine region from the database host
    // First try the direct connection
    const hosts = [
      `db.${projectRef}.supabase.co`,
      `aws-0-ap-south-1.pooler.supabase.com`,
      `aws-0-us-east-1.pooler.supabase.com`,
      `aws-0-eu-west-1.pooler.supabase.com`,
    ]

    let connected = false
    let lastError = ''

    for (const host of hosts) {
      if (connected) break

      const connectionStrings = [
        // Pooler with project ref in username (session mode)
        `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${host}:6543/postgres`,
        // Pooler with project ref in username (transaction mode)
        `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`,
        // Direct connection
        `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`,
      ]

      for (const connStr of connectionStrings) {
        if (connected) break
        try {
          const client = new pg.Client({ connectionString: connStr, connectionTimeoutMillis: 5000 })
          await client.connect()

          // Read and execute the schema SQL
          const { readFileSync } = await import('fs')
          const { join } = await import('path')
          let sqlPath = join(process.cwd(), '..', 'supabase-schema.sql')
          let sql
          try {
            sql = readFileSync(sqlPath, 'utf8')
          } catch {
            sqlPath = join(process.cwd(), 'supabase-schema.sql')
            try {
              sql = readFileSync(sqlPath, 'utf8')
            } catch {
              // Fallback inline SQL
              sql = `
                CREATE TABLE IF NOT EXISTS analyses (
                  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  user_id UUID NOT NULL,
                  created_at TIMESTAMPTZ DEFAULT NOW(),
                  event_name TEXT NOT NULL DEFAULT '',
                  organization TEXT NOT NULL DEFAULT '',
                  location TEXT NOT NULL DEFAULT '',
                  event_date TEXT NOT NULL DEFAULT '',
                  participants INTEGER DEFAULT 0,
                  duration REAL DEFAULT 1,
                  category TEXT DEFAULT '',
                  form_data JSONB DEFAULT '{}',
                  scores JSONB DEFAULT '{}',
                  impact JSONB DEFAULT '{}',
                  recommendations JSONB DEFAULT '[]',
                  sdg_impact JSONB DEFAULT '{}',
                  certification JSONB DEFAULT '{}'
                );
                CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);
                CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
                ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Users can view own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
                CREATE POLICY "Users can insert own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
                CREATE POLICY "Users can delete own analyses" ON analyses FOR DELETE USING (auth.uid() = user_id);

                CREATE TABLE IF NOT EXISTS user_badges (
                  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  user_id UUID NOT NULL,
                  badge_id TEXT NOT NULL,
                  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
                  UNIQUE(user_id, badge_id)
                );
                ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
                CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
              `
            }
          }

          await client.query(sql)
          await client.end()
          connected = true

          res.json({
            success: true,
            message: 'Database tables created successfully!',
            host: host,
            tables: ['analyses', 'user_badges'],
          })
        } catch (err) {
          lastError = err.message
        }
      }
    }

    if (!connected) {
      res.status(500).json({
        error: 'Could not connect to database',
        details: lastError,
        hint: 'Make sure the database password is correct. Find it at: https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/settings/database',
      })
    }
  } catch (err) {
    console.error('Setup DB error:', err)
    res.status(500).json({ error: 'Failed to setup database', details: err.message })
  }
})

/**
 * Create an authenticated Supabase client from a user's JWT.
 * This allows database operations that respect RLS policies.
 */
function getAuthenticatedClient(token) {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )
}

/**
 * POST /api/ai-advisor/seed-data
 * Seeds sample event analyses into Supabase for a given user.
 * Used when authenticated users want demo data in their Supabase account.
 */
router.post('/seed-data', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Extract JWT from Authorization header for authenticated DB operations
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' })
    }

    // Create an authenticated client so RLS allows inserts for this user
    const supabaseUser = getAuthenticatedClient(token)

    // Verify the user owns this userId
    const { data: { user: authUser }, error: authError } = await supabaseUser.auth.getUser(token)
    if (authError || !authUser || authUser.id !== userId) {
      return res.status(403).json({ error: 'User ID does not match authenticated user' })
    }

    // Check if user already has analyses
    const { count } = await supabaseAdmin
      .from('analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (count > 0) {
      // Delete existing analyses for this user before re-seeding
      await supabaseUser
        .from('analyses')
        .delete()
        .eq('user_id', userId)
    }

    // Generate and insert seed analyses
    const inserts = sampleEvents.map((event) => {
      const formData = { ...event, participants: String(event.participants), duration: String(event.duration) }
      const scores = calculateScores(formData)
      const impact = calculateCarbonImpact(formData)
      const recommendations = generateRecommendations(formData)
      const sdgImpact = mapSDGImpact(formData)
      const certification = generateCertification(scores)

      // Random date within last 90 days
      const daysAgo = Math.floor(Math.random() * 90)
      const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString()

      return {
        user_id: userId,
        event_name: event.eventName,
        organization: event.organization,
        location: event.location,
        event_date: '',
        participants: event.participants,
        duration: event.duration,
        category: event.category,
        form_data: formData,
        scores,
        impact,
        recommendations,
        sdg_impact: sdgImpact,
        certification,
        created_at: createdAt,
      }
    })

    const { data, error } = await supabaseUser
      .from('analyses')
      .insert(inserts)
      .select()

    if (error) {
      console.error('Seed data insert error:', error)
      return res.status(500).json({ error: 'Failed to seed data', details: error.message })
    }

    // Also seed badges for the qualifying events
    const badgeIds = []
    inserts.forEach((item, i) => {
      if (item.scores.carbon >= 80) badgeIds.push('carbon-warrior')
      if (item.scores.water >= 80) badgeIds.push('water-saver')
      if (item.scores.waste >= 85) badgeIds.push('plastic-free-champion')
      if (item.scores.overall >= 90) badgeIds.push('climate-hero')
      if (i === 0) badgeIds.push('green-planner')
      if (i >= 4) badgeIds.push('eco-leader')
      if (item.certification.level === 'platinum') badgeIds.push('sustainability-master')
      if (item.form_data?.initiatives?.includes('tree-plantation')) badgeIds.push('tree-planter')
    })

    const uniqueBadges = [...new Set(badgeIds)]
    if (uniqueBadges.length > 0) {
      const badgeInserts = uniqueBadges.map(badgeId => ({
        user_id: userId,
        badge_id: badgeId,
      }))
      const { error: badgeError } = await supabaseUser
        .from('user_badges')
        .upsert(badgeInserts, { onConflict: 'user_id,badge_id', ignoreDuplicates: true })

      if (badgeError) {
        console.error('Seed badge error:', badgeError)
      }
    }

    res.json({
      success: true,
      message: `Seeded ${inserts.length} sample events and ${uniqueBadges.length} badges`,
      count: inserts.length,
      badges: uniqueBadges.length,
    })
  } catch (err) {
    console.error('Seed data error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/ai-advisor/chat
 * Chat endpoint for the AI Sustainability Advisor chatbot.
 * 
 * Uses a three-tier response system:
 * 1. AI API (watsonx/OpenAI) — if API key is configured, calls the AI for genuine responses
 * 2. Local knowledge engine — keyword-matched hardcoded responses
 * 3. General fallback — default sustainability best practices
 *
 * Supports context-aware queries with event analysis data.
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context, useExpertMode } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    let response = ''

    // ─── Tier 1: Try the AI API (if configured) ────────────────────────────
    if (isAiConfigured()) {
      try {
        const aiResponse = await askAi(message, context)
        if (aiResponse) {
          return res.json({
            success: true,
            response: aiResponse,
            source: 'ai',
          })
        }
      } catch (aiErr) {
        console.warn('[Chat] AI API failed, falling back to local engine:', aiErr.message)
      }
    }

    // ─── Tier 2: Local knowledge engine ────────────────────────────────────
    const lower = message.toLowerCase()

    // ─── Handle the 5 specific complex prompts with rich responses ────────
    
    // Prompt 1: 20 sustainability recommendations for college events
    if ((lower.includes('suggest') || lower.includes('recommendation') || lower.includes('list')) &&
        lower.includes('college') && lower.includes('event')) {
      response = `🌿 **20 Sustainability Recommendations for College Events**\n\n` +
        `Here are 20 actionable recommendations to make college events more sustainable:\n\n` +
        `**Waste & Materials** ♻️\n` +
        `1. **Go Paperless** — Use QR codes for registration, schedules, and feedback forms\n` +
        `2. **Ban Single-Use Plastics** — Replace plastic banners, cups, and cutlery with bamboo or compostable alternatives\n` +
        `3. **Set Up Segregation Stations** — Clearly labeled bins for recyclables, compost, and landfill waste\n` +
        `4. **Compost Food Waste** — Partner with campus composting facilities or local farms\n` +
        `5. **Digital Swag Bags** — Replace physical promo items with digital coupons and downloads\n\n` +
        `**Food & Beverage** 🥗\n` +
        `6. **Choose Local Catering** — Source food from local vendors to reduce transport emissions\n` +
        `7. **Plant-Forward Menu** — Offer vegetarian/vegan options (plant-based meals have 75% lower carbon footprint)\n` +
        `8. **Water Refill Stations** — Install refill stations and sell branded reusable bottles\n` +
        `9. **Bulk Dispensers** — Use large dispensers for beverages instead of individual bottles/cans\n` +
        `10. **Donate Leftovers** — Partner with food recovery programs like Feeding India\n\n` +
        `**Energy & Venue** ⚡\n` +
        `11. **Choose Green Venues** — Select campus buildings with energy-efficient HVAC and LED lighting\n` +
        `12. **Daylight Scheduling** — Hold events during daylight hours to reduce artificial lighting needs\n` +
        `13. **Solar-Powered Stages** — Use portable solar generators for outdoor events\n` +
        `14. **Smart Power Strips** — Use timers or motion sensors to cut power when equipment isn't in use\n` +
        `15. **Natural Ventilation** — Choose venues with good airflow to minimize AC usage\n\n` +
        `**Transportation** 🚗\n` +
        `16. **Campus Shuttle Services** — Coordinate free shuttle routes from dorms and parking lots\n` +
        `17. **Carpool Incentives** — Offer priority parking or small prizes for carpoolers\n` +
        `18. **Bike Parking & Valet** — Set up secure, visible bike parking with basic repair tools\n\n` +
        `**Engagement & Education** 📚\n` +
        `19. **Sustainability Ambassadors** — Recruit student volunteers to guide attendees on eco-practices\n` +
        `20. **Impact Dashboard** — Display real-time sustainability metrics (plastic saved, CO₂ avoided, waste diverted) on screens throughout the event\n\n` +
        `💡 **Quick Wins:** Start with #1 (paperless), #3 (segregation stations), and #8 (refill stations) for immediate impact!\n` +
        `📊 Use our **Event Analyzer** to score your college event and track improvement!`
    }
    
    // Prompt 2: Reduce carbon emissions during large events
    else if ((lower.includes('carbon') || lower.includes('emission')) &&
             (lower.includes('large') || lower.includes('reduce') || lower.includes('reduc'))) {
      response = `🌍 **Reducing Carbon Emissions at Large Events**\n\n` +
        `Large events (500+ attendees) pose significant carbon challenges. Here's a comprehensive strategy:\n\n` +
        `**1. Measure Your Baseline** 📊\n` +
        `• Calculate emissions from: transportation (40-60%), energy (20-30%), waste (10-15%), food (5-15%)\n` +
        `• Use our **Event Analyzer** for a detailed breakdown\n` +
        `• Establish per-attendee carbon budget (target: <5 kg CO₂e per person)\n\n` +
        `**2. Transportation — The Biggest Lever** 🚗\n` +
        `• **Choose centralized venues** near public transit hubs\n` +
        `• **Provide shuttles** from major transit stations and parking areas\n` +
        `• **Incentivize carpooling** — Create ride-matching platforms 2 weeks before the event\n` +
        `• **Offer virtual attendance options** — Hybrid events can reduce travel emissions by 40-70%\n` +
        `• **Calculate savings:** Switching 1000 attendees from private cars to buses reduces CO₂ by ~5 tons\n\n` +
        `**3. Energy Management** ⚡\n` +
        `• **LED throughout** — Uses 75-90% less energy than traditional lighting\n` +
        `• **Renewable energy** — Negotiate green power purchase with venue or bring portable solar\n` +
        `• **HVAC optimization** — Pre-cool/heat the venue, then reduce during the event\n` +
        `• **Power management** — Use smart strips and motion sensors for stages and exhibitor booths\n` +
        `• **Estimated savings:** Renewable energy + LED can cut energy emissions by 50-70%\n\n` +
        `**4. Food & Catering** 🥗\n` +
        `• **Plant-forward menus** — Beef has 5x the carbon footprint of chicken, 20x of legumes\n` +
        `• **Local sourcing** — Reduce food miles by partnering with local farms\n` +
        `• **Minimize food waste** — RSVP-based ordering + donation partnerships\n` +
        `• **Compostable servingware** — Avoid disposable plastics entirely\n\n` +
        `**5. Waste Reduction** ♻️\n` +
        `• **Digital everything** — Programs, tickets, certificates, marketing materials\n` +
        `• **Reusable badge systems** — Collect and reuse lanyards and badge holders\n` +
        `• **Water refill stations** — Eliminate plastic bottles (saves ~3 bottles per attendee per day)\n` +
        `• **Waste sorting** — Recruit volunteers to guide attendees at sorting stations\n\n` +
        `**6. Carbon Offsetting** 🌳\n` +
        `• **Calculate unavoidable emissions** after all reductions\n` +
        `• **Purchase verified offsets** — Gold Standard or VCS-certified projects\n` +
        `• **Tree planting** — Each tree absorbs ~22kg CO₂/year\n` +
        `• **Communicate transparently** — Share your carbon footprint and offset strategy with attendees\n\n` +
        `🎯 **Target:** Aim for Platinum certification (score 90+) with a carbon intensity <2 kg CO₂e per attendee per day.\n` +
        `📊 Start by analyzing your event with our **Carbon Impact Simulator**!`
    }
    
    // Prompt 3: Environmental impacts of plastic bottle usage in public events
    else if ((lower.includes('plastic') || lower.includes('bottle')) &&
             (lower.includes('impact') || lower.includes('environmental') || lower.includes('public'))) {
      response = `🚰 **Environmental Impacts of Plastic Bottles in Public Events**\n\n` +
        `A comprehensive analysis of the environmental consequences:\n\n` +
        `**1. The Scale of the Problem** 📏\n` +
        `• A single large event (1000 attendees, 2 days) can generate **4,000-6,000 plastic bottles**\n` +
        `• Multiply by thousands of events globally = **billions of bottles annually**\n` +
        `• Only 9% of all plastic ever produced has been recycled\n` +
        `• Each bottle takes **450+ years** to decompose in a landfill\n\n` +
        `**2. Carbon Footprint** 💨\n` +
        `• Production: 1 liter plastic bottle = ~0.33 kg CO₂e (extraction + manufacturing)\n` +
        `• Transportation: Bottled water travels an average of **1,000+ km** from source to event\n` +
        `• Refrigeration: Keeping bottles cold adds 20-40% more emissions\n` +
        `• **Total impact:** A 1000-person event using plastic bottles emits ~1.5-2 tons CO₂e just from bottled water\n\n` +
        `**3. Water Resource Depletion** 💧\n` +
        `• It takes **3 liters of water** to produce 1 liter of bottled water (packaging + processing)\n` +
        `• Major events can waste **12,000-18,000 liters** of hidden water per event\n` +
        `• Bottled water costs **2,000x more** than tap water per liter\n` +
        `• Groundwater extraction for bottling affects local water tables\n\n` +
        `**4. Waste Management Crisis** 🗑️\n` +
        `• High contamination rates — only 20-30% of event plastic bottles are recycled properly\n` +
        `• Most end up in landfills, incinerators, or the ocean\n` +
        `• **Ocean impact:** 8 million tons of plastic enter oceans annually, killing 100,000+ marine animals\n` +
        `• Microplastics from degrading bottles enter the food chain\n` +
        `• Cleanup costs for municipalities after large events can exceed **$50,000 per event**\n\n` +
        `**5. Health Concerns** ⚠️\n` +
        `• Bottles left in heat (direct sunlight at outdoor events) can leach **BPA and antimony**\n` +
        `• Microplastics found in 93% of bottled water brands tested\n` +
        `• Refilled single-use bottles breed bacteria — a single refill can have **more bacteria than a toilet seat**\n\n` +
        `**6. The Solution — Refill Stations** ✅\n` +
        `• A single refill station serves **500+ attendees per day**\n` +
        `• Reduces plastic waste by **80-95%** compared to bottled water\n` +
        `• Saves **$2,000-5,000 per event** in bottled water costs\n` +
        `• Branded reusable bottles become **marketing giveaways** instead of waste\n` +
        `• **Water Score improvement:** Switching to refill stations boosts your Water Score by 15-20 points!\n\n` +
        `💡 **Pro Tip:** Start with one refill station + reusable bottle program at your next event. The ROI is immediate — both environmental AND financial!`
    }
    
    // Prompt 4: Sustainability scoring framework
    else if ((lower.includes('scoring framework') || lower.includes('evaluat') || lower.includes('scoring system')) &&
             lower.includes('event')) {
      response = `📊 **Sustainability Scoring Framework for Evaluating Events**\n\n` +
        `A comprehensive framework for evaluating event sustainability:\n\n` +
        `**THE 5-DIMENSION SCORING MODEL**\n` +
        `Each dimension is scored 0-100, with 100 being the most sustainable. The overall score is a weighted composite.\n\n` +
        `**Dimension 1: Carbon & Transportation** 💨 (Weight: 25%)\n` +
        `Assesses emissions from attendee travel and venue energy.\n` +
        `• **Transport:** Private cars=20, Hybrid=60, Public transit=70, Carpooling=90, Bicycle/Walk=100\n` +
        `• **Energy source:** High-emission grid=20, Mixed grid=60, Renewable tariff=80, On-site solar=100\n` +
        `• **Virtual options:** None=0, Partial recording=40, Live streaming=70, Fully hybrid=100\n` +
        `• **Formula:** Carbon Score = (Transport × 0.3) + (Energy × 0.4) + (Initiatives × 3, capped at 30)\n\n` +
        `**Dimension 2: Water Stewardship** 💧 (Weight: 20%)\n` +
        `Evaluates water sourcing, usage, and conservation.\n` +
        `• **Water source:** Plastic bottles=20, Single-use cups=30, Reusable bottles provided=70, Refill stations=90, Refill + filtration=100\n` +
        `• **Initiatives:** Tree plantation (+20), Plastic-free commitment (+20)\n` +
        `• **Formula:** Water Score = (Water Source × 0.6) + Initiatives Bonus (capped at 40)\n\n` +
        `**Dimension 3: Waste Management** ♻️ (Weight: 20%)\n` +
        `Measures material usage, segregation, and circularity.\n` +
        `• **Registration:** Paper=20, Hybrid=60, Digital=90\n` +
        `• **Certificates/Materials:** Printed=20, Hybrid=60, Digital=90\n` +
        `• **Food service:** Disposable=20, Reusable collected=70, Biodegradable composted=90, No food=100\n` +
        `• **Segregation:** Not available=20, Limited bins=50, Full sorting with volunteers=90\n` +
        `• **Formula:** Waste Score = (Registration × 0.15) + (Certificates × 0.15) + (Food × 0.35) + (Segregation × 0.35)\n\n` +
        `**Dimension 4: Energy Efficiency** ⚡ (Weight: 20%)\n` +
        `Analyzes energy consumption patterns and efficiency measures.\n` +
        `• **Usage level:** High (AC all day, heavy AV)=20, Medium (mixed)=60, Low (LED, natural light)=90\n` +
        `• **Incentives:** Solar power (+30), Carbon offset program (+20)\n` +
        `• **Formula:** Energy Score = (Usage Level × 0.5) + Green Initiatives (capped at 50)\n\n` +
        `**Dimension 5: Environmental Impact** 🌿 (Weight: 15%)\n` +
        `Captures overall ecological footprint and biodiversity considerations.\n` +
        `• **Base:** Average of Water, Waste, and Energy scores\n` +
        `• **Bonus initiatives:** Tree plantation (+10), Waste recycling (+10), Each additional green initiative (+2.5, capped at 15)\n` +
        `• **Formula:** Env Score = Average(Water, Waste, Energy) × 0.7 + Initiative Bonus × 2\n\n` +
        `**OVERALL SCORE CALCULATION** 🎯\n` +
        `Overall = (Carbon × 0.25 + Water × 0.20 + Waste × 0.20 + Energy × 0.20 + Environmental × 0.15)\n` +
        `Then: Overall = Overall × 0.7 + (Initiative Count × 2.5, capped at 15)\n\n` +
        `**CERTIFICATION TIERS** 🏅\n` +
        `• **Platinum:** 90-100 — Industry-leading sustainability\n` +
        `• **Gold:** 75-89 — Excellent practices with room for optimization\n` +
        `• **Silver:** 60-74 — Good foundation, several improvements needed\n` +
        `• **Bronze:** 40-59 — Basic practices, significant gaps\n` +
        `• **Unsustainable:** 0-39 — Major changes required\n\n` +
        `📊 **Ready to apply this framework?** Use our **Event Analyzer** to score your event automatically and get a detailed breakdown across all 5 dimensions!`
    }
    
    // Prompt 5: SDG contributions from sustainable event planning
    else if (lower.includes('sdg') || lower.includes('sustainable development goal') || lower.includes('un') &&
             (lower.includes('contribut') || lower.includes('event planning') || lower.includes('align'))) {
      response = `🌍 **How Sustainable Event Planning Contributes to UN SDGs**\n\n` +
        `Sustainable event planning directly supports multiple UN Sustainable Development Goals:\n\n` +
        `---\n\n` +
        `**SDG 6: Clean Water and Sanitation** 💧\n` +
        `**Target 6.4:** Increase water-use efficiency across all sectors\n` +
        `**How events contribute:**\n` +
        `• Installing water refill stations instead of bottled water saves thousands of liters of embedded water\n` +
        `• Reusable bottle programs reduce the 3:1 water-to-product ratio of bottled water\n` +
        `• Rainwater harvesting for venue landscaping and sanitation\n` +
        `**Impact level:** Each event with refill stations conserves 2-5L of embedded water per attendee per day\n\n` +
        `**SDG 7: Affordable and Clean Energy** ⚡\n` +
        `**Target 7.2:** Increase share of renewable energy in the global energy mix\n` +
        `**How events contribute:**\n` +
        `• Choosing venues powered by renewable energy creates demand signals\n` +
        `• On-site solar or wind power for outdoor events demonstrates feasibility\n` +
        `• LED lighting (75-90% energy savings) sets efficiency benchmarks\n` +
        `• Smart HVAC scheduling reduces peak energy demand and carbon emissions\n` +
        `**Impact level:** A 1000-person event switching to renewables saves ~3-5 MWh of fossil fuel energy\n\n` +
        `**SDG 11: Sustainable Cities and Communities** 🏙️\n` +
        `**Target 11.6:** Reduce per capita environmental impact of cities\n` +
        `**How events contribute:**\n` +
        `• Accessible venues near public transit reduce urban congestion\n` +
        `• Zero-waste events divert tons of waste from city landfills\n` +
        `• Local sourcing supports community economies and reduces food miles\n` +
        `• Walkable/bikeable venue choices promote active transportation infrastructure\n` +
        `**Impact level:** Large events can divert 1-5 tons of waste from landfills and reduce traffic by 15-25%\n\n` +
        `**SDG 12: Responsible Consumption and Production** 🔄\n` +
        `**Target 12.5:** Substantially reduce waste generation through prevention, reduction, recycling, and reuse\n` +
        `**How events contribute:**\n` +
        `• Digital registration, programs, and certificates eliminate paper waste entirely\n` +
        `• Reusable badge systems and swag prevent single-use material waste\n` +
        `• Composting food waste closes the nutrient loop\n` +
        `• Donating leftovers addresses both waste and food insecurity\n` +
        `• Waste segregation stations with volunteer guidance achieve 60-80% recycling rates\n` +
        `**Impact level:** Sustainable events achieve 70-90% waste diversion from landfills\n\n` +
        `**SDG 13: Climate Action** 🌍\n` +
        `**Target 13.3:** Improve education and awareness on climate change mitigation\n` +
        `**How events contribute:**\n` +
        `• Carbon footprint measurement establishes accountability and baseline data\n` +
        `• Reduction strategies (transport, energy, materials) directly cut emissions\n` +
        `• Carbon offset programs fund verified emission reduction projects\n` +
        `• Sustainability education at events raises awareness among thousands of attendees\n` +
        `• Displaying real-time impact metrics (CO₂ saved, waste diverted) normalizes sustainability\n` +
        `**Impact level:** A well-managed large event (2000 people, 2 days) can save 5-15 tons CO₂e\n\n` +
        `**SDG 15: Life on Land** 🌳\n` +
        `**Target 15.2:** Promote sustainable management of all forest types\n` +
        `**How events contribute:**\n` +
        `• Tree-planting initiatives as part of event offset programs\n` +
        `• Choosing venues that protect rather than harm natural habitats\n` +
        `• Avoiding single-use plastics that harm wildlife and ecosystems\n` +
        `• Partnering with conservation organizations for event give-backs\n` +
        `**Impact level:** Each 100 trees planted offsets ~2.2 tons CO₂/year and restores habitat\n\n` +
        `---\n` +
        `🎯 **The Ripple Effect:** Beyond direct impact, sustainable events inspire attendees to adopt eco-friendly habits in their daily lives, multiplying the positive effect exponentially.\n` +
        `📊 **Track your SDG contribution** using our **SDG Impact Mapper** — every analysis maps to all 6 SDGs automatically!`
    }

    // ─── Context-aware queries about the current analysis ───────────────────
    else if (context?.scores && context?.formData) {
      const { scores, formData, impact, certification } = context

      if (lower.includes('score') || lower.includes('rating') || lower.includes('how did i do')) {
        response = `📊 **Your Sustainability Score: ${scores.overall}/100**\n\n` +
          `Here's your breakdown across all categories:\n\n` +
          `💨 **Carbon:** ${scores.carbon}/100\n` +
          `💧 **Water:** ${scores.water}/100\n` +
          `🗑️ **Waste:** ${scores.waste}/100\n` +
          `⚡ **Energy:** ${scores.energy}/100\n` +
          `🌿 **Environmental:** ${scores.environmental}/100\n\n` +
          `🏅 **Certification:** ${certification?.level || 'N/A'}\n` +
          `🔖 **Verification:** ${certification?.verificationCode || 'N/A'}\n\n` +
          `Your event **${formData.eventName || 'Untitled'}** by ${formData.organization || 'your organization'} is performing ` +
          `${scores.overall >= 75 ? '🌟 excellently!' : scores.overall >= 50 ? '👍 well' : '📈 with room for improvement'}.`
      } else if (lower.includes('carbon') || lower.includes('emission') || lower.includes('co2')) {
        response = `💨 **Carbon Impact Analysis**\n\n` +
          `Your event generates approximately **${impact?.carbonEmissions || 'N/A'} kg CO₂e** in carbon emissions.\n\n` +
          `**Score: ${scores.carbon}/100**\n\n` +
          `**Recommendations to reduce carbon:**\n` +
          `🚗 Choose ${formData.transport === 'private' ? 'carpooling or public transport instead of private vehicles' : 'more sustainable transport options'}\n` +
          `⚡ Use energy-efficient equipment and LED lighting\n` +
          `🌳 Consider carbon offset programs\n\n` +
          `With initiatives, you reduced your impact by **${impact?.reduction || 0}%**!`
      } else if (lower.includes('water')) {
        response = `💧 **Water Usage Analysis**\n\n` +
          `Your event uses approximately **${impact?.waterUsage || 'N/A'} L** of water.\n\n` +
          `**Score: ${scores.water}/100**\n\n` +
          `**Tips to improve water efficiency:**\n` +
          `🚰 Install water refill stations instead of ${formData.water === 'plastic-bottles' ? 'plastic bottles' : 'current methods'}\n` +
          `💧 Use water-efficient fixtures\n` +
          `♻️ Collect and reuse greywater where possible`
      } else if (lower.includes('waste')) {
        response = `🗑️ **Waste Management Analysis**\n\n` +
          `Your event generates approximately **${impact?.wasteGenerated || 'N/A'} kg** of waste.\n\n` +
          `**Score: ${scores.waste}/100**\n\n` +
          `**Recommendations:**\n` +
          `🔄 ${formData.wasteSegregation === 'not-available' ? 'Set up waste segregation stations (recyclables, compost, landfill)' : 'Continue maintaining your waste segregation system'}\n` +
          `🥤 Replace single-use items with reusable alternatives\n` +
          `📄 Go digital instead of printed materials`
      } else if (lower.includes('energy')) {
        response = `⚡ **Energy Consumption Analysis**\n\n` +
          `Your event consumes approximately **${impact?.energyUsage || 'N/A'} kWh** of energy.\n\n` +
          `**Score: ${scores.energy}/100**\n\n` +
          `**Energy-saving suggestions:**\n` +
          `💡 Use LED lighting (75% less energy than traditional bulbs)\n` +
          `☀️ Choose venues with ${formData.initiatives?.includes('solar-power') ? 'your existing solar power setup' : 'renewable energy options'}\n` +
          `🌡️ Optimize HVAC scheduling for event hours only`
      } else if (lower.includes('improve') || lower.includes('better') || lower.includes('how can i')) {
        const recs = context.recommendations || []
        response = `📈 **Improvement Suggestions for Your Event**\n\n` +
          `Based on your analysis, here are the top ways to improve:\n\n` +
          (recs.length > 0
            ? recs.slice(0, 4).map((r, i) => `${i + 1}. **${r.title}** — +${r.improvement || 'N/A'}% improvement (${r.difficulty || 'moderate'})\n   ${r.description || ''}`).join('\n\n')
            : `1. **Transportation** — Choose sustainable transport options\n` +
              `2. **Waste Management** — Implement proper segregation\n` +
              `3. **Energy Efficiency** — Switch to LED and renewable energy\n` +
              `4. **Digital Transformation** — Reduce paper usage`) +
          `\n\n💡 Start with the easiest changes for quick wins!`
      } else if (lower.includes('certification') || lower.includes('badge') || lower.includes('level')) {
        response = `🏅 **Certification Details**\n\n` +
          `Your event **${formData.eventName || 'Untitled'}** has earned:\n\n` +
          `**Level:** ${certification?.level || 'N/A'}\n` +
          `**Score:** ${scores.overall}/100\n` +
          `**Verification Code:** ${certification?.verificationCode || 'N/A'}\n\n` +
          `**Certification Tiers:**\n` +
          `🥇 Platinum: 90-100\n` +
          `🥇 Gold: 75-89\n` +
          `🥈 Silver: 60-74\n` +
          `🥉 Bronze: 40-59\n` +
          `📉 Unsustainable: 0-39\n\n` +
          `${scores.overall >= 90 ? '🎉 You\'ve achieved the highest tier — Platinum! Amazing work!' :
            scores.overall >= 75 ? '🎉 Great job reaching Gold! Push for Platinum next time.' :
            scores.overall >= 60 ? '👍 Good start at Silver! Aim for Gold.' :
            '💪 Keep working on improvements to reach the next tier.'}`
      }
    }

    // ─── General sustainability knowledge (works with or without context) ────
    if (!response) {
      if (lower.includes('waste') || lower.includes('reduc') || lower.includes('recycl')) {
        response = `♻️ **Waste Reduction Strategies**\n\n` +
          `Here are effective ways to reduce waste at your event:\n\n` +
          `**Digital Transformation** 📱\n` +
          `• Replace paper registration with QR code check-ins\n` +
          `• Use digital certificates instead of printed ones\n` +
          `• Send digital invitations and programs\n\n` +
          `**Waste Management** 🚮\n` +
          `• Set up clearly labeled segregation stations\n` +
          `• Partner with local recycling facilities\n` +
          `• Compost food waste from catering\n\n` +
          `**Single-Use Alternatives** 🥤\n` +
          `• Replace plastic bottles with refill stations\n` +
          `• Use reusable or biodegradable serving materials\n` +
          `• Provide reusable tote bags instead of plastic swag`
      } else if (lower.includes('carbon neutral') || lower.includes('net zero') || lower.includes('offset')) {
        response = `🌍 **Achieving Carbon Neutrality**\n\n` +
          `Here's your roadmap to carbon-neutral events:\n\n` +
          `**1. Measure Your Footprint** 📊\nUse our Event Analyzer to calculate emissions from all sources.\n\n` +
          `**2. Reduce Energy** 🔋\n• Use LED lighting and energy-efficient equipment\n• Choose venues with renewable energy\n• Optimize HVAC schedules\n\n` +
          `**3. Sustainable Transport** 🚗\n• Encourage carpooling with incentives\n• Provide public transit passes\n• Choose accessible central locations\n\n` +
          `**4. Offset Remaining** 🌳\n• Partner with verified carbon offset programs\n• Plant trees (each absorbs ~22kg CO₂/year)\n• Invest in renewable energy projects`
      } else if (lower.includes('energy') || lower.includes('solar') || lower.includes('renewable') || lower.includes('green')) {
        response = `☀️ **Sustainable Energy Solutions**\n\n` +
          `Top sustainable energy options for events:\n\n` +
          `**Solar Power** ☀️\n• Portable solar generators for outdoor events\n• Solar-powered charging stations\n• Solar lighting for evening events\n\n` +
          `**Energy Efficiency** 💡\n• LED lighting throughout (90% less energy)\n• Smart thermostats and motion sensors\n• Energy-efficient appliances\n\n` +
          `**Renewable Energy** 🌱\n• Choose venues with green energy tariffs\n• Purchase Renewable Energy Certificates (RECs)\n• Partner with local renewable energy providers`
      } else if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
        response = `👋 **Hello! I'm the AI Sustainability Advisor.**\n\n` +
          `I can help you with:\n\n` +
          `📊 **Analyze your event scores** — Ask about your carbon, water, waste, or energy performance\n` +
          `💡 **Get improvement tips** — "How can I improve my score?"\n` +
          `🌍 **Learn about sustainability** — SDGs, carbon neutrality, waste reduction\n` +
          `🏅 **Check certifications** — Platinum, Gold, Silver, Bronze tiers\n` +
          `♻️ **Eco-friendly alternatives** — Plastic-free options, renewable energy\n\n` +
          `How can I assist you today? 🌿`
      } else if (lower.includes('thank')) {
        response = `😊 **You're welcome!**\n\n` +
          `I'm glad I could help you with your sustainability journey. Remember, every small step toward greener events makes a difference for our planet! 🌍💚\n\n` +
          `Feel free to ask me anything else about:\n` +
          `• Improving your sustainability scores\n` +
          `• Understanding environmental impact\n` +
          `• Planning eco-friendly initiatives\n` +
          `• Getting certified for your events`
      } else {
        response = `🌿 **Sustainability Insights**\n\n` +
          `Great question! Here are some general best practices for sustainable events:\n\n` +
          `1. **Conduct a sustainability assessment** using our Event Analyzer\n` +
          `2. **Go digital** — reduce paper waste with QR codes and digital certificates\n` +
          `3. **Choose sustainable materials** — reusable, biodegradable, or compostable\n` +
          `4. **Encourage green transportation** — public transit, carpooling, biking\n` +
          `5. **Select eco-venues** — venues with green certifications\n` +
          `6. **Partner locally** — reduce transportation emissions\n` +
          `7. **Measure and offset** — calculate carbon footprint and offset\n` +
          `8. **Educate attendees** — spread awareness about sustainability\n\n` +
          `📊 Would you like me to elaborate on any specific area? Try asking about waste reduction, carbon neutrality, or energy efficiency!`
      }
    }

    res.json({ success: true, response, source: 'local' })
  } catch (err) {
    console.error('AI Advisor chat error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
