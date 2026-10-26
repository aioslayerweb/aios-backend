# Stage 2U — Authoritative Event-to-Organization Ownership Resolution

**Verdict: BLOCKED.** Current repository evidence does not provide an
authoritative organization relationship for runtime events, nor a trusted
Express identity and active-membership boundary capable of assigning one at
creation. No safe ownership migration or backfill can be implemented from
the available evidence. Affected Express routes remain fail-closed; this
stage does not enable runtime authorization.

## 1. Scope and evidence boundary

Reviewed local source, migrations, tests, and Stage 2I–2T reports on branch
`main`. Local HEAD at inspection was
`b2eb41374c3415a6e287003466156d2742cf54a3`. The worktree already contained
three modified layout files and six untracked Stage 2H–2K reports; these
were preserved and are not part of this stage.

This review did not access a database or deployed service. Migration source
does not establish that a table or policy exists in a live database, and
repository route declarations do not establish which service is deployed.
No production records, credentials, or endpoint responses were accessed.

## 2. Ownership-source determination

No existing authoritative parent or ownership relation for the Express
runtime events was found:

| Candidate source | Repository evidence | Conclusion |
|---|---|---|
| Event row | [`src/memory/supabaseClient.ts`](../../../src/memory/supabaseClient.ts) models `aios_events` with `id`, `type`, `timestamp`, `context_id`, `payload`, and `created_at`; neither row nor insert model contains organization ownership. | No owner is stored or validated by this adapter. The table model is source code, not proof of actual database schema. |
| In-memory event store | [`src/memory/eventStore.ts`](../../../src/memory/eventStore.ts) indexes events by event ID and `contextId`, and provides global and context-only reads. It has no organization field or ownership check. | A context lookup is not a tenant boundary. Cache contents cannot prove ownership. |
| Context / parent resource | No runtime context, run, workflow, or agent parent with a verified organization relationship was found in the reviewed event path or migrations. | There is no existing parent relation that can safely establish event ownership. |
| Event migrations | The checked-in migration set contains no `CREATE TABLE`/`ALTER TABLE` ownership definition for `aios_events`, no event-to-context organization foreign key, and no event-table RLS/grant definition. | Actual event schema, migration ledger, and effective policies remain unknown. Do not infer they are absent in a deployed database; obtain database-owner evidence. |
| Customer ownership | [`20261026000000_scope_customers_to_organizations.sql`](../../../supabase/migrations/20261026000000_scope_customers_to_organizations.sql) adds organization ownership and a membership-based read policy for customers. | This is a separate resource. It does not authorize associating events with a customer's organization. |
| Client event fields | [`src/api/intelligence.ts`](../../../src/api/intelligence.ts) accepts `contextId` from the request body. | `contextId`, payload fields, headers, query values, route parameters, `org_id`, and `organization_id` are client-controlled and cannot establish ownership. |
| FastAPI identity and membership | [`backend/routes/security.py`](../../../backend/routes/security.py) verifies bearer identity; [`backend/security/authorization.py`](../../../backend/security/authorization.py) resolves active membership and permissions; [`backend/services/organization_memberships.py`](../../../backend/services/organization_memberships.py) validates membership results. | These are usable FastAPI source primitives, but are not wired into the Express runtime or event persistence. Authentication alone does not prove a record's organization. |

**No trustworthy source exists in the current Express event flow from which
to assign either new or historical event ownership.** Therefore this stage
does not add an organization column, context ownership table, foreign key,
RLS policy, or backfill. Those would be speculative without the actual
database schema, owner-approved domain contract, verified producer identity,
and an evidenced source mapping.

## 3. Event creation, persistence, and read paths

### Express event ingestion

[`src/server.ts`](../../../src/server.ts) mounts `/intelligence` and `/aios`.
[`src/api/intelligence.ts`](../../../src/api/intelligence.ts) installs a
router-wide 503 response before the `/event` handler. The handler beneath the
gate would parse the body, call `processEvent`, and persist via the event
store. It has no verified caller identity, membership lookup, server-derived
organization, or parent ownership check. The event sink registration also
has no tenant argument. It is not safe to remove the gate or use that handler
as an ownership source.

### Express persistence

[`src/memory/eventStore.ts`](../../../src/memory/eventStore.ts) adds events to
global process memory before asynchronous persistence. It can retain events
when storage is unavailable and its maps are not organization-partitioned.
[`src/memory/supabaseClient.ts`](../../../src/memory/supabaseClient.ts)
creates a Supabase client from `SUPABASE_URL` and `SUPABASE_ANON_KEY`; its
event insert and select operations have no organization parameter and no
caller credential binding in this adapter. This does not prove the actual
database grants or RLS, but it means the application code shown here does not
enforce tenant scope.

### FastAPI and older event paths

- The current root [`main.py`](../../../main.py) does not mount
  `backend.routes.events`. Its event-summary routes call
  `require_event_organization_scope()` and return 503 after the
  authentication/membership dependency; their event ownership source remains
  unconfigured.
- [`backend/routes/events.py`](../../../backend/routes/events.py) is present
  but not included by current `main.py`. Its request model takes `user_id`
  and `user_email` from the request and inserts into a generic `events` table
  using the server's service-role Supabase client. It is not an acceptable
  organization ownership mechanism and must not be newly mounted as-is.
- [`supabase_client.py`](../../../supabase_client.py) initializes a
  service-role client for older Python code. Service-role use is privileged
  and cannot be treated as RLS isolation. Effective database role attributes
  and grants were not inspected.

The focused event migration search found no event organization schema in
checked-in migrations. The actual event table, if any, and its applied
migration state require database-owner verification.

## 4. Identity and authorization boundary

FastAPI has verified bearer identity and active-membership source code, but
there is no existing verified bridge that Express can reuse. Express does
not import those Python dependencies, validate the same bearer contract, or
resolve membership. No trusted proxy assertion or service-to-service identity
contract is evidenced. The Express event adapter also has no membership-aware
database session.

Consequently, even a future `organization_id` column would not by itself make
the endpoints safe. Before any organization-scoped operation can be enabled,
an owner must choose and evidence one runtime boundary:

1. Move runtime event operations to FastAPI and use its verified identity and
   active-membership dependencies; or
2. Approve a cryptographically verified identity contract for Express,
   including issuer, audience, key lifecycle, subject mapping, and a trusted
   active-membership resolver; or
3. Establish a verified, integrity-protected service identity exchange and
   have Express validate the assertion and independently resolve membership.

Plain forwarded identity/organization headers, client-selected organization,
and a valid identity without active membership are insufficient.

## 5. Minimal future ownership contract (not implemented)

After the actual schema and trusted producer are confirmed, the owner-approved
design must provide:

- A server-derived organization from verified subject plus active membership
  and operation permission, before event creation.
- An authoritative context/parent binding or immutable event organization,
  with database-enforced organization references and an atomic event/context
  association. Client-controlled event fields cannot set or transfer owner.
- Tenant-scoped list, type-filter, timeline, replay, debug, and ingestion
  repository operations. Context lookup must be scoped by authorized
  organization; aggregates and pagination must be scoped before computation.
- Fail-closed behavior on missing, null, orphaned, ambiguous, or conflicting
  owner; no cache/global/memory fallback can return data without tenant proof.
- Effective least-privilege database grants and policies verified for every
  actual role. A service-role or BYPASSRLS path requires separately verified
  server-derived tenant predicates and cannot be described as RLS isolation.
- A reviewed migration plan that preserves unknown historical records as
  inaccessible/quarantined unless an authoritative mapping independently
  establishes their owner. Do not backfill from context IDs, payloads,
  membership at present time, caller values, or guessed mappings.

The future schema details must be chosen only after the database owner
provides actual event/context tables and constraints. This report does not
authorize a migration, backfill, production change, or database access.

## 6. Route status and test evidence

| Route family | Current source behavior | Ownership assessment |
|---|---|---|
| `GET /aios/events`, type filter, `/timeline`, `/replay/:contextId`, `/debug/:contextId` | Express replay router returns 503 before handlers. | No identity/membership scope or authoritative owner exists in the underlying handlers. Keep disabled. |
| `POST /intelligence/event` | Express ingestion router returns 503 before parsing or processing. | No server-derived owner exists; client organization fields cannot be trusted. Keep disabled. |
| FastAPI event-summary routes | Current `main.py` invokes a 503 event-scope guard. | Identity/membership dependencies alone do not establish event ownership. Keep blocked. |
| `/ws`, `/ws/autopilot` | Current [`main.py`](../../../main.py) and [`main_backup.py`](../../../main_backup.py) close before accepting. | Keep disabled; connection and per-message authorization would need a separate contract. |

Extended [`runtime-event-isolation.test.ts`](../../../tests/security/runtime-event-isolation.test.ts)
with synthetic forged top-level `organization_id` and `org_id` values on an
ingestion request. It verifies the request still receives 503 and does not
write to the local event store. This proves only the local fail-closed route
gate and no-write behavior. It does **not** test a legitimate tenant read,
identity/membership integration, ownership enforcement, database RLS/grants,
or deployed isolation.

The two original TODOs in
[`security-foundation.test.ts`](../../../tests/security/security-foundation.test.ts)
remain **OPEN**:

1. `selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved`
2. `user cannot read or replay a record owned by another organization`

### Stage-report reconciliation

- Stage 2S and 2T correctly identify absent event ownership and missing
  Express identity/membership integration; this Stage 2U source review
  confirms those blockers remain.
- Stage 2I's earlier statement that primary `/ws` accepts and echoes
  connections is stale relative to current [`main.py`](../../../main.py),
  which closes before accepting. Stage 2S/2T and current security tests
  reflect the later fail-closed source. Actual deployment state remains
  unknown.
- Stage 2H–2K owner/deployment reports do not establish an authoritative
  event mapping, effective database policy, or currently deployed service.
  Their owner evidence request remains a request, not evidence received.

## 7. Validation, unverified guarantees, and next action

### Proven in repository tests

- Express event/replay endpoints remain unavailable with 503 in the local
  synthetic test server.
- A forged organization header and the added forged event-body organization
  identifiers do not enable ingestion; the local event count is unchanged.
- The current runtime feature gate remains false; the original security
  TODOs remain open.

### Not verified

- Actual database schema, migration ledger, foreign keys, effective RLS,
  grants, role attributes, or service-role/BYPASSRLS behavior.
- Any deployed API identity, proxy provenance, route ownership, or active
  service/build.
- Authentication or active-membership authorization for Express.
- Tenant ownership of any historical event or context.
- Production deployment or production behavior.

### Required next action

The authorized service, identity, domain, and database owners must identify
the active runtime service and choose its verified identity/membership path;
provide the actual event/context schema and an authoritative event-owner
source; and approve an isolated synthetic database and migration/test plan.
If no authoritative historical mapping exists, historical events remain
untrusted and unavailable through tenant-scoped endpoints. Keep the 503 gates
and `RUNTIME_AUTHORIZATION_VERIFIED = false` until the complete chain is
implemented and independently verified.
