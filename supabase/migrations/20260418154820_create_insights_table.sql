/*
  # Create Insights Table

  1. New Tables
    - `insights`
      - `id` (uuid, primary key)
      - `type` (text: Risk, Opportunity, Alert)
      - `title` (text)
      - `description` (text)
      - `impact_score` (integer: 1-100)
      - `confidence_score` (integer: 1-100)
      - `status` (text: active, resolved, ignored)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `insights` table
    - Add policy for authenticated users to read all insights
*/

CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('Risk', 'Opportunity', 'Alert')),
  title text NOT NULL,
  description text NOT NULL,
  impact_score integer NOT NULL CHECK (impact_score >= 1 AND impact_score <= 100),
  confidence_score integer NOT NULL CHECK (confidence_score >= 1 AND confidence_score <= 100),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view insights"
  ON insights FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update insights"
  ON insights FOR UPDATE
  TO authenticated
  WITH CHECK (true);
