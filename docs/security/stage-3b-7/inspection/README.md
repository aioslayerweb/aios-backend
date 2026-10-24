# Stage 3B.7 read-only Supabase inspection toolkit

## Status and safety

These SQL files are **inspection-only source for future human review**. They
are **not approved for execution** and must not be run against any database
during Stage 3B.7. No database access or SQL execution occurred while preparing
them.

Before any future use, the database owner and security reviewer must:

1. Identify the project/environment using an approved, non-secret identifier.
2. Confirm a separately approved read-only role and its effective privileges.
3. Review the exact query, expected catalog visibility, query plan, and likely
   scan cost.
4. Approve each query and run it individually. Do not batch optional aggregate
   queries against large tables without a load review.
5. Redact connection details and never return record-level customer, user,
   employee, or event data.

Do not paste credentials or connection strings into chat. Do not use the
Supabase CLI to link, pull, push, or alter a remote project. None of these files
prove production security or the deployed database state.

## Files

- `01_catalog_inventory.sql`: relation existence/type, columns, nullability,
  defaults, constraints, indexes, visible owner, and RLS flags for known
  application tables.
- `02_migration_history.sql`: checks whether the expected
  `supabase_migrations.schema_migrations` metadata is visible; the applied
  version/name query is a commented optional query and must only be used after
  the metadata query confirms the table and columns.
- `03_rls_and_grants.sql`: visible policies, table/schema grants, role
  attributes, and role memberships. These are not by themselves a complete
  effective-permission calculation.
- `04_ownership_aggregates.sql`: commented count-only query templates. They
  require explicit confirmation of actual schema prerequisites and a separate
  load review before use.

## Interpretation cautions

- A missing catalog result may mean the object does not exist, or that the
  inspection role cannot see it.
- The ACL inspection uses PostgreSQL's `aclexplode()`, available since
  PostgreSQL 9.6. The target server version has not been verified and must be
  confirmed before future use.
- Catalog visibility depends on the inspection role and server privileges.
  Missing rows or invisible objects do not by themselves prove that a role,
  table, policy, grant, or privilege does not exist.
- Stored ACL entries, default privileges, object ownership, role inheritance,
  RLS behavior, and application-level authorization are distinct
  considerations. A named-role privilege probe is not a complete effective
  access determination and does not establish RLS row access or application
  authorization.
- Read-only schema metadata cannot establish trustworthy ownership of
  historical business records.
- A repository migration is not proof it was applied. An absent migration
  history table is not proof migrations were never applied.
- A declared/visible RLS policy does not prove effective isolation. Table
  ownership, `BYPASSRLS`, forced RLS, role inheritance, grants, views, and
  security-definer code matter.
- A non-null `organization_id` or matching foreign key proves structural
  linkage only. It does not prove that historical ownership was assigned from
  an authoritative source.
- Never map ownership using emails, names, client-supplied IDs, event/context
  IDs, or guesses.
