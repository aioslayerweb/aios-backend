/*
 * INSPECTION ONLY — NOT YET APPROVED FOR EXECUTION.
 * NEVER RUN AGAINST ANY DATABASE DURING STAGE 3B.7.
 * Before any future execution, review the target environment, role privileges,
 * query plan, catalog visibility, and expected load with the database owner.
 * This file contains SELECT statements only: no DDL, DML, session changes,
 * temporary objects, or application-function calls.
 *
 * PostgreSQL assumptions: the ACL queries use aclexplode(), available since
 * PostgreSQL 9.6. Confirm compatibility with the target server before use.
 * Catalog visibility is role-dependent. ACL entries show stored ACL state, not
 * necessarily whether a grant was issued explicitly or originated in default
 * privileges. A NULL ACL means PostgreSQL's built-in default applies.
 */

-- Policies visible through PostgreSQL's catalog view. Visibility depends on
-- the inspection role and does not by itself establish effective access.
SELECT
    policies.schemaname,
    policies.tablename,
    policies.policyname,
    policies.permissive,
    policies.roles,
    policies.cmd,
    policies.qual AS using_expression,
    policies.with_check AS with_check_expression
FROM pg_policies AS policies
WHERE policies.schemaname = 'public'
  AND policies.tablename IN (
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
ORDER BY policies.tablename, policies.policyname;

-- Stored table ACL entries visible to this role, including PUBLIC (grantee OID
-- 0) where present in the ACL. The owner is reported separately because owner
-- privileges are not fully represented by ordinary grant entries. ACL entries
-- do not identify whether a grant came from an explicit GRANT or default
-- privileges. A NULL relacl means PostgreSQL's built-in default applies.
SELECT
    namespace.nspname AS table_schema,
    relation.relname AS table_name,
    pg_get_userbyid(relation.relowner) AS owner_name,
    relation.relacl IS NULL AS uses_default_acl,
    CASE
        WHEN acl.grantee IS NULL THEN 'no stored ACL entry'
        WHEN acl.grantee = 0 THEN 'PUBLIC ACL entry'
        WHEN acl.grantee = relation.relowner THEN 'owner ACL entry'
        ELSE 'role ACL entry'
    END AS acl_entry_kind,
    CASE WHEN acl.grantee = 0 THEN 'PUBLIC'
         ELSE pg_get_userbyid(acl.grantee)
    END AS acl_grantee,
    pg_get_userbyid(acl.grantor) AS grantor_name,
    acl.privilege_type,
    acl.is_grantable
FROM pg_class AS relation
JOIN pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
LEFT JOIN LATERAL aclexplode(relation.relacl) AS acl
    ON relation.relacl IS NOT NULL
WHERE namespace.nspname = 'public'
  AND relation.relkind IN ('r', 'p', 'v', 'm')
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
ORDER BY relation.relname, acl.grantee, acl.privilege_type;

-- Stored schema ACL entries, including PUBLIC (grantee OID 0) where present.
-- As above, an ACL entry does not prove whether it came from an explicit GRANT
-- or default privileges. The schema owner is shown separately.
SELECT
    namespace.nspname AS schema_name,
    pg_get_userbyid(namespace.nspowner) AS owner_name,
    namespace.nspacl IS NULL AS uses_default_acl,
    CASE
        WHEN acl.grantee IS NULL THEN 'no stored ACL entry'
        WHEN acl.grantee = 0 THEN 'PUBLIC ACL entry'
        WHEN acl.grantee = namespace.nspowner THEN 'owner ACL entry'
        ELSE 'role ACL entry'
    END AS acl_entry_kind,
    CASE WHEN acl.grantee = 0 THEN 'PUBLIC'
         ELSE pg_get_userbyid(acl.grantee)
    END AS acl_grantee,
    pg_get_userbyid(acl.grantor) AS grantor_name,
    acl.privilege_type,
    acl.is_grantable
FROM pg_namespace AS namespace
LEFT JOIN LATERAL aclexplode(namespace.nspacl) AS acl
    ON namespace.nspacl IS NOT NULL
WHERE namespace.nspname IN ('public', 'auth', 'supabase_migrations')
ORDER BY namespace.nspname, acl.grantee, acl.privilege_type;

-- Named-role privilege probes. has_schema_privilege()/has_table_privilege()
-- include privileges inherited through role membership, PUBLIC, ownership,
-- and superuser status. These probes report privilege checks only; they do not
-- establish row access, RLS outcomes, or application-level effective access.
-- Roles absent from pg_roles or not visible to the inspection role produce no
-- probe rows; absence is not a verified negative privilege result.
WITH target_roles(role_name) AS (
    VALUES ('anon'), ('authenticated'), ('service_role'), (current_user)
)
SELECT
    roles.rolname AS role_name,
    namespace.nspname AS schema_name,
    has_schema_privilege(roles.oid, namespace.oid, 'USAGE') AS has_usage,
    has_schema_privilege(roles.oid, namespace.oid, 'CREATE') AS has_create
FROM target_roles AS target
JOIN pg_roles AS roles
    ON roles.rolname = target.role_name
CROSS JOIN pg_namespace AS namespace
WHERE namespace.nspname IN ('public', 'auth', 'supabase_migrations')
ORDER BY roles.rolname, namespace.nspname;

WITH target_roles(role_name) AS (
    VALUES ('anon'), ('authenticated'), ('service_role'), (current_user)
),
target_tables AS (
    SELECT relation.oid, relation.relname
    FROM pg_class AS relation
    JOIN pg_namespace AS namespace
        ON namespace.oid = relation.relnamespace
    WHERE namespace.nspname = 'public'
      AND relation.relkind IN ('r', 'p', 'v', 'm')
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
),
privileges(privilege_name) AS (
    VALUES
        ('SELECT'),
        ('INSERT'),
        ('UPDATE'),
        ('DELETE'),
        ('REFERENCES'),
        ('TRIGGER'),
        ('TRUNCATE')
)
SELECT
    roles.rolname AS role_name,
    tables.relname AS table_name,
    privileges.privilege_name,
    has_table_privilege(roles.oid, tables.oid, privileges.privilege_name)
        AS has_privilege
FROM target_roles AS target
JOIN pg_roles AS roles
    ON roles.rolname = target.role_name
CROSS JOIN target_tables AS tables
CROSS JOIN privileges
ORDER BY roles.rolname, tables.relname, privileges.privilege_name;

-- Role attributes and membership paths visible to the inspection role.
-- Catalog visibility may be restricted; absence from results is not proof of
-- absence in the cluster.
SELECT
    roles.rolname AS role_name,
    roles.rolsuper AS is_superuser,
    roles.rolbypassrls AS bypasses_rls,
    roles.rolinherit AS inherits_privileges,
    roles.rolcanlogin AS can_login
FROM pg_roles AS roles
WHERE roles.rolname IN (
    'anon',
    'authenticated',
    'service_role',
    current_user
)
ORDER BY roles.rolname;

-- Direct membership edges only; this does not recursively expand transitive
-- memberships. Role inheritance and privilege probes above require separate
-- interpretation, and this output is not a complete effective-access result.
SELECT
    member_role.rolname AS member_role,
    granted_role.rolname AS granted_role,
    membership.admin_option
FROM pg_auth_members AS membership
JOIN pg_roles AS granted_role
    ON granted_role.oid = membership.roleid
JOIN pg_roles AS member_role
    ON member_role.oid = membership.member
WHERE member_role.rolname IN (
    'anon',
    'authenticated',
    'service_role',
    current_user
)
   OR granted_role.rolname IN (
    'anon',
    'authenticated',
    'service_role',
    current_user
)
ORDER BY member_role.rolname, granted_role.rolname;

/*
 * A visible policy is not proof that it applies to every request. ACL entries,
 * owners, inherited roles, and privilege probes are distinct evidence; none
 * alone computes actual effective access. A complete conclusion requires
 * BYPASSRLS, forced RLS, all applicable permissive/restrictive policies,
 * security-definer functions, views, and the actual connection role to be
 * reviewed together.
 */
