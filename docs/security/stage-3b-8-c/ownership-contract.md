# Stage 3B.8-C Canonical Ownership Contract

**Status:** founder-approved design requirements for this stage. This contract
does not describe controls already implemented or verified in a deployed
database. No application behavior, schema, or database was changed or inspected
for this document.

## Approved decisions

1. Each business customer has exactly one authoritative owning organization.
2. Business activity events and operational/platform telemetry are separate
   data domains.
3. Records without authoritative ownership evidence are quarantined or denied
   ordinary tenant access. Ownership is never guessed from email domains,
   names, timestamps, context IDs, or similar heuristics.
4. Insights and KPIs are tenant-specific by default. Shared demo/platform data
   must be expressly classified and kept distinct from tenant business data.
5. Preparation is offline only. Database access, SQL execution, migrations,
   commits, pushes, and deployments require separate explicit approval.

## Customer ownership requirements

- Every business customer has exactly one authoritative owner organization.
- Knowing a customer ID does not grant access. Access ultimately requires
  verified identity, active membership, an appropriate permission, and
  verified record ownership.
- Customer-related deals, meetings, timelines, and customer intelligence must
  preserve the same owner. A child record must not reference a customer owned
  by a different organization.
- Shared customer access is outside the approved model. It requires a separate
  explicit decision and must not be introduced by weakening single ownership.
- Organization fields, foreign keys, uniqueness constraints, and application
  query filters are proposed implementation mechanisms, not evidence that the
  deployed schema currently enforces these requirements.

## Separate event domains

### Business activity

Business activity represents customer, sales, organizational, or other tenant
business activity. It requires a provable organization scope before tenant
access. User IDs, event IDs, context IDs, and client-provided payload fields
are identifiers or data—not proof of organization ownership. The exact mapping
of current event tables and producers to this domain remains unresolved.

### Operational/platform telemetry

Operational telemetry represents platform execution, diagnostics, runtime
activity, debugging, or infrastructure events. It requires a documented
classification and access policy. Platform-internal visibility does not grant
tenant-user access. If telemetry includes customer data or sensitive payloads,
that risk must be assessed and an explicit access policy established.

The repository uses both `events` and `aios_events`, but source names and
current code do not prove that either table cleanly represents one domain.
Do not merge or equate them without a reviewed event contract.

## Legacy and ambiguous records

- Assign ownership only when authoritative evidence and a documented reviewer
  establish it.
- Unowned, ambiguous, or conflicting records must be denied to ordinary tenant
  access and treated as quarantine candidates.
- Quarantine preserves records; it is not deletion or authorization to reassign
  data.
- No migration, reassignment, data repair, or backfill is authorized here.
- A future process must define accepted evidence, accountable reviewer,
  auditability, and release criteria for quarantined records.
- Missing ownership evidence must never default to the currently selected
  organization.

## Insights, KPIs, and AI-generated outputs

- **Tenant-specific by default:** customer insights, company-specific KPIs,
  business recommendations, tenant activity summaries, and outputs derived
  from tenant data.
- **Shared demo/platform:** only explicitly identified sample data,
  product-level operational metrics, or intentionally shared platform content.
- **Unknown classification:** inaccessible through ordinary tenant
  business-data paths until reviewed.
- AI-generated outputs must not have broader access than their source data and
  authorized user context. Lineage and ownership are required design properties,
  not features claimed to exist today.

## Mandatory access-control invariants

These are approved requirements, **not assertions of current enforcement**:

1. Verified identity is necessary but insufficient for business-data access.
2. Active organization membership and an appropriate permission are necessary
   but insufficient without record-ownership validation.
3. A selected organization must be validated against the authenticated user's
   active memberships.
4. Caller-supplied organization, user, customer, event, and context IDs do not
   prove ownership.
5. Service-role database access requires explicit server-side authorization
   and organization-scoped query rules.
6. RLS and application authorization are separate controls; neither is assumed
   effective without evidence.
7. A permission dependency cannot secure an unscoped query.
8. Missing, conflicting, or unverifiable ownership means deny.
9. Demo data and demo authentication remain isolated from real tenant data and
   real user sessions.
10. A route is not secured merely because identity or authorization modules
    exist elsewhere in the repository.

## Evidence boundaries

The repository contains identity and membership foundations, conflicting
customer schema declarations, and unscoped data paths. These are source facts
only. The actual deployed schema, migration history, grants, RLS, record
ownership quality, and exposure of routes are unknown. Read-only schema
inspection can establish visible structural and policy facts; it cannot by
itself prove that historical customer/event ownership is trustworthy.
