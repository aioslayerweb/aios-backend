# Changelog

All notable changes to AIOS are documented in this file.

## [1.0.0] - 2026-07-09

### Added
- Enterprise multi-tenant security and authorization foundation.
- MCP host/server/gateway/registry architecture with policy and health layers.
- Platform quality/testing contracts for AI, integration, performance, and security gates.
- Production runtime architecture with lifecycle, queue orchestration, cache, observability, and resource snapshots.
- DevOps and infrastructure architecture for deployment, configuration, secrets, release, backup, recovery, and monitoring.
- SDK/extension/marketplace foundation for external developer extensibility.

### Changed
- Unified platform layering with stable hooks, contexts, and typed registries.
- Increased consistency of enterprise module boundaries and architectural documentation.
- Refined SDK hooks to remove duplicated singleton access patterns.

### Security
- Strengthened extension/plugin security contract model (sandboxing, RBAC, policy, tenant isolation, audit, signature requirements).
- Expanded operational security architecture for dependency audits and secret-detection workflows.

### Notes
- This release is architecture-first and intentionally avoids introducing unapproved backend APIs.
