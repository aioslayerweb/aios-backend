/*
 * INSPECTION ONLY — NOT YET APPROVED FOR EXECUTION.
 * NEVER RUN AGAINST ANY DATABASE DURING STAGE 3B.7.
 * Before any future execution, review the target environment, role privileges,
 * query plan, catalog visibility, and expected load with the database owner.
 * This file contains SELECT statements only: no DDL, DML, session changes,
 * temporary objects, or application-function calls.
 */

-- First inspect whether the expected Supabase migration-history relation and
-- its version/name columns are visible to the current inspection role.
SELECT
    tables.table_schema,
    tables.table_name,
    columns.column_name,
    columns.data_type,
    columns.is_nullable
FROM information_schema.tables AS tables
LEFT JOIN information_schema.columns AS columns
    ON columns.table_schema = tables.table_schema
   AND columns.table_name = tables.table_name
WHERE tables.table_schema = 'supabase_migrations'
  AND tables.table_name = 'schema_migrations'
ORDER BY columns.ordinal_position;

/*
 * Only after the query above confirms that the relation and both columns exist
 * and are visible, a database owner may separately approve and run this
 * read-only query. Do not run it otherwise.
 *
 * SELECT version, name
 * FROM supabase_migrations.schema_migrations
 * ORDER BY version;
 *
 * If the history relation is absent or invisible, that result does not prove
 * that no migrations were applied. Record the limitation and ask the database
 * owner to identify the authoritative migration-tracking mechanism.
 */
