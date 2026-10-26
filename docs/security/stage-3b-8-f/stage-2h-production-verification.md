# Stage 2H — Production Verification and Release Readiness

**Audit date:** 2026-10-26
**Verdict: NOT READY FOR A PAID PILOT.** The public website is reachable and
selected frontend behavior was checked, but the deployed build identity, API
route ownership, and effective database tenant controls could not be verified.
The security TODOs remain open. A backend source route also accepts and echoes
unauthenticated WebSocket messages; whether that handler is exposed in
production is unknown and must be resolved before pilot approval.

This is a read-only audit. No production API route was probed, no database was
connected to, and no application code, production configuration, or
infrastructure was changed.

## A. Executive summary

### What is verified

- Local branch `main` and `origin/main` both point to
  `c797876cef7a84cb278e85ee02158290c28f0917`.
- Public GET requests reached the website at `aiospilot.com`; the apex host
  redirects to `www.aiospilot.com`, which returned HTTP 200. Response headers
  identify Vercel as the public frontend edge.
- The homepage, Platform, Resources, Universe, Security, and Demo Platform
  public routes returned HTTP 200. Four routes rendered at 320, 375, 390, 768,
  1024, and 1440 pixel viewport widths without horizontal overflow or broken
  images.
- The public Resources category filter and mobile navigation toggle/Escape
  behavior worked in the browser. The demo page identified itself as synthetic,
  was marked `noindex, nofollow`, and exposed no observed same-origin `/api/`,
  `/aios/`, or `/intelligence/` resource requests during the page check.
- Current local checks passed: application validation, frontend security tests,
  backend security tests, and `git diff --check`.

### What is blocked

- Public page availability and a Vercel response header do **not** identify the
  deployed commit or deployment status. No Vercel or Render CLI/dashboard
  access was available. `gh run list` could not run because GitHub CLI
  authentication is unavailable.
- The frontend's runtime API origin and the production service owning each
  required runtime route could not be established. No API endpoint was probed.
- No approved disposable Postgres/Supabase target was available; `psql` and the
  Supabase CLI were unavailable. Migration application state, grants, effective
  RLS, and production tenant isolation are unverified.
- Lighthouse/PageSpeed measurement was unavailable. Browser navigation timings
  below are unthrottled, one-run observations, not Lighthouse scores or
  Core Web Vitals.

## B. Deployment evidence

| Evidence | Result | What it does and does not establish |
|---|---|---|
| Local branch / HEAD | `main` / `c797876cef7a84cb278e85ee02158290c28f0917` | Matches the expected commit. |
| `git ls-remote origin refs/heads/main` | `c797876cef7a84cb278e85ee02158290c28f0917` | At audit time, public `origin/main` was exactly the expected commit. This is Git evidence, not deployment evidence. |
| Public domain response | `https://aiospilot.com/` returned HTTP 308 to `https://www.aiospilot.com/`; `www` returned HTTP 200. | Confirms the public site is reachable and establishes the observed public host redirect. |
| Public frontend response headers | `server: Vercel`; `x-vercel-id` present. | Identifies a Vercel edge response. It does not identify the project deployment, Git SHA, deployment success state, or domain-to-build mapping. |
| Tracked backend configuration | [render.yaml](../../../render.yaml) declares a Python web service named `aios-backend`, started as `uvicorn main:app`. | Describes repository configuration only; no active Render service or deployed backend was inspected. |
| Deployment workflows | [deployment-production-template.yml](../../../.github/workflows/deployment-production-template.yml) contains placeholder deployment and rollback steps. | Does not prove that a deployment workflow is configured or has run. |
| Hosting access | `render`, `vercel`, and `supabase` CLIs unavailable; GitHub CLI reports that authentication is required. | No deployment dashboard, build metadata, or host logs were available through the current environment. |

The public routes `/`, `/platform`, `/resources`, `/universe`, `/security`, and
`/demo-platform` each returned HTTP 200 in browser navigation. Their current
production build identity cannot be tied to `c797876` from the public evidence
collected.

## C. API route ownership matrix

The frontend client in
[runtime-client.ts](../../../lib/runtime/runtime-client.ts) selects
`NEXT_PUBLIC_RUNTIME_API_URL`, `NEXT_PUBLIC_API_URL`, or
`NEXT_PUBLIC_BACKEND_URL`, falling back in source to `http://localhost:3001`.
The client sends JSON requests but does not attach a bearer identity. The
frontend call sites in [runtime-events.ts](../../../lib/runtime/runtime-events.ts)
use GET for the routes below. The response types are declared in
[runtime-types.ts](../../../lib/runtime/runtime-types.ts).

| Frontend request | Expected response shape | Source route / current source behavior | Production owner and result |
|---|---|---|---|
| `GET /aios/events` | `{ count, events }` | Express [server.ts](../../../src/server.ts) mounts [replay.ts](../../../src/api/replay.ts) at `/aios`; router-wide middleware returns 503 before the route handlers. | **Unverified.** No selected production API origin, owner, or deployment build was available. |
| `GET /aios/timeline` | `{ count, timeline }` | Express route is declared behind the same fail-closed 503 middleware. | **Unverified.** No production request made. |
| `GET /aios/replay/:contextId` | `{ contextId, count, timeline }` | Express route is declared behind the same fail-closed 503 middleware. | **Unverified.** No production request made. |
| `GET /aios/debug/:contextId` | `{ summary, events }` | Express route is declared behind the same fail-closed 503 middleware. | **Unverified.** No production request made. |
| `POST /intelligence/event` | Source handler accepts a typed event envelope and would return `{ success, eventType, timestamp, contextId, lifecycle }`. | Express [server.ts](../../../src/server.ts) mounts [intelligence.ts](../../../src/api/intelligence.ts) at `/intelligence`; router middleware returns 503 before handlers. No active frontend call was found in the inspected runtime client. | **Unverified.** No production request made; route ownership and expected deployed state are unknown. |

The tracked Render configuration selects FastAPI [main.py](../../../main.py),
which does not
declare the four `/aios/*` runtime routes or `/intelligence/event`. The
Express routes are source declarations only; no tracked deployment
configuration selects the Express server. These facts do not establish which
service, proxy, rewrite, gateway, or legacy entry point serves production.
The disabled state in source is not proof of deployed ownership or behavior.

The FastAPI source protects customer list/detail/health/insight/churn routes
with `require_organization_permission(BusinessPermission.READ)`. However,
the deployment mapping for those routes is also unverified. The repository's
`main_backup.py` and WebSocket surfaces have no confirmed production
deployment owner.

## D. Database and tenant-isolation assessment

### Source-level authorization evidence

- `require_verified_identity` validates a bearer token through the configured
  issuer, audience, signing algorithm, JWKS key, expiry, and required claims.
- Organization authorization obtains memberships using the verified subject,
  filters active memberships, rejects malformed or cross-user membership
  records, validates requested organization selection against those
  memberships, and applies the role permission matrix. `member` is read-only;
  `org_admin` receives the declared business permissions.
- Customer routes pass the server-derived organization ID to customer
  queries. `services/customer_engine.py` filters list reads by
  `organization_id` and detail reads by both customer ID and organization ID.
- `supabase_client.py` constructs a server-side client with
  `SUPABASE_SERVICE_ROLE_KEY`. That role can bypass RLS; explicit server-side
  tenant filters are therefore important and are present on the inspected
  customer queries. Credential values were not read or reported.
- The company/customer/decision memory functions inspected return static demo
  fixtures. The repository's local security tests cover synthetic identities,
  separate tenant IDs, authorization order, and fail-closed runtime routes.

### Database policy evidence and gap

The source migration
[20261026000000_scope_customers_to_organizations.sql](../../../supabase/migrations/20261026000000_scope_customers_to_organizations.sql)
adds a nullable organization reference for customers, grants authenticated
customer SELECT, and defines an active-membership SELECT policy. It enables
RLS on customer/KPI/insight tables and revokes client grants on tables whose
ownership is unresolved. The membership migration enables RLS and limits
membership access to the service role.

These are source declarations only. No migration ledger, applied migration
state, database version, effective grant set, table ownership, RLS state,
policy state, or service-role behavior was inspected. No database connection,
SQL query, migration, or cross-tenant database test was performed. The
nullable/unmapped customer ownership and service-role bypass require explicit
validation in the approved disposable environment.

### Original infrastructure-dependent security TODOs

Both original TODOs remain **OPEN** in
[security-foundation.test.ts](../../../tests/security/security-foundation.test.ts):

1. `selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved` — **OPEN**. Production service ownership and runtime contract cannot be proven from local source or public frontend responses.
2. `user cannot read or replay a record owned by another organization` — **OPEN**. Local synthetic tests are not deployed API or effective RLS evidence; no approved synthetic database or deployment was available.

No TODO was converted into a mock-based pass or closed based on a generic
denial response.

## E. Regression results

| Command | Current result |
|---|---|
| `npm run validate` | **Exit 0.** ESLint, TypeScript check, and optimized Next.js build passed; build generated 127 static pages. |
| `npm run test:security` | **Exit 0.** 77 tests total: 75 passed, 0 failed, 0 skipped, 2 TODO. |
| `PATH=/opt/conda/envs/aios-py311/bin:$PATH npm run test:security:backend` | **Exit 0.** 48 Python tests passed. |
| `git diff --check` | **Exit 0.** No whitespace errors. |

`git diff --check` covers tracked changes only. The untracked report was
separately checked for trailing whitespace.

The two TODOs are reported separately from the 75 passing frontend security
tests. Successful local validation does not close deployment or database
verification gaps.

## F. Browser, SEO, and performance results

### Public browser checks

Tested the production homepage, `/platform`, `/resources`, and `/demo-platform`
at viewport widths **320, 375, 390, 768, 1024, and 1440 px**. Each route
returned HTTP 200 with a visible H1; no horizontal overflow or broken images
were observed at the tested sizes.

Additional observed behavior:

- The Resources category filter reduced the displayed articles from 6 to 2
  when selecting Governance.
- At mobile width, the navigation button changed to `aria-expanded="true"`
  when opened and returned to `"false"` after Escape.
- Reduced-motion preference emulation was enabled, but the resulting animation
  behavior was not exhaustively audited. No canvas element was present on the
  inspected homepage; other routes' WebGL fallbacks were not assessed.
- `/demo-platform` displayed its synthetic-data/local-preview notice and
  `noindex, nofollow` metadata. The demo layout sets `liveDataEnabled={false}`;
  the local tests cover the disabled live-data boundary. No same-origin
  `/api/`, `/aios/`, or `/intelligence/` resource path was observed in the
  demo page's browser performance resources. This is useful evidence, not a
  guarantee about every interaction, backend log, or deployment path.
- No failed network requests or JavaScript page errors were observed in the
  sampled production pages. The browser did log the CSP report-only warning
  that `upgrade-insecure-requests` is ignored in a report-only policy; it is a
  warning about that directive, not evidence that a request failed.
- Keyboard focus traversal beyond opening/closing the mobile menu, all
  navigation/CTA destinations, loading/error states, and font fallback
  behavior were not exhaustively tested.

### SEO and metadata

- `/robots.txt` and `/sitemap.xml` returned HTTP 200. Robots allows `/`,
  disallows `/api/` and selected application paths, and names the sitemap.
- The sitemap contains 13 apex-host URLs. `/contact` returned HTTP 200 in a
  read-only check but is absent from the sitemap; confirm whether that
  omission is intentional.
- Public routes inspected had titles, descriptions, canonical links, and
  structured data. The demo route is explicitly `noindex, nofollow`.
- **Canonical-host inconsistency:** the apex URL returns HTTP 308 to
  `https://www.aiospilot.com/`, while the homepage canonical, `robots.txt`
  host/sitemap declaration, and sitemap URLs use `https://aiospilot.com`.
  Normalize redirects, canonical URLs, robots host, and sitemap to one host.

### Performance measurement

Lighthouse, PageSpeed, and `psql` tooling checks found those CLIs unavailable;
no authorized PageSpeed request was made. A single unthrottled browser run
at a 1440 px viewport recorded approximate navigation timings:

| Route | DOMContentLoaded | Load event | First Contentful Paint |
|---|---:|---:|---:|
| `/` | 279 ms | 326 ms | 340 ms |
| `/platform` | 274 ms | 317 ms | 344 ms |
| `/resources` | 149 ms | 195 ms | 216 ms |
| `/demo-platform` | 165 ms | 258 ms | 268 ms |

These are one-run browser measurements under the audit browser's cache/network
conditions, not a reproducible mobile/desktop Lighthouse test. LCP, INP, CLS,
accessibility scores, field Core Web Vitals, and SEO scoring were not
established.

## G. Paid-pilot readiness matrix

| Dimension | Status | Evidence and remaining action |
|---|---|---|
| 1. Public website deployment | **Partially verified** | Public routes are reachable and Vercel headers are present. Deployed SHA, deployment completion, and exact project mapping are unavailable. |
| 2. Core product and demo functionality | **Partially verified** | Public demo renders; selected navigation/filter interactions work; local tests establish synthetic fixtures. End-to-end product workflows and integrations were not verified in production. |
| 3. Authentication and identity verification | **Partially verified** | Source and local tests cover JWT and BFF identity checks. Production configuration and deployed behavior are unknown; see unauthenticated `/ws` source risk below. |
| 4. RBAC and server-side authorization | **Partially verified** | FastAPI source derives active membership and applies role permissions; local tests pass. Production routes and all alternate entry points are unverified. |
| 5. Tenant isolation and database policies | **Blocked** | Effective grants/RLS and two-tenant behavior require the approved disposable database and owner access. |
| 6. Production API routing and service ownership | **Blocked** | No service map, deployed build ID, API origin, gateway configuration, or host metadata was available. |
| 7. Synthetic demo versus live-data separation | **Partially verified** | Source disables live data for the demo; offline tests cover the boundary; the checked public demo made no observed same-origin runtime/API requests. Complete deployed request/log evidence was not available. |
| 8. Analytics consent and privacy | **Partially verified** | Consent and sanitization tests pass; public privacy metadata exists. Production analytics settings, consent persistence, and actual outbound analytics behavior were not audited end-to-end. |
| 9. Error handling, monitoring, operational visibility | **Blocked** | Fail-closed source paths are tested locally, but production monitoring, alerting, logs, and incident visibility were inaccessible. |
| 10. Backup, recovery, incident response | **Not assessed** | No operational backup/restore evidence, recovery exercise, or incident-response access was available. Repository contracts/templates are not operational proof. |
| 11. Data handling and customer onboarding | **Partially verified** | Public privacy/legal content and synthetic demo separation exist. Customer-specific onboarding, retention, deletion, contractual safeguards, and data-flow controls were not verified. |
| 12. Human approval and oversight for consequential AI actions | **Partially verified** | Local tests and demo interactions distinguish recommendations/local simulations from live actions. Deployed approval policies and human-oversight enforcement were not verified. |

### Source-level security risk requiring owner confirmation

[main.py](../../../main.py) declares `@app.websocket("/ws")` and accepts connections before
receiving and echoing arbitrary JSON messages. The handler does not verify
identity, organization membership, tenant ownership, payload size, or an
authorization policy. The tracked `render.yaml` selects `main:app`, but no
evidence establishes that this build or route is currently deployed or
reachable. Treat exposure as **unverified and release-blocking** until the
backend owner confirms it is disabled or a separately approved remediation
enforces authentication, authorization, and resource limits. No production
WebSocket probe was made.

The FastAPI source also configures CORS with wildcard origins and credentials.
Its effective behavior in the deployed service was not tested; have the
backend owner confirm the intended origin allowlist before a pilot.

**Final readiness verdict: Not ready for a paid pilot.** The public-facing
website is available, but the critical evidence for live API ownership and
effective tenant/database isolation is missing, and the conditional WebSocket
exposure has not been ruled out.

## H. Prioritized remediation and next action

1. **Backend service owner — resolve the `/ws` exposure first.** Identify the
   active production backend service/build and externally reachable WebSocket
   routes. Confirm `/ws` is disabled or obtain separate approval for a fix
   requiring authentication, tenant checks, and message/resource limits.
   Do not infer safety from `render.yaml`.
2. **Infrastructure owners — satisfy the Stage 2G entry checklist.** Provide
   the exact non-production frontend and API base URLs, service owners,
   immutable deployed build identifiers, proxy/rewrite/WebSocket topology,
   authorization for synthetic requests, and an approved contact. For the
   database, provide an isolated disposable synthetic target, migration
   ledger/workflow, policy/grant inspection process, and safe discard
   procedure. Do not paste credentials into chat or this report.
3. **Run the approved Stage 2G/2H matrix** against that target: establish
   route ownership and disabled/enabled contracts; test unauthenticated,
   invalid/expired, no-membership, same-tenant, cross-tenant, unmapped,
   mutation, WebSocket, alternate-service, and demo/live boundaries; inspect
   effective RLS/grants and service-role query scoping. Keep both TODOs open
   until direct evidence satisfies their pass criteria.
4. **Resolve the canonical-host inconsistency** and decide whether `/contact`
   should be included in the sitemap. This is an SEO follow-up, not a
   substitute for the security gate.
5. **Measure performance and accessibility** with an authorized, reproducible
   Lighthouse/PageSpeed run after deployment identity is established.

The **smallest next action that reduces risk** is an owner-confirmed inventory
of the live backend deployment and its externally reachable WebSocket routes,
including confirmation that unauthenticated `/ws` is not exposed. Pair that
with the Stage 2G request for the approved synthetic API/database environment;
do not begin database or security probes until approval and target identity are
confirmed.

## I. Final Git status and operational actions

- Branch: `main`.
- HEAD: `c797876cef7a84cb278e85ee02158290c28f0917`.
- `origin/main`: same SHA at audit time.
- The worktree was **not clean** at audit start: three pre-existing,
  uncommitted demo-layout files from the preceding user request were preserved.
- This report is the only file created by Stage 2H. No application code was
  modified during this audit.
- Final worktree contents: the three pre-existing modified files
  [next-gen-workspace.tsx](../../../components/platform-next/next-gen-workspace.tsx),
  [organization-center-workspace.tsx](../../../components/organization-center/organization-center-workspace.tsx),
  and
  [organization-center-components.tsx](../../../components/organization-center/organization-center-components.tsx),
  plus this new untracked report.
- Tracked changes passed `git diff --check`; the untracked report passed a
  separate trailing-whitespace check.
- No commit, push, merge, deployment, database migration, production write, or
  production configuration change was made. Public checks were limited to
  read-only website GET/navigation behavior and local validation.
