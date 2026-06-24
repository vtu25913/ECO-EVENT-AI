import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createClient } from '@supabase/supabase-js'

import analysesRouter from './routes/analyses.js'
import leaderboardRouter from './routes/leaderboard.js'
import aiAdvisorRouter from './routes/ai-advisor.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Supabase Admin Client ──────────────────────────────────────────────────
// Uses the service_role key (bypasses RLS for admin operations).
// Falls back to anon key if service_role key is not set.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!process.env.SUPABASE_URL || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or Supabase key in .env — database will not work.')
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  supabaseKey || ''
)

/**
 * Create an authenticated Supabase client from a user's JWT.
 * Database operations via this client will respect RLS policies
 * using the authenticated user's identity (auth.uid()).
 */
export function getSupabaseClient(token) {
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

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  // Quick DB ping
  const { error } = await supabaseAdmin
    .from('analyses')
    .select('id', { count: 'exact', head: true })

  const dbStatus = error
    ? { connected: false, error: error.message, code: error.code }
    : { connected: true }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: {
      url: process.env.SUPABASE_URL,
      db: dbStatus,
    },
    ai: {
      provider: process.env.AI_PROVIDER || 'openai',
      configured: !!process.env.AI_API_KEY,
    },
  })
})

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/analyses', analysesRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/ai-advisor', aiAdvisorRouter)
app.use('/api/admin', adminRouter)

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error', details: err.message })
})

// ─── Startup ─────────────────────────────────────────────────────────────────
// Start the server only when run directly (not when imported by Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log('')
    console.log('🌿 ─────────────────────────────────────────')
    console.log(`🌿  EcoEvent AI Backend  —  port ${PORT}`)
    console.log('🌿 ─────────────────────────────────────────')
    console.log(`🔗 Supabase URL : ${process.env.SUPABASE_URL}`)
    console.log(`🤖 AI Provider  : ${process.env.AI_PROVIDER || 'openai'} (${process.env.AI_API_KEY ? '✅ key set' : '⚠️  no key — using fallback'})`)
    console.log('')

    // ── Verify Supabase tables on startup ──────────────────────────────────
    console.log('🔍 Checking Supabase database connection...')

    const tables = ['analyses', 'user_badges']
    let allOk = true

    for (const table of tables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('id', { count: 'exact', head: true })

      if (error) {
        allOk = false
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          console.log(`   ❌ "${table}" — table not found (run setup-database.js)`)
        } else if (error.message?.includes('Invalid API key') || error.code === 'PGRST301') {
          console.log(`   ❌ "${table}" — invalid API key (update SUPABASE_SERVICE_ROLE_KEY in .env)`)
          console.log(`      👉 https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/settings/api`)
          break
        } else {
          console.log(`   ❌ "${table}" — ${error.message} (${error.code})`)
        }
      } else {
        console.log(`   ✅ "${table}" — connected (${count ?? 0} rows)`)
      }
    }

    if (allOk) {
      console.log('')
      console.log('✅ Supabase database fully connected!')
    } else {
      console.log('')
      console.log('⚠️  Some database tables are missing or inaccessible.')
      console.log('   Run: node setup-database.js   for instructions.')
    }

    console.log('')
    console.log(`📡 API ready at http://localhost:${PORT}/api`)
    console.log(`🔧 AI Advisor chat  : POST /api/ai-advisor/chat`)
    console.log(`📊 Leaderboard      : GET  /api/leaderboard`)
    console.log(`📋 Analyses         : GET  /api/analyses  (auth required)`)
    console.log('')
  })
}
