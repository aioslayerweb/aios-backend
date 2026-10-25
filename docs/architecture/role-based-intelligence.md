# Role-Based Intelligence

Role-Based Intelligence (RBI) is a deterministic triage layer for connecting business signals to an executive's current focus. It reuses the platform's `RoleId`, effective permissions, and synthetic Intelligence Center anomaly samples; it does not introduce a separate identity or authorization model.

## Data and access boundary

The current panel is shown only in the Demo Platform. Its records are synthetic examples derived from existing Intelligence Center fixtures, not live business observations. Their timestamps are retained, and evidence older than 30 days (or without a usable timestamp) is flagged for verification. Financial estimates are omitted unless source data and explicit assumptions support one.

Each item identifies its entity, business function, relevant roles, evidence, uncertainty, and suggested next step. Required permissions are checked before records are scored or duplicates are collapsed. The active role can change relevance ranking but never grants access; a sample that requires `view_reports`, for example, is omitted unless that permission is already effective.

## Explainable triage

The relative score is a demo triage aid, not a calibrated probability or measured business result. Its weighted inputs are:

| Signal | Weight |
| --- | ---: |
| Impact | 20% |
| Urgency | 15% |
| Risk | 15% |
| Opportunity | 10% |
| Evidence confidence | 10% |
| Evidence freshness | 10% |
| Selected-role relevance | 20% |

Inputs use a 0–100 scale. Evidence confidence is capped when evidence is absent; missing or stale evidence is visibly marked for verification. Acknowledged and in-progress records receive ranking adjustments, while resolved and dismissed records are excluded. Ties and duplicate selection are deterministic.

## Demo interactions

Filters can narrow the visible authorized samples by business function, signal kind, priority, and status. Acknowledge and resolve actions update only in-memory page state and reset on reload. RBI does not execute workflows, approve decisions, contact external systems, call an AI model, or persist changes.

The demo now retrieves a bounded, organization- and permission-filtered Business Memory context package for the selected signal. It displays source references, applicable periods, historical rationale, unresolved commitments, conflicts, and evidence gaps without asserting unsupported history. Retrieval uses deterministic text and metadata matching; see [Business Memory and Context Engine](./business-memory.md) for the provider and authorization boundary.
