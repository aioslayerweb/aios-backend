# Stage 3B.8-E Read-Only Inspection Plan

**Status: preparation only.** This plan does not approve or perform a database
connection, SQL execution, migration, or production change. Inspection target,
owner, PostgreSQL version, role, approval, and capability have not been
provided or verified here.

The governing requirements are in
[the Stage 3B.8-C ownership contract](../stage-3b-8-c/ownership-contract.md):
one owner per business customer, separate business-activity and
operational-telemetry domains, no guessed ownership, tenant-specific
intelligence by default, and separate approval for any next stage.

## Phase A — Establish the inspection target

Complete these fields only after explicit approval and independent
identification. Do not infer values from local environment variable names,
example configuration, repository remotes, or previous reports.

| Field | Value |
|---|---|
| Target environment identifier (non-secret project/environment name and independently verified project reference) | Not established |
| Responsible database owner | Not established |
| Approved inspection purpose | Not approved |
| Approval date | Not approved |
| Approved scope and query set | Not approved |
| PostgreSQL version and confirmation method | Not verified |
| Inspection role identity verified out of band | Not verified |
| Read-only privileges and catalog visibility verified out of band | Not verified |

**Preconditions:** founder authorizes a separate inspection stage; database
owner identifies the environment; target identity and scope are independently
verified; server version is known; a suitable read-only role is verified out
of band.

**Question:** which exact database environment and server version is the
approved target, and who is accountable for the inspection?

**Expected evidence:** non-secret environment identifier, named accountable
owner, written scope/approval, version evidence, and verification method.

**Missing result may mean:** the target or approval has not been supplied, or
the operator cannot see the evidence. It does not establish a default or
production environment.

**Cannot prove:** that a local configuration points to that environment, that
any repository migration was applied, or that production behavior is secure.

**Separate approval:** yes. No query or connection is authorized by this plan.

## Phase B — Verify read-only access out of band

Before a future operator connects, the database owner must verify outside this
chat:

- The exact inspection role and exact target environment.
- That the role cannot write data or change schema, grants, policies,
  functions, triggers, or migration state within the approved scope.
- That it cannot bypass those restrictions through elevated role membership,
  ownership, superuser, `BYPASSRLS`, or other privileges.
- That the role has enough metadata visibility for the approved questions.
  Lack of visibility must be reported as unknown, not as absence.
- That query results and any optional aggregates are limited to the approved
  information and operational cost.
- That the role does not require or receive application service-role
  credentials.

**Preconditions:** Phase A complete; database owner has independently verified
the role and restrictions; inspection purpose and scope are written down.

**Question:** can this exact role perform only the approved read-only
inspection, without an elevated path that changes database state?

**Expected evidence:** out-of-band role/privilege review and an approved
statement of catalog visibility. Do not copy credentials, tokens, or
connection strings into chat or this report.

**Missing result may mean:** privileges or role membership cannot be
independently established. This is not proof the role is safe or unsafe.

**Cannot prove:** business-level ownership, application authorization, or
whether an application service role bypasses the inspection role's controls.

**Separate approval:** yes. “Read-only” in a role name or description is not
verification.

## Phase C — Future execution of individually approved queries

All SQL files below remain source text only in this stage. Each query or
template must be approved individually for the target, role, output, and cost.
Optional count queries are not a default batch. A future operator must stop if
preconditions are not satisfied.

| File | Preconditions | Question and expected evidence | Missing-result interpretation | Cannot prove | Separate query/cost approval |
|---|---|---|---|---|---|
| `01_catalog_inventory.sql` | Phases A and B; approved schema scope; metadata visibility; confirmed PostgreSQL compatibility. | Which listed relations are visible, and what are their visible columns, types, defaults, constraints, indexes, owners, and RLS flags? Includes metadata for `auth.users`; no user rows. | Object may be absent, outside the query's fixed inventory, or hidden by role/schema visibility. | Ownership correctness or population; a foreign key does not establish trustworthy historical assignment. | Yes, review each statement and expected catalog output. |
| `02_migration_history.sql` | Approved history schema/relation scope; first metadata result confirms the expected relation and columns are visible. | Is the expected Supabase migration-history relation visible, and if separately approved, what version/name entries does it report? | Relation may be absent, use another tracking mechanism, or be invisible. | That the history is complete/authoritative or that it exactly describes current schema. | Yes. The optional applied-version query requires separate approval. |
| `03_rls_and_grants.sql` | Confirmed target version (the ACL functions assume PostgreSQL 9.6+); role/catalog visibility understood; exact roles/tables approved. | What policies, stored ACL entries (including visible `PUBLIC`), named-role privilege probe results, role attributes, and direct membership edges are visible? | Missing roles/rows may indicate limited visibility or absence; neither is a verified negative permission result. | Complete effective access, RLS row results, transitive role semantics, application authorization, or service-role query scoping. | Yes, review every statement and role/table scope. |
| `04_ownership_aggregates.sql` | Exact schema prerequisites independently confirmed; target and aggregate scope explicitly approved; query cost reviewed; read-only role confirmed. | What approved aggregate counts describe null/missing/mismatched organization references in selected tables? | Template may not apply because tables or columns differ, or may be too costly. | Whether any assignment is historically correct or supported by authoritative evidence. | Yes, each optional aggregate separately; no batching by default. |

**Result handling:** return only approved schema/policy metadata and aggregate
counts. Do not retrieve record-level customer, user, or event rows. Never
include credentials or unnecessary personal data.

## Phase D — Reconcile evidence against the ownership contract

A separate analysis after approved evidence collection must distinguish:

- Customer schema structure from trustworthy customer ownership.
- Business activity events from operational telemetry; do not infer table
  semantics from names alone.
- Tenant-specific intelligence from explicitly shared demo/platform content.
- Stored ACL entries from default privileges, ownership, role inheritance,
  RLS behavior, and application authorization.
- Migration-history evidence from proof of the currently deployed schema.
- Visible catalog objects from objects that may be hidden by the inspection
  role's limited visibility.

Do not classify an entity as safely tenant-scoped merely because it has an
`organization_id` column. A read-only schema inspection can establish visible
structure and policy evidence; it cannot establish historical ownership
provenance. Legacy customer/event ownership requires separately identified
authoritative evidence and an accountable review process. If that evidence is
not available, preserve the approved deny/quarantine rule.

## Phase E — Stop conditions

Stop without querying, and report the blocker, if:

- Target environment or inspection purpose cannot be independently identified.
- Founder approval or database-owner scope approval is absent.
- Read-only privileges or elevated role paths cannot be verified.
- PostgreSQL version is unknown or incompatible with the toolkit assumptions.
- Catalog visibility is insufficient to answer a question.
- A query's read-only status, expected output, cost, or operational impact is
  uncertain.
- Results reveal an unexpected schema, privilege, policy, or ownership issue
  outside approved scope.

Do not widen scope or attempt a workaround. A discrepancy or missing result
requires separate approval before further inspection.

## Next-stage gate

Any read-only inspection is a separate stage and requires explicit approval.
Completing this plan does not authorize a connection or SQL execution. After
approved evidence collection, a separate analysis must determine whether the
canonical ownership model is structurally supported and whether authoritative
legacy ownership evidence exists. Tenant-isolation implementation remains
blocked until ownership, data classification, related-record consistency, and
route-to-query scope are resolved.
