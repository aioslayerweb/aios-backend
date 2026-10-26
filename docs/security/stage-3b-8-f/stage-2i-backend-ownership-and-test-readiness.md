# Stage 2I — Backend Ownership and Security-Test Readiness

**Assessment date:** 2026-10-26
**Verdict: BLOCKED at the infrastructure boundary.** Repository source
identifies a configured FastAPI entry point and multiple alternate server
implementations, but no authorized deployment evidence identifies the active
API service, build, route map, or effective database controls. The `/ws`
handler in the configured source accepts connections without authentication.
Its deployment exposure is **UNKNOWN**. Both deployment-dependent security
TODOs remain open.

This is a documentation-first, source-only assessment. No production or
staging API was contacted, no WebSocket connection was attempted, no database
was accessed, and no application or infrastructure configuration was changed.

## 1. Executive verdict and evidence labels

- **Verified from repository source:** application declarations, route
  handlers, frontend client calls, deployment manifests, local security test
  code, and environment-variable *names* described below.
- **Verified from authorized runtime evidence in this stage:** none.
- **Inferred but not confirmed:** `render.yaml` and `Procfile` select `main:app`
  when used as configured; neither establishes that a host is active or running
  this revision.
- **Blocked by missing access:** deployed API identity and ownership,
  externally reachable routes, effective database grants/RLS, and cross-tenant
  runtime outcomes.
- **Not assessed:** actual hosting settings, deployed environment values,
  service logs, deployment dashboards, runtime traffic, database state, and
  external identity-provider configuration.

The two original TODOs in
[security-foundation.test.ts](../../../tests/security/security-foundation.test.ts)
were inspected and left unchanged.

## 2. Repository baseline and preserved changes

- Branch: `main`; upstream: `origin/main`.
- HEAD: `c797876cef7a84cb278e85ee02158290c28f0917`
  (`feat: refresh AIOS public experience and security foundation`).
- `origin/main` resolved to the same SHA during this inspection.
- Existing worktree changes at inspection start:
  - Modified [next-gen-workspace.tsx](../../../components/platform-next/next-gen-workspace.tsx).
  - Modified [organization-center-workspace.tsx](../../../components/organization-center/organization-center-workspace.tsx).
  - Modified [organization-center-components.tsx](../../../components/organization-center/organization-center-components.tsx).
  - Untracked [stage-2h-production-verification.md](./stage-2h-production-verification.md).
- Those changes were inspected and preserved. No existing file was edited.
- This report is the only file added by Stage 2I. No tests or builds were run;
  the task is documentation-only and no approved integration target exists.

## 3. Backend implementation and deployment inventory

| Service/application | Actual source entry point and runtime | Deployment target evidence | Routes and callers | Authentication and tenant scope | Deployment confidence |
|---|---|---|---|---|---|
| FastAPI primary source | [main.py](../../../main.py) creates `FastAPI`; `render.yaml` declares `uvicorn main:app --host 0.0.0.0 --port $PORT`; [Procfile](../../../Procfile) declares `uvicorn main:app --host 0.0.0.0 --port 10000`. | Tracked Render manifest and Procfile only. The workflow at [deployment-production-template.yml](../../../.github/workflows/deployment-production-template.yml) contains deployment placeholders, not a configured deployment. | `/`, `/health`, `/ready`, `/dashboard`; protected `/api/v1/customers*`, business-memory, executive, `/signals/{user_id}`, `/insights/{user_id}`, `/autopilot/{user_id}`; WebSocket `/ws`. Frontend `runtime-events.ts` expects the separate `/aios/*` routes, which are not declared here. | Protected FastAPI business routes use `require_verified_identity` and `require_organization_permission`; membership is derived from the verified subject and tenant-scoped customer service calls receive the authorized organization. The `/ws` handler does not use these dependencies or verify identity or tenant scope. | **Partial source configuration; active deployment UNKNOWN.** |
| Express runtime/event service | [src/server.ts](../../../src/server.ts) creates an Express app, mounts `/intelligence` and `/aios`, and listens on `PORT` or 3001. `package.json` contains no start/build script selecting this entry point; no inspected deployment manifest selects it. | No tracked deployment target or service ownership evidence found. | Replay GETs and event-ingestion POST are declared in [replay.ts](../../../src/api/replay.ts) and [intelligence.ts](../../../src/api/intelligence.ts). Current router-wide middleware returns 503 before those handlers. Frontend calls four replay GET routes. | No identity or organization authorization is present in the underlying route handlers. Current source middleware fails closed before the handlers. The event schema/store uses `context_id`, not an organization key; global replay handlers read all stored events and event ingestion does not derive tenant ownership. These handlers must not be enabled without an authorization and ownership design. | **Source exists; deployment UNKNOWN.** |
| Legacy FastAPI source | [main_backup.py](../../../main_backup.py) creates a separate FastAPI app. No inspected manifest or process declaration selects it. | No deployment target evidence found. | Includes `/timeline/{user_id}`, `/autopilot/{user_id}`, `/autopilot/global`, and `/ws/autopilot`. | HTTP middleware returns 503 for the listed unscoped business paths. The WebSocket closes with code 1013 before accepting. Local backend tests exercise these fail-closed paths. | **Source exists; deployment UNKNOWN.** |

No Dockerfile, container manifest, Terraform configuration, or other inspected
infrastructure-as-code selected a different application. This is a bounded
repository search result, not proof that no external hosting configuration
exists.

### Configuration variable names seen in source

The source reads names including `AIOS_SUPABASE_JWT_ISSUER`,
`AIOS_SUPABASE_JWT_AUDIENCE`, `AIOS_SUPABASE_JWT_ALGORITHM`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and the frontend runtime
origin names `NEXT_PUBLIC_RUNTIME_API_URL`, `NEXT_PUBLIC_API_URL`, and
`NEXT_PUBLIC_BACKEND_URL`. Other application integrations read provider or
auth secret names. No values were inspected, copied, or included here.

## 4. WebSocket source assessment

| Path | Owning source app | Purpose and caller evidence | Source authentication / tenant behavior | Deployment status |
|---|---|---|---|---|
| `/ws` | FastAPI [main.py](../../../main.py#L231) | Accepts text messages, parses JSON, and echoes each payload in an acknowledgement. No frontend `new WebSocket` caller was found in the inspected TypeScript source. | Calls `accept()` immediately; no token, identity, membership, permission, or tenant check. No explicit origin validation or application message-size/rate limit is present. Arbitrary client JSON is reflected to that same client; the handler does not query business records or broadcast sensitive data. The active-connection set is cleaned up only on `WebSocketDisconnect`, so other exceptions (including malformed JSON) can leave entries retained. | `render.yaml` and `Procfile` select `main:app` in source configuration, but do not prove that this endpoint is deployed or reachable. Actual exposure: **UNKNOWN**. |
| `/ws/autopilot` | Legacy [main_backup.py](../../../main_backup.py#L276) | Legacy autopilot path; no frontend WebSocket caller was found. | Closes with code 1013 before accepting. `tests/security/test_protected_api.py` verifies this local ASGI behavior and verifies the legacy HTTP fail-closed routes. | No manifest selects this app; actual exposure: **UNKNOWN**. |

**Security significance:** The primary `/ws` implementation is a credible
source-level unauthenticated-connection and resource-consumption risk if
deployed. Its observed handler only echoes client-provided JSON; source
inspection does not establish access to customer records or tenant data
through this socket. Do not describe it as production-exploitable without
deployment evidence. The smallest safe remediation, if the endpoint is not
required, is to remove/disable it at the actual service owner. If required,
authenticate and authorize before accept, bind every operation to a verified
tenant, validate origin and message schema/size, enforce connection/rate
limits, and clean up connections in all exit paths. Any code change requires
separate authorization and regression coverage.

The Express replay and ingestion routers have a similar conditional concern:
the current router-wide 503 middleware blocks all handlers, but the handlers
below it have no auth/tenant checks and operate on a context-only event store.
Do not remove, bypass, reorder, or replace the fail-closed middleware until
tenant ownership and server-derived authorization are implemented and tested.

## 5. Deployment evidence and unknowns

### Verified from source

- Render source configuration and `Procfile` point to `main:app`; the Express
  listener and legacy FastAPI app are alternate source implementations.
- The production deployment workflow file is explicitly a template with
  placeholder steps. No source manifest establishes an active Render service,
  selected Express service, proxy, gateway, rewrite, or WebSocket route.
- The frontend runtime client selects the first configured
  `NEXT_PUBLIC_RUNTIME_API_URL`, `NEXT_PUBLIC_API_URL`, or
  `NEXT_PUBLIC_BACKEND_URL`, then falls back in source to
  `http://localhost:3001`. The actual deployed value is unknown.
- The runtime client sends JSON and does not attach bearer authorization
  itself. Any deployed runtime route that serves protected data must have an
  independently verified server-side identity contract; a frontend origin
  value is not an authorization control.

### Runtime facts not established

- No authorized non-production or production API base URL was provided.
- No deployed commit/build ID, service owner, routing map, host configuration,
  or service logs were available in this stage.
- No HTTP or WebSocket backend route was contacted.
- No active deployment, endpoint availability, applied migration, database
  policy, grant, or tenant isolation result can be claimed.
- The website evidence recorded in Stage 2H is not evidence of backend route
  ownership or backend build identity.

## 6. Frontend-to-backend dependency matrix

The four calls below are made by
[runtime-events.ts](../../../lib/runtime/runtime-events.ts#L241). Types are
declared in [runtime-types.ts](../../../lib/runtime/runtime-types.ts).

| Frontend method and path | Expected success response | Current Express source behavior | Required authorized runtime evidence |
|---|---|---|---|
| `GET /aios/events` | `{ count, events }` | `/aios` router returns 503 before route handler. | Identify the service/build that owns the path; establish whether the approved release contract enables it; if enabled, validate response shape and auth/tenant behavior against synthetic fixtures. |
| `GET /aios/timeline` | `{ count, timeline }` | 503 before handler. | Same; no global/unscoped event exposure. |
| `GET /aios/replay/:contextId` | `{ contextId, count, timeline }` | 503 before handler. | Same; prove same-tenant permitted behavior and cross-tenant denial for context IDs. |
| `GET /aios/debug/:contextId` | `{ summary, events }` | 503 before handler. | Same; prove debug summaries and events do not reveal foreign data. |
| `POST /intelligence/event` (not one of the four frontend calls) | Source handler would return `{ success, eventType, timestamp, contextId, lifecycle }`. | `/intelligence` router returns 503 before handler. | Establish whether it is intentionally disabled or enabled. If enabled, prove authenticated server-derived ownership and no cross-tenant write. |

The four GET request paths are the exact runtime dependency surface for TODO A.
The HTTP methods and success shapes are source contracts, not claims about
deployed behavior. Current local source's 503 is not proof of route ownership,
correct deployment, or intended production availability. A 503 must not be
treated as a passing authentication or isolation test.

## 7. Ready-to-send infrastructure-owner request

> Please provide the approved non-production frontend URL and API URL, the
> hosting provider and responsible service owner, the active API application
> and complete routing topology (including proxies, rewrites, gateways,
> alternate/legacy services, and WebSockets), and the deployed commit SHA or
> immutable build ID for each relevant service.
>
> Please confirm whether FastAPI `/ws` is deployed, disabled, or otherwise
> protected, and provide the approved route contract and expected enabled or
> disabled state for the four frontend `/aios/*` GET routes and any
> `/intelligence/event` route. Please confirm authorization for synthetic
> authentication, tenant-isolation, and WebSocket testing in the identified
> non-production environment, including the approved test window and stop
> contact.
>
> Please identify the database owner and an isolated disposable Postgres/
> Supabase target confirmed to contain synthetic data only. Provide the
> approved secure workflow for access, migration-order reconciliation and
> application, inspection of effective grants/RLS/policies, and safe reset or
> destruction of the target, plus a responsible contact for routing, build,
> or policy discrepancies.
>
> Please do not send passwords, bearer tokens, service-role keys, or other
> credentials in chat, this report, source code, or logs. Access and synthetic
> identity creation must use the organization's approved secret-management
> workflow.

This request has not been sent. No owner, URL, hosting confirmation, or
approval is fabricated here.

## 8. Verification plans for the two outstanding TODOs

### TODO A — deployed API ownership and runtime-route behavior

Original test: `selected deployed API implements every frontend runtime
route; current FastAPI source lacks /aios/* and deployment ownership is
unresolved`.

**Prerequisites**

1. Owner-approved non-production frontend and API targets; written synthetic
   test approval, window, rate limits, and stop contact.
2. Service owner, immutable deployed build IDs, and complete proxy/gateway/
   rewrite/alternate-service/HTTP/WebSocket route map.
3. Signed-off route-by-route expected enabled/disabled contract and expected
   auth model. No credentials are placed in test output or committed fixtures.

**Execution**

1. Verify the target identity and deployed build from the owner-controlled
   deployment metadata, not source manifests or public-page headers.
2. For each of `GET /aios/events`, `GET /aios/timeline`,
   `GET /aios/replay/{synthetic-context-A}`, and
   `GET /aios/debug/{synthetic-context-A}`, record the selected service and
   final handler from approved routing metadata/logs.
3. Compare enabled responses with the source success shapes listed in section
   6. If a route is contractually disabled, prove its owner and documented
   disabled response at that service; do not mistake a proxy error or generic
   503 for implementation proof.
4. For any enabled protected route, test: no credentials; malformed,
   invalid, and expired synthetic identity; valid identity without membership;
   insufficient role; permitted synthetic identity. Confirm denials happen
   before record access, and responses contain no event, customer, or
   existence-sensitive data. Since the frontend client currently attaches no
   bearer token, establish how any protected browser request is authenticated
   (for example, an independently verified BFF/proxy contract); do not infer
   protection from browser-side configuration.
5. Use malformed path/context values and malformed payloads where the
   endpoint/method accepts a payload. Record status/result class, response
   shape, route owner, sanitized request case ID, and authorization/query
   trace. Do not store tokens or sensitive payloads.
6. An absent route, route owned by an unexpected service, response contract
   mismatch, unprotected data access, or unauthenticated sensitive response is
   **FAIL** and must stop further requests to that path pending owner review.

**Closure criteria**

Close TODO A only when every frontend route has verified deployed ownership,
build identity, and behavior matching its signed-off product contract, and
every enabled sensitive route enforces its documented authentication and
authorization before access. A route intentionally disabled can be documented
as disabled, but does not satisfy an expected enabled runtime dependency.
Source inspection, generic 401/403/503 responses, or local tests alone do not
close the TODO. Missing owner, build ID, approval, route contract, or trace
means **BLOCKED** and the TODO stays open.

### TODO B — cross-organization read and replay isolation

Original test: `user cannot read or replay a record owned by another
organization`.

**Prerequisites and synthetic fixtures**

- Approved disposable isolated database with owner confirmation it contains
  synthetic data only and has no production sharing or replication.
- Reconciled migration ledger and owner-approved migration workflow. Do not
  apply migrations until the database owner approves the exact target/order.
- Organization A and B; active User A membership only in A and User B only in
  B; User C with no active membership; a read-only member role; valid synthetic
  identities plus invalid and expired cases.
- One synthetic customer record per organization and one runtime record/event
  per organization only if the deployed schema and approved event ownership
  contract support these fixtures. Include an unmapped record when supported.
- Explicit service/route contract and the approved reset/discard procedure.

**Execution**

1. Through the selected deployed service, prove User A can read its own
   documented A record and User B can read its own B record when the role and
   endpoint contract permit. Assert expected fields and no extra records.
2. As User A, request B's direct record ID and any supported organization
   query/path selector naming B; repeat symmetrically as User B. Also try User
   C, invalid/expired identity, and read-only role against any operation that
   requires more than read. Assert denial, no foreign record/content or
   existence leak, and no state change.
3. For runtime replay/debug/timeline, use synthetic A/B contexts/events. Prove
   A can retrieve only permitted A content and cannot replay/debug B's
   context. Global timeline/list endpoints must be tenant-filtered or remain
   disabled under an explicitly approved contract; no unscoped global read
   counts as a pass.
4. If an approved ingestion/mutation path exists, submit as A with client
   supplied B organization/context identifiers. Verify the server derives
   ownership from the verified identity/membership and no B row/event or
   side-effect is created. If no enabled contract exists, record BLOCKED;
   do not enable the route for the test.
5. If WebSocket support is explicitly enabled in staging, test unauthenticated,
   invalid/expired, no-membership, A-on-B, and permitted A-on-A cases.
   Authentication and tenant authorization must precede accept or data
   delivery. Otherwise verify owner evidence that it is disabled; do not
   connect to production.
6. As the database owner/operator, inspect the effective state after approved
   migrations: migration ledger/order; schema/table ownership; role membership
   and `BYPASSRLS`; grants and default privileges; `relrowsecurity` and
   `relforcerowsecurity`; applicable policies and predicates; helper
   functions' owners/security-definer/search-path/grants; and the actual roles
   used by authenticated queries. Exercise allowed/denied SELECT and writes
   as the real synthetic roles. Do not infer effective RLS from SQL files.
7. Because the Python service uses a service-role client that can bypass RLS,
   separately prove server-side tenant filters and permission checks on each
   privileged path. Database RLS inspection alone does not establish the
   safety of service-role operations.
8. Capture synthetic case IDs, status/result classes, response field names,
   before/after row counts or approved side-effect evidence, and sanitized
   authorization/query traces. Never capture bearer tokens or real customer
   data. Reset/discard the database through the owner-approved workflow.

**Closure criteria**

Close TODO B only when authorized runtime tests demonstrate same-tenant
permitted reads and cross-tenant denial for direct-record and replay paths,
client-supplied tenant IDs cannot override verified membership, no denied
case leaks protected data or causes a write, and effective database grants/RLS
plus any privileged service-role query filters are inspected in the disposable
target. All results must use synthetic identities/data and retain sanitized
evidence tied to the service build. If a route/schema is unavailable, an
owner approval is missing, or effective policy state cannot be inspected,
record **BLOCKED** and leave the TODO open.

## 9. Closure and reporting rules

- Do not modify either `test.todo` assertion to make the suite appear green.
- An approved source-level test may supplement these plans, but cannot replace
  deployed route ownership or effective database evidence.
- Record test target/build, owner approval, case IDs, sanitized outcomes, and
  evidence location without recording credentials, token values, or customer
  data.
- Stop on any unexpected data disclosure or mutation; preserve sanitized
  evidence and notify the authorized service/security owner.

## 10. Prioritized recommendations

1. **Backend owner: resolve `/ws` deployment status immediately.** Identify
   the active service/build and externally reachable WebSocket topology. If
   the endpoint is unused, disable it in the actual service. If required,
   approve an authenticated, tenant-authorized design before use. Exposure
   remains unknown until verified by the owner.
2. **Keep runtime event APIs fail-closed.** The Express source's global replay
   handlers and context-only event store do not implement organization
   ownership beneath the current 503 middleware. Do not activate them until
   ownership, authentication, and cross-tenant tests are implemented.
3. **Obtain Stage 2G prerequisites.** Confirm approved non-production API and
   frontend ownership, immutable build IDs, routing map, synthetic test
   authorization, and disposable database workflow.
4. **Run TODO A first** to establish the actual API owner and route contracts;
   then run TODO B against that identified service and disposable database.
5. **Inspect effective database controls** and explicitly test the Python
   service's privileged service-role query scoping. Source migrations are not
   evidence of applied policies.

## 11. Required approvals and environment entry gate

Before any integration or security request, obtain:

- Service owner confirmation of the exact staging hosts, API service/build,
  route map, WebSocket state, allowed request methods, test window, and stop
  contact.
- Written authorization for synthetic authentication, cross-tenant, and
  (only if applicable) WebSocket testing.
- Database owner confirmation of isolation, synthetic-only contents, schema
  version/extensions, authoritative migration ledger/order, permitted access
  roles, grant/RLS inspection method, and safe reset/discard operator.
- Approved identity and credential handling through the organization secret
  manager; do not place credentials in chat or source.
- Expected route behavior signed off before requests are sent.

Until all prerequisites for a particular test are met, that test is
**BLOCKED**. This report grants no production or staging access and does not
authorize migrations, provisioning, deployment, or configuration changes.

## 12. Final Git status and operational actions

Final repository state at report creation:

- Branch `main`, HEAD `c797876cef7a84cb278e85ee02158290c28f0917`;
  `origin/main` was the same SHA at inspection.
- Preserved modified files:
  [next-gen-workspace.tsx](../../../components/platform-next/next-gen-workspace.tsx),
  [organization-center-workspace.tsx](../../../components/organization-center/organization-center-workspace.tsx),
  [organization-center-components.tsx](../../../components/organization-center/organization-center-components.tsx).
- Preserved untracked Stage 2H report:
  [stage-2h-production-verification.md](./stage-2h-production-verification.md).
- Added by this stage:
  [stage-2i-backend-ownership-and-test-readiness.md](./stage-2i-backend-ownership-and-test-readiness.md).
- No application files or TODO tests were changed. No test/build command was
  run. `git diff --check` passed for tracked changes; the new untracked report
  separately passed a trailing-whitespace check.
- No production access, probing, database access, migration, provisioning,
  deployment, configuration change, commit, push, or merge occurred.
