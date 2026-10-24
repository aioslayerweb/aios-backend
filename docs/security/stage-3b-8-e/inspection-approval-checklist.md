# Stage 3B.8-E Inspection Approval Checklist

**All items are intentionally unchecked.** No approval, target, inspection
role, server version, or access capability is established by this document.
Completion of this checklist is not database access authorization unless the
founder separately approves the exact inspection stage and scope.

## Approval and scope

- [ ] Founder approves a separate read-only inspection stage.
- [ ] The approved purpose and exact scope are documented.
- [ ] Database owner identifies the target environment using a non-secret
      identifier.
- [ ] Target identity is independently verified before any connection.
- [ ] Responsible database owner and inspection operator are identified.
- [ ] No production mutation, migration, route modification, or deployment is
      included in the approval.

## Role and server

- [ ] Exact inspection role is identified out of band.
- [ ] Read-only restrictions are independently verified, including that the
      role cannot write, alter schema/policies/grants, or use elevated
      membership/ownership to bypass the restrictions.
- [ ] Catalog visibility is sufficient for the approved questions and its
      limitations are understood.
- [ ] PostgreSQL server version is confirmed using an owner-approved method.
- [ ] PostgreSQL 9.6+ `aclexplode()` compatibility is confirmed for the target.
- [ ] The inspection role does not require application service-role
      credentials.

## Query-by-query review

- [ ] Existing SQL files are reviewed for this approved target.
- [ ] Every query's purpose, scope, expected output, permissions, and expected
      load are approved individually.
- [ ] Optional aggregate queries are individually approved; no aggregate batch
      is assumed approved.
- [ ] `03_rls_and_grants.sql` includes `TRUNCATE` in the named-role table
      privilege probe and is interpreted as a probe, not a complete effective
      security determination.
- [ ] Missing roles, invisible catalog objects, and empty results will not be
      misinterpreted as proof of absence or lack of privilege.
- [ ] Expected output and data-minimization requirements are agreed; no
      credentials or unnecessary record-level personal data will be reported.
- [ ] Stop conditions and escalation path are documented.

## Ownership and decision boundary

- [ ] All reviewers agree schema structure and aggregate counts do not prove
      trustworthy ownership of historical records.
- [ ] Any proposed ownership evidence is separately identified as authoritative
      and assigned to an accountable reviewer.
- [ ] Unknown or ambiguous records remain denied/quarantined; no heuristic
      assignment or automatic fallback is permitted.

## Approval record — fill only after approval actually occurs

| Field | Status |
|---|---|
| Target environment identifier | Not established |
| Database owner | Not established |
| Founder approval date | Not approved |
| Approved query scope | Not approved |
| PostgreSQL version | Not verified |
| Inspection role and verification evidence | Not verified |

No credentials or connection strings should be entered in this checklist.
