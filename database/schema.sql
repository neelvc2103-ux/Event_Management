-- AYOJA Database Schema for Supabase & Vercel Postgres (Neon)
-- Copy and run this in your Supabase SQL Editor or Vercel Storage Postgres Query Console

CREATE TABLE IF NOT EXISTS event_plans (
  id VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  event_date DATE,
  guest_count INTEGER,
  total_budget NUMERIC,
  plan_data JSONB NOT NULL
);

-- Index for fast lookup by updated date and city
CREATE INDEX IF NOT EXISTS idx_event_plans_created_at ON event_plans (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_plans_city ON event_plans (city);

-- Row Level Security (RLS) - Enable if using Supabase public client
ALTER TABLE event_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access for shared plans by ID
CREATE POLICY "Allow public read access for shared plans"
  ON event_plans FOR SELECT
  USING (true);

-- Allow inserting plans
CREATE POLICY "Allow public insert of plans"
  ON event_plans FOR INSERT
  WITH CHECK (true);

-- Allow updating existing plans
CREATE POLICY "Allow public update of plans"
  ON event_plans FOR UPDATE
  USING (true);

