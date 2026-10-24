/*
 * INSPECTION ONLY — NOT YET APPROVED FOR EXECUTION.
 * NEVER RUN AGAINST ANY DATABASE DURING STAGE 3B.7.
 * Before any future execution, review the target environment, role privileges,
 * query plan, catalog visibility, and expected load with the database owner.
 * This file contains SELECT statements only: no DDL, DML, session changes,
 * temporary objects, or application-function calls. The auth.users inventory
 * below reads metadata only, never user records or authentication data.
 */

-- 0. Schema existence and owner visibility.
WITH target_schemas(schema_name) AS (
    VALUES
        ('public'),
        ('auth'),
        ('supabase_migrations')
)
SELECT
    target.schema_name,
    namespace.oid IS NOT NULL AS schema_visible,
    pg_get_userbyid(namespace.nspowner) AS visible_owner_name
FROM target_schemas AS target
LEFT JOIN pg_namespace AS namespace
    ON namespace.nspname = target.schema_name
ORDER BY target.schema_name;

-- 1. Existence, schema, relation kind, owner visibility, and RLS flags.
WITH target_tables(schema_name, table_name) AS (
    VALUES
        ('public', 'organizations'),
        ('auth', 'users'),
        ('public', 'organization_memberships'),
        ('public', 'organization_membership_audit'),
        ('public', 'employees'),
        ('public', 'customers'),
        ('public', 'deals'),
        ('public', 'meetings'),
        ('public', 'business_memory'),
        ('public', 'events'),
        ('public', 'aios_events'),
        ('public', 'user_insights'),
        ('public', 'users'),
        ('public', 'customer_timeline'),
        ('public', 'insights'),
        ('public', 'kpi_metrics'),
        ('public', 'ai_insights'),
        ('public', 'business_insights')
)
SELECT
    target.schema_name,
    target.table_name,
    relation.relkind AS relation_kind_code,
    CASE relation.relkind
        WHEN 'r' THEN 'ordinary table'
        WHEN 'p' THEN 'partitioned table'
        WHEN 'v' THEN 'view'
        WHEN 'm' THEN 'materialized view'
        ELSE NULL
    END AS relation_kind,
    pg_get_userbyid(relation.relowner) AS visible_owner_name,
    relation.relrowsecurity AS rls_enabled,
    relation.relforcerowsecurity AS rls_forced
FROM target_tables AS target
LEFT JOIN pg_namespace AS namespace
    ON namespace.nspname = target.schema_name
LEFT JOIN pg_class AS relation
    ON relation.relnamespace = namespace.oid
   AND relation.relname = target.table_name
   AND relation.relkind IN ('r', 'p', 'v', 'm')
ORDER BY target.schema_name, target.table_name;

-- 2. Column names and types only; no row contents are selected. Metadata
-- visibility varies by role; missing auth.users rows here do not prove the
-- table or its columns are absent.
SELECT
    columns.table_schema,
    columns.table_name,
    columns.ordinal_position,
    columns.column_name,
    columns.data_type,
    columns.udt_schema,
    columns.udt_name,
    columns.is_nullable,
    columns.column_default
FROM information_schema.columns AS columns
WHERE (
      columns.table_schema = 'public'
      AND columns.table_name IN (
      'organizations',
      'organization_memberships',
      'organization_membership_audit',
      'employees',
      'customers',
      'deals',
      'meetings',
      'business_memory',
      'events',
      'aios_events',
      'user_insights',
      'users',
      'customer_timeline',
      'insights',
      'kpi_metrics',
      'ai_insights',
      'business_insights'
  )
  )
   OR (columns.table_schema = 'auth' AND columns.table_name = 'users')
ORDER BY columns.table_schema, columns.table_name, columns.ordinal_position;

-- 3. Primary, foreign-key, unique, check, and exclusion constraints.
SELECT
    namespace.nspname AS schema_name,
    relation.relname AS table_name,
    constraint_info.conname AS constraint_name,
    constraint_info.contype AS constraint_type_code,
    pg_get_constraintdef(constraint_info.oid, true) AS constraint_definition
FROM pg_constraint AS constraint_info
JOIN pg_class AS relation
    ON relation.oid = constraint_info.conrelid
JOIN pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
WHERE (
      namespace.nspname = 'public'
      AND relation.relname IN (
      'organizations',
      'organization_memberships',
      'organization_membership_audit',
      'employees',
      'customers',
      'deals',
      'meetings',
      'business_memory',
      'events',
      'aios_events',
      'user_insights',
      'users',
      'customer_timeline',
      'insights',
      'kpi_metrics',
      'ai_insights',
      'business_insights'
  )
  )
   OR (namespace.nspname = 'auth' AND relation.relname = 'users')
ORDER BY namespace.nspname, relation.relname, constraint_info.conname;

-- 4. Index definitions for the same inventory. Definitions can expose schema
-- expressions, but no record values are returned.
SELECT
    indexes.schemaname AS schema_name,
    indexes.tablename AS table_name,
    indexes.indexname AS index_name,
    indexes.indexdef AS index_definition
FROM pg_indexes AS indexes
WHERE (
      indexes.schemaname = 'public'
      AND indexes.tablename IN (
      'organizations',
      'organization_memberships',
      'organization_membership_audit',
      'employees',
      'customers',
      'deals',
      'meetings',
      'business_memory',
      'events',
      'aios_events',
      'user_insights',
      'users',
      'customer_timeline',
      'insights',
      'kpi_metrics',
      'ai_insights',
      'business_insights'
  )
  )
   OR (indexes.schemaname = 'auth' AND indexes.tablename = 'users')
ORDER BY indexes.schemaname, indexes.tablename, indexes.indexname;
