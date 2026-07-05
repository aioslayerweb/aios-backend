# AIOS Database Architecture & Schema Changes

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Analyze the existing database schema before making changes.
4. Never modify the database without understanding existing relationships.

---

# Objective

Design and implement database changes that strengthen AIOS.

Every schema change must be:

Safe

Scalable

Normalized

Maintainable

Backward compatible whenever possible

Production ready

Never redesign the database without a compelling architectural reason.

---

# Phase 1 — Understand

Before making changes explain:

Business purpose

Business problem

Feature requiring database changes

Expected data flow

Expected growth

Expected usage

---

# Phase 2 — Existing Database Analysis

Analyze:

Current schema

Existing tables

Relationships

Indexes

Foreign keys

Views

Policies

Triggers

Functions

Realtime subscriptions

Supabase Auth

Storage

Existing migrations

Never duplicate existing tables.

Never duplicate existing data.

---

# Phase 3 — Design

Explain:

New tables

New columns

Modified columns

Relationships

Indexes

Constraints

Foreign keys

Cascade rules

Nullable fields

Defaults

Enums

JSON fields

Generated fields

Explain why each design decision is appropriate.

---

# Phase 4 — Data Integrity

Protect:

Relationships

Existing records

Historical data

Audit trails

Foreign keys

Transactions

Never risk data corruption.

Never remove production data without explicit approval.

---

# Phase 5 — Performance

Optimize:

Indexes

Search

Filtering

Sorting

Joins

Large datasets

Aggregation

Pagination

Realtime performance

Avoid unnecessary joins.

Avoid unnecessary JSON fields.

---

# Phase 6 — Security

Review:

Row Level Security

Supabase Policies

Authentication

Authorization

Sensitive fields

Encrypted data

Audit logs

PII

GDPR considerations

Never expose confidential data.

---

# Phase 7 — Migration Plan

Before creating migrations explain:

Migration order

Rollback strategy

Potential risks

Downtime

Compatibility

Breaking changes

Wait for approval.

---

# Phase 8 — SQL Quality

Generate:

Readable SQL

Safe migrations

Comments where appropriate

Idempotent migrations where possible

Consistent naming

Avoid unnecessary complexity.

---

# Phase 9 — Testing

Verify:

Migration succeeds

Rollback succeeds

Relationships work

Indexes used

Performance acceptable

No data loss

Realtime unaffected

RLS works

Permissions correct

---

# Phase 10 — Documentation

Document:

Schema

Relationships

Purpose

Business meaning

Indexes

Policies

Migration notes

Developer notes

---

# Phase 11 — Delivery

Provide:

Executive summary

Schema changes

Migration files

Indexes created

Relationships created

Performance improvements

Security improvements

Future recommendations

---

# AIOS Database Philosophy

The database is the foundation of AIOS.

Every table should represent a clear business concept.

Every relationship should have a business purpose.

Prefer normalized data unless denormalization provides measurable performance benefits.

Optimize for long-term maintainability rather than short-term convenience.

The database should evolve carefully as AIOS grows into an enterprise-scale AI Operating System.