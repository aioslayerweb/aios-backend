# AIOS SDK, Extension Platform, and Marketplace Foundation (M7.6.5)

## Objective

Transform AIOS into a secure, enterprise-grade extensible platform where third-party developers and partners can build plugins, SDK modules, connectors, and UI extensions without changing AIOS core modules.

## SDK Philosophy

The SDK is TypeScript-first and contract-driven. Public contracts are stable, versioned, and intentionally separated from internal implementation details.

Design principles:

- Stable public APIs before implementation coupling
- Backward compatibility as a first-class requirement
- Security and governance built into extension contracts
- Tenant-isolated extension execution assumptions
- Modular registries to support future language SDKs

## SDK Modules

The SDK architecture models these modules:

- Core
- Authentication
- Organizations
- Memory
- Knowledge
- Workflows
- Agents
- Models
- Prompts
- Policies
- Runtime
- MCP
- Events
- Search
- Analytics

Future SDK language targets are modeled (TypeScript, Python, Java, Go, .NET, other) without requiring redesign.

## Public API Layer and Versioning

Public API contracts are registered through a dedicated registry with semantic version fields and deprecation controls.

A dedicated `SDKPublicClient` exposes only approved stable surfaces:

- Public API listings
- Signed plugins
- Extension metadata
- Package metadata
- Marketplace listings and install records
- Agent and workflow SDK definitions

This avoids exposing internal registries directly to external developers.

## Plugin Lifecycle

Plugin architecture supports extension scopes across:

- Agents
- Commands
- Workflows
- Knowledge providers
- Memory providers
- Decision engines
- Prompt packs
- Models
- Reports
- Dashboards
- Developer tools
- Administration
- Navigation
- Notifications

Plugin manifests capture permissions, compatibility ranges, signatures, and organization ownership.

## Extension Lifecycle

Extension framework supports these extension points:

- Lifecycle hooks
- Event subscriptions
- Command registration
- Workflow registration
- Sidebar extensions
- Dashboard widgets
- Settings panels
- Background services
- Custom actions

Lifecycle records track extension state transitions (`registered`, `loaded`, `started`, `stopped`, `failed`).

## Agent SDK

Agent SDK contracts support:

- Metadata
- Capabilities
- Tools
- Prompts
- Policies
- Memory access
- Knowledge access
- MCP access
- Observability

## Workflow SDK

Workflow SDK contracts support:

- Triggers
- Conditions
- Actions
- Retries
- Scheduling
- Approvals
- Rollback
- Validation

## Knowledge and Memory Provider SDKs

Knowledge provider SDK supports enterprise knowledge integrations, including internal wiki, SharePoint, Confluence, custom databases, document repositories, and industry-specific sources.

Memory provider SDK supports long-term/short-term memory, vector stores, enterprise databases, hybrid storage, and future AI-native providers.

## MCP Connector SDK

MCP connector SDK supports:

- Authentication modes
- Connector discovery
- Health checks
- Tool/resource/prompt exposure
- Streaming support
- Version compatibility controls

## UI Extension Framework

UI extension targets include:

- Workspace pages
- Widgets
- Panels
- Inspector views
- Developer Center
- Runtime Center
- Command Palette
- Context menus

## Package Management

Package metadata includes:

- Name
- Version
- Author
- Organization
- Dependencies
- Permissions
- Capabilities
- Compatibility
- License
- Signature
- Release history

## Marketplace Foundation

Marketplace architecture supports:

- Discovery (listing registry)
- Installation and updates (install records)
- Reviews
- Approval workflow
- Organization policies
- Version compatibility metadata
- Signature-aware governance posture

## Security and Governance

Extension security profiles enforce modeled controls for:

- Sandboxing
- Permission validation
- RBAC
- Role-Based Intelligence compliance
- Tenant isolation
- Policy enforcement
- Audit logging
- Digital signing

## Developer Experience

Developer experience foundation includes:

- CLI command architecture
- Template registry
- Scaffolding model
- Documentation generator readiness
- Diagnostics readiness
- Reference implementation readiness

## Folder Structure

M7.6.5 implementation is organized under:

- `src/sdk/core`
- `src/sdk/plugins`
- `src/sdk/extensions`
- `src/sdk/marketplace`
- `src/sdk/packages`
- `src/sdk/agent-sdk`
- `src/sdk/workflow-sdk`
- `src/sdk/memory-sdk`
- `src/sdk/knowledge-sdk`
- `src/sdk/mcp-sdk`
- `src/sdk/ui-sdk`
- `src/sdk/hooks`
- `src/sdk/types`
- `src/sdk/utils`

## Developer Onboarding Path

1. Use SDK public API contracts to discover approved services.
2. Build package metadata with capability, permission, and compatibility declarations.
3. Register plugin and extension contributions.
4. Apply security profile validation and policy checks.
5. Publish to marketplace foundation with organization policy gating.
6. Install/update through policy-aware install workflow.

This keeps extensibility secure, versioned, and maintainable for long-term enterprise platform evolution.
