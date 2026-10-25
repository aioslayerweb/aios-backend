# Business Memory and Context Engine

## Architecture audit

The current application combines several different data behaviors. They are not interchangeable:

| Data class | Existing behavior |
| --- | --- |
| Persisted application data | The repository has a `business_memory` table migration and a generic Supabase `aios_events` event store. The Memory and Knowledge Center workspaces do not read or write those tables. |
| Client-side state | `MemoryProvider`, security/role contexts, and page-level demo actions use React state. That state is not durable storage or a trusted authorization boundary. |
| Synthetic demo data | Memory Center, Knowledge Center, Decision Center, and RBI fixtures are local sample records. New Business Memory examples are explicitly synthetic and organization-scoped. |
| Authorized external source data | No external record provider is connected to this memory feature. SDK memory/knowledge provider registries describe providers but do not implement record retrieval. |
| AI-generated information | Existing mock labels and summaries do not make these memory fixtures model outputs. The Business Memory search and context engine call no model. Records marked `ai_generated` are distinguished from verified facts. |

Search in the current Memory/Knowledge Center is literal field matching. There is no configured vector or semantic search provider in these paths. The existing `business_memory` migration does not define an organization key or row-level policy in that migration, and the generic event store is not an authorized memory-record API. Neither is used as a shortcut for the new feature.

The application has identity, tenant, role, and permission contexts and authenticated BFF routes for selected identity operations. The Business Memory feature has no server-side record endpoint today. Effective permission values available in the workspaces are client context, not a replacement for server authorization.

## Structured record model

`lib/business-memory/business-memory-engine.ts` defines validated, discriminated content for business facts, decisions, commitments, events, policies, knowledge references, business context, and lessons learned. Records carry organization scope, source type and source record reference, record timestamps, optional effective periods, verification, confidence, sensitivity, required permissions, business entity, relationships, lifecycle status, and optional review/expiry dates.

Content is type-specific: decisions retain rationale and outcome; commitments retain owner, due date, and status; policies retain version. Source identity and original timestamps are preserved on updates. Verified statements cannot be silently rewritten; a new record can supersede one instead. Conflict groups are returned together and flagged rather than resolved by recency alone.

## Operations and retrieval

The engine provides permission- and tenant-filtered record lookup and structured text search, as well as create, metadata/content update, link, and archive operations. Mutations return immutable state and compact audit entries containing actor, action, changed field names, organization, and timestamp, not record content. The Memory Center demo keeps this state in React memory only.

`retrieveBusinessContext` filters by organization and every required permission before relevance matching. It supports entity or RBI-signal links, date periods, permitted source types, and a bounded result count. It returns source citations, effective-period bounds, relevance reasons, stale/unverified/conflict flags, and evidence-gap messages. Retrieval is deterministic text and metadata matching, not semantic search. Superseded, obsolete, and archived records are excluded from current context while remaining inspectable in the Memory Center.

RBI consumes only the bounded context package for the selected demo signal. It can show a sourced sample fact, a decision rationale, an unresolved commitment, conflicts, or an explicit evidence gap. It does not infer that an event occurred from an unverified record, execute actions, or send the package to a model.

## Demo governance and production boundary

The demo includes synthetic verified facts, unverified decision rationales (including a reversed outcome), an overdue commitment, current and superseded policy versions, two conflicting source reports, a stale metric, a missing-evidence note, and a second-organization record. Role relevance never grants access; effective permissions and organization scope filter records before content search and ranking. Confidential/restricted sample records require `view_reports` in addition to the base dashboard permission.

Creation and archive controls are exposed only when the current UI context includes `manage_memory`; they affect the local session only. These controls and the context engine are demonstrators, not server-side access control. Do not use them for customer or production data.

Production persistence requires an authenticated server-side memory API, tenant-scoped storage and database-enforced access policies, server-verified permissions, durable append-only audit history, and an approved retention/archive policy. None is claimed or added here. A future provider should implement the existing model and retrieval contract only after those controls are available.

The synthetic connector fixture is not a Business Memory source: normalized connector output remains in demo page memory and is not persisted or consumed by RBI. Production connector-to-memory ingestion requires the server-side authorization, tenant persistence, provenance, and audit controls documented in [Secure Business Data Connectors](./data-connectors.md).
