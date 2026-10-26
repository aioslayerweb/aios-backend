# Synthetic ownership and tenant-isolation validation plan

**Future work only.** No test database or records were created in Stage 3B.7.
Building or using a disposable database requires separate approval and
independent confirmation that it is isolated and contains only synthetic data.

## Proposed fixture

- Organizations `org-A` and `org-B`.
- User `user-A` with active `org_admin` in A and `user-B` with active `member`
  in B.
- Optional second active membership for one user to validate explicit
  organization selection.
- Multiple synthetic customers in each organization.
- One unowned legacy customer that must remain inaccessible.
- Deliberately inconsistent customer-child ownership pair.
- Deals and meetings with valid parents, missing parents, and cross-organization
  parent references.
- Business events associated by server-derived organization and actor.
- Operational telemetry with no tenant owner and a separately defined
  platform-internal access path.
- Synthetic user/event/context/customer IDs designed to test forgery, without
  using values from any real database.

## Test matrix

| Area | Test | Expected result |
|---|---|---|
| Identity | Missing, malformed, expired, or invalidly signed bearer token | Denied before repository access |
| Membership | No active membership; suspended or revoked membership | Denied with no business record data |
| Organization choice | User selects org B without active membership there; repeated or malformed selection | Denied |
| Roles | `org_admin` CRUD; `member` read-only | Admin actions permitted only in authorized org; member writes denied |
| Customers | List/get within active organization | Only rows with matching organization are returned |
| Forgery | User supplies another customer ID or another user ID | No cross-tenant read/write; IDs alone never authorize |
| Legacy | Unowned customer/event | Denied/quarantined, not inferred or automatically assigned |
| Parent integrity | Deal/meeting organization conflicts with customer owner | Constraint rejects write; query does not disclose record |
| Events | Client supplies foreign user, email, org, event, or context identifiers | Authorization scope derives from verified identity; forged identifiers do not alter tenant |
| Telemetry | User guesses another context ID or requests global replay | Denied unless a separately reviewed organization-visible scope applies |
| RLS | anon/authenticated direct table requests for another org | Denied by RLS; own-org behavior matches approved policy |
| Service role | Application query omits organization filter | Test/review detects that privileged access bypasses RLS; endpoint must deny/fix query |
| Reconciliation | Compare before/after totals, owned, unowned, orphaned, mismatched, quarantined counts | Counts reconcile; no records silently dropped or assigned |
| Rollback | Apply migration to synthetic fixture, then exercise approved rollback/restore plan | Original synthetic state is recoverable and ownership decisions remain auditable |

## What can be tested locally now

Offline Python tests validate token verification, membership resolution, the
shared authorization dependency, tenant-scoped FastAPI customer reads, and
fail-closed event-summary routes using synthetic signed tokens, fake
repositories, and fake data clients. Event summary routes remain unavailable
until their source schema has an approved organization ownership contract. The
Express runtime replay and event-ingestion routers also return 503 until a
verified identity and organization-scoped event contract are implemented.
Their former in-memory/global-read paths are not exposed while that contract is
unknown. The alternate `main_backup.py` API returns 503 for its unscoped
timeline/autopilot routes and closes its event-ingestion WebSocket until the
same authorization contract exists. TypeScript security tests cover the
frontend BFF contract, demo isolation, and runtime event route denial; Python
ASGI tests exercise the current and alternate FastAPI route boundaries.
The source migration adds nullable organization ownership to customers and
grants customer reads only to authenticated users with active organization
membership. KPI and insight ownership is unresolved, so the migration removes
public/authenticated access to those tables rather than assigning ownership or
exposing unclassified rows. Existing unmapped customers remain unassigned and
are not returned through the scoped API. These code-level tests do not
exercise a real PostgreSQL schema, RLS, constraints, or deployed permissions.

Run the backend security tests with
`npm run test:security:backend` after installing `requirements.txt`.

## What requires a future approved synthetic database

- Actual migration syntax and ordering against the reconciled schema.
- Primary/foreign/unique constraint behavior.
- RLS policies under anon, authenticated, and service-role-like test roles.
- Cross-tenant queries against two synthetic organizations.
- Parent organization consistency and invalid relationship rejection.
- Data migration reconciliation and rollback/restore behavior.

Run none of these against production or any existing shared database. First
complete the readiness checklist, obtain explicit approval, and verify the
synthetic target environment.
