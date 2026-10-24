# Stage 3B.8-C Tenant-Isolation Implementation Gate

**Gate status: NOT SATISFIED.** This document does not authorize implementation.
Passing all criteria permits proposing a scoped implementation stage; it does
not authorize production changes, migrations, SQL execution, or deployment.

## Required entry criteria

- [ ] Founder accepts the canonical ownership contract in
      `ownership-contract.md`.
- [ ] Relevant deployed schemas and migration history are reconciled using
      approved read-only evidence, **or** founder explicitly approves a
      source-only implementation scope that does not assume deployed schema.
- [ ] Canonical customer model and related-record ownership/consistency rules
      are defined, including deals, meetings, timelines, and derived outputs.
- [ ] Business activity and operational/platform telemetry have documented,
      separate boundaries and access policies.
- [ ] Legacy quarantine, denial, reviewer, provenance, and release rules are
      defined; no ambiguous record is assigned by heuristic.
- [ ] Insights, KPIs, and AI outputs are classified tenant-specific, explicitly
      shared demo/platform, or unknown/inaccessible.
- [ ] Route-to-data-access map identifies each handler, repository/query,
      client type (including service role or browser client), and required
      organization scope.
- [ ] Implementation plan derives organization scope server-side from verified
      identity plus active membership and validates related-record ownership.
- [ ] Tests exercise actual handlers/repository scoping for unauthenticated
      access, inactive membership, forbidden roles, forged identifiers,
      cross-organization access, missing ownership, parent mismatch, and
      service-role query scoping.
- [ ] RLS and application authorization are reviewed as distinct controls;
      neither is treated as a substitute for scoped service-role queries.
- [ ] Any required migration design, synthetic validation, backup/rollback,
      and separate execution approval are handled as distinct review gates.

## Current blockers

- Customer definitions conflict and do not yield a verified canonical
  organization owner across all source paths.
- No authoritative legacy ownership mapping is established.
- `events` and `aios_events` have different source contracts but unresolved
  domain classification and no demonstrated organization owner.
- Deals/meetings have customer references without demonstrated organization
  consistency; timeline and several insight schemas are missing from tracked
  migrations or have no tenant owner.
- Existing business routes and runtime replay consumers are not wired to the
  shared authorization dependency or organization-scoped queries.
- Deployed schema, migration status, grants, RLS, and route exposure are
  unknown.

## Decision

Until every applicable criterion passes, keep tenant-sensitive routes blocked
from new real-user business access. Do not attach authorization dependencies
across customer/business routes as a substitute for resolving ownership and
query scope.
