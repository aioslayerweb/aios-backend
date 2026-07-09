# AIOS Testing Foundation (M7.3)

## Purpose

Provide an enterprise-ready quality architecture that treats testing as a first-class platform capability without breaking existing runtime architecture.

## Principles

- Never break existing architecture.
- Never remove functionality.
- Never invent backend APIs.
- Keep quality contracts modular, typed, and reusable.
- Prioritize business-signal, memory, security, and executive-experience validation.

## Directory Structure

- `tests/unit`: Unit-level test placeholders and suite planning.
- `tests/integration`: Cross-module resilience and integration scenarios.
- `tests/e2e`: End-to-end journey placeholders.
- `tests/ai`: AI evaluation matrix for regression, consistency, grounding, latency, and model comparison.
- `tests/performance`: Performance benchmark catalog and thresholds.
- `tests/security`: Security validation catalog (RBAC, tenant isolation, policy, audit, session).
- `tests/fixtures`: Shared business fixtures and workflow simulation scenarios.
- `tests/mocks`: Mock providers/evaluators for architecture-first quality harnesses.
- `tests/test-utils`: Builders and quality harness helpers.
- `tests/shared`: Core contracts, quality gates, and observability metrics model.

## Current Status

Architecture scaffolding complete. Framework-specific runner wiring (Jest/Vitest/Playwright/Pytest) can be layered next without changing these contracts.

## Quality Gate Baseline

Current baseline gates are defined in `tests/shared/quality-gates.ts` and include:

- lint
- typecheck
- build
- unit
- integration
- e2e
- ai-evaluation
- performance
- security

## How To Extend

1. Add concrete test files in the correct layer folder (`unit`, `integration`, `e2e`, etc.).
2. Reuse definitions from `tests/shared/types.ts` to keep metadata consistent.
3. Reuse shared fixtures and builders from `tests/fixtures` and `tests/test-utils`.
4. Keep every new scenario tenant-aware and role-aware when applicable.
5. Align new checks with business outcomes, security controls, and AI explainability.
