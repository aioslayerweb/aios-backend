# AIOS Architectural Refactoring

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Never refactor code without understanding its purpose.

---

# Objective

Improve the architecture without changing business functionality.

The goal is cleaner, more maintainable, more scalable code.

The user should notice no functional differences.

Only the code quality should improve.

---

# Phase 1 — Understand

Before changing anything explain:

Current architecture

Business purpose

Dependencies

Related modules

Potential risks

Never refactor blindly.

---

# Phase 2 — Architecture Review

Analyze:

Folder structure

Component hierarchy

Backend services

API organization

Database

State management

Routing

Hooks

Utilities

Shared components

Shared services

Context providers

AI services

Memory usage

Signal processing

Explain strengths and weaknesses.

---

# Phase 3 — Code Quality Review

Identify:

Duplicate code

Large components

Large functions

Mixed responsibilities

Dead code

Unused imports

Unused dependencies

Repeated API calls

Repeated queries

Magic numbers

Hardcoded values

Deep nesting

Complex conditionals

Poor naming

Inconsistent styling

Explain why each issue matters.

---

# Phase 4 — Improvement Opportunities

Recommend:

Reusable components

Reusable services

Shared utilities

Hooks

Contexts

Configuration files

Type improvements

Folder improvements

Performance improvements

Scalability improvements

Maintainability improvements

Prioritize recommendations.

---

# Phase 5 — Refactoring Plan

Before writing code provide:

Files to modify

Files to move

Files to split

Files to remove

Reason for every change

Expected benefits

Potential risks

Wait for approval.

---

# Phase 6 — Refactoring

Refactor gradually.

Never rewrite entire modules unless requested.

Keep commits focused.

Preserve business behaviour.

Reuse existing architecture.

---

# Phase 7 — Performance

Improve where appropriate:

Rendering

Database queries

API calls

Caching

Memory usage

Bundle size

Lazy loading

Reusable logic

Avoid premature optimization.

---

# Phase 8 — Validation

Confirm:

✓ Business functionality unchanged

✓ No regressions

✓ No duplicated code

✓ Smaller components

✓ Cleaner architecture

✓ Production ready

✓ No TypeScript errors

✓ No lint errors

✓ No console errors

---

# Phase 9 — Documentation

Explain:

Architecture improvements

Components simplified

Services improved

Utilities extracted

Technical debt removed

Future opportunities

---

# AIOS Refactoring Philosophy

Refactoring should make AIOS easier to extend tomorrow.

Every refactoring should:

Reduce complexity.

Increase consistency.

Increase reuse.

Improve readability.

Strengthen the architecture.

Never refactor for personal preference.

Always refactor for measurable improvements.