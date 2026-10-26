# Stage 2J/2K — Infrastructure Evidence Tracker

**Tracker status (Stage 2L review, 2026-10-26):** No owner response or
infrastructure evidence was found in the locally available repository
artifacts. The Stage 2J request explicitly says it has not been sent.
Therefore, no request is represented as `REQUESTED`, and no
deployment/database item is `VERIFIED`.

## Provenance and status rules

The Stage 2J tracker was embedded in
[stage-2j-owner-evidence-request.md](./stage-2j-owner-evidence-request.md);
the separately referenced `stage-2j-evidence-tracker.md` did not exist at the
start of Stage 2K. This standalone tracker makes the embedded requirements
available at the expected path. The initial evidence entries and statuses
below are copied from that tracker and reconciled against the current local
reports. No owner response, provider-generated deployment evidence, approved
configuration export, or independently verified integration result was
present among the reviewed local artifacts.

Evidence categories must not be conflated:

- **Source-code evidence:** repository configuration/implementation only.
- **Owner assertion:** a responsible person's statement; not independent
  deployment verification.
- **Provider evidence:** hosting/database-provider generated metadata or
  sanitized exports.
- **Independent test evidence:** authorized synthetic test results tied to a
  verified target and build.

Allowed statuses only:

- `NOT REQUESTED`
- `REQUESTED`
- `RECEIVED — NOT VERIFIED`
- `VERIFIED`
- `BLOCKED`
- `NOT APPLICABLE — JUSTIFIED`

All requirements remain `NOT REQUESTED`: the request has not been sent and no
response is available. Missing evidence is described in each row; source
declarations are explicitly labeled as source-only and are not accepted as
deployment evidence. Do not change a status to `REQUESTED` unless the request
is actually sent; do not use `VERIFIED` for source-only facts.

## Evidence requirements

| ID | Requirement | Responsible owner/role | Evidence expected | Evidence received in reviewed local artifacts | Independent verification method | Status | Blocking consequence / next action |
|---|---|---|---|---|---|---|---|
| E01 | Frontend host, project, environment, approved non-production URL and owner | Frontend/infrastructure owner | Provider deployment metadata and approved URL | None | Match provider project/environment/build metadata to approved target | NOT REQUESTED | Cannot select an approved frontend; owner to provide deployment identity |
| E02 | FastAPI service and actual entry point/start command | Backend service owner | Service configuration/export identifying app, start command, host and environment | Source only: `render.yaml` and `Procfile` select `main:app`; no active service evidence | Compare provider metadata with source and deployment configuration | NOT REQUESTED | Cannot establish whether `main.py` serves traffic |
| E03 | Express service deployment status and owner | Backend/platform owner | Provider service metadata or owner confirmation if absent | Source only: `src/server.ts` exists; no deployment evidence | Confirm selected build and route/service mapping | NOT REQUESTED | Cannot establish whether `/aios/*` or `/intelligence/*` is served |
| E04 | Legacy, alternate, worker, scheduled, proxy, gateway and domain inventory | Infrastructure owner | Sanitized route/service inventory and owner statement | Source only: FastAPI, Express and legacy app declarations; no deployed inventory | Reconcile each independent entry point against provider routing records | NOT REQUESTED | Alternate bypasses remain unknown |
| E05 | Deployed build identifiers, SHA, branch and timestamp for relevant services | Service owners | Provider-generated deployment metadata | None; Git `origin/main` is not deployment evidence | Tie service's active deployment record to immutable commit/build | NOT REQUESTED | No build can be selected for security verification |
| E06 | Frontend runtime API base URL destination | Frontend owner | Sanitized configuration showing variable name and destination/host only | Source only: configuration variable names/fallback are known; deployed value absent | Compare frontend build configuration with approved API routing map | NOT REQUESTED | Frontend-to-API path remains unknown |
| E07 | Owners and enabled/reachable state for four `/aios/*` GET routes | API/service owner | Route inventory mapped to service/build, gateway evidence and route contract | Source only: paths are known; no deployed owner or behavior | Trace each route to deployed handler using approved metadata/logs | NOT REQUESTED | TODO 1 blocked |
| E08 | `POST /intelligence/event` deployment state and security contract | API/service owner | Route mapping and enabled/disabled contract | Source only: Express route exists behind 503 middleware | Verify owning service/build and authorization behavior | NOT REQUESTED | Cannot verify whether ingestion is reachable or disabled |
| E09 | `/ws` deployment and gateway exposure | Backend/infrastructure owner | Active build route list and sanitized proxy/WebSocket mapping | Source only: `/ws` is declared by FastAPI; deployment exposure unknown | Reconcile provider routing with deployed application/build metadata | NOT REQUESTED | Source authentication concern remains unresolved |
| E10 | `/ws` authentication, tenant authorization, message checks and mitigation | Backend security owner | Auth design/config evidence and approved non-production behavior | Source only: current repository handler closes before accept with policy code 1008; no authenticated WebSocket protocol is implemented; deployed exposure remains unknown | Inspect deployed identity-before-accept flow; run approved synthetic cases or verify disabled routing | NOT REQUESTED | Cannot determine deployed exposure/control |
| E11 | `/ws/autopilot` and equivalent legacy route status | Backend/infrastructure owner | Legacy service inventory and route map | Source only: legacy handler closes before accept | Verify all applicable deployed entry points | NOT REQUESTED | Legacy path could not be ruled out |
| E12 | Database provider, owner, schemas and relevant data tables | Database owner | Sanitized schema/table inventory and owner confirmation | None | Compare inventory with approved target catalog/schema | NOT REQUESTED | Cannot scope effective policy review |
| E13 | Migration ledger/version/order/application state | Database owner | Sanitized migration ledger and database version | Source migration files only; no target ledger or applied state | Reconcile ledger to source migration set and target | NOT REQUESTED | Effective schema/policy state unknown |
| E14 | Effective RLS state and SELECT/INSERT/UPDATE/DELETE policies | Database owner | Sanitized catalog output for RLS flags and policies | None; migration source is not effective policy evidence | Inspect effective target catalog; run approved role checks | NOT REQUESTED | TODO 2 blocked |
| E15 | Effective schema/table/function/sequence grants and role attributes | Database owner | Sanitized grants, owners, role attributes and function privilege evidence | None | Inspect target privileges and approved synthetic-role behavior | NOT REQUESTED | Privileged bypass and effective permissions unknown |
| E16 | Disposable synthetic database and reset/recreation procedure | Database owner/operator | Target identifier, synthetic-only/isolation confirmation, approved reset runbook | None | Owner verification plus approved target identity check | NOT REQUESTED | No database tests may begin |
| E17 | Synthetic A/B identities, records, roles and identity edge cases | Identity/test environment owner | Fixture plan and identity-provisioning workflow; no secrets | None; source fixtures are not a deployed target | Verify fixture memberships/ownership and intended role matrix on approved target | NOT REQUESTED | Cross-tenant cases cannot be executed |
| E18 | Written test approval, window, limits, stop contact and release reviewer | Authorized security/service owner | Written scope approval and named accountable reviewer | None | Confirm scope matches targets, routes, methods, dates and test plan | NOT REQUESTED | No test is authorized; release decision cannot be approved |
| E19 | Public demo remains isolated from production customer reads and live mutations | Frontend/API owner and demo data owner | Sanitized provider/request-path evidence, demo data-provider map, and approved synthetic negative-test method | None; Stage 2H reports only source/local checks and a sampled public-browser resource observation, not complete deployed-path proof | Review deployed routing/provider configuration and sanitized logs; execute approved non-production negative tests showing no production customer reads or live mutation | NOT REQUESTED | Demo/live boundary remains partially verified; no release approval |

## Reconciliation notes

- Stage 2H reports no approved disposable database, deployed backend
  ownership/build identity, or effective RLS/grant evidence.
- Stage 2I reports no authorized runtime evidence and requires owner
  confirmation of the `/ws` service exposure.
- Stage 2J's request document says it has not been sent; its embedded
  18-requirement table has all statuses `NOT REQUESTED`.
- Stage 2K and the Stage 2L re-review found no additional owner response or
  infrastructure artifacts in the reviewed local repository evidence.
- Stage 2L added E19 because the owner request did not explicitly request
  demo/live separation evidence. The owner request was clarified but not sent;
  E19 and all prior statuses remain `NOT REQUESTED`.
- Stage 2N locally disabled FastAPI `/ws` before connection acceptance and
  added regression coverage. This source change does not establish which
  build is deployed or whether a provider route still exposes the endpoint;
  no owner-evidence status changed.
- Stage 2O removed process-wide runtime response caching, made polling
  cancellable with visible failures, removed the empty-context fallback to a
  global timeline, and stopped HTTP snapshot success from advertising a
  WebSocket connection. These source-level changes do not establish deployed
  route ownership or cross-tenant runtime isolation; no evidence status
  changed.
- Public website observations in Stage 2H do not identify the backend build,
  API owner, database state, or approved test target.

**Current blocker:** No request has been submitted or answered, and the
non-production API, service/build identity, disposable synthetic database,
test authorization, test window, and responsible approvers are all missing.
Evidence of deployed demo/live separation is also missing. The repository
owner must send the updated
[owner evidence request](./stage-2j-owner-evidence-request.md) through the
approved internal channel, then record actual receipt and verification
rationale here. Preserve these statuses until evidence is received through
that channel.

## Evidence acceptance criteria

The following is the minimum evidence sufficient to consider the corresponding
tracker item verified. Owner assertions are recorded separately and do not
substitute for provider or independent-test evidence.

| Evidence area | Sufficient evidence for review | Independent verification needed |
|---|---|---|
| Deployment topology and build identity (E01-E05) | Provider-generated deployment metadata identifying service/project, runtime/entry point, active deployment/build ID, commit SHA, source branch, timestamp, and an inventory of active alternate services | Reconcile provider evidence with owner-supplied service inventory and actual routing configuration; source manifests alone are insufficient |
| Frontend-to-API route ownership (E06-E08) | Sanitized deployed frontend API-origin configuration plus provider/gateway route mapping to the service/build and handler for each of the four GETs and ingestion route | Confirm origin-to-service mapping and approved enabled/disabled route contract; runtime behavior only through authorized non-production tests |
| WebSocket exposure/control (E09-E11) | Provider route/proxy configuration showing whether `/ws` and `/ws/autopilot` are forwarded, plus deployed build identity and deployed auth/tenant-authorization configuration | Independently inspect deployed route/auth behavior; use WebSocket tests only in approved non-production |
| Database controls (E12-E16) | Database-owner inventory and sanitized effective migration ledger, schema/table/function grants, role attributes, RLS enabled/forced flags, policy definitions, and isolation/reset confirmation for the disposable target | Inspect effective target catalog and role behavior; test only against the approved synthetic database; migration source is not proof |
| Synthetic identities and test authorization (E17-E18) | Owner-approved fixture specification, test scope, exact non-production targets, allowed endpoints/methods, window, stop contact, and credential-management workflow | Verify target identity and fixture memberships through approved processes; never store or expose credentials |
| Demo/live isolation (E19) | Sanitized deployed demo-provider/routing map and evidence that demo actions cannot call production data/mutation paths | Approved non-production negative tests and sanitized request/query/mutation evidence showing no live-customer access or writes |

Evidence received must be labeled by provenance (`owner assertion`,
`provider-generated`, or `independent test`), include a date and reviewer,
and be redacted to exclude secrets, credentials, personal data, and production
records.
