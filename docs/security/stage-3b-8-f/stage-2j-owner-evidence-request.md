# Stage 2J — Infrastructure Owner Evidence Request

**Purpose:** Collect specific evidence needed to identify AIOS backend
ownership and prepare authorized synthetic security testing. This request is
not approval to access production, probe any service, connect to a database,
apply migrations, or change infrastructure.

**Current disposition:** No owner response or provider-generated deployment
evidence was available for this stage. No external request has been sent.
Infrastructure and runtime verification remains blocked.

## 1. Ready-to-send request

> **Subject: AIOS Pilot — evidence request for approved non-production security verification**
>
> Please provide the evidence below through the organization-approved channel.
> No production testing, deployment, provisioning, or database modification is
> requested by this handoff.
>
> **Service ownership and identity**
>
> 1. Identify the frontend hosting provider, project/service, environment,
>    named responsible owner and team, and the approved non-production
>    frontend URL.
> 2. Identify the FastAPI service provider, service identifier, actual entry
>    point and start command, named responsible owner and team, and approved
>    non-production API URL. Confirm whether `main.py` is deployed.
> 3. If deployed, identify the Express service provider, service identifier,
>    entry point, named responsible owner and team, and approved
>    non-production API URL. Confirm whether `src/server.ts` is deployed.
> 4. Identify whether `main_backup.py` or any other legacy/alternate API,
>    worker, scheduled job, function, proxy, gateway, rewrite, or separate
>    domain can reach the same data or expose equivalent routes.
> 5. For each relevant service, provide provider-generated deployment
>    metadata showing service/environment, immutable build or deployment ID,
>    deployed commit SHA, source branch, and deployment timestamp. Please
>    distinguish provider records from owner statements.
> 6. Identify which service receives API traffic and which receives WebSocket
>    traffic, with sanitized routing/export evidence. State the configured
>    frontend API base URL by variable name and destination/host only; do not
>    include secret values.
>
> **Runtime routes**
>
> Please provide the active route inventory and responsible service/build for:
>
> - `GET /aios/events`
> - `GET /aios/timeline`
> - `GET /aios/replay/:contextId`
> - `GET /aios/debug/:contextId`
> - `POST /intelligence/event`
> - FastAPI WebSocket `/ws`
> - Legacy WebSocket `/ws/autopilot`, if its application is deployed
> - Any equivalent replay, event ingestion, customer, runtime, or legacy route
> - Authentication/identity endpoints, organization selection or membership
>   routes, protected customer/business routes, and the middleware/dependencies
>   that enforce identity and permissions
> - Public demo routes and the API/data paths they can invoke
>
> For each, state whether it is public, internal-only, or disabled; describe
> its authentication mechanism and server-side identity validation,
> organization-membership and role checks, tenant scope, replay/mutation
> behavior, service/build identity, evidence source, and evidence timestamp.
> Include gateway/proxy routing and any route that is disabled intentionally.
>
> **WebSocket `/ws`**
>
> Please establish whether `/ws` exists in the active deployed build and
> whether any internet-facing proxy or gateway forwards to it. Provide
> evidence showing whether authentication and authorization occur before
> accepting a connection or sending data; how messages validate identity,
> organization membership, tenant, schema, and permissions; and whether
> cross-organization subscriptions, reads, writes, or message delivery are
> possible. State whether an approved mitigation is required before the
> endpoint can be considered for production. This is a source-identified
> authentication concern; deployment exposure is **UNKNOWN**, not a confirmed
> production vulnerability.
>
> **Database security evidence**
>
> Identify the database provider and responsible owner. Provide a sanitized
> description of schemas/tables containing organization-scoped customers,
> KPIs, insights, events, or replay data; migration version and application
> status; RLS enabled/forced state; effective schema/table/function/sequence
> grants; service-role and application-role permissions; and relevant
> SELECT/INSERT/UPDATE/DELETE policies. Explain whether any API/worker path
> bypasses intended tenant restrictions. Describe an approved, read-only
> procedure to inspect effective permissions and policies. Do not provide
> customer rows or raw secrets.
>
> **Approved synthetic test environment**
>
> Confirm a dedicated non-production frontend/API environment, exact approved
> base URLs, owners, immutable build IDs, and written authorization to run the
> Stage 2I synthetic test plan. Identify an isolated, disposable database
> confirmed to contain synthetic data only and not be shared or replicated
> with production. Confirm the approved access and migration workflow, policy
> inspection process, and reset/recreation procedure.
>
> Provision through approved workflows only: unrelated synthetic Organizations
> A and B; separate active users and records for each; a user without active
> membership; and authorized, unauthorized, invalid, expired, and (where
> supported) unverified identity cases. Confirm a read-only role and the
> expected same-tenant and cross-tenant outcomes. Name the owner who approves
> the test window and can stop testing.
>
> For demo/live separation, provide sanitized architecture or request/log
> evidence showing which data providers and API paths the public demo uses,
> that demo requests cannot reach production customer data, and that demo
> actions cannot cause live business mutations. Identify a safe synthetic
> negative-test method and its authorized environment; do not include
> customer records or production payloads.
>
> Please provide sanitized screenshots, deployment metadata, configuration
> exports, route maps, or catalog evidence that can be reviewed without
> credentials. Distinguish an owner assertion from provider-generated
> evidence. Do not send passwords, bearer tokens, private keys, database URLs,
> service-role keys, customer records, or other secret values in chat, email,
> logs, source, or this request. Use the approved secret-management and
> operator-authentication workflow.

This request is prepared but has **not** been sent. No external owner has
confirmed a service, route, database, approval, or mitigation.

## 2. Evidence status definitions

Use only these status values:

- `NOT REQUESTED`
- `REQUESTED`
- `RECEIVED — NOT VERIFIED`
- `VERIFIED`
- `BLOCKED`
- `NOT APPLICABLE — JUSTIFIED`

Evidence categories must remain distinct:

- **Source-code evidence:** what this repository declares or implements.
- **Owner-provided assertion:** a statement from the responsible owner; not
  independently verified by itself.
- **Provider-generated deployment evidence:** provider metadata or sanitized
  exports identifying actual service/build/configuration.
- **Independently verified test evidence:** results from an explicitly
  approved test against the identified non-production target.

No infrastructure requirement is marked `VERIFIED` in this tracker. Stage 2J
did not inspect provider deployment evidence or run an approved integration
test. A source declaration cannot establish deployment.

## 3. Evidence tracker

There are **19 evidence requirements**. All remain `NOT REQUESTED` because
this handoff has not been sent. A requirement becomes `BLOCKED` if its owner,
target, approval, or necessary evidence is unavailable. Do not change a status
to `VERIFIED` until the evidence has been inspected and its verification
method and reviewer are recorded.

| ID | Requirement | Responsible owner/role | Evidence expected | Evidence received | Independent verification method | Status | Blocking consequence / next action |
|---|---|---|---|---|---|---|---|
| E01 | Frontend host, project, environment, non-production URL, owner | Frontend/infrastructure owner | Provider deployment metadata and approved URL | None | Match provider project/environment/build metadata to approved target | NOT REQUESTED | Cannot select approved frontend; owner to provide deployment identity |
| E02 | FastAPI service and actual entry point/start command | Backend service owner | Service configuration/export identifying app, start command, host and environment | None | Compare provider metadata with source and deployment configuration | NOT REQUESTED | Cannot establish whether `main.py` serves traffic |
| E03 | Express service deployment status and owner | Backend/platform owner | Provider service metadata or owner confirmation if absent | None | Confirm selected build and route/service mapping | NOT REQUESTED | Cannot establish whether `/aios/*` or `/intelligence/*` is served |
| E04 | Legacy, alternate, worker, scheduled, proxy, gateway and domain inventory | Infrastructure owner | Sanitized route/service inventory and owner statement | None | Reconcile each independent entry point against provider routing records | NOT REQUESTED | Alternate bypasses remain unknown |
| E05 | Deployed build identifiers, SHA, branch, timestamp for every relevant service | Service owners | Provider-generated deployment metadata | None | Tie service's active deployment record to immutable commit/build | NOT REQUESTED | No build can be selected for security verification |
| E06 | Frontend runtime API base URL destination | Frontend owner | Sanitized configuration showing variable name and destination only | None | Compare frontend build config with approved API routing map | NOT REQUESTED | Frontend-to-API path remains unknown |
| E07 | Owners and enabled/reachable state for four `/aios/*` GET routes | API/service owner | Route inventory mapped to service/build, gateway evidence, route contract | None | Trace each route to deployed handler using approved metadata/logs | NOT REQUESTED | TODO 1 blocked |
| E08 | `POST /intelligence/event` deployment state and security contract | API/service owner | Route mapping and enabled/disabled contract | None | Verify owning service/build and authorization behavior | NOT REQUESTED | Cannot verify whether ingestion is reachable or disabled |
| E09 | `/ws` deployment and gateway exposure | Backend/infrastructure owner | Active build route list and sanitized proxy/WebSocket mapping | None | Reconcile provider routing with deployed application/build metadata | NOT REQUESTED | Source-authentication concern remains unresolved |
| E10 | `/ws` authentication, tenant authorization, message checks, mitigation | Backend security owner | Auth design/config evidence and approved non-production behavior | None | Inspect identity-before-accept flow; authorized synthetic negative/positive cases | NOT REQUESTED | Cannot determine deployed exposure/control |
| E11 | `/ws/autopilot` and equivalent legacy route status | Backend/infrastructure owner | Legacy service inventory and route map | None | Verify all applicable deployed entry points | NOT REQUESTED | Legacy path could not be ruled out |
| E12 | Database provider, owner, schemas and relevant data tables | Database owner | Sanitized schema/table inventory and owner confirmation | None | Compare inventory with approved target catalog/schema | NOT REQUESTED | Cannot scope effective policy review |
| E13 | Migration ledger/version/order/application state | Database owner | Sanitized migration ledger and database version | None | Reconcile ledger to source migration set and target | NOT REQUESTED | Effective schema/policy state unknown |
| E14 | Effective RLS state and SELECT/INSERT/UPDATE/DELETE policies | Database owner | Sanitized catalog output for RLS flags and policies | None | Inspect effective target catalog; run approved role checks | NOT REQUESTED | TODO 2 blocked; migration source is insufficient |
| E15 | Effective schema/table/function/sequence grants and role attributes | Database owner | Sanitized grants, owners, role attributes and function privilege evidence | None | Inspect target privileges and approved synthetic-role behavior | NOT REQUESTED | Privileged bypass and effective permissions unknown |
| E16 | Disposable synthetic DB and reset/recreation procedure | Database owner/operator | Target identifier, synthetic-only/isolation confirmation, approved reset runbook | None | Owner verification plus approved target identity check | NOT REQUESTED | No database tests may begin |
| E17 | Synthetic A/B identities, records, roles and identity edge cases | Identity/test environment owner | Fixture plan and test-identity provisioning workflow; no secrets | None | Verify fixture memberships/ownership and intended role matrix on approved target | NOT REQUESTED | Cross-tenant cases cannot be executed |
| E18 | Written test approval, window, limits, stop contact and release reviewer | Authorized security/service owner | Written scope approval and named accountable reviewer | None | Confirm scope matches targets, routes, methods, dates and test plan | NOT REQUESTED | No test is authorized; release decision cannot be approved |
| E19 | Public demo remains isolated from production customer reads and live mutations | Frontend/API owner and demo data owner | Sanitized deployed demo-provider/routing map and approved synthetic negative-test method | None; source/local observations do not establish deployed-path isolation | Review deployed routing/provider configuration and sanitized evidence; run approved non-production negative tests | NOT REQUESTED | Demo/live boundary is unverified; no release approval |

## 4. Deployment ownership decision matrix

Do not select an application based only on `render.yaml`, `Procfile`, README
content, or a local route declaration.

| Deployment scenario | Evidence needed | Next verification action |
|---|---|---|
| FastAPI is the only deployed backend | Provider metadata identifies active FastAPI service/build; complete gateway and WebSocket routing map; no Express/legacy/worker entry points to relevant data | Verify `/ws` exposure and identity behavior first; establish how the four frontend runtime GET routes are served, including whether they are intentionally disabled; then execute approved tests |
| Express is the only deployed backend | Provider metadata identifies Express service/build and owner; active route map; confirm FastAPI/legacy are absent or unreachable through all relevant ingress paths | Verify replay and ingestion remain disabled or have documented server-side identity and tenant controls; test only approved routes |
| Both FastAPI and Express are deployed | Independent service/build evidence and complete route/proxy/domain map for each | Test each route at each independently reachable service; do not assume one service's auth protects another |
| Legacy or alternate backend is deployed | Provider/service inventory for legacy apps, jobs, functions, proxies and data access | Treat each as an independent security boundary; inventory routes, authentication, tenant scope and database role before testing |
| Deployment cannot be identified | No authoritative provider-generated service/build/routing evidence | **BLOCKED.** Do not probe; request owner identity and deployment evidence |
| Active backend differs from repository configuration | Provider metadata and actual start command/build identity demonstrating the discrepancy | Document actual owner and route contract; inspect that service's source/build and data paths; revise verification plan only after authorized evidence |

The matrix is a decision aid, not evidence that any scenario is currently
true. The selected scenario remains **UNKNOWN**.

## 5. Reconfirmed repository facts and release gate

Current-source facts rechecked for this handoff:

- The four frontend GET routes are exactly `/aios/events`,
  `/aios/timeline`, `/aios/replay/:contextId`, and `/aios/debug/:contextId`.
  Call sites are in `lib/runtime/runtime-events.ts`; the regression contract is
  in `tests/security/security-foundation.test.ts`.
- `src/server.ts` mounts `src/api/replay.ts` at `/aios` and
  `src/api/intelligence.ts` at `/intelligence`. The first router middleware in
  both modules currently returns HTTP 503 before the downstream handlers.
- FastAPI `main.py` declares `/ws` and accepts the connection before any
  application authentication check. Deployment exposure remains **UNKNOWN**.
- `main_backup.py` declares `/ws/autopilot` and closes before accepting.
- Both existing deployment-dependent TODOs remain unchanged and open. Their
  exact strings and closure criteria are in
  [stage-2j-security-todo-closure-plan.md](./stage-2j-security-todo-closure-plan.md).
- Deployed environment-variable presence cannot be established safely from
  repository source; only the relevant variable names are listed in Stage 2I.

### Security-sensitive paid-pilot release gate

AIOS is **NOT approved for a security-sensitive paid pilot** until evidence
establishes all applicable gates:

1. Deployed backend ownership and immutable build identity.
2. All active API, WebSocket, legacy, alternate and worker paths.
3. WebSocket exposure and authentication behavior.
4. Effective database tenant policies and permissions.
5. Cross-organization read and replay isolation in approved non-production.
6. Replay and ingestion remain disabled until authorization and isolation
   requirements are met.
7. Demo data is isolated from live business data.
8. Existing security tests, validation and integration checks pass.
9. Both deployment-dependent TODOs are closed only after their evidence-based
   criteria are met.
10. A named responsible owner reviews the evidence and explicitly approves
    the release decision.

Completing this request or collecting owner assertions alone does not satisfy
these gates or grant release approval.

## 6. Stage 2J limits

- No production/staging endpoint was contacted or probed.
- No database was connected to; no SQL, migration, seed or destructive command
  was run.
- No tests or builds were run; this stage adds documentation only.
- No credentials or secret values were inspected or recorded.
- No application behavior, test, deployment configuration, or existing
  worktree modification was changed.
