# Enterprise Security, RBAC & Multi-Tenancy

## Purpose

The AIOS Enterprise Security Layer transforms AIOS into a multi-tenant enterprise SaaS platform.

It provides architecture for organization isolation, workspace segmentation, tenant-aware users and teams, RBAC, permissions, auditability, security policies, API key governance, and active session management.

This is not only authentication. It is the full enterprise governance layer for secure deployment.

## Architecture

The enterprise administration experience is implemented on the existing corporate workspace route at `/app/corporate`.

Primary frontend areas:

- `components/security/`
- `components/rbac/`
- `components/organizations/`
- `components/workspaces/`
- `components/users/`
- `components/roles/`
- `components/permissions/`
- `components/audit/`
- `components/api-keys/`
- `components/sessions/`
- `contexts/security-context.tsx`
- `hooks/use-organizations.ts` and related security selectors
- `types/security.ts`
- `utils/security.ts`

## Integrated AIOS Systems

The security layer composes or reflects state from:

- Runtime Engine
- Memory Layer
- Knowledge Graph
- Decision Engine
- Governance Center
- Executive Reports
- Workflow Builder
- Prompt OS
- Supabase Authentication

## Enterprise Model

The current model supports:

- organizations
- workspaces
- users
- teams
- roles
- permissions
- audit logs
- security policies
- API keys
- active sessions

Production SSO, SAML, SCIM, Azure AD, Okta, Google Workspace, Microsoft Entra ID, and ABAC are not invented here, but the state model is designed so those integrations can be added without major rewrites.

## Status

Implemented in the app shell with mock tenant, RBAC, policy, API key, and session data.