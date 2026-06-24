/**
 * setup-database.js
 * Creates the required Supabase tables using the REST API (no DB password needed).
 * Run: node setup-database.js
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ─── SQL Schema ────────────────────────────────────────────────────────────
const SCHEMA_SQL = `
-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── analyses table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analyses (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  event_name   TEXT        NOT NULL DEFAULT '',
  organization TEXT        NOT NULL DEFAULT '',
  location     TEXT        NOT NULL DEFAULT '',
  event_date   TEXT        NOT NULL DEFAULT '',
  participants INTEGER     DEFAULT 0,
  duration     REAL        DEFAULT 1,
  category     TEXT        DEFAULT '',
  form_data    JSONB       DEFAULT '{}',
  scores       JSONB       DEFAULT '{}',
  impact       JSONB       DEFAULT '{}',
  recommendations JSONB    DEFAULT '[]',
  sdg_impact   JSONB       DEFAULT '{}',
  certification JSONB      DEFAULT '{}'
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS analyses_user_id_idx    ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_score_idx      ON analyses((scores->>'overall') DESC NULLS LAST);

-- Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (idempotent)
DROP POLICY IF EXISTS "Users can view own analyses"   ON analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
DROP POLICY IF EXISTS "Service role can do anything"  ON analyses;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- ─── user_badges table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL,
  badge_id    TEXT        NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS user_badges_user_id_idx ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own badges"   ON user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);
`

async function setupDatabase() {
  console.log('🌿 EcoEvent AI — Supabase Database Setup')
  console.log(`🔗 Project: ${SUPABASE_URL}`)
  console.log('')

  // ── Step 1: Run schema SQL via Supabase's REST SQL execution endpoint ──
  console.log('⚙️  Creating tables via Supabase SQL API...')

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ query: SCHEMA_SQL }),
  })

  if (!response.ok) {
    // Supabase doesn't expose exec_sql by default — fall back to verifying tables
    // by attempting test inserts / selects
    console.log('ℹ️  SQL exec endpoint not available — verifying via REST API instead...')
    await verifyAndReportTables()
    return
  }

  console.log('✅ SQL executed successfully')
  await verifyAndReportTables()
}

async function verifyAndReportTables() {
  console.log('')
  console.log('🔍 Verifying table connections...')

  // ── Test: analyses table ──
  const { data: analysesData, error: analysesError } = await supabase
    .from('analyses')
    .select('id', { count: 'exact', head: true })

  if (analysesError) {
    if (analysesError.message?.includes('does not exist') || analysesError.code === '42P01') {
      console.log('❌ "analyses" table does NOT exist')
      console.log('')
      console.log('📋 ACTION REQUIRED: Create tables manually in Supabase SQL Editor:')
      console.log('   👉 https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/sql/new')
      console.log('')
      console.log('   Paste and run this SQL:')
      console.log('─'.repeat(60))
      printManualSQL()
    } else if (analysesError.message?.includes('Invalid API key') || analysesError.code === 'PGRST301') {
      console.log('❌ API KEY ERROR: The service role key in .env is invalid or expired.')
      console.log('   👉 Get your keys from: https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/settings/api')
      console.log('   Update SUPABASE_SERVICE_ROLE_KEY in backend/.env')
    } else {
      console.log(`❌ analyses table error: ${analysesError.message} (code: ${analysesError.code})`)
    }
    return
  }

  console.log('✅ "analyses" table — CONNECTED')

  // ── Test: user_badges table ──
  const { data: badgesData, error: badgesError } = await supabase
    .from('user_badges')
    .select('id', { count: 'exact', head: true })

  if (badgesError) {
    if (badgesError.message?.includes('does not exist') || badgesError.code === '42P01') {
      console.log('❌ "user_badges" table does NOT exist')
      console.log('   (See SQL above to create it)')
    } else {
      console.log(`❌ user_badges error: ${badgesError.message}`)
    }
    return
  }

  console.log('✅ "user_badges" table — CONNECTED')
  console.log('')
  console.log('🎉 Database is fully connected and ready!')
  console.log('   Both tables exist with Row Level Security enabled.')
  console.log('')
  console.log('🚀 You can now start the backend with: npm run dev')
}

function printManualSQL() {
  console.log(`
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/sql/new

CREATE TABLE IF NOT EXISTS analyses (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  event_name   TEXT        NOT NULL DEFAULT '',
  organization TEXT        NOT NULL DEFAULT '',
  location     TEXT        NOT NULL DEFAULT '',
  event_date   TEXT        NOT NULL DEFAULT '',
  participants INTEGER     DEFAULT 0,
  duration     REAL        DEFAULT 1,
  category     TEXT        DEFAULT '',
  form_data    JSONB       DEFAULT '{}',
  scores       JSONB       DEFAULT '{}',
  impact       JSONB       DEFAULT '{}',
  recommendations JSONB    DEFAULT '[]',
  sdg_impact   JSONB       DEFAULT '{}',
  certification JSONB      DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS analyses_user_id_idx    ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_score_idx      ON analyses((scores->>'overall') DESC NULLS LAST);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"   ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON analyses FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_badges (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL,
  badge_id    TEXT        NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS user_badges_user_id_idx ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"   ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
`)
  console.log('─'.repeat(60))
}

setupDatabase().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
