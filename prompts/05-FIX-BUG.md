# AIOS Bug Investigation & Resolution

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Never attempt a fix before identifying the root cause.

---

# Objective

Investigate and permanently resolve a bug without introducing regressions.

Never guess.

Never apply random fixes.

Never rewrite working code unnecessarily.

The goal is to identify the root cause before making any code changes.

---

# Phase 1 — Understand the Bug

Describe:

What is happening?

What should happen?

Where does the issue occur?

Can it be reproduced?

Is it intermittent?

What changed recently?

Summarize the issue before investigating.

---

# Phase 2 — Gather Evidence

Analyze:

Frontend

Backend

API requests

Responses

Logs

Console errors

Network requests

Database

Authentication

Permissions

WebSockets

AI services

Signal processing

Memory

Collect evidence before suggesting fixes.

---

# Phase 3 — Root Cause Analysis

Identify:

Where the bug originates.

Why it occurs.

Which components are affected.

Whether it impacts other modules.

Whether it impacts performance.

Whether it impacts security.

Never begin fixing until the root cause has been identified.

---

# Phase 4 — Impact Analysis

Explain:

Files involved

Components involved

Services involved

Database impact

API impact

User impact

Business impact

Potential regressions

---

# Phase 5 — Solution Options

If multiple fixes exist:

List them.

Explain:

Advantages

Disadvantages

Complexity

Long-term maintainability

Recommend the best solution.

---

# Phase 6 — Implementation Plan

Before modifying code provide:

Files to modify

Reason for each change

Expected outcome

Potential risks

Wait for approval before major refactoring.

---

# Phase 7 — Implementation

Keep changes as small as possible.

Only modify what is necessary.

Avoid unrelated refactoring.

Reuse existing architecture.

Maintain consistency.

---

# Phase 8 — Validation

Verify:

✓ Bug fixed

✓ No regressions

✓ No console errors

✓ No TypeScript errors

✓ No lint errors

✓ No broken UI

✓ No broken APIs

✓ Existing functionality preserved

---

# Phase 9 — Testing

Test:

Happy path

Edge cases

Error handling

Permissions

Realtime updates

Mobile responsiveness

Performance

Document all tests performed.

---

# Phase 10 — Delivery

Provide:

Root cause

Files modified

Changes made

Reasoning

Testing performed

Future prevention recommendations

---

# AIOS Bug Philosophy

Never patch symptoms.

Always solve the underlying cause.

The best bug fix is one that permanently improves the architecture while minimizing unnecessary changes.