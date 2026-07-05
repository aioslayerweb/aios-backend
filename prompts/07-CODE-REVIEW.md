# AIOS Enterprise Code Review

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Review the implementation before suggesting changes.
4. Do not modify code until the review is complete.

---

# Objective

Perform a professional enterprise code review.

Review the implementation as if it is about to be deployed to production.

Do not focus only on syntax.

Review architecture, scalability, maintainability, security, UX, AI integration and long-term quality.

---

# Phase 1 — Architecture Review

Review:

Overall architecture

Folder structure

Component hierarchy

Backend services

Routing

Database organization

API design

State management

Memory usage

AI architecture

Identify architectural weaknesses.

---

# Phase 2 — Code Quality

Review:

Naming

Readability

Maintainability

Component size

Function size

Duplication

Unused code

Complexity

Error handling

Configuration

Types

Documentation

Rate overall quality.

---

# Phase 3 — UI Review

Verify:

Design System compliance

Spacing

Typography

Colors

Glassmorphism

Animations

Consistency

Responsive behavior

Accessibility

Loading states

Error states

Empty states

Professional appearance

The interface should feel like a premium enterprise product.

---

# Phase 4 — Component Review

Check:

Reusable components

Duplicate components

Component responsibilities

Props

Hooks

Contexts

Utilities

Shared layouts

Recommend improvements.

---

# Phase 5 — Backend Review

Review:

FastAPI routes

Services

Business logic

Validation

Authentication

Authorization

Logging

Error handling

Performance

Scalability

No business logic should exist inside routes.

---

# Phase 6 — Database Review

Review:

Schema

Relationships

Indexes

Queries

Normalization

Performance

Security

Migration quality

Scalability

---

# Phase 7 — API Review

Review:

Endpoint naming

Consistency

Validation

Response models

Status codes

Documentation

Security

Performance

Caching

---

# Phase 8 — AI Review

Review:

AI reasoning

Confidence scores

Recommendations

Explainability

Memory integration

Signal processing

Agent collaboration

Business value

Every AI recommendation should explain WHY.

---

# Phase 9 — Performance Review

Review:

Rendering

API calls

Queries

Caching

Bundle size

Lazy loading

Realtime updates

Large datasets

Scalability

Identify bottlenecks.

---

# Phase 10 — Security Review

Verify:

Authentication

Authorization

Permissions

Validation

Secrets

Environment variables

Sensitive information

Audit logging

OWASP best practices

Rate security.

---

# Phase 11 — Accessibility Review

Verify:

Keyboard navigation

ARIA

Screen readers

Focus states

Color contrast

Responsive layouts

Touch interactions

Accessibility should not be optional.

---

# Phase 12 — Documentation Review

Verify:

Code comments

Architecture

README

API documentation

Developer experience

Prompt consistency

Missing documentation

---

# Phase 13 — Technical Debt

Identify:

Quick fixes

Temporary code

Architecture compromises

Duplicate logic

Future maintenance risks

Estimate severity.

---

# Phase 14 — Scoring

Provide scores from 1–10.

Architecture

Frontend

Backend

Database

API

Security

Performance

Accessibility

AI Integration

Maintainability

Scalability

Developer Experience

Overall Quality

Explain every score.

---

# Phase 15 — Recommendations

Separate findings into:

Critical Issues

High Priority

Medium Priority

Low Priority

Nice to Have

Future Enhancements

Rank recommendations by business value.

---

# Phase 16 — Final Report

Provide:

Executive Summary

Strengths

Weaknesses

Risks

Immediate Improvements

Long-Term Improvements

Deployment Readiness

Would you approve this code for production?

Explain why.

---

# AIOS Code Review Philosophy

Review the implementation as if AIOS will be used by thousands of enterprise customers.

Every recommendation should improve:

Reliability

Scalability

Consistency

Security

Maintainability

Developer experience

Business value

Never recommend changes based only on personal preference.

Recommend improvements that objectively strengthen the platform.