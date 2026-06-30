/*
  # AIOS Customer Intelligence

  ## Summary
  Introduces the core customers table for AIOS.

  Future modules will build upon this:
  - Customer Health
  - Customer Timeline
  - AI Recommendations
  - Revenue Forecasting
  - Executive Dashboard

*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  company_name text NOT NULL,

  contact_name text,

  email text,

  phone text,

  industry text,

  country text,

  annual_revenue numeric DEFAULT 0,

  contract_value numeric DEFAULT 0,

  lifecycle_stage text DEFAULT 'lead',

  health_score integer DEFAULT 75,

  churn_risk text DEFAULT 'low',

  ai_summary text,

  created_at timestamptz DEFAULT now(),

  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read customers"
ON customers
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can insert customers"
ON customers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
ON customers
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO customers
(
    company_name,
    contact_name,
    email,
    industry,
    country,
    annual_revenue,
    contract_value,
    lifecycle_stage,
    health_score,
    churn_risk,
    ai_summary
)
VALUES
(
    'Acme Corporation',
    'Sarah Johnson',
    'sarah@acme.com',
    'Manufacturing',
    'United States',
    4200000,
    25000,
    'customer',
    92,
    'low',
    'Strong engagement. Upsell opportunity detected.'
),
(
    'Globex',
    'Michael Smith',
    'michael@globex.com',
    'Technology',
    'United Kingdom',
    1800000,
    12000,
    'customer',
    61,
    'medium',
    'Reduced product usage during last 30 days.'
),
(
    'Initech',
    'Peter Gibbons',
    'peter@initech.com',
    'Software',
    'Estonia',
    900000,
    8000,
    'prospect',
    44,
    'high',
    'Pricing viewed multiple times but no conversion.'
)
ON CONFLICT DO NOTHING;