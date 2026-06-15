/*
  AIOS Business Memory V1

  Core memory entities for AIOS.

  Every business event becomes a persistent memory.

  Tables:
  - organizations
  - customers
  - employees
  - deals
  - meetings
  - business_memory
*/

CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    industry text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid REFERENCES organizations(id),
    email text UNIQUE,
    first_name text,
    last_name text,
    lifecycle_stage text DEFAULT 'lead',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid REFERENCES organizations(id),
    email text UNIQUE,
    first_name text,
    last_name text,
    role text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id),
    title text NOT NULL,
    value numeric DEFAULT 0,
    stage text DEFAULT 'open',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id),
    title text NOT NULL,
    meeting_date timestamptz,
    summary text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_memory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type text NOT NULL,
    entity_id text,

    event_name text NOT NULL,

    user_id text,
    user_email text,

    memory_payload jsonb DEFAULT '{}'::jsonb,

    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_user
ON business_memory(user_id);

CREATE INDEX IF NOT EXISTS idx_memory_event
ON business_memory(event_name);

CREATE INDEX IF NOT EXISTS idx_memory_entity
ON business_memory(entity_type, entity_id);