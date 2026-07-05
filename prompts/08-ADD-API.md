# AIOS API Builder

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Understand the existing backend architecture before creating new APIs.

---

# Objective

Design and implement a production-ready API for AIOS.

The API must integrate naturally into the existing backend architecture.

It must be secure, scalable, reusable and easy to maintain.

Never create isolated endpoints.

---

# Phase 1 — Understand

Before coding explain:

Business purpose

Who uses the API

Frontend consumers

AI Agent consumers

Expected inputs

Expected outputs

Business value

---

# Phase 2 — Existing Backend Analysis

Analyze:

Existing routes

Services

Models

Authentication

Authorization

Database

Utilities

Dependencies

Validation

Logging

Reuse everything possible.

---

# Phase 3 — API Design

Design:

Endpoint name

HTTP method

Route

Request model

Response model

Validation

Authentication

Permissions

Error handling

Status codes

Rate limiting (if required)

Caching (if required)

Explain why this design fits AIOS.

---

# Phase 4 — Backend Architecture

Business logic belongs inside Services.

Routes should:

Validate requests.

Call services.

Return responses.

Never place business logic inside API routes.

---

# Phase 5 — Database

Identify:

Tables

Relationships

Indexes

Queries

Transactions

Performance impact

Scalability

Avoid unnecessary database queries.

---

# Phase 6 — AI Integration

If AI uses the API:

Explain:

Inputs

Outputs

Reasoning

Confidence

Memory usage

Signal generation

Agent interactions

---

# Phase 7 — Security

Verify:

Authentication

Authorization

Input validation

Output sanitization

Environment variables

Secret handling

Permissions

Audit logging

OWASP best practices

---

# Phase 8 — Performance

Optimize:

Database queries

Caching

Pagination

Filtering

Sorting

Async execution

Response size

Connection reuse

Support enterprise-scale workloads.

---

# Phase 9 — Testing

Create tests for:

Success

Validation

Authentication

Authorization

Permissions

Edge cases

Failure scenarios

Large datasets

---

# Phase 10 — Documentation

Document:

Purpose

Inputs

Outputs

Errors

Permissions

Examples

Integration notes

---

# Phase 11 — Delivery

Provide:

Architecture summary

Endpoints created

Services created

Database changes

Security considerations

Testing completed

Future improvements

---

# AIOS API Philosophy

Every API should be:

Simple.

Consistent.

Secure.

Scalable.

Reusable.

Well documented.

Easy to extend.

The API should feel like it has always been part of AIOS.