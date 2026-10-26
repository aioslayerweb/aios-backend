# Stage 2G — Non-Production Environment Readiness Handoff

**Status: READY FOR OWNER COORDINATION; verification is BLOCKED pending
environment approvals and identifiers.** This document supplements the
[Stage 2F evidence report](./deployed-security-verification.md); it does not
repeat its source-topology findings or authorize deployment, provisioning,
database access, SQL execution, or migration application.

No target was contacted or created for Stage 2G. No migration or test against
a deployed service/database was run.

## 1. Readiness checklist

### A. Service-owner confirmation — owner must provide

- [ ] Exact non-production frontend deployment identifier and base URL.
- [ ] Exact non-production API deployment identifier and base URL.
- [ ] Service owner for each route family in the route ownership matrix below.
- [ ] Routing topology from frontend through any proxy, rewrite, gateway, or
      load balancer to the actual API service.
- [ ] All independently reachable APIs, alternate/legacy entry points, and
      HTTP/WebSocket exposure relevant to these route families.
- [ ] Deployed commit SHA or immutable build identifier for each service.
- [ ] Expected enabled/disabled behavior for each runtime route; current
      source intentionally fails closed for unscoped replay/ingestion and
      event-summary paths.
- [ ] Written approval for synthetic authentication, authorization, and
      cross-tenant requests against the identified non-production deployment,
      including allowed methods, test window, rate limits, and stop contact.
- [ ] Named responsible contact for routing/auth discrepancies.

Do not provide credentials, access tokens, private keys, or secret
configuration values in this handoff. Access must use the organization's
approved secret manager or operator-controlled authentication workflow.

### B. Disposable database confirmation — database owner must provide

- [ ] Exact non-production Postgres/Supabase project or isolated database
      identifier; confirm it is disposable and isolated from production.
- [ ] Written confirmation that the target contains synthetic data only and
      has no production replication, shared tables, or customer records.
- [ ] Database version and relevant extensions (including whether extensions
      required by the migrations are available).
- [ ] Authoritative migration workflow and migration ledger; confirm the
      required applied order and how to review pending migrations.
- [ ] Approved role/workflow for applying source migrations to this disposable
      target only.
- [ ] Approved way to inspect effective grants, table ownership, RLS enablement
      and force flags, policies, role attributes, and relevant function
      privileges.
- [ ] Approved role(s) for synthetic tenant queries and writes, distinct from
      privileged administrative access.
- [ ] Safe reset/discard procedure and named operator authorized to execute it.
- [ ] Named responsible contact for schema/policy discrepancies.

Current source migration files relevant to the expected order include
`20260415135853_create_dashboard_tables.sql`,
`20260418154820_create_insights_table.sql`,
`20260615190000_create_business_memory.sql`,
`20260701100000_create_customers_table.sql`,
`20261023000000_create_organization_memberships.sql`, and
`20261026000000_scope_customers_to_organizations.sql`. This is a source
inventory only, **not** a statement that these migrations are registered,
compatible with the target, applied, or authorized. The database owner must
reconcile this list against the authoritative migration ledger before any
execution. Do not apply migrations in Stage 2G.

### C. Synthetic identities and fixtures — provision only after approval

- [ ] Organization A and Organization B, unrelated synthetic identifiers.
- [ ] User A with active membership in A and no membership in B.
- [ ] User B with active membership in B and no membership in A.
- [ ] User C with no active organization membership.
- [ ] One synthetic customer/business record per organization if the verified
      deployed schema supports it.
- [ ] One synthetic runtime event per organization only if an approved
      event-to-organization ownership contract and route exist.
- [ ] An unmapped/unowned synthetic record for denial testing, if supported.
- [ ] A read-only member role and an authorized read role configured according
      to the approved role matrix.
- [ ] One valid test identity for each synthetic user, plus invalid and expired
      test identities generated using the approved identity workflow.
- [ ] No shared or reusable authentication secret in source, test fixtures,
      logs, screenshots, or this document. Do not place bearer tokens in
      evidence.

Fixture outcomes must be explicit before execution:

| Request | Expected outcome |
|---|---|
| Active User A reads an owned, in-scope record in A with the required read permission | Permit only if the endpoint contract is enabled and documents this read. |
| User A requests User B's record, tenant B selector, or B runtime context | Deny without disclosing whether the foreign record exists. |
| User C has no active membership | Deny before tenant data access. |
| Invalid or expired identity | Authentication denial before membership/data access. |
| Any unmapped ownership record | Deny or quarantine; never infer an owner. |
| Runtime route still marked disabled in source/release contract | Fail closed; do not count a generic denial as route-ownership proof. |

## 2. Executable verification matrix

Shared decision criteria:

- **PASS:** observed behavior matches the documented endpoint contract,
  authorization order is demonstrated, and sanitized evidence is retained.
- **FAIL:** the observed behavior contradicts the contract, exposes or mutates
  foreign/unowned data, or fails to enforce an expected identity/tenant
  boundary. Stop the test, preserve sanitized evidence, and notify the
  responsible owner.
- **BLOCKED:** required target, approval, route owner, fixture, access method,
  or expected behavior is missing. A generic 401/403/503 is not sufficient
  proof of implementation or deployment ownership.

| # | Category | Prerequisite | Test method | Expected result | Evidence to capture | Environment | PASS / FAIL / BLOCKED criterion |
|---|---|---|---|---|---|---|---|
| 1 | Frontend runtime route ownership and routing contract | Service owner supplies selected frontend/API, immutable build IDs, route owner, proxy/rewrite/gateway/WebSocket map, and approved test window. | Compare deployed frontend request contract (`/aios/events`, `/aios/timeline`, `/aios/replay/:contextId`, `/aios/debug/:contextId`) with deployed route registrations; issue safe synthetic requests to each owner and trace intended routing via approved gateway/service logs. | Each route has an explicit owner and documented enabled/disabled state. Disabled routes fail closed at the owning service. No alternate unreviewed route is treated as equivalent. | Sanitized route-to-service map, build IDs, request class, final service/handler ownership and response contract; no tokens or payloads. | Local source + approved staging | PASS only with deployment-level route ownership and expected response contract. FAIL on unexpected exposure or mismatched owner. BLOCKED without selected deployment evidence. |
| 2 | Unauthenticated access to protected routes | Approved staging URL and route contract. | Send requests without identity to protected customer and enabled runtime endpoints; use synthetic path/query values. | Denied before membership or business-data access; error does not contain records or existence details. Disabled routes must be identified as intentionally disabled, not mistaken for authenticated route behavior. | Status/result class, response field names, sanitized server authorization/data-access trace. | Local and staging | PASS if denial occurs before data query and no data is disclosed. FAIL on access/data leakage. BLOCKED if endpoint ownership/contract is unclear. |
| 3 | Invalid and expired identity rejection | Approved synthetic identity workflow and staging endpoint. | Submit deliberately invalid and expired synthetic identities; do not log identity token values. | Authentication denial before membership lookup/data access; no identity or business data in response. | Case label, HTTP/WS result, sanitized auth decision trace and membership/data-query counts. | Local and staging | PASS if both denied at authentication boundary. FAIL if either reaches protected query or returns data. BLOCKED without approved identity setup or service trace. |
| 4 | Active organization membership enforcement | Synthetic User A, User B, User C; memberships provisioned using approved owner workflow. | Request a protected read as each user; vary allowed organization selection using synthetic A/B IDs. | A can select only A; B only B; C is denied. Multiple-membership behavior follows documented selection policy; client-supplied IDs do not grant membership. | Synthetic case IDs, status/result, verified subject-to-membership decision and query ordering. | Local and staging | PASS if active membership is verified server-side before data access. FAIL if foreign/no-membership access reaches data. BLOCKED if memberships or route contract unavailable. |
| 5 | Same-tenant permitted reads | Approved enabled route, active membership and permission, owned synthetic record. | User A requests its synthetic A record; repeat for User B/B. | Only documented, permitted same-tenant fields are returned. Runtime route same-tenant success is not expected while it remains disabled. | Case ID, permitted field names, response outcome, tenant predicate/query trace. | Local, staging, disposable DB | PASS if enabled documented read succeeds with tenant scope. FAIL if wrong/no tenant scope or no documented read is accidentally opened. BLOCKED if route disabled or ownership contract absent. |
| 6 | Cross-tenant direct-record denial | Synthetic A/B records and active A/B memberships; approved detail route. | As A, request B record ID; change organization query/path selection where supported; repeat from B toward A. | Denial without foreign-record existence or content leakage; no mutation or privileged query unscoped by tenant. | Case ID, status, response key names, sanitized query filter/side-effect count. | Local, staging, disposable DB | PASS if denied and no foreign fields/side effects. FAIL if data, existence details, or mutation leaks. BLOCKED without owned records or enabled route. |
| 7 | Cross-tenant runtime replay denial | Approved runtime route owner, approved organization ownership contract, A/B event fixtures. | As A, replay B context/event identifiers and attempt any cursor/filter variation supported by the deployed contract. | Denied without event existence/payload disclosure; same-tenant behavior follows contract. If replay remains disabled, verify deployment route ownership separately and record disabled contract. | Request class, route owner, sanitized status/response shape, event query scope trace; no event payloads. | Local source tests + staging + disposable DB | PASS only when route contract and tenant result are both verified. FAIL on foreign replay. BLOCKED if feature disabled/no owner/no event ownership schema. |
| 8 | Cross-tenant event ingestion and mutation denial | Approved event-ingestion route/contract and synthetic A/B identities/events. | As A, attempt to submit or mutate an event attributed to B using body IDs/context IDs; test foreign organization identifiers and replay acknowledgements if supported. | Server derives owner from verified identity/membership; client-supplied IDs cannot set another tenant. Disabled ingestion must remain disabled. | Sanitized decision result, event-store row count/fixture state before/after, server-derived ownership trace. | Local, staging, disposable DB | PASS if foreign attempt denied with no write/change. FAIL on foreign write/change. BLOCKED without an approved enabled route and owner model. |
| 9 | WebSocket identity and tenant enforcement | WebSocket endpoint owner, approved staging route, synthetic identities and tenant-bound event contract. | Attempt connection unauthenticated, with invalid/expired identity, A identity for B context, and permitted same-tenant case if enabled. | Authentication and tenant authorization precede accept/data; otherwise endpoint remains disabled and closes before processing. | Sanitized handshake outcome, close code/reason class, server authorization trace, fixture state. | Local and staging | PASS if all cases match enabled contract or disabled-close contract. FAIL if unauthorized connection accepts/reads/writes. BLOCKED if deployment/expected state unknown. |
| 10 | Unmapped ownership fail-closed behavior | Synthetic record with ownership intentionally null/unverified; approved data target. | Query via list/detail/derived/replay endpoints and direct database role path under approved roles. | Unmapped data is denied/quarantined; no guessed ownership; no sensitive detail in errors. | Fixture label, result class, row/query counts, sanitized policy result. | Local, staging, disposable DB | PASS if inaccessible in each applicable path. FAIL if exposed or assigned heuristically. BLOCKED if an unowned synthetic fixture cannot be prepared safely. |
| 11 | Effective database grants and RLS after migrations | Disposable synthetic DB, owner-approved role/workflow, reconciled migration order and reset plan. | Apply migrations only to disposable target; inspect effective table/function grants, owner/role attributes, RLS flags/policies and relevant defaults; run tenant A/B reads/writes using approved roles. | Customer reads match active-membership policy and explicit query scoping; unresolved KPI/insight tables remain inaccessible; cross-tenant reads/writes fail; authorized same-tenant operation follows contract. | DB version/extensions, migration IDs/status, sanitized catalog output and role probe results, test outcomes. No URLs, secrets, or customer-like content. | Disposable DB only | PASS only after successful migration and effective privilege/policy tests. FAIL on unexpected grant/policy/access. BLOCKED without verified isolated target or owner authorization. |
| 12 | Alternate/legacy service bypass prevention | Complete service inventory from owner, including primary, backup, Express, worker, proxy, and WebSocket entry points. | Repeat applicable unauthenticated and A-to-B cases against every independently reachable entry point; confirm disabled paths are blocked before data operations. | No alternate route bypasses primary auth/tenant controls; disabled source routes remain disabled in selected deployment. | Service inventory, immutable builds, route-to-owner map, sanitized requests/results per entry point. | Local, staging | PASS only if the owner inventory is complete and all reachable paths satisfy the contract. FAIL on bypass. BLOCKED if service inventory or exposure unknown. |
| 13 | Demo routes cannot access or mutate live business data | Approved frontend/API topology, demo identity/fixtures and known live-data boundary. | Exercise demo navigation/actions; observe approved backend access logs or test transport; verify demo paths use synthetic fixtures and do not invoke live business mutations/data queries. | Demo actions remain local/synthetic and truthful; no live customer/business data access or mutation occurs. | Route/action class, sanitized synthetic fixture labels, backend query/mutation counters/log classes. | Local and staging | PASS if demo activity stays synthetic with no live operation. FAIL if live data/mutation is observed. BLOCKED without observability or route/fixture evidence. |

For every staging test, capture the environment identifier and immutable build
ID, test-case ID, timestamp/window, route owner, request class, expected
contract, observed status/result class, and sanitized evidence. Do not retain
authorization headers, tokens, secret values, real business payloads, or
unnecessary personal data. Preserve failed results; do not retry destructively
or broaden scope without owner approval.

## 3. Ready-to-send request to infrastructure owners

> **Subject: Stage 2H request — approved non-production security verification**
>
> We are preparing a synthetic-only verification of AIOS authentication,
> route ownership, tenant isolation, runtime replay/ingestion behavior, and
> database grants/RLS. No production testing, deployment, or infrastructure
> provisioning is requested.
>
> Please provide or confirm, through the approved internal channel:
>
> 1. The exact approved non-production frontend and API base URLs and
>    deployment/service identifiers.
> 2. The service owner for each expected runtime route and the complete
>    proxy/rewrite/gateway/WebSocket/alternate-service routing map.
> 3. The deployed commit SHA or immutable build identifier for each relevant
>    service, and which runtime paths are intentionally enabled or disabled.
> 4. Written approval for synthetic authentication and cross-tenant requests
>    against those specific targets, including test window, rate limits, and
>    stop/escalation contact.
> 5. An isolated, disposable Postgres/Supabase test-target identifier, with
>    confirmation it contains synthetic data only and is isolated from
>    production.
> 6. The approved secure workflow for database access, migration application
>    to that disposable target, inspection of effective grants/RLS/policies,
>    and safe reset/discard. Please also confirm database version, relevant
>    extensions, and authoritative migration order/ledger.
> 7. The responsible service/database contact for resolving route, schema, or
>    policy discrepancies.
>
> Please do not send passwords, bearer tokens, service-role keys, connection
> strings, or other credentials in chat, email, source code, logs, or this
> handoff. Any required access should be granted through the approved
> secret-management and operator-authentication process. Stage 2H will not
> begin against a target until its identity, isolation, scope, and authorization
> are confirmed.

## 4. Two remaining security TODOs

The original TODO assertions in
[`security-foundation.test.ts`](../../../tests/security/security-foundation.test.ts)
remain unchanged:

1. **Selected deployed API implements every frontend runtime route.** Needs
   the owner-provided deployed service/build identity and route/proxy map,
   followed by approved synthetic route checks. Local source matching is not
   deployment proof.
2. **User cannot read or replay another organization's record.** Needs the
   approved tenant/event ownership contract, two-tenant synthetic deployment,
   and disposable database with effective RLS/grant evidence. Local fail-closed
   source behavior is not proof of enabled-route isolation or deployed RLS.

Do not convert either TODO to a mock-based pass or close it solely because a
disabled route returns a generic denial.

## 5. Handoff entry gate and stop conditions

Stage 2H may begin only after the service owner and database owner confirm
their respective checklist sections, the test operator verifies target
identity using the approved workflow, expected outcomes are signed off, and
the scope/test window is authorized. If any host, routing path, identity,
database role, migration order, synthetic-only guarantee, reset method, or
expected result is ambiguous, mark the affected matrix row **BLOCKED** and
stop that test.

This readiness handoff does not grant approval for production access, schema
changes, migration execution, deployment, or release. Release approval still
requires complete evidence for both open TODOs and all applicable matrix
categories.
