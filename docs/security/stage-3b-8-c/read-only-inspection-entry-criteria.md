# Stage 3B.8-C Read-Only Inspection Entry Criteria

**No database access is requested or authorized by this checklist.** It
prepares a possible future inspection only. Do not paste credentials into chat
or use an unverified local connection.

## Approval and target

- [ ] Founder explicitly approves a separate read-only inspection stage and
      its exact scope.
- [ ] Database owner independently identifies the intended Supabase
      environment using a non-secret project/environment identifier.
- [ ] Database owner approves a genuinely read-only role; its effective
      privileges are verified out of band.
- [ ] Target PostgreSQL version is confirmed before selecting catalog queries.
- [ ] Inspection operator confirms target identity immediately before any
      approved query; if environment identity or role is ambiguous, stop.

## Toolkit review before any use

- [ ] Review `docs/security/stage-3b-7/inspection/README.md` and all four SQL
      files as source; no SQL is presumed approved merely because it is
      documented.
- [ ] Update/review README to include the `aclexplode()` PostgreSQL 9.6+
      assumption and catalog-visibility limitations. This correction is
      outstanding and requires a separately authorized documentation-only
      stage.
- [ ] Review/correct the named-role privilege probe's omission of `TRUNCATE`;
      this correction is also outstanding and separately authorized.
- [ ] Confirm that a missing role or invisible catalog object cannot be
      interpreted as proof the role/object is absent or lacks privileges.
- [ ] Review each query's purpose, expected output, required catalog visibility,
      execution role, and cost individually.
- [ ] Obtain explicit authorization for the exact queries, target, and any
      aggregate scope. No optional aggregate query runs by default.

## Reporting and data minimization

- [ ] Report schema and policy metadata without credentials, connection
      details, or unnecessary personal data.
- [ ] Do not select customer/user/event rows. If aggregate ownership counts are
      separately approved, return only the approved counts and do not infer
      ownership.
- [ ] Record the role and visibility limitations alongside any absent catalog
      result.
- [ ] Stop if query cost, read-only behavior, or result sensitivity is unclear.

## Strict evidence boundary

An approved read-only schema inspection may establish visible structural facts
(columns, constraints, indexes), migration metadata, and visible policy/grant
evidence within the inspection role's visibility. It cannot by itself establish
that legacy customer or event ownership is historically trustworthy, that a
client-supplied identifier is authorized, or that production application
queries enforce tenant scope. Those require authoritative provenance and
separate application/security review.

This checklist grants no database access, SQL execution, migration, production
change, or deployment permission.
