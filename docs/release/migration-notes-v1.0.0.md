# AIOS Platform v1.0.0 Migration Notes

## Audience

Platform engineers, solution architects, and implementation teams upgrading to AIOS Platform v1.0.0.

## Summary

v1.0.0 is a platform unification release. It standardizes architecture, contracts, and extensibility foundations without requiring new backend APIs.

## Key Migration Areas

- Security foundation
- MCP platform foundation
- Quality/testing contracts
- Production runtime contracts
- Infrastructure/DevOps contracts
- SDK and extension platform contracts

## Compatibility

- Existing app routes and provider tree remain supported.
- Existing hooks remain available; new hooks are additive.
- Domain model remains source-of-truth under `src/domain`.

## Recommended Migration Steps

1. Adopt new architecture docs under `docs/architecture` as canonical implementation references.
2. Prefer registry-driven contracts in `src/runtime`, `src/infrastructure`, and `src/sdk` for new work.
3. Reuse root hook wrappers instead of importing deep internal module paths when possible.
4. Validate with `npm run lint`, `npm run typecheck`, and `npm run build` in CI for all changes.

## Known Non-Goals in v1.0.0

- No direct backend API expansion.
- No replacement of existing UI routes/components.
- No breaking removal of prior module surfaces.

## Follow-Up

Future post-GA releases should focus on attaching concrete execution engines to existing contracts, not creating parallel abstractions.
