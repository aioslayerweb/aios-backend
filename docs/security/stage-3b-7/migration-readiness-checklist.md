# Migration readiness checklist

**Status:** every gate is pending. Documentation or local source review does
not count as deployed-database evidence. No migration is approved for execution.

| # | Gate | Required evidence | Pass criteria | Block if | Approver |
|---|---|---|---|---|---|
| 1 | Read-only access and environment identification | Written access approval; non-secret target project/environment identifier; credentialed role restrictions confirmed out of band | Target is unambiguous and role is read-only for approved metadata/count queries | Target or effective read-only privileges cannot be established | Founder + database owner |
| 2 | Actual schema and migration reconciliation | Catalog inventory; migration-history result; comparison against tracked and local untracked files | Every relevant object and applied version is accounted for; unknown visibility is documented | Schema/history is missing, inconsistent, or insufficiently visible | Database owner + security reviewer |
| 3 | Effective RLS and grants | Policies, grants, role attributes/memberships, ownership, `BYPASSRLS`, security-definer/view paths | Effective paths are understood for anon/authenticated/service roles; tenant policies are explicit | Role inheritance or policy effectiveness is ambiguous | Security reviewer + database owner |
| 4 | Canonical customer/event decisions | Approved customer definition; event-domain classification; field and retention requirements | Founder approves canonical shapes and tenant/platform classifications | Competing meanings or fields remain unresolved | Founder |
| 5 | Legacy ownership source and quarantine | Authoritative mapping evidence, provenance, ambiguity counts, quarantine rules | Every assigned row has evidence; ambiguous rows remain inaccessible | Email/name/ID inference is needed or unresolved rows would be exposed | Founder + data owner |
| 6 | Migration design review | Proposed DDL, constraints, indexes, grants, RLS, audit strategy, impact estimate | Security and data reviewers approve design, sequencing, and compatibility | DDL changes ownership without enforceable constraints or review | Database owner + security reviewer |
| 7 | Backup and recovery readiness | Verified backup/snapshot procedure, restore test, retention and RPO/RTO | Restore path and rollback data preservation are demonstrated | Backup is unavailable or restore has not been verified | Database owner |
| 8 | Synthetic environment readiness | Disposable project/database isolated from production; synthetic-only credentials/data | Environment identity is independently verified and destruction/cleanup controlled | Any ambiguity about target or real data use | Founder + database owner |
| 9 | Idempotency and rollback design | Migration transaction/re-run behavior, rollback or forward-repair plan, lock/load estimate | Safe failure and recovery paths reviewed; no destructive data loss | Irreversible action or uncertain retry behavior | Database owner + reviewer |
| 10 | Cross-tenant authorization tests | Synthetic two-tenant route/repository tests, including forged IDs and unowned records | All cross-tenant attempts deny and authorized cases pass | Tests only mock a permission decision without exercising scoped queries | Security reviewer |
| 11 | Service-role query scoping | Repository review and tests of every privileged query path | Queries constrain by verified organization and ownership; unowned rows deny | Any tenant query relies on RLS while using service role, or omits scope | Application owner + security reviewer |
| 12 | Frontend direct-Supabase review | Inventory of browser reads/writes, effective RLS policy tests, client key classification | Tenant data is inaccessible without active membership; public demo data is intentionally separated | Global policies expose tenant data or deployed policies unknown | Frontend owner + security reviewer |
| 13 | Monitoring and reconciliation plan | Before/after aggregate counts, mismatch/quarantine counts, error and latency monitoring | Owners can detect drift and reconcile without exposing row data | No rollback trigger or reconciliation owner | Database owner + operations |
| 14 | Separate execution approval | Explicit approval naming environment, migration/version, window, and operator | Staging/production execution authorized as a distinct task | Approval is implicit, environment differs, or scope expands | Founder + database owner |
| 15 | Deployment and post-deployment verification | Deployment source commit, applied migration record, policy/grant review, safe smoke-test results | Only approved version is deployed and scoped tests pass in the named environment | Runtime wiring, migration state, or effective access differs from approved plan | Founder + security reviewer + database owner |

## Approval rule

All gates must be recorded as passed with evidence before a migration is
considered ready for staging. Production execution requires a separate,
explicit approval after staging results. This checklist does not grant
database access or authorize a migration.
