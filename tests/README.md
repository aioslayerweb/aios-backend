# AIOS Testing Foundation

## Purpose

Provide a quality architecture that treats testing as a first-class platform capability without breaking existing runtime architecture.

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

The repository has architecture scaffolding and an offline security contract suite. Run the security suite from the repository root:

```sh
npm run test:security
```

The command uses the already-declared `tsx` development dependency and Node's built-in test runner. It does not require a database, credentials, migrations, or service startup.

The suite reads local source files and synthetic fixtures only. It replaces `globalThis.fetch` with a throwing function during tests so accidental HTTP requests fail immediately. It does not import application entry points or initialize Supabase, Render, or Vercel clients.

## Security Suite Coverage

- Active checks validate synthetic identity, organization, role, and mapped/unmapped record fixtures.
- Active route-contract checks compare the frontend runtime paths against the Express replay route registrations.
- Demo isolation checks verify disabled runtime loaders are not invoked and demo insights/actions are explicitly synthetic.
- A TODO requirement expects the selected deployed API to implement those paths. It is pending because the identified FastAPI app does not currently register the runtime `/aios/*` contract and the canonical API routing strategy has not been implemented.
- TODO cases document the required denials for unauthenticated and invalid/expired identities, missing organization membership, cross-organization access, insufficient roles, unmapped records, and unauthorized service-role access.

TODO tests are intentionally not security assurances. They remain pending until a server-side identity and authorization boundary exists and can be exercised offline with injected fake dependencies. A passing test command means executable checks pass and pending requirements are reported; it does not mean those requirements are implemented.

## Limitations

- These tests do not invoke live FastAPI or Express handlers, Supabase policies, or deployed hosting controls.
- Source-text route checks can detect contract drift but do not prove production deployment wiring.
- Security TODO tests do not establish API behavior. They should be replaced with mocked/injected handler tests when the security boundary is introduced.
- No production credentials, network services, or customer data are used.

## FastAPI Identity Verification

The protected identity endpoint is tested independently of `main.py` and its service-role Supabase client:

```sh
/opt/conda/envs/aios-py311/bin/python -m unittest discover -s tests/security -p 'test_*.py' -v
```

Configure the FastAPI runtime with `AIOS_SUPABASE_JWT_ISSUER`, `AIOS_SUPABASE_JWT_AUDIENCE`, and `AIOS_SUPABASE_JWT_ALGORITHM`. The issuer must be an HTTPS Supabase Auth issuer ending in `/auth/v1`; the algorithm must be `RS256` or `ES256`. The JWKS URL is derived from the issuer. Local HS256 verification is intentionally unsupported. Production project settings must be independently confirmed before enabling this endpoint in production.

## Supabase Identity BFF

Real-account sign-in is separate from the Auth.js demo credential flow. The Next.js server accepts Supabase email/password credentials, stores the Supabase session in server-managed `HttpOnly`, `SameSite=Lax` cookies, and forwards the access token only to FastAPI's `/api/v1/security/identity` endpoint. The BFF returns only the subject verified by FastAPI; it does not authorize `/app`, organization membership, or business-data access. The existing Auth.js demo session and middleware remain separate.

Required frontend runtime configuration:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL. HTTPS is required except for local development.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable/anon key (never a service-role key).
- `AIOS_BACKEND_URL`: server-only backend origin, such as `https://api.example.test`; it must not include a path, credentials, query, or fragment. There is no hardcoded production fallback.

Run the focused offline BFF contract tests with:

```sh
npm run test:security
```

These tests inject local fake Supabase Auth and backend responses. They do not contact Supabase, FastAPI, or production. They do not verify the project's deployed Supabase issuer, audience, signing mode, or hosting configuration. The BFF refresh orchestration is tested with synthetic sessions; token rotation against a real Supabase project remains unverified.

## Organization Membership Foundation

The local-only migration `supabase/migrations/20261023000000_create_organization_memberships.sql` defines membership by Supabase Auth user UUID plus organization UUID, with a unique pair, controlled `pending`/`active`/`suspended`/`revoked` status, and approved `org_admin`/`member` role values. It enables RLS without client policies, grants access only to the backend service role, and records membership creation/status/role changes in a separate audit table. The migration has not been applied to any database.

`GET /api/v1/me/organizations` requires a Stage 3A-verified bearer token. It queries memberships by the verified subject only, returns active memberships only, automatically selects a sole active organization, and requires an explicit server-validated organization ID when multiple active memberships exist. The matching Next.js BFF endpoint uses the server-held Supabase session and forwards only the verified access token to that fixed FastAPI route. A selected organization is not persisted as authorization and does not authorize any business-data route.

The approved business permission mapping is `org_admin`: read/create/update/delete and `member`: read only. The reusable FastAPI authorization dependency resolves the current active organization membership for the verified subject and denies missing, ambiguous, or unauthorized organization selection. It does not establish record ownership by itself, and existing business routes remain outside the authorization boundary unless their repository queries can also be scoped to a trustworthy organization owner. There is no invitation or membership-provisioning endpoint. Membership rows must be created or changed only through a separately approved server-side provisioning flow that sets the audit actor fields. The migration depends on the tracked UUID `organizations` table definition; the deployed schema and effective RLS/grants remain unverified.

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
