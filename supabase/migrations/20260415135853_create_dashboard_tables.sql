/*
  # Create Dashboard Tables

  ## Summary
  Sets up the core data tables for the AIOS Layer SaaS dashboard.

  ## New Tables

  ### 1. kpi_metrics
  Stores KPI snapshot data per period.
  - `id` (uuid, primary key)
  - `metric_name` (text) - e.g., "revenue", "deals", "conversion"
  - `value` (numeric) - the raw metric value
  - `change_percent` (numeric) - percentage change vs prior period
  - `period` (text) - label like "This month", "Q4 2024"
  - `created_at` (timestamptz)

  ### 2. ai_insights
  Stores AI-generated insight cards shown on the dashboard.
  - `id` (uuid, primary key)
  - `title` (text) - short insight headline
  - `body` (text) - full insight description
  - `action_label` (text) - CTA button text
  - `action_type` (text) - type of action (task, webhook, notification)
  - `priority` (text) - high | medium | low
  - `is_active` (boolean) - whether to display this insight
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Anon users can read kpi_metrics and active ai_insights (dashboard is read-only for now)

  ## Seed Data
  - 3 KPI metrics (Revenue, Deals, Conversion)
  - 3 sample AI insights
*/

CREATE TABLE IF NOT EXISTS kpi_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  change_percent numeric NOT NULL DEFAULT 0,
  period text NOT NULL DEFAULT 'This month',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read kpi_metrics"
  ON kpi_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert kpi_metrics"
  ON kpi_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update kpi_metrics"
  ON kpi_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  action_label text NOT NULL DEFAULT 'Take Action',
  action_type text NOT NULL DEFAULT 'notification',
  priority text NOT NULL DEFAULT 'medium',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active ai_insights"
  ON ai_insights FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert ai_insights"
  ON ai_insights FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ai_insights"
  ON ai_insights FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO kpi_metrics (metric_name, value, change_percent, period) VALUES
  ('Revenue', 128400, 12.4, 'This month vs last'),
  ('Deals', 47, 8.1, 'This month vs last'),
  ('Conversion', 24.6, -2.3, 'This month vs last')
ON CONFLICT DO NOTHING;

INSERT INTO ai_insights (title, body, action_label, action_type, priority, is_active) VALUES
  (
    'Revenue spike detected in Enterprise tier',
    'Enterprise plan revenue is up 34% this week. Consider launching a targeted upsell campaign to maximize the momentum before the quarter ends.',
    'Create Campaign',
    'task',
    'high',
    true
  ),
  (
    'Lead response time is above threshold',
    '3 high-value leads have not received a follow-up in over 48 hours. Faster responses increase close rates by up to 21%.',
    'Send Follow-ups',
    'webhook',
    'medium',
    true
  ),
  (
    'Conversion rate dropped this week',
    'Week-over-week conversion has fallen 2.3%. The AI model suggests this correlates with recent pricing page changes.',
    'View Analysis',
    'notification',
    'medium',
    true
  )
ON CONFLICT DO NOTHING;
