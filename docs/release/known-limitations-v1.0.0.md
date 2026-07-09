# AIOS Platform v1.0.0 Known Limitations

## Architecture-First Scope

- Several platform areas are contract/scaffold first and require environment-specific runtime bindings.
- CI/CD workflows include production templates and placeholders rather than full environment binding.

## Testing Infrastructure

- Quality framework is established; some runner-specific suites are still incremental.

## Marketplace and SDK Runtime Enforcement

- Security and policy controls are strongly modeled; enforcement adapters depend on backend/runtime integration layers.

## Operational Integrations

- Monitoring, alerting, and cost contracts are unified but may require provider-specific adapter implementation.

## Guidance

Use v1.0.0 as a stable architectural baseline. Extend by attaching concrete providers to existing contracts rather than creating alternate abstractions.
