# Secure Business Data Connectors

## Current implementation boundary

`lib/integrations/connectors` defines a provider-neutral connector contract for connection verification, resource discovery, paged retrieval, normalization, provenance, freshness, tombstones, and safe failure categories. The first implementation is `SyntheticOpportunityAdapter`, a deterministic local fixture with no external network access, credentials, secret storage, or persistence.

The synthetic adapter is exposed only by the demo Integration Hub. Its client-side permissions and organization scope are demonstrative checks, not a server authorization boundary. Its records are held in page memory and are not written to Business Memory, RBI, `aios_events`, or any production database. A passing synthetic validation means only that the fixture adapter contract executed; it is not evidence of a provider connection.

The application Integration Hub does not expose the synthetic fixture. Its provider catalogue is marked as illustrative, its connection and sync controls are disabled, and its seeded activity, job, and execution-log claims have been removed. The integration context rejects unsupported connect, pause, sync, and retry requests instead of generating success-shaped local state.

## Connector contract

- Definitions identify provider mode, auth method, requested scopes, supported business categories, and required data permission.
- Instances are organization-scoped and store metadata and scopes only. Credential-shaped scope or metadata fields and common credential values are rejected; secrets must not be placed in connector instances.
- Lifecycle verification requires `manage_integrations`, checks the active organization and adapter identity, and records only a verified status when the adapter explicitly validates. Provider exceptions are reduced to enumerated categories.
- Synchronization additionally requires the definition's data permission. It verifies organization scope, caps page size at 100 and page count at 20, and returns `partial` when pages are incomplete or fail.
- Opportunity records retain normalized values, source system and record ID, source update time, import time, freshness, organization scope, and deleted-source tombstones. Older source versions do not overwrite newer records; identical imports are idempotent.
- Existing records belonging to another organization are never merged into a sync result.

## Production prerequisites

No production connector is currently implemented or configured. Before adding one, provide:

1. An authenticated server-side API that derives identity and active tenant from verified credentials and enforces `manage_integrations` plus data-category permissions server-side.
2. An approved OAuth/API credential flow and managed secret storage. Secrets must never be sent to the browser, returned in API payloads, or logged.
3. Tenant-keyed persistence with database-enforced row-level access, validated provider account-to-organization binding, durable provenance, and audited state transitions.
4. Server-side synchronization jobs with rate limits, bounded retries, replay protection, provider-specific cursors, partial-failure reporting, deletion policy, and operational monitoring.
5. An explicit, permission-filtered mapping from normalized records into Business Signals, Business Memory, RBI, or other intelligence surfaces. A successful import alone is not an insight and must not imply a business recommendation.

Until these controls and a real provider credential path are verified, UI and API code must not claim a live connection, successful provider sync, or production data availability. See [Business Memory](./business-memory.md) for its separate persistence boundary and [Security](./security.md) for tenant and authorization requirements.
