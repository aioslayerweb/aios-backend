# Proposed canonical ownership model

**Status:** architecture proposal only. Fields, constraints, RLS policies, and
migration steps below are recommendations—not statements about any deployed
database. No database was accessed for this proposal.

## Verified repository facts

- Tracked migrations define `organizations` with a UUID key.
- The business-memory migration defines a customer shape with nullable
  `organization_id`, unique email, and first/last name.
- A later tracked migration defines a different customer shape with company,
  contact, financial, health, churn, and summary fields, but no organization
  key. Both use `CREATE TABLE IF NOT EXISTS`; that does not merge their columns.
- Current customer services read `company_name`, health/churn fields, lifecycle,
  summary, annual revenue, and contract value.
- The local, untracked membership migration links Supabase Auth UUIDs to
  organization UUIDs. The actual deployed schema and migration status are
  unknown.
- Tracked migrations do not define `events`, `aios_events`, `user_insights`,
  `users`, `customer_timeline`, or `business_insights`.
- FastAPI creates a service-role Supabase client. Express persistence uses an
  anon-key client. Their actual database privileges and policies are unknown.

## Customer recommendation

Adopt one canonical tenant-owned customer entity after reconciling the deployed
schema and legacy data. A proposed shape should retain all fields referenced by
current code:

- UUID primary key.
- Mandatory `organization_id` foreign key for all newly created tenant
  customers.
- `company_name`, `contact_name`, optional contact email/phone, industry and
  country.
- Lifecycle stage, health score, churn risk, and AI summary.
- Annual revenue and contract value.
- Created and updated timestamps.

The earlier tracked customer migration also declares `first_name` and
`last_name`. The proposed field list above does not replace or silently map
those legacy fields: retain them during any transition unless and until a
founder-approved compatibility and migration decision establishes their
disposition. Current application consumers identified in this review use the
later company/contact-oriented shape; that is not evidence that legacy name
data is unused or safe to discard. Any deprecation, merge into `contact_name`,
or data migration requires explicit compatibility review and approval.

The proposal should include an index on `organization_id` and query access
patterns. If a business rule requires email uniqueness, prefer
organization-scoped uniqueness only after founder approval of whether a person
or company may be represented more than once within an organization. Do not use
globally unique email as proof of tenant ownership: contacts may work across
organizations, share addresses, change addresses, or be imported without a
verified organization relationship.

For `deals`, `meetings`, and other customer-owned records, preserve the
customer foreign key and ensure an organization cannot reference a customer
owned by a different organization. A composite constraint involving
`(organization_id, customer_id)` is one possible design, subject to schema and
migration review.

Legacy rows without verified ownership must remain inaccessible to tenant
users. Ownership assignment requires an authoritative source and an auditable
review trail; never derive it from names or email.

### Customer source consumers requiring compatibility review

- [services/customer_engine.py](/workspaces/aios-backend/services/customer_engine.py:6)
- [services/customer_ai.py](/workspaces/aios-backend/services/customer_ai.py:6)
- [services/churn_model.py](/workspaces/aios-backend/services/churn_model.py:1)
- `main.py` customer routes
- [supabase/migrations/20260701100000_create_customers_table.sql](/workspaces/aios-backend/supabase/migrations/20260701100000_create_customers_table.sql:16)
- [supabase/migrations/20260615190000_create_business_memory.sql](/workspaces/aios-backend/supabase/migrations/20260615190000_create_business_memory.sql:24)

The deployed shape must be inspected before deciding which migration or code
shape to retain.

## Event model: keep business events distinct from runtime telemetry

Do not automatically merge `events` and `aios_events`.

### Business activity events

Treat events used for customer analytics, churn, insights, or decisions as
tenant business data. Proposed requirements:

- Derive `organization_id` from verified identity and active membership on the
  server.
- Derive actor user ID from verified identity, not request input.
- Reject client-supplied identity fields as authorization evidence.
- Apply `business.create` at ingestion and `business.read` at reads.
- Scope every query by authorized organization.
- Keep `user_email` only if a documented product need exists; do not use it to
  resolve ownership.
- Make event-to-owner relationships auditable and constrained where the data
  model supports it.

### Operational telemetry and replay

Treat runtime errors, execution traces, debug data, and orchestration events as
platform-internal by default. The current `aios_events` contract centers on
`context_id`, not user or organization ownership. A context ID is a grouping
key, not authorization.

If a product decision allows organization-visible telemetry, add a
server-derived organization association and explicit redaction/access rules.
Debug payloads should remain platform-internal unless separately reviewed.
Keep operational telemetry separate from business activity unless a reviewed
event contract and retention model justify a shared storage layer.

## Related records, insights, and direct clients

- `business_memory` should have an explicit ownership class: tenant memory,
  user-private memory, or platform memory. Its free-form entity/user fields do
  not prove ownership.
- `user_insights` should use a verified user relationship and, for
  organization-derived insights, an explicit organization owner.
- `kpi_metrics`, `ai_insights`, and `insights` currently have no organization
  owner in tracked definitions. The founder must classify them as shared
  platform/demo material or tenant-specific data.
- `business_insights` is referenced by frontend code but has no tracked
  definition. Confirm whether it exists and what it represents.
- Browser direct-Supabase reads must be reviewed independently from FastAPI.
  Tenant-owned rows require appropriate RLS based on verified auth identity and
  active membership; public platform/demo rows should be separated from tenant
  data.
- Server-side authorization and query scoping remain mandatory for service-role
  requests because service-role access bypasses ordinary RLS enforcement.
  RLS is complementary defense in depth, not a substitute for scoped server
  queries.

## Migration and backfill principles

1. Confirm actual deployed schema and migration history before designing DDL.
2. Preserve all legacy fields still consumed by code until consumers are
   deliberately migrated.
3. Require authoritative source evidence for each ownership assignment.
4. Quarantine or deny unowned and ambiguous rows; do not bulk-assign them.
5. Record actor, timestamp, evidence source, and prior/new owner for every
   approved ownership change.
6. Reconcile counts before/after, including null ownership, missing parents,
   mismatched organization/customer pairs, and quarantined rows.
7. Preserve legacy data and document a rollback/restore plan.
8. Validate constraints, indexes, RLS, application query behavior, and rollback
   in a disposable synthetic environment before any deployment request.

## Founder decisions required

- Which customer schema/source is canonical, and what authoritative source
  establishes ownership of existing rows?
- Are `events` and `aios_events` different domains? Which event classes may be
  exposed to organization users?
- Are KPI and insight tables shared demo/platform data or tenant-owned data?
- Which historical rows lack sufficient evidence and must remain quarantined?
- What contact-email uniqueness rules reflect the actual product behavior?
