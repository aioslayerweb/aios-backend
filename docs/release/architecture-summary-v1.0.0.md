# AIOS Platform v1.0.0 Architecture Summary

## Platform Layers

- Unified domain model: `src/domain`
- Runtime orchestration: `src/runtime`
- Infrastructure and operations: `src/infrastructure`
- SDK, plugins, extensions, marketplace: `src/sdk`
- MCP architecture: `src/mcp`

## Enterprise Foundations Included

- Security and authorization contracts
- Multi-tenant context and policy-ready controls
- Runtime lifecycle and queue/cache/event architecture
- Infrastructure deployment/configuration/recovery architecture
- Extensibility architecture for external developers

## Design Philosophy

- Architecture-first, execution-second
- Strong typing and contract boundaries
- Additive and non-breaking integration
- Enterprise governance and security posture by default

## Cohesion Improvements in GA Pass

- Reduced duplicated hook logic in SDK layer
- Consolidated release and migration readiness documentation
- Standardized module-level documentation for runtime, infra, MCP, SDK, and security
- Aligned versioning direction toward AIOS Platform v1.0.0
