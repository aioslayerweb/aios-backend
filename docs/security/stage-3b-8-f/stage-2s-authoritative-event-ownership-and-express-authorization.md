# Stage 2S — Authoritative Event Ownership and Express Authorization

**Verdict: BLOCKED.** Repository evidence does not establish authoritative
organization ownership for runtime events, and the Express runtime routers have
no verified caller identity or active-membership authorization. They remain
fail-closed. No migration, deployment change, production access, or external
test was performed.

## 1. Scope and evidence boundary

This is a source, test, and migration-file review at local `main` and
`origin/main`, both `492384114798a4630b6d39de2c4d5349de05462a`
(`fix: secure runtime state and mobile privacy layout`). The worktree also
contained three pre-existing modified layout files and six untracked Stage
2H–2K reports; those files were preserved and are not part of this report.

Repository evidence establishes declarations and local behavior only. It does
not establish the active deployed service/build, effective database grants or
RLS, runtime route ownership, or production tenant isolation. No production or
staging endpoint or database was accessed.

## 2. Required trust contract

Any future runtime event operation must implement this chain, without treating
one layer as a substitute for another:

1. **Authentication:** validate the caller's credential and derive a verified
   subject. Missing, invalid, or unverifiable identity is denied.
2. **Authorization:** resolve active organization membership and required
   permission server-side for that verified subject. Missing, inactive,
   ambiguous, malformed, or unavailable membership fails closed.
3. **Tenant ownership:** derive the authorized organization from that
   membership; establish that each event, replay context, and timeline record
   belongs to it using an authoritative stored relationship. Client-selected
   organization IDs, `context_id`, payload data, and request parameters do not
   prove ownership.
4. **Scoped operations:** constrain every event read, type filter, timeline,
   debug aggregation, replay, and ingestion write to the authorized
   organization. No global/memory fallback may return data outside that scope.
5. **Database enforcement:** establish effective grants and policies for the
   actual application roles, and independently verify database isolation.
   Migration source or application query filters alone are not proof of
   effective database enforcement.

Authentication proves who the caller is; membership authorization determines
which organization/permission is allowed; authoritative ownership associates
each record with that organization; database enforcement constrains access
even if an application query path is incomplete. All four are required.

## 3. Verified source findings

| Surface | Repository evidence | Finding |
|---|---|---|
| Express registration | [`src/server.ts`](../../../src/server.ts) mounts `/intelligence` and `/aios`. | Source declares an Express runtime, but no reviewed deployment evidence identifies it as active. |
| Express replay/timeline/debug | [`src/api/replay.ts`](../../../src/api/replay.ts) installs router-wide middleware returning 503 before the route handlers. Under that gate, the handlers use global event reads and context-only reads; they do not accept an authorized organization. | Current source is fail-closed. The underlying handlers are not tenant-safe to enable as-is. |
| Express ingestion | [`src/api/intelligence.ts`](../../../src/api/intelligence.ts) also returns 503 before parsing or processing a request. Its handler accepts `contextId` from the request body and calls the event processor/store. | Current source rejects ingestion. `contextId` is not an ownership proof and the handler has no identity/membership dependency. |
| Event model/store | [`src/memory/eventStore.ts`](../../../src/memory/eventStore.ts) stores `StoredEvent` values by ID and `contextId`, and supports global and context reads. | The source model has no organization owner or authoritative context-to-organization relationship. |
| Supabase event persistence | [`src/memory/supabaseClient.ts`](../../../src/memory/supabaseClient.ts) models `aios_events` as `id`, `type`, `timestamp`, `context_id`, `payload`, and `created_at`. The client is created with `SUPABASE_URL` and `SUPABASE_ANON_KEY`; event queries filter only by optional context/type. | No event organization key, ownership join, caller identity propagation, or tenant predicate is present in this adapter. No reviewed migration creates or scopes `aios_events`; actual database schema and applied migrations are unknown. |
| FastAPI identity | [`backend/routes/security.py`](../../../backend/routes/security.py) verifies a bearer token and returns `VerifiedIdentity.sub`. | A verified identity primitive exists in FastAPI source; this is not event authorization and is not wired into Express. |
| FastAPI membership | [`backend/security/authorization.py`](../../../backend/security/authorization.py) resolves membership for the verified subject, rejects missing/ambiguous selection, and applies the role/permission matrix. [`backend/services/organization_memberships.py`](../../../backend/services/organization_memberships.py) validates records and filters active memberships. | A source-level FastAPI authorization path exists for FastAPI dependencies; Express cannot directly invoke these Python dependencies. |
| Customer ownership precedent | The customer-scoping migration [`20261026000000_scope_customers_to_organizations.sql`](../../../supabase/migrations/20261026000000_scope_customers_to_organizations.sql) adds `customers.organization_id` and customer RLS. | This applies to customers, not runtime events. It does not prove event ownership or deployed/effective policy state. |
| Runtime gate | [`lib/runtime/live-data-boundary.ts`](../../../lib/runtime/live-data-boundary.ts) sets `RUNTIME_AUTHORIZATION_VERIFIED = false`; the Stage 2Q providers use this gate. | Runtime remains disabled in source. This report does not change the gate. |
| WebSockets | FastAPI `/ws` and legacy `/ws/autopilot` are fail-closed in current source and have local regression coverage. | Keep both disabled; this assessment does not establish deployment exposure or define per-message authorization. |

The checked-in deployment workflow
[`deployment-production-template.yml`](../../../.github/workflows/deployment-production-template.yml)
is a `workflow_dispatch` template whose deploy and rollback steps only print
placeholder text. It is not evidence of a configured deployment or of a
production route owner.

## 4. Ownership contract and required schema plan

**Current ownership status: not established.** The event model and adapter have
no organization field. `context_id` is supplied by ingestion and is only a
context selector. Neither it nor payload fields, headers, or a client-supplied
organization ID may be used to infer tenant ownership.

Before enabling event functionality, the service and database owners must
approve a schema/data contract that at minimum:

- Stores an authoritative, non-null `organization_id` on each event (with a
  foreign key to the canonical organization table), or an equivalent
  database-enforced ownership relation.
- Derives that organization from the verified identity's active,
  authorized membership at ingestion. A request-provided organization is
  ignored or checked only against that server-derived authorization.
- If contexts are separately represented, binds a context to exactly one
  organization and enforces the event/context organization pair (for example,
  a composite foreign key); event queries must scope both tenant and context.
- Applies tenant scope to inserts and every select/replay/debug path, including
  event type filters and aggregate summaries. Missing or ambiguous ownership
  must not return data or create a record.
- Defines least-privilege grants and effective SELECT/INSERT/UPDATE/DELETE
  policies for the actual roles. If a role bypasses RLS (including a
  service-role path), that bypass must not be treated as isolation: either
  use a non-bypass role or enforce and verify an equivalent protected
  boundary for that path.

No migration is proposed or applied in Stage 2S. Existing events must not be
backfilled from context IDs, payloads, or guesses. A future migration requires
an evidenced authoritative mapping, a reviewed treatment for missing or
ambiguous records (quarantine rather than assignment), an approved migration
plan, and an isolated disposable test database. Applied migration state,
effective policies, and grants remain unverified.

## 5. Express identity and membership integration options

Express currently has no verified identity contract or trusted membership
resolver. The Python FastAPI dependencies are not directly reusable in
TypeScript. Do not add an independent weaker authentication mechanism or trust
forwarded identity/organization headers without verified deployment provenance
and integrity protection.

Options for an owner-approved design are:

1. **Keep runtime routes owned by FastAPI:** implement the runtime capability
   behind the existing FastAPI verified-identity and membership dependencies,
   then scope the event store/database operations there. Do not expose the
   current Express handlers as an alternate path.
2. **Retain Express behind a verified internal boundary:** establish a
   deployment-backed, integrity-protected service contract (for example,
   authenticated service-to-service communication) that conveys an
   independently verifiable user identity. Express must validate that
   identity, resolve active membership itself through an approved repository
   contract, and derive the organization server-side before every operation.
   A plain proxy header is insufficient.
3. **Use a reviewed shared identity contract/library:** only after the owner
   approves a common issuer, audience, key/rotation, claim-validation,
   membership, error, and revocation contract. A library or token validator
   alone does not establish membership or event ownership.

The service owner must choose and document the active service, route map,
trusted request path, identity source, membership resolver, and database role.
Until then, there is no safe basis to enable Express or ingestion.

## 6. Tests and local validation

No new test was added: the current Express implementation has no partial
authorization path to test safely. Existing synthetic tests establish the
negative gate only; they must not be presented as proof of cross-tenant
isolation:

- [`runtime-event-isolation.test.ts`](../../../tests/security/runtime-event-isolation.test.ts)
  verifies replay and ingestion requests return 503 with absent, malformed,
  and forged-looking authorization/organization headers and verifies no
  synthetic event is added.
- [`security-foundation.test.ts`](../../../tests/security/security-foundation.test.ts)
  preserves the two original open deployment/ownership TODOs.
- Backend tests cover FastAPI identity, membership, customer scoping, and
  fail-closed event summary behavior. They do not prove Express authorization,
  event ownership, deployed identity, or effective RLS.

Executed results:

| Command | Result |
|---|---|
| `npm run test:security` | **Passed:** 85 tests; 83 passed, 0 failed, 2 TODOs remain open. |
| `npm run test:security:backend` | **Passed:** 49 tests. Initial run was blocked by missing `jwt`; declared `requirements.txt` dependencies were installed, then the suite passed. |
| `npm run validate` | **Passed:** lint, TypeScript check, and Next.js production build. |
| `git diff --check` and `git diff --cached --check` | **Passed** for the Stage 2S report. |

No production/staging integration test, database query, migration, WebSocket
probe, or customer-data test was run.

## 7. External evidence required and original TODOs

The following evidence must come from the authorized service/database owners;
it cannot be established by this repository review:

- Provider-generated active API service/build identity, deployed SHA, route
  and proxy map, and confirmation of which service owns each runtime path.
- The approved identity and membership contract for that service, including
  the provenance/integrity of any service-to-service identity.
- Authoritative event/context-to-organization mapping and a synthetic,
  disposable data migration/fixture plan.
- Effective event-table schema, RLS/policies, role grants and any service-role
  bypass behavior, independently inspected on the approved non-production
  database.
- Written authorization and verified build identity before any future
  synthetic cross-tenant integration tests.

The two original TODOs in `tests/security/security-foundation.test.ts` remain
open and unchanged:

1. `selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved` —
   **OPEN;** deployed route ownership/build evidence is missing.
2. `user cannot read or replay a record owned by another organization` —
   **OPEN;** authoritative event ownership, Express authorization, effective
   database controls, and approved cross-tenant evidence are missing.

## 8. Disposition

**BLOCKED.** Keep `RUNTIME_AUTHORIZATION_VERIFIED` false; keep all Express
runtime/ingestion routes, `/ws`, and `/ws/autopilot` disabled. Do not run a
migration or enable route access based on the passing local tests. The next
required action is for the authorized owners to establish the deployment
identity/routing, choose the identity integration, approve an authoritative
event ownership contract and migration plan, and provide isolated database
policy evidence. Only then can the TODOs be evaluated against approved
synthetic integration tests.
