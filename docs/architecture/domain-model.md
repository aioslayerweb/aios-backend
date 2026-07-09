# AIOS Unified Domain Model

AIOS now centers on a shared TypeScript domain model under `src/domain`. The goal is a single business language that every module can import instead of redefining its own records.

## Core Entities

The model is organized around a small set of enterprise aggregates:

- `Company`
- `Organization`
- `Department`
- `Team`
- `Person`
- `Goal`
- `Project`
- `Task`
- `Workflow`
- `Decision`
- `Agent`
- `Knowledge`
- `Memory`
- `Policy`
- `Event`
- `Customer`
- `Opportunity`
- `Document`
- `Integration`
- `Connector`
- `Tool`
- `Conversation`
- `Notification`
- `Report`
- `Relationship`

Each entity carries common lifecycle and audit fields through the shared base contracts in `src/domain/common`.

## Shared Base Contracts

The foundation is built from:

- `Entity`
- `OwnedEntity`
- `TimestampedEntity`
- `VersionedEntity`
- `AuditableEntity`

These are used consistently across the model so the platform can reason about identity, ownership, lifecycle, and traceability in the same way everywhere.

## Relationships

Relationships are modeled explicitly through shared reference and relationship definitions in `src/domain/common/relationships.ts`.

The primary business chain is:

Company -> Department -> Team -> Person -> Goal -> Project -> Task -> Workflow -> Event -> Decision -> Memory -> Knowledge

Additional links connect customers, opportunities, documents, integrations/connectors, tools, conversations, policies, notifications, reports, and explicit relationships into the same model.

## Ownership

Ownership is modeled as a first-class concept on each aggregate. Some entities are owned by people, while system aggregates are owned by users or platform operators. This keeps responsibility explicit and supports governance-aware behavior.

## Aggregates and Bounded Contexts

The domain is split into bounded contexts that still share the same identifiers, status enums, and base contracts. That lets AIOS keep local behavior inside each module while preserving a single enterprise vocabulary.

Existing platform modules such as decisioning, planning, runtime, workflow, knowledge, memory, executive intelligence, role intelligence, and organization intelligence should import from `src/domain` rather than redefining core business entities.

## Future Extension Strategy

When adding a new business concept:

1. Add the identifier to `src/domain/types/ids.ts` if needed.
2. Add any new shared enum values to `src/domain/common/enums.ts`.
3. Define the entity in a bounded context under `src/domain/<context>/index.ts`.
4. Reuse the common base contracts instead of creating new lifecycle or ownership patterns.
5. Update platform modules to import the shared model rather than introducing local duplicates.

This keeps the model stable, discoverable, and suitable for long-term enterprise growth.
