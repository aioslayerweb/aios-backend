# AIOS Production Release Checklist

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Review the entire implementation before approving deployment.

---

# Objective

Determine whether the implementation is production-ready.

Review the entire system.

Do not focus only on code.

Review architecture, UI, UX, backend, AI, database, security, performance and business logic.

Deployment should only be approved if enterprise quality standards are met.

---

# Phase 1 — Feature Completion

Verify:

✓ Requested functionality complete

✓ Acceptance criteria met

✓ Business goals achieved

✓ Product Vision maintained

✓ Business Glossary followed

Explain any incomplete work.

---

# Phase 2 — Frontend Review

Verify:

Responsive layouts

Navigation

Typography

Spacing

Glassmorphism

Animations

Loading states

Error states

Empty states

Accessibility

Dark/Light mode compatibility (if applicable)

Professional appearance

No broken layouts

No visual inconsistencies

---

# Phase 3 — Backend Review

Verify:

Routes

Services

Validation

Authentication

Authorization

Logging

Error handling

Business logic

Performance

Scalability

No duplicated services

---

# Phase 4 — Database Review

Verify:

Schema

Relationships

Indexes

RLS Policies

Migrations

Constraints

Data integrity

Performance

Scalability

Rollback strategy

---

# Phase 5 — API Review

Verify:

Naming consistency

Validation

Authentication

Authorization

Response models

Status codes

Performance

Documentation

No breaking changes

---

# Phase 6 — AI Review

Verify:

AI reasoning

Recommendations

Confidence scores

Explainability

Memory integration

Signal detection

Agent collaboration

Business value

No hallucinated outputs

Every recommendation explains WHY.

---

# Phase 7 — Performance Review

Verify:

Frontend performance

Backend performance

Database queries

Caching

Realtime

Bundle size

Memory usage

CPU usage

Network requests

Loading speed

Large datasets

Enterprise scalability

---

# Phase 8 — Security Review

Verify:

Authentication

Authorization

Permissions

Secrets

Environment variables

Validation

OWASP best practices

RLS Policies

Sensitive data protection

Audit logging

GDPR considerations

---

# Phase 9 — Accessibility Review

Verify:

Keyboard navigation

Focus states

ARIA labels

Screen readers

Contrast

Responsive touch interactions

Accessibility should satisfy WCAG standards where practical.

---

# Phase 10 — Code Quality

Verify:

Reusable components

Reusable services

No duplicate code

Small components

Readable code

Consistent naming

Documentation

No dead code

No unnecessary dependencies

Maintainable architecture

---

# Phase 11 — Testing

Verify:

Unit tests

Integration tests

API tests

UI tests

Manual testing

Edge cases

Permissions

Error handling

Realtime

AI workflows

Document test coverage.

---

# Phase 12 — Documentation

Verify:

README

Architecture

API documentation

Database documentation

AI documentation

Developer documentation

Prompt library

Knowledge Base

Everything should be current.

---

# Phase 13 — Business Review

Confirm:

Supports Product Vision

Supports Executive Decision Making

Supports AIOS Business Glossary

Supports AI Agents

Supports Autonomous Business Vision

Improves business intelligence

Provides measurable value

---

# Phase 14 — Risk Assessment

Identify:

Critical Risks

High Risks

Medium Risks

Low Risks

Technical Debt

Known Issues

Missing Features

Deployment Risks

Operational Risks

Provide mitigation recommendations.

---

# Phase 15 — Production Readiness Score

Rate each category from 1–10.

Architecture

Frontend

Backend

Database

API

AI

Performance

Security

Accessibility

Documentation

Maintainability

Scalability

Developer Experience

Business Value

Overall Production Readiness

Explain every score.

---

# Phase 16 — Release Recommendation

Choose ONE.

✅ Ready for Production

⚠ Ready with Minor Issues

⚠ Ready for Staging Only

❌ Not Ready

Explain your reasoning.

---

# Phase 17 — Final Executive Summary

Provide:

Executive Summary

Major Strengths

Major Risks

Critical Fixes Required

Future Improvements

Estimated Technical Debt

Estimated Release Confidence

Estimated Customer Impact

Deployment Recommendation

---

# AIOS Release Philosophy

AIOS is an enterprise AI Operating System.

Every release should increase:

Trust

Reliability

Scalability

Maintainability

Security

Business Intelligence

User Experience

Never approve a release simply because it works.

Approve it because it is ready for enterprise customers.