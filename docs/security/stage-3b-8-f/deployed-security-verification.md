# Stage 2F — Deployed Security Verification and Cross-Tenant Isolation

**Verdict: BLOCKED.** This is source/deployment-configuration review only.
No non-production deployment or database was accessed, no SQL was executed,
and no migration was applied. The repository does not identify an approved
target or provide deployment metadata sufficient to establish which services
are currently running.

## Evidence boundary

Evidence below is classified as:

- **Repository source/configuration:** tracked code, route declarations,
  workflow templates, and migration files.
- **Local synthetic tests:** offline tests against application handlers,
  fake repositories, or a local test HTTP server.
- **Deployment/database evidence:** not available for this review.

An HTTP response from a browser page, a repository deployment template, or a
source route declaration does not prove what is deployed. No external endpoint
was contacted.

## Source topology and ownership

| Service / route family | Source and tracked configuration | Auth and tenant boundary in source | Deployment status from available evidence |
|---|---|---|---|
| Next.js frontend and BFF | `package.json` declares `next start`; `app/api/**` contains BFF routes; `next.config.js` declares headers but no rewrites. No frontend service declaration is present in `render.yaml`. | Supabase BFF routes keep credentials server-side and forward identity to the configured backend. The frontend runtime client uses `NEXT_PUBLIC_RUNTIME_API_URL`, `NEXT_PUBLIC_API_URL`, or `NEXT_PUBLIC_BACKEND_URL`; source fallback is `http://localhost:3001`. | **Unverified.** No selected frontend deployment, active URL, or deployment metadata is configured here. |
| Primary FastAPI backend | `main.py`; `render.yaml` declares a Python web service started as `uvicorn main:app`. | Identity verification uses JWT/JWKS; business routes use verified identity, active membership, RBAC, and tenant-scoped customer queries. Event-summary routes return 503 because event organization ownership is unresolved. | **Configured, not verified deployed.** `render.yaml` is source configuration only; active Render service identity/routing is unavailable. |
| Express runtime API | `src/server.ts` mounts `/aios/*` replay and `/intelligence/*` event ingestion. `package.json` has no Express start script; `render.yaml` does not declare it. | Both routers fail closed with 503 before replay reads or event ingestion until verified identity and tenant scope are implemented. | **Unverified / no tracked deployment declaration.** It must not be presumed deployed or absent. |
| Alternate/backup FastAPI app | `main_backup.py` contains timeline, autopilot, and WebSocket paths. No tracked deployment configuration points to it. | HTTP timeline/autopilot paths return 503; `/ws/autopilot` closes before accepting or persisting events. | **Unverified / no tracked deployment declaration.** |
| Worker/background service | No worker entry point or deployment service was identified in the inspected Render and workflow configuration. | Not established. | **Unverified.** |
| Deployment workflows | `.github/workflows/deployment-preview-template.yml` and `deployment-production-template.yml` contain placeholder steps only. | They do not establish authentication, routing, or deployed service ownership. | **Templates only; no deployment evidence.** |

The local environment has no configured `AIOS_BACKEND_URL`,
`NEXT_PUBLIC_RUNTIME_API_URL`, `NEXT_PUBLIC_BACKEND_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, `AIOS_SUPABASE_JWT_ISSUER`,
`AIOS_SUPABASE_JWT_AUDIENCE`, or `AIOS_SUPABASE_JWT_ALGORITHM` values.
Only variable presence was checked; no values were read or reported. No
approved non-production API URL or database identifier was provided.

## Frontend runtime route contract

The runtime client calls the configured runtime API origin directly. Its
source-level GET contract is:

| Frontend request | Express source handler | Local source/test status | Deployed ownership |
|---|---|---|---|
| `GET /aios/events` | `/aios` + `/events` | Handler is mounted behind fail-closed 503 middleware. | **Unverified** |
| `GET /aios/timeline` | `/aios` + `/timeline` | Handler is mounted behind fail-closed 503 middleware. | **Unverified** |
| `GET /aios/replay/:contextId` | `/aios` + `/replay/:contextId` | Handler is mounted behind fail-closed 503 middleware. | **Unverified** |
| `GET /aios/debug/:contextId` | `/aios` + `/debug/:contextId` | Handler is mounted behind fail-closed 503 middleware. | **Unverified** |
| `POST /intelligence/event` | `/intelligence` + `/event` | Handler is mounted behind fail-closed 503 middleware. No active frontend call was found in the inspected runtime client. | **Unverified** |

The current frontend and Express source contracts match route paths, but the
configured deployment is not selected. The Render file selects `main:app`,
which does not register `/aios/*` or `/intelligence/*`. The Express service
has no tracked start/deployment declaration. A 503 from the Express source
middleware is evidence of local fail-closed behavior only; it is not evidence
that a selected deployed service owns the route or satisfies the frontend
contract.

The primary FastAPI business routes are declared in `main.py`. Customer
list/detail/health/insights/churn are authorization-protected and query by
server-resolved organization. Identity, membership, and organization
selection endpoints are mounted through the security and organization
routers. Main-app event summaries explicitly return 503 while event
organization ownership is unknown. `/ws` is an unauthenticated echo endpoint
in source and does not query or mutate business data in the inspected
handler; its deployed status is unknown.

## TODO closure matrix

| Original TODO | Status | Evidence and remaining blocker |
|---|---|---|
| Selected deployed API implements every frontend runtime route | **OPEN** | The frontend-to-Express path contract is checked in `tests/security/security-foundation.test.ts`; local handler behavior is tested in `tests/security/runtime-event-isolation.test.ts`. `render.yaml` only declares Python `main:app`, workflows are placeholders, and no selected deployment, proxy, rewrite, or routing metadata is available. A service owner must provide the exact non-production deployment identifier, its routing configuration, and authorization to run synthetic requests against it. |
| User cannot read or replay another organization's record | **OPEN** | Local FastAPI tests exercise synthetic tenant-scoped customer queries and fail-closed event summaries; Express tests verify replay/ingestion denial before reading or mutating the event store. No runtime event organization owner/schema or deployed RLS policy has been established. A verified synthetic database and approved two-tenant deployment are required for same-tenant success and cross-tenant denial tests. |

These TODOs are deliberately not closed by a source-only assertion or generic
401/403/503 response.

## Cross-tenant checks actually performed

### Local synthetic evidence

- FastAPI tests use synthetic signed tokens, separate synthetic users and
  organizations, fake membership lookup, and fake database queries. They
  assert authorization occurs before data access, tenant filters are present,
  cross-tenant customer IDs return a non-disclosing 404, and unmapped rows
  remain inaccessible.
- Event summary endpoints fail closed without organization ownership; tests
  assert the fake event data is not queried or returned.
- A local Express HTTP integration test verifies all four replay reads and
  event ingestion return the configured fail-closed result before event-store
  reads or writes.
- An ASGI test verifies the alternate backup service returns 503 for the
  timeline/autopilot HTTP routes and closes its event-ingestion WebSocket
  before accepting event data.
- Identity unit tests exercise malformed, invalid-signature, expired,
  wrong-issuer, and wrong-audience tokens.

These are **local integration/unit tests**, not deployed API or RLS evidence.
No test used real user, organization, business, or customer data.

### Deployed evidence

**None.** No approved non-production API target or synthetic credentials were
provided, and no deployed requests were made. An exact future request matrix
must include: unauthenticated, invalid/expired identity, no-membership,
tenant-A same-tenant success, tenant-A attempts against tenant-B identifiers
and organization selectors, ingestion/mutation attempts, unmapped ownership,
and WebSocket rejection. Capture only sanitized status/result classes and
synthetic identifiers; never capture tokens or sensitive payloads.

### Database/RLS evidence

**None.** `psql` and `supabase` CLI were not available. A Docker executable
alone does not identify an approved isolated PostgreSQL target. Database
connection variables and an approved target identifier were not configured.
No database connection, migration, SQL query, or policy probe was attempted.

## Migration review and required validation

The source migration
[`20261026000000_scope_customers_to_organizations.sql`](../../../supabase/migrations/20261026000000_scope_customers_to_organizations.sql):

- adds nullable `customers.organization_id` linked to `organizations`;
- restricts customer grants and adds an active-membership SELECT policy;
- removes public/broad customer policy declarations by their tracked names;
- enables RLS on customer, KPI, AI-insight, and insight tables;
- revokes public/client access to KPI and insight tables whose tenant
  ownership is unresolved, rather than assigning ownership.

Tracked source migrations establish declarations, not applied state. The
customer table has conflicting `CREATE TABLE IF NOT EXISTS` definitions,
including seeded customer rows without authoritative organization mapping.
The deployment's actual migration history, grants, policies, role ownership,
and table shapes are unknown.

Before calling database isolation verified, the database owner must identify
an approved disposable synthetic Supabase/Postgres target and read/write test
roles. Then apply the migrations in repository order only to that disposable
target; inspect effective grants, RLS flags/policies and constraints; test
same-tenant customer reads, cross-tenant reads/writes, no-membership access,
unmapped customer denial, and KPI/insight inaccessibility. Separately verify
service-role application query filters. Record server version and sanitized
results. Do not run these steps against production.

## Runtime routes that remain disabled

`/aios/*` replay reads, `/intelligence/event` ingestion,
FastAPI event-summary routes, and the backup service timeline/autopilot and
event WebSocket remain unavailable or fail-closed.

Before re-enablement, define and implement a contract that:

1. verifies identity on every HTTP and WebSocket connection;
2. derives active organization membership server-side;
3. binds each event/context to an authoritative organization owner and checks
   that owner on every lookup, replay, and mutation;
4. prevents client-supplied context/user/org IDs from establishing ownership;
5. defines which runtime telemetry is organization-visible versus
   platform-internal, including retention and payload classification;
6. scopes every privileged query explicitly and validates RLS separately;
7. proves two-tenant read/write isolation and same-tenant behavior against a
   disposable database and approved non-production deployment.

As a result, runtime timeline, replay, debug, event ingestion, and event-based
executive summaries are currently unavailable through these routes. Do not
remove the fail-closed controls to make the frontend appear functional.

## Validation record

| Command | Result |
|---|---|
| `npm run validate` | Exit 0: lint, typecheck, and production build passed. |
| `npm run test:security` | Exit 0: 77 total, 75 passed, 0 failed, 0 skipped, 2 TODO. |
| `PATH=/opt/conda/envs/aios-py311/bin:$PATH npm run test:security:backend` | Exit 0: 48 Python tests passed. |
| `git diff --check` | Exit 0. |

An earlier attempt to run the backend suite with the previous temporary venv
path failed because that venv no longer existed and the system interpreter
lacked PyJWT. The documented `/opt/conda/envs/aios-py311/bin` environment was
available and the complete backend suite passed with it. Local checks do not
establish deployment ownership, migration application, or effective database
policy.
