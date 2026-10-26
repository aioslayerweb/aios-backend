# Stage 2T — Runtime Security Implementation Readiness

**Verdict: BLOCKED.** A safe implementation sequence can be defined from
repository evidence, but the event ownership source, deployed Express/API
identity path, effective event-table controls, and approved synthetic
integration target are not established. Runtime event and ingestion routes
remain fail-closed; WebSockets remain disabled. This report is a plan, not
evidence that runtime isolation is implemented or deployed.

## 1. Current state and evidence boundary

Review date: 2026-10-26.

| Item | Verified local evidence |
|---|---|
| Branch / HEAD | Local branch `main`; HEAD `66a329411efd234e8948c614a8fe42f337a8299e`, subject `feat: redesign public homepage experience`, parent `b20dc1a1578ba04edf63a9d2824c2c23e9699060`. |
| Remote tracking ref | The locally cached `origin/main` is `b20dc1a1578ba04edf63a9d2824c2c23e9699060`. GitHub authentication is unavailable (`gh auth status` reports not logged in); the remote was not fetched. This is cached tracking state, not confirmation of the current GitHub branch. |
| Worktree at start | Three previously modified organization/platform layout files and six untracked Stage 2H–2K evidence documents. They were preserved. Stage 2S is already committed in the local history. |
| Original TODOs | Both declarations in [`security-foundation.test.ts`](../../../tests/security/security-foundation.test.ts) remain open and unchanged. |
| Express runtime | [`src/server.ts`](../../../src/server.ts) mounts `/aios` and `/intelligence`. [`src/api/replay.ts`](../../../src/api/replay.ts) and [`src/api/intelligence.ts`](../../../src/api/intelligence.ts) install router-wide 503 middleware before handlers. The underlying handlers use global/context-only reads and accept caller-provided `contextId`; they are not safe to expose by removing the gate. |
| Event storage | [`eventStore.ts`](../../../src/memory/eventStore.ts) and [`supabaseClient.ts`](../../../src/memory/supabaseClient.ts) describe event ID, type, timestamp, context, payload, and creation time; no organization owner or trusted context-owner relation is present in these source models. No reviewed migration establishes an `aios_events` organization policy. Actual database schema and applied migration state are unknown. |
| FastAPI identity/membership | [`security.py`](../../../backend/routes/security.py) verifies a bearer identity; [`authorization.py`](../../../backend/security/authorization.py) resolves active membership and permissions from that identity. These FastAPI dependencies are not wired into Express. |
| WebSockets | At this HEAD, [`main.py`](../../../main.py) closes `/ws` before accepting, and [`main_backup.py`](../../../main_backup.py) closes `/ws/autopilot` before accepting. Earlier Stage 2I text describes the pre-hardening `/ws` behavior; the later source and regression test in [`test_protected_api.py`](../../../tests/security/test_protected_api.py) reflect the fail-closed change. Deployment exposure remains unknown. |
| Runtime feature gate | [`live-data-boundary.ts`](../../../lib/runtime/live-data-boundary.ts) keeps `RUNTIME_AUTHORIZATION_VERIFIED` false. |
| Deployment workflow | [`deployment-production-template.yml`](../../../.github/workflows/deployment-production-template.yml) contains manual placeholder steps, not an active deployment workflow. |
| External evidence | No provider-generated service/build and routing evidence, owner-approved identity contract, event ownership mapping, effective database catalog/grant/RLS evidence, or authorized disposable integration target was found in the reviewed Stage 2H–2S artifacts. The Stage 2J owner request says it has not been sent. |

Repository statements above are source or local-test evidence only. They do
not establish deployed route ownership, effective database controls, or
production isolation.

## 2. Dependency matrix

| Requirement | Existing evidence | Missing proof / dependency | Owner role | Safe next action | Acceptance criteria |
|---|---|---|---|---|---|
| Identify the actual runtime service and route owner | `render.yaml` selects FastAPI `main:app`; Express routes exist in source; Stage 2H–2K identify no deployed owner. | Provider-generated service/build SHA, route/proxy map, frontend API destination, alternate/legacy inventory. | Platform / API service owner | Supply sanitized provider metadata and approved non-production route inventory. | Every required path maps to one declared service/build and expected enabled/disabled behavior; alternate routes accounted for. |
| Choose event ownership source | Stage 2S confirms event model has no organization owner; customer rows have a separate organization field. | Owner decision on authoritative context/event association and whether an existing external source is authoritative. | Product/domain and database owners | Approve the proposed contract in section 3 or provide an evidenced alternative. | Every newly accepted event is assigned to exactly one server-derived organization; no inference from client context/payload. |
| Select Express identity path | FastAPI verifies bearer identity and active membership; Express has no such dependency. | Approved Express identity mechanism, audience/key lifecycle, membership resolver, proxy provenance if relevant, frontend/BFF contract. | Identity / API security owner | Decide whether runtime moves to FastAPI or remains Express under a verified integration contract. | Express obtains a cryptographically verified subject, resolves current active membership, and binds organization/permission to request context before data access. |
| Establish effective database isolation | Customer RLS migration exists; event-table migration and deployed state are unknown. | Actual event/context schema, ledger, role attributes, grants, RLS policies, service-role bypass, disposable DB. | Database owner | Provide sanitized schema/catalog evidence and an isolated database runbook. | Effective permissions and policy results match the approved A/B matrix for each actual application role; privileged paths are explicitly tenant-scoped. |
| Enable event reads/replay/debug | Router handlers currently perform global/context-only reads behind 503. | Tenant-safe repository API and verified event owner relation; route owner/build identity. | API owner | Keep routes disabled; implement only after sections 3–4 prerequisites pass. | Every query, aggregation, error, pagination cursor, and memory fallback is tenant-filtered; negative A-to-B tests pass. |
| Enable ingestion | Body supplies context; no verified caller or server-side organization binding. | Identity, create permission, context ownership contract, idempotency rule, DB constraints. | API and database owners | Keep 503; use an approved server-derived organization and context binding. | A cannot create or retry an event under B; duplicate retries cannot transfer or overwrite ownership. |
| Verify deployment and cross-tenant behavior | Local unit/security tests only; TODOs explicitly require deployed/integration evidence. | Provider build identity, written scope approval, synthetic-only target, owner reviewer. | Service/security and database owners | Complete owner checklist; conduct only approved isolated tests. | Sanitized evidence ties positive and negative cases to immutable build and effective DB role; owner review recorded. |
| Re-enable WebSockets, if needed | Both current source handlers close before accept. | Separate connection/message identity, membership, permission, tenant-routing, limits, and deployed path proof. | API / real-time service owner | Keep disabled; decide whether WebSockets are needed at all. | Authentication before accept; per-message authorization and ownership; negative synthetic tests and deployment confirmation. |

## 3. Proposed authoritative event ownership contract

This section is a **proposal**, not current schema or an approved migration.
The database/domain owners must confirm the actual tables and canonical
organization source first.

### Event and context identity

- Each event has a database-enforced, immutable `organization_id` referencing
  the canonical organization, and a context identity bound to exactly one
  organization. If a separate context table is warranted, its identity is
  unique on `(organization_id, context_id)` and the event has a composite
  foreign key to that pair. If contexts are not separate rows, an equivalent
  authoritative relation must enforce that one context cannot span tenants.
- The organization is obtained from the request's verified subject plus the
  current active membership and required permission. A client-supplied
  organization field is rejected or ignored; `context_id`, payload fields,
  event identifiers, and forwarded headers are not ownership evidence.
- The server binds a typed authorized organization object to the request after
  identity and membership checks. Repository methods require that object (or
  its validated organization ID); they do not accept a raw tenant selector
  from route/body/query input as authorization.
- Event ownership is immutable after insertion. No user-facing event transfer
  operation is proposed. If a legitimate transfer is later required, it needs
  a separately approved, auditable domain operation with source/target
  authorization, referential updates, and a migration/test plan; it must not
  be implemented as an ordinary event update.

### Proposed database constraints and access rules

Subject to schema review, the migration specification should consider:

1. Non-null `organization_id` on new events; foreign key to canonical
   organizations; an organization/context composite key or equivalent
   ownership constraint; and a composite uniqueness constraint for
   idempotency.
2. Indexes supporting the actual scoped access patterns, at minimum
   `(organization_id, timestamp, id)` and
   `(organization_id, context_id, timestamp, id)`; add type to an index only
   if query plans justify it. Avoid a global index/API that becomes an
   unscoped read path.
3. Least-privilege SELECT/INSERT grants and tenant-aware policies for every
   permitted operation. Require organization membership to be evaluated from
   a verified database identity when user-scoped RLS is used. Verify both RLS
   enable/force state and table/function/role ownership/attributes.
4. Do not assume RLS protects a service-role/BYPASSRLS path. Prefer a
   non-bypass application role where feasible; otherwise every privileged
   repository method must use server-derived organization scope, with
   integration evidence proving the filter is applied before reads/writes.
5. A database write must bind event organization to context organization
   atomically. Reads for events, type, timeline, debug aggregation, and replay
   all include `organization_id = authorized.organization_id`; context
   selectors are additionally constrained by that organization. Any in-memory
   cache key must include organization as well as context/event identity.

### History, retries, quarantine, and rollback

- Do not backfill historical events from context ID, event payload, caller
  parameters, naming conventions, or current membership. Backfill requires an
  authoritative source mapping independently tied to each historical event
  or context, approved by the data owner.
- Missing, ambiguous, or conflicting mappings are quarantined from tenant
  reads/replay and retained for review under the approved retention policy.
  They are not assigned to a default organization.
- Define idempotency as a stable client/request key scoped by authorized
  organization and context (for example, unique
  `(organization_id, context_id, idempotency_key)`). A duplicate with the
  same tenant/key returns the existing safe result; reuse across organizations
  is a conflict/denial and never updates ownership or payload. If no trustworthy
  idempotency key exists, do not claim retries are deduplicated.
- Before deployment, rehearse schema expansion, validation, dual-read/write
  if required, quarantine counts, and rollback on an isolated disposable
  database. Rollback must not discard accepted events or silently revert
  ownership; retain the additive ownership data and disable routes if
  application rollback cannot safely preserve the contract.
- No migration, backfill, or production database action is authorized by this
  report.

### Migration preconditions

1. Database owner provides current schema, migration ledger/order, role
   attributes, effective grants/RLS, and confirms the actual `aios_events`
   table and any context relation.
2. Domain owner identifies an authoritative source mapping for existing
   events; unmatched rows have an approved quarantine disposition.
3. Service owner approves the identity/membership source and schema contract.
4. Security/database owners approve a disposable synthetic-only database,
   test identities, migration sequence, rollback, and reset procedure.
5. Code change is reviewed against those facts, tested in the isolated target,
   and released only after owner sign-off. Until all five hold, schema and
   history work remain specification-only.

## 4. Proposed Express authentication and authorization contract

There is no evidence that Express can currently reuse FastAPI's dependencies.
The FastAPI implementation is a viable **source-level reference**, not an
Express trust boundary or an established inter-service contract.

### Owner decision: select one supported path

1. **Make FastAPI the runtime owner.** Place runtime routes behind the existing
   FastAPI bearer identity and membership dependencies, add event ownership
   and tenant-scoped repository methods there, and remove/keep inaccessible
   duplicate Express exposure. This minimizes identity duplication but still
   requires database ownership and deployed route proof.
2. **Keep Express and validate the user's bearer credential itself.** Approve
   issuer, audience, signing algorithm, key/JWKS rotation, required claims,
   expiry/revocation expectations, and verified-subject mapping; Express
   validates locally and resolves active membership using an approved
   repository. Never accept client-selected organization as the membership
   source.
3. **Keep Express behind a cryptographically verified identity exchange.**
   Use an owner-approved service-to-service channel and signed, audience-bound,
   short-lived identity assertion or token exchange. Verify issuer,
   signature, audience, expiry, and replay protections. Network location or
   plain `X-User-*` / `X-Organization-*` headers alone are not trusted
   provenance. The gateway must strip client-supplied identity headers, and
   that behavior must be confirmed from deployed configuration.

The frontend runtime client currently does not attach a bearer credential.
Thus any browser-to-Express path requires an approved BFF/session-to-backend
flow or another verified boundary; it cannot be assumed from code or browser
origin. The responsible owner must choose and document the path before
implementation.

### Request authorization flow and outcomes

1. Authenticate first; derive immutable verified `subject` from validated
   credentials. Missing/invalid/expired credentials return the documented
   authentication denial (normally 401) without membership/event lookup.
2. Resolve membership by verified subject from the authoritative
   membership repository. Filter active state and validate returned subject,
   org relation, role, and ambiguity. No active membership or insufficient
   permission returns authorization denial (normally 403); malformed or
   ambiguous membership and repository outage fail closed (normally 503),
   without disclosing data or raw dependency errors.
3. If users have multiple active organizations, require an explicit
   organization selection only as a selector among verified active
   memberships; reject repeated, malformed, absent-when-required, or
   non-member selections. Server returns a request-scoped `AuthorizedEventOrg`
   containing verified subject, organization, role, and operation permission.
4. Data and event repository functions accept that scope, validate it at the
   boundary, and use organization predicates/constraints. Never log tokens,
   credentials, raw event payloads, or full sensitive errors. A cross-tenant
   or unmapped record should not leak whether it exists; use one documented
   denial/not-found contract consistently.
5. Authentication-service, membership, or DB failures do not fall back to
   global memory, another store, demo data, or a success-shaped empty result.
   Preserve a safe generic error response and internal sanitized correlation
   identifier.

Permission proposal based on the existing FastAPI role matrix: event list,
timeline, replay, and debug require an approved event-read permission;
ingestion requires an approved event-create permission. The current
`org_admin`/`member` matrix grants broad business permissions to admins and
READ to members, but an owner must explicitly decide whether these runtime
permissions map to those existing permissions. Do not infer authorization
from role relevance or create new roles implicitly.

## 5. Operation-by-operation enforcement matrix

All enabled-state entries below refer to **current repository source** only;
deployment ownership and external reachability remain unknown. Routes stay
disabled until every required cell is verified.

| Operation | Identity / membership / permission | Tenant ownership and storage contract | Denial / current source | Minimum positive and negative tests |
|---|---|---|---|---|
| `GET /aios/events` | Verified subject; active membership; explicit authorized organization; event-read permission. | Add org predicate before returning rows; filter type/ordering/cursors within org; memory cache must be org-scoped. | Current Express router returns 503. Underlying all-event read is global and unsafe to expose. | Same-tenant list contains only tenant fixtures; A cannot observe B, unmapped counts, or existence; forged org does not change scope; identity/membership/DB failures return no data. |
| `GET /aios/timeline` | Same event-read chain. | Tenant scope applies to every event before timeline sort/aggregation; pagination stays within org. | Current source 503; underlying timeline is global. | A and B timelines contain their own events only; cross-tenant IDs/cursors and global totals reveal nothing; failure has no memory/global fallback. |
| `GET /aios/replay/:contextId` | Verified subject, active membership, event-read permission. | Resolve context by `(authorized org, contextId)`; every replay event rechecked/scoped by org. Missing/ambiguous context is denied/not-found without existence leak. | Current source 503; underlying replay uses context only. | Own context replays; A replaying B context yields no B data; duplicate/ambiguous contexts denied; client org override ineffective; DB error fails closed. |
| `GET /aios/debug/:contextId` | Same read chain; owner must decide if debug requires a stronger permission because summaries can expose counts, event types, timestamps, payloads, or operational details. | Scope before calculating summary, type counts, first/last event, and span; no unscoped aggregate. | Current source 503; underlying context-only aggregation unsafe. | Same A/B negative replay cases; prove no cross-tenant summary/count/existence leak; test missing/ambiguous context and repository failure. |
| `POST /intelligence/event` | Verified subject, active membership, explicit event-create permission. | Derive organization from membership; bind context to that organization atomically. Ignore/reject client org field; validate schema and idempotency; immutable owner. | Current source 503 before handler; handler body supplies `contextId` and persists event without identity/tenant scope. | A ingestion stores only A; forged B org/context cannot create B event; retry is idempotent within tenant; cross-org key reuse denied; invalid identity/member/DB errors produce no write. |
| `/ws` | **Not enabled.** If needed later: authenticate and resolve membership/permission before accept; authorize every message and subscription. | Bind socket session to immutable authorized org; per-message event/context ownership and tenant predicates; no broadcast outside org. | Current FastAPI source closes before accept; actual deployed route/proxy status unknown. | Until separately approved, assert close-before-accept and no message processing. If proposed enabled, synthetic no-auth/invalid/expired/no-membership/A-to-B/A-to-A message tests and route verification are required. |
| `/ws/autopilot` | **Not enabled.** Same separate design plus per-message create/execute permission. | No organization from message payload; derive from verified socket identity/membership and enforce each delivery/write. | Current legacy source closes before accept; deployed legacy ownership unknown. | Unit test close-before-accept; verify route disabled at all active gateways/services. If future enablement, run the full approved per-message matrix. |

The table is a target contract. Existing `503` tests prove the source gate
rejects requests; they do not prove any other service is disabled or that
cross-tenant isolation succeeds.

## 6. Isolated verification plan

### Environment gate and fixtures

Use only an explicitly approved disposable non-production environment whose
database owner confirms synthetic-only data, no shared/production access or
replication, known migration state, least-privilege roles, and reset/discard
procedure. Verify provider-generated service/build SHA and complete route map
before sending requests. Record written approval, test window, limits, stop
contact, and reviewer. No tests in this plan authorize production access.

Provision through approved workflows:

- Organizations A and B with unrelated IDs.
- User A active only in A; User B active only in B; User C with no active
  membership; include an inactive/suspended/revoked membership case.
- Separate permitted and read-only roles as approved.
- Distinct synthetic events `event-A` and `event-B`, contexts `context-A` and
  `context-B`, and timeline data, each tied through the authoritative mapping.
- One unmapped and, if safely representable, one ambiguous/conflicting legacy
  event kept quarantined.
- Invalid/expired synthetic identities using the approved test identity
  workflow; never persist credentials in test evidence.

### Test levels and limits

| Level | Cases | Can establish | Cannot establish |
|---|---|---|---|
| Unit | Identity claim validation; membership status/subject mismatch; request-scope derivation; permission matrix; org-required repository parameters; duplicate/idempotency handling; no-context inference; malformed/ambiguous ownership quarantine; generic errors; runtime gate unchanged. | Local code behavior under deterministic fixtures. | Provider routing, real issuer/key config, effective RLS/grants, cross-tenant deployed behavior. |
| Isolated service/database integration | As A, read/replay/debug/timeline A; as B, corresponding B controls; A cannot read/replay/debug/timeline B; forged B organization selectors do not change A scope; no-membership/inactive/invalid/expired identity denied; missing/ambiguous owner denied or quarantined; A ingestion cannot assign to B; retries cannot transfer ownership; injected auth/DB failure has no read/write fallback; route gates remain 503 when not explicitly enabled. | Combined application and database behavior on the identified disposable schema/roles. | Production deployment identity/configuration or production data isolation. |
| Database policy/grant verification | Reconcile migration ledger and actual schema; inspect table/function/sequence grants, owners, role memberships and BYPASSRLS; inspect enabled/forced RLS and all policies; exercise approved synthetic app roles for SELECT/INSERT/UPDATE/DELETE and cross-tenant controls. | Effective target database controls for the inspected roles/schema. | Behavior of uninspected deployed services or different production grants/config. |
| Deployed-service verification | On approved non-production endpoint/build, trace route-to-service, verify auth before lookup and membership before event query, execute synthetic A/B cases, inspect sanitized before/after counts and correlation traces, reconcile every alternate route. | Behavior of the identified service/build and path at test time. | Untested builds, routes, data stores, or future deployment changes. |

### Required case matrix

1. Positive same-tenant reads and context replay for A and B.
2. A-to-B and B-to-A attempts for list, timeline, replay, debug, direct event
   identifier, and any supported context selector; no payload, count, summary,
   existence signal, or side effect crosses tenants.
3. Forged/contradictory client organization ID and context pair; the server
   derives organization from identity/membership and rejects or ignores the
   foreign selector per the signed contract.
4. Missing, invalid, and expired identity; no-active, inactive, revoked, and
   ambiguous membership; insufficient role. Denial occurs before event query.
5. Missing context, nonexistent context, ambiguous ownership, null owner, or
   conflicting owner mapping; no inference and no sensitive existence leak.
6. Ingestion without identity, with a forged B organization, with A identity
   and B context, with invalid payload, and with an idempotent retry. Verify
   DB state/event count unchanged on denial; retry cannot reassign ownership.
7. Injected membership repository, DB read, write, and policy lookup failures;
   fail closed with no unscoped memory fallback or success-shaped empty result.
8. Direct DB tests for each app role, RLS/grants and service-role/BYPASSRLS
   paths, including policies for every applicable command.
9. `/ws` and `/ws/autopilot` remain unavailable and process no message until a
   separate design is approved; if later enabled, authentication precedes
   accept and each message is separately authorized.
10. Confirm existing public demo paths use synthetic fixtures and cannot
    reach live customer data or perform live mutations in the approved
    environment.

Stop on unexpected data or mutation, preserve only sanitized evidence, and
notify the authorized owner through their established process. Do not extend
scope or retry a failed cross-tenant case without review.

## 7. Safe implementation backlog

### A. Safe before owner evidence

| Priority | Work | Dependencies | Deliverable / acceptance |
|---|---|---|---|
| A1 | Preserve the fail-closed route middleware and false runtime gate; protect them with regression tests. | None. | Tests verify all Express replay/ingestion paths return unavailable without mutation; frontend does not fallback to unscoped storage; both TODOs remain TODO. |
| A2 | Add pure unit tests for a proposed typed authorization context and tenant-scoped repository interface, without wiring routes or asserting production isolation. | Contract review by code maintainers; synthetic fixtures only. | Tests reject missing org scope, mismatched subject/membership, and ownership ambiguity; no route is enabled. |
| A3 | Define event schema/API contracts, error classes, idempotency semantics, cache key rules, quarantine states, and migration checklist in docs. | Clearly label as proposal. | Reviewable implementation spec with unresolved choices explicitly assigned to owner roles. |
| A4 | Build synthetic fixtures and a test harness that cannot call network/production endpoints. | Existing offline test conventions. | Unit suite is offline and synthetic-only; assertions do not treat 503 as tenant isolation. |
| A5 | Keep demo/live isolation tests and verify homepage/demo copy does not imply active integrations or results without evidence. | Existing synthetic demo architecture. | Tests assert the public demo uses synthetic sources and avoids live data/mutations. |
| A6 | Document sanitized logging and generic denial/error response requirements. | None. | No credentials/payloads logged; auth 401, authorization 403, dependency failure 503, and record-not-found policy are distinct and documented. |

### B. Requires owner or infrastructure evidence

| Priority | Work | Blocking dependencies | Acceptance |
|---|---|---|---|
| B1 | Select deployed runtime/API owner and identity path (FastAPI ownership, direct Express verification, or verified identity exchange). | Provider-generated build/route inventory; identity owner decision; browser/BFF contract. | Immutable service/build selected; cryptographic identity provenance, issuer/audience/key lifecycle, and trusted route path documented. |
| B2 | Approve authoritative event/context organization source and historical data disposition. | Domain owner evidence and actual schema/data inventory. | Every new event ownership source is server-derived; historical maps are evidenced; missing/conflicting rows quarantined. |
| B3 | Implement database schema, constraints, indexes, grants/RLS and migration. | B1/B2; database catalog and migration ledger; approval and disposable target. | Migration rehearsed in isolated DB; no ambiguous backfill; DB policies and privileged paths satisfy A/B matrix. |
| B4 | Implement the chosen identity/membership boundary and scoped event repository, then route handlers. | B1–B3. | Every operation passes positive/negative service integration tests; no global fallback. |
| B5 | Verify deployed route behavior and cross-tenant isolation. | Written authorization, identified non-production build, disposable DB, synthetic identities, stop contact/reviewer. | Sanitized independent evidence tied to exact build; owner/security review. |
| B6 | Consider runtime or WebSocket re-enable. | B1–B5; for WebSockets, separate connection/message authorization spec and tests. | Explicit release approval and evidence; otherwise routes remain disabled. |

The shortest safe path is: obtain the service/identity owner decision and
provider route/build evidence; obtain the authoritative event ownership
decision and actual database catalog; then approve a disposable synthetic DB.
Do not implement schema/backfill or remove route gates before those decisions.

## 8. Owner evidence package

A ready-to-send, unsent checklist is maintained in
[`stage-2t-owner-evidence-checklist.md`](./stage-2t-owner-evidence-checklist.md).
It requests only evidence needed to choose an implementation and authorize
isolated verification. It names roles, not individuals. No owner was contacted.

## 9. Original TODO disposition

The two unchanged TODOs in
[`security-foundation.test.ts`](../../../tests/security/security-foundation.test.ts)
remain **OPEN**:

1. `selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved` — **OPEN**. Need provider-generated service/build and route ownership, approved route contracts, and evidence that enabled routes authenticate/authorize before access or are disabled at the actual owner.
2. `user cannot read or replay a record owned by another organization` — **OPEN**. Need an authoritative event-owner relation, verified identity and active membership, tenant-scoped app/database enforcement, effective grants/RLS evidence, and approved A/B integration cases tied to the deployed build.

Local tests, source migrations, local route 503 responses, and a Git commit or
push are not substitutes for these acceptance criteria.

## 10. Remaining risks and next action

- An alternate deployed API, proxy, worker, direct DB client, or legacy path
  may not share current source gates; deployment inventory is absent.
- A privileged database role may bypass RLS; effective role attributes and
  query filters are unknown.
- Existing historical events cannot safely be assigned to tenants without an
  authoritative mapping; unsafe backfill risks permanent cross-tenant
  attribution.
- The Express handlers would expose global/context-only data if their 503
  middleware were removed without redesign.
- Current WebSocket source is closed but external reachability is unknown.
- The Stage 2J owner evidence request is not sent; GitHub auth is unavailable,
  so this Stage 2T change must not claim remote verification or deployment.

**Highest-priority next action:** The authorized backend/platform owner must
provide provider-generated evidence identifying the active runtime service,
immutable build, route map, and approved identity/membership integration
decision. Keep routes disabled while that evidence is gathered.
