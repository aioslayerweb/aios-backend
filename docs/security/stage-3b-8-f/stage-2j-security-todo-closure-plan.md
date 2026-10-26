# Stage 2J — Security TODO Closure Plan

**Status:** Both deployment-dependent TODOs remain open. This plan specifies
what an authorized engineer must verify; it does not itself close either TODO
or authorize any test.

## 1. Existing TODOs and related source

The exact assertions in
[security-foundation.test.ts](../../../tests/security/security-foundation.test.ts#L61)
are:

1. `selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved`
2. `user cannot read or replay a record owned by another organization`

Do not edit, remove, skip, or convert these TODOs into mocks. Current source
declares the frontend calls in
[runtime-events.ts](../../../lib/runtime/runtime-events.ts#L241). The four
paths, current Express routers, FastAPI WebSocket, and legacy WebSocket are
summarized below. Source declarations are not deployment evidence.

| Surface | Source evidence | Current source state |
|---|---|---|
| Runtime event list | `GET /aios/events` in `runtime-events.ts`; Express mount in `src/server.ts`, route in `src/api/replay.ts` | Router-wide middleware returns 503 before handlers |
| Runtime timeline | `GET /aios/timeline` | Same 503 middleware |
| Runtime replay | `GET /aios/replay/:contextId` | Same 503 middleware |
| Runtime debug | `GET /aios/debug/:contextId` | Same 503 middleware |
| Event ingestion | `POST /intelligence/event` | Intelligence router returns 503 before handler |
| Primary WebSocket | FastAPI `/ws` in `main.py` | Current repository source closes before accepting with policy code 1008; no authenticated protocol is implemented; deployed exposure **UNKNOWN** |
| Legacy WebSocket | `/ws/autopilot` in `main_backup.py` | Source closes before accepting; deployment **UNKNOWN** |

**Stage 2N local change:** The primary FastAPI `/ws` endpoint now closes
connections before acceptance because the repository has no established
WebSocket authentication, membership, or message-authorization protocol. The
local regression test confirms no connection is accepted and no client
message is processed. This does not prove which build is deployed or whether
an upstream gateway still exposes the path; owner/provider evidence remains
required.

## 2. Test governance and evidence requirements

Before any test, the authorized service owner and security/test approver must
provide:

- Written authorization scoped to exact non-production hosts, service/build
  IDs, methods, routes, test window, rate limits, and stop contact.
- Exact route contracts and expected enabled/disabled states, including
  expected status/result for each test case. Do not infer a numeric status
  code before the owner confirms the contract.
- Provider-generated evidence tying each host and route to the active deployed
  service and immutable build.
- For database cases: database-owner confirmation of a disposable,
  isolated, synthetic-only target, migration ledger/order, access roles,
  effective-policy inspection method and reset procedure.
- Synthetic Organization A/B, separate active users and records/events where
  supported, no-membership identity, and role fixtures. Create test identities
  through approved workflows only; never store or print credential values.

Record a sanitized test case ID, timestamp/window, target identifier, service
and build, route owner, expected contract, result class, evidence location,
and reviewer. Retain no bearer tokens, passwords, private keys, connection
strings, customer records, or unnecessary personal data. Distinguish:

- **Source evidence:** local declaration or implementation.
- **Owner assertion:** owner statement, not independently verified by itself.
- **Provider evidence:** deployment/runtime metadata from the hosting provider.
- **Independent test evidence:** approved synthetic test result tied to a
  verified environment/build.

## 3. TODO 1 — deployed API ownership and runtime behavior

### Objective

Verify which deployed service owns every frontend runtime route, its immutable
build identity and actual enabled/disabled behavior, and the authentication
and authorization boundary applied before sensitive access.

### Required prerequisites

1. Approved non-production frontend and API URLs and written test scope.
2. Provider-generated service/build metadata: provider, project/service,
   deployment ID, commit SHA, source branch and deployment time.
3. Complete routing inventory for frontend, API, proxy/rewrite/gateway,
   alternate services, workers and WebSocket forwarding.
4. Owner-signed route contract for each route, including enabled/disabled
   state, expected success/error response shape and authentication model.
5. A documented browser-to-server authentication mechanism. The source
   `runtime-client.ts` currently sends JSON but does not attach a bearer
   token; do not infer that a protected runtime request is authenticated.
6. Named service owner and security/test approver; approved window, request
   limits and stop contact.

### Approved non-production test cases

Run only after the prerequisites above are confirmed:

| Case | Request/action | Expected secure outcome |
|---|---|---|
| Ownership/build verification | Trace each route through deployed routing metadata to its final service and handler; capture active immutable build | Each route maps to the owner-declared service/build and matches the approved contract. A source manifest or generic gateway response is insufficient. |
| `R1` list | `GET /aios/events` | If enabled: documented response only, with auth/tenant policy established. If disabled: owner confirms disabled state and owning service; a generic 503 alone is not proof. |
| `R2` timeline | `GET /aios/timeline` | Same; no unscoped global event disclosure. |
| `R3` replay | `GET /aios/replay/{synthetic-context-A}` | Same-tenant behavior follows the approved contract; foreign context must not disclose data. |
| `R4` debug | `GET /aios/debug/{synthetic-context-A}` | Debug summary and event data follow the approved tenant/permission contract; no foreign details. |
| Authentication boundary | For each enabled protected route: no credential, malformed credential, invalid synthetic identity, expired synthetic identity, then permitted synthetic identity | Denials occur before protected data access; permitted behavior matches contract. Status codes must be taken from the confirmed contract and recorded, not assumed here. |
| Membership/role boundary | Valid synthetic identity without membership; valid membership with insufficient role; permitted role | Server-derived active membership/permission determines access; client-supplied organization identifiers do not authorize. |
| Route/contract mismatch | Approved malformed path/context or malformed body only for a route that accepts a body | Reject according to documented contract without protected data, side effects, or diagnostic leakage. |
| Ingestion control | If `POST /intelligence/event` is in scope, verify owner/build and enabled/disabled contract; only then use synthetic valid/invalid payload tests | If disabled, verify service ownership and fail-closed behavior. If enabled, server derives tenant ownership and rejects foreign attribution without a write. |
| WebSocket routing | Verify active route and proxy forwarding from provider metadata; test only the approved non-production endpoint | If disabled, evidence shows it is disabled at the owning service/gateway. If enabled, identity and authorization precede accept or data delivery. |
| Alternate service check | Apply ownership and authentication cases to every separately reachable service that exposes these routes | No alternate/legacy service bypasses the approved boundary. |

Do not probe production. Do not send unauthenticated test traffic until the
explicit non-production target and approval are in place.

### Evidence, pass/fail and stop conditions

Capture:

- Provider deployment record and immutable build IDs.
- Route-to-service/gateway map and signed-off enabled/disabled contract.
- For each case: synthetic case ID, route/method, expected result, observed
  result/status class, response key names (not sensitive content), and
  sanitized service/auth/query trace showing the responsible handler and
  authorization order.
- Owner and independent reviewer identity/role and review date.

**PASS / TODO closure:** Every frontend route has confirmed deployed
ownership/build identity and behavior matching its approved contract; every
enabled sensitive route enforces documented authentication, membership and
permissions before data access; disabled paths are proven disabled at the
actual owning service; alternate paths are accounted for; and a reviewer
approves the evidence.

**FAIL:** Wrong/unknown handler for an expected enabled route, unexpected
route exposure, contract mismatch, unauthenticated sensitive access, access
before authorization, sensitive data in an error, or WebSocket acceptance/
delivery without the approved identity and tenant checks. Stop that test
immediately, do not broaden scope, preserve sanitized evidence, and notify
the owner.

**BLOCKED:** Missing owner, build identity, route contract, target approval,
test identities, routing trace, or reviewer. The TODO remains open. A local
test, source manifest, compile, or generic 401/403/503 cannot close it.

## 4. TODO 2 — cross-organization read/replay isolation

### Objective

Demonstrate that a verified user can access only permitted records/events for
their active organization, cannot read or replay another organization's data,
and cannot trigger unauthorized writes or message delivery through alternate
paths.

### Required synthetic environment

- Disposable database isolated from production and confirmed synthetic-only.
- Owner-approved schema/migration reconciliation and migration workflow.
  Do not apply a migration until target identity and explicit approval are
  confirmed.
- Organization A and Organization B with unrelated synthetic IDs.
- User A, active only in A; User B, active only in B; User C with no active
  membership.
- One synthetic customer record per organization. Runtime event/context
  fixtures only if deployed schema and an approved organization-ownership
  contract support them. Include an unmapped record if supported.
- A read-only role and a role used for authorized reads; invalid, expired,
  and where the existing auth model supports it, unverified/malformed identity
  test cases.
- Documented endpoint contracts, owner-approved test window, reset/discard
  procedure, and stop contact.

### Approved non-production cases

| Case | Test | Expected secure outcome |
|---|---|---|
| `T1` same-tenant control | User A reads its own permitted A record; User B reads its own permitted B record | Permit only the fields/operations in the approved route contract; no records from another tenant. |
| `T2` direct cross-tenant | User A requests B's record ID; User B requests A's record ID | Deny without record contents or a response that reveals whether the foreign record exists; no side effect. |
| `T3` client tenant override | As A, provide organization B in each supported query/path/body selector; repeat symmetrically | Server derives tenant from verified identity and active membership; supplied foreign ID cannot switch tenant. |
| `T4` missing membership | User C requests protected A/B records and runtime data | Denied before protected query; response does not reveal records. |
| `T5` identity failures | Missing, malformed, invalid, expired, and unverified identity cases where supported | Denied at the verified authentication boundary before membership/data access; record expected status from the approved API contract. |
| `T6` role denial | Read-only or otherwise insufficient role attempts a protected mutation/admin operation if such a route exists | Denied without state change; do not invent or invoke unsupported operations. |
| `T7` replay/debug | A requests B's synthetic event/context with replay and debug routes; test same-tenant A control if enabled | A cannot receive B's event, payload, summary, existence-sensitive detail, or cursor data. Global timeline/list is tenant-filtered or remains explicitly disabled. |
| `T8` ingestion/write | If an approved ingestion/mutation endpoint is enabled, A submits B's organization/context identifiers | Reject or safely normalize to verified A ownership as documented; no B row/event or side effect is created. If disabled, do not enable it for testing. |
| `T9` WebSocket | If enabled in approved staging, attempt missing/invalid/expired identity, no membership, A-on-B, and permitted A-on-A | Authentication/tenant authorization precedes connection acceptance and any message delivery; no cross-tenant message or write. If disabled, confirm owner/provider evidence of disabled routing. |
| `T10` alternate/legacy path | Repeat applicable read/replay/ingestion cases against each independently reachable legacy, worker, or alternate service | No bypass of the primary identity or tenant boundary. |
| `T11` unmapped ownership | Request intentionally unmapped synthetic record/event where supported | Deny or quarantine; never infer organization; no protected detail leaks. |
| `T12` effective database policy | Inspect and exercise the disposable target using approved application and synthetic roles | Confirm migration ledger, table owners, role attributes/BYPASSRLS, grants/default grants, RLS enabled/forced flags, policies for SELECT/INSERT/UPDATE/DELETE, helper-function ownership/security/grants, and role-specific access. Results match the expected tenant matrix. |
| `T13` service-role scope | Exercise each relevant privileged API path using synthetic A/B fixtures and inspect sanitized query/filter evidence | Since service-role access can bypass RLS, every privileged data operation independently constrains the query by server-authorized organization and permission; denied requests produce no query/write side effect. |

### Evidence, pass/fail and stop conditions

Capture sanitized case labels, environment/service/build ID, route owner,
expected and observed response classes, permitted response field names,
authorization/query ordering, before/after synthetic row or event counts,
effective grant/RLS evidence, and independent reviewer sign-off. Do not copy
test tokens, full payloads, database connection details, or customer data into
evidence.

**PASS / TODO closure:** Same-tenant permitted reads work as documented;
cross-tenant direct, replay/debug, client-selected organization, and applicable
alternate paths deny without content/existence disclosure; missing/invalid/
expired identity and missing membership deny before data access; unauthorized
writes and WebSocket delivery do not occur; effective database policy/grants
are inspected on the disposable target; and privileged service-role paths
show explicit server-side tenant and permission scope. Results are tied to the
verified service build and approved synthetic fixtures.

**FAIL:** Any foreign record/event/message is returned, cross-tenant write or
side effect occurs, identity/membership is bypassed, sensitive data leaks in
an error, unmapped data is exposed, or effective grants/policies allow
unexpected access. Stop immediately, do not retry or broaden requests, retain
sanitized evidence, and notify the authorized owner.

**BLOCKED:** No approved disposable target, synthetic-only confirmation,
owner approval, verified build, usable synthetic fixtures, effective-policy
inspection path, or enabled route contract. Keep the TODO open; do not
substitute mocked tests, migration source, or an assumed 401/403/503.

## 5. Status changes and release review

The test TODOs may be changed only after:

1. The relevant cases above have run under written approval.
2. Evidence is sanitized, retained at an approved location, and tied to the
   actual service/build and target.
3. The responsible service/security owner has reviewed the evidence and
   confirmed pass criteria.
4. Any failure has been resolved and retested; no pass is inferred from a
   blocked or disabled source path.

This plan does not approve a security-sensitive paid pilot. Release approval
also requires a named accountable owner to review all applicable security,
database, demo/live-separation, validation and operational evidence and
explicitly record the decision.
