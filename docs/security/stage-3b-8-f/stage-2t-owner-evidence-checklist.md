# Stage 2T — Owner Evidence Checklist

**Status: PREPARED — NOT SENT.** This checklist does not authorize production
access, endpoint probes, database changes, migrations, deployments, or tests.
No owner has been contacted. Supply sanitized evidence through the
organization-approved channel; do not include secrets or customer data.

## 1. Runtime service and routing — backend/platform owner

- Identify the active runtime API service(s), repository, environment, actual
  entry point/start command, responsible owner role, and approved
  non-production URL.
- Provide provider-generated immutable deployment/build ID, commit SHA, branch,
  and deployment time for each active service. Clearly label owner assertions
  separately from provider evidence.
- Map the browser runtime API destination and every route to the final service,
  gateway/proxy/rewrite, and handler:
  - `GET /aios/events`
  - `GET /aios/timeline`
  - `GET /aios/replay/:contextId`
  - `GET /aios/debug/:contextId`
  - `POST /intelligence/event`
  - `/ws` and `/ws/autopilot`
- Identify legacy APIs, workers, scheduled jobs, alternate domains, internal
  routes, direct database paths, and any equivalent read/replay/ingestion
  surface. State whether each path is enabled, internal-only, or disabled.
- For each active path, provide the signed-off request/response contract and
  which service performs authentication, membership, event ownership,
  permission, and tenant filtering.

## 2. Identity and active membership — identity/API security owner

- Decide whether runtime routes will be owned by FastAPI, authenticated
  directly by Express, or protected by a verified service-to-service identity
  exchange. Identify the responsible owner role for this decision.
- Provide the approved issuer, audience, signing/key rotation and expiry
  validation requirements, subject identifier mapping, revocation/refresh
  expectations, and credential transport for the chosen path. Do not send
  token or key values.
- Explain how the browser/BFF/session path supplies verifiable identity to the
  selected service. If a proxy forwards identity, provide sanitized
  configuration evidence that client-provided identity headers are stripped
  and the forwarded assertion is integrity-protected and audience-bound.
- Identify the authoritative active-membership repository, status/role
  vocabulary, multi-organization selection rules, and permission mapping for
  event read, replay/debug, ingestion, and WebSocket messages.
- Confirm required failures: missing/invalid/expired identity denied before
  event lookup; inactive/no membership and insufficient permission denied;
  membership/identity dependency outage fails closed with no fallback.

## 3. Event ownership and history — domain/data owner

- Identify the canonical organization identifier and authoritative source that
  binds each runtime event and replay context to exactly one organization.
  Explain how the organization is established at ingestion without trusting
  request/body/payload/context identifiers.
- Provide current event/context table and type definitions (including
  constraints, foreign keys, uniqueness, indexes, and any ownership join) and
  sanitized inventory of legacy rows that are missing, ambiguous, or
  conflicting.
- Decide whether ownership is immutable after creation. If transfer is
  required, document the separately authorized, auditable workflow; do not
  treat ordinary updates as transfers.
- Define duplicate/retry behavior and idempotency keys, including behavior
  when a key or context is reused across organizations.
- Provide an authoritative historical mapping source, if one exists, and the
  approved quarantine disposition for unmapped/conflicting events. If no
  mapping is evidenced, confirm that such rows will not be backfilled or
  exposed.

## 4. Database controls — database owner

- Identify database provider/environment and responsible database owner.
- Provide sanitized current schema and migration ledger/version/order for
  event, context, organization, and membership tables; confirm whether
  `aios_events` exists in the target.
- Provide effective table/function/sequence grants, ownership, role
  memberships/attributes including `BYPASSRLS`, default grants, and
  service-role/application-role usage.
- Provide effective RLS enabled/forced state and SELECT/INSERT/UPDATE/DELETE
  policies for event/context tables and relevant membership helper functions.
  Migration source alone is insufficient.
- Identify every privileged API/worker path that bypasses RLS and how its
  query is explicitly constrained by server-derived organization and
  permission.
- Confirm an isolated, disposable, synthetic-only database, approved
  migration/rehearsal workflow, policy inspection procedure, reset/discard
  process, and confirmation that it is not shared or replicated with
  production.

## 5. Isolated test authorization — service/security and database owners

- Approve exact non-production service/build, endpoints/methods, test window,
  rate limits, named test operator/reviewer roles, and a stop/escalation
  contact. No production endpoint is in scope.
- Approve synthetic Organizations A/B; separate active A-only and B-only
  users; a user without active membership; inactive membership; permitted and
  read-only roles; and invalid/expired synthetic identities.
- Approve distinct synthetic A/B events, contexts, replay/timeline records,
  and intentionally unmapped/quarantined records where supported.
- Provide expected success/denial response classes, no-existence-leak rule,
  before/after synthetic state evidence, and sanitized result retention
  location.
- Approve tests for own-tenant reads, A-to-B reads/replay/debug/mutation,
  forged organization/context selectors, authorization/database failure,
  idempotent retries, WebSocket unavailability, and demo/live-data separation.
- Confirm an independent reviewer will inspect results tied to the exact
  provider build and database target.

## 6. Evidence handling

- Distinguish source-code evidence, owner assertions, provider-generated
  evidence, and independently executed test evidence.
- Provide sanitized screenshots, exports, route maps, and database catalog
  results without credentials, private keys, tokens, connection strings,
  customer rows, or raw sensitive payloads.
- Do not send secrets in chat, repository files, logs, or this checklist. Use
  the approved secret manager for any authorized test credentials.

## Current source facts (not owner confirmations)

- Local Express routers declare the runtime paths but return 503 before their
  underlying unscoped handlers.
- The event source model has no organization owner; context ID is not proof
  of ownership.
- FastAPI source has bearer identity and active-membership authorization
  primitives, but Express is not wired to them.
- Current source closes both WebSocket endpoints before accept.
- `RUNTIME_AUTHORIZATION_VERIFIED` remains false.

These facts do not prove deployment identity, effective database security, or
external route state. Until the required owner/provider evidence is reviewed,
keep runtime, ingestion, and WebSockets disabled.
