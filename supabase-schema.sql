-- ============================================================
-- EcoEvent AI - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/lpzsohndlzpalrgvvzqi/sql/new
-- ============================================================

-- 1. Analyses table - stores all event analyses
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Users can only read their own analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analyses
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Badges table - tracks earned badges per user
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Leaderboard view - public read-only (GRANT SELECT with anon)
-- Note: This view respects RLS on the underlying 'analyses' table,
-- so when queried via REST API with anon key, it returns empty.
-- Use the get_leaderboard() function below for public API access.
DROP VIEW IF EXISTS leaderboard;
CREATE VIEW leaderboard AS
SELECT 
  id,
  user_id,
  event_name,
  organization,
  scores->>'overall'::TEXT AS score,
  created_at,
  certification->>'level' AS certification_level,
  ROW_NUMBER() OVER (ORDER BY (scores->>'overall')::INT DESC) AS rank
FROM analyses
WHERE scores->>'overall' IS NOT NULL;

-- Grant public read access to leaderboard
GRANT SELECT ON leaderboard TO anon, authenticated;

-- 4. Function to get global stats (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_analyses INT;
  avg_score NUMERIC;
  total_carbon_saved NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_analyses FROM analyses;
  SELECT COALESCE(AVG((scores->>'overall')::INT), 0) INTO avg_score FROM analyses;
  SELECT COALESCE(SUM((impact->>'reduction')::NUMERIC), 0) INTO total_carbon_saved FROM analyses;
  
  RETURN json_build_object(
    'total_analyses', total_analyses,
    'avg_score', ROUND(avg_score),
    'carbon_saved', ROUND(total_carbon_saved::NUMERIC, 1)
  );
END;
$$;

-- 5. Function to get leaderboard (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INT DEFAULT 50)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT 
      id,
      user_id,
      event_name,
      organization,
      scores->>'overall'::TEXT AS score,
      created_at,
      certification->>'level' AS certification_level,
      ROW_NUMBER() OVER (ORDER BY (scores->>'overall')::INT DESC) AS rank
    FROM analyses
    WHERE scores->>'overall' IS NOT NULL
    ORDER BY (scores->>'overall')::INT DESC
    LIMIT limit_count
  ) t;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$;

-- Grant execute permission to anon so the public API can call it
GRANT EXECUTE ON FUNCTION get_leaderboard(INT) TO anon, authenticated;
