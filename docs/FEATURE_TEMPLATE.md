# AIOS Feature Specification Template

> This template must be completed before implementing any new feature in AIOS.

---

# STEP 1 — Read Documentation

Before beginning implementation, read the following documents in order:

1. AI_CONTEXT.md
2. 01-product-vision.md
3. 02-design-system.md
4. 03-ui-rules.md
5. 04-architecture.md
6. 05-coding-standards.md
7. 06-component-library.md
8. 07-ai-agents.md
9. 08-api-conventions.md
10. 09-database-guidelines.md
11. 10-development-workflow.md
12. 11-roadmap.md
13. 12-business-glossary.md

Do not skip this step.

---

# STEP 2 — Understand Existing Code

Before writing any code:

Analyze the existing implementation.

Understand:

• Project structure

• Existing components

• Existing pages

• Routing

• API services

• Backend services

• Database models

• State management

• Existing UI patterns

Identify reusable code before creating new code.

Never duplicate functionality.

---

# STEP 3 — Feature Name

Feature:

_________________________________

Module:

_________________________________

Priority:

Critical / High / Medium / Low

---

# STEP 4 — Business Purpose

Describe WHY this feature exists.

Questions:

What business problem does it solve?

Why does the user need it?

How does it improve AIOS?

How does it support autonomous business operations?

---

# STEP 5 — User Goal

After using this feature, the user should be able to:

•

•

•

•

---

# STEP 6 — Success Criteria

The feature is complete when:

□ UI completed

□ Responsive

□ Connected to backend

□ Uses reusable components

□ Uses AIOS design system

□ Accessible

□ Production ready

□ Fully tested

□ No console errors

□ No duplicated code

---

# STEP 7 — UI Requirements

Describe:

Layout

Navigation

Cards

Tables

Charts

Filters

Buttons

Search

Animations

Responsive behavior

Glassmorphism usage

Spacing

Typography

Icons

Loading states

Empty states

Error states

Hover effects

Transitions

---

# STEP 8 — Functional Requirements

List every capability.

Example:

View opportunities

Search

Filter

Sort

Export

Generate AI summary

View history

Open details

Approve AI recommendations

Reject AI recommendations

Etc.

---

# STEP 9 — AI Requirements

How should AI help?

Examples:

Generate summaries

Detect risks

Predict outcomes

Recommend actions

Prioritize work

Explain reasoning

Provide confidence score

Suggest automation

Every AI output should explain WHY.

---

# STEP 10 — Data Requirements

Data sources.

API endpoints.

Supabase tables.

Required models.

Caching.

Realtime updates.

Permissions.

Relationships.

---

# STEP 11 — Components

Reuse whenever possible.

Existing Components:

•

•

•

New Components Needed:

•

•

•

Each component should have a single responsibility.

---

# STEP 12 — Backend Changes

List:

Services

Routes

Database

Models

AI services

WebSockets

Jobs

Cron tasks

Background workers

---

# STEP 13 — AI Agents

Does this feature involve AI agents?

If yes:

Which agents?

Responsibilities

Inputs

Outputs

Memory usage

Interactions

Approvals required

---

# STEP 14 — Security

Authentication

Authorization

Validation

Error handling

Permissions

Audit logging

Sensitive information

---

# STEP 15 — Performance

Avoid unnecessary API calls.

Lazy loading where appropriate.

Pagination.

Caching.

Reusable queries.

Component optimization.

---

# STEP 16 — Mobile

Tablet layout

Mobile layout

Responsive behavior

Touch interactions

---

# STEP 17 — Accessibility

Keyboard navigation

Screen readers

Color contrast

Focus states

ARIA labels

---

# STEP 18 — Implementation Plan

Before coding, provide:

Architecture summary

Implementation strategy

Files to modify

Files to create

Potential risks

Estimated complexity

Wait for approval.

---

# STEP 19 — Implementation

Only after approval.

Implement in small logical steps.

Do not refactor unrelated code.

Keep commits focused.

---

# STEP 20 — Final Review

Before completion verify:

✓ Matches AIOS Design System

✓ Matches AIOS Architecture

✓ Uses Business Glossary terminology

✓ Responsive

✓ No duplicated components

✓ Reusable

✓ Clean code

✓ Production ready

✓ Scalable

✓ Tested

---

# STEP 21 — Delivery Summary

After implementation provide:

## What was built

Describe the completed feature.

---

## Files Changed

List every modified file.

---

## New Components

List every new reusable component.

---

## Backend Changes

Summarize backend modifications.

---

## Future Improvements

Recommend future enhancements.

---

## Technical Debt

List anything intentionally postponed.

---

## Final Verification

Confirm:

✓ Documentation followed

✓ Coding standards followed

✓ UI rules followed

✓ Product principles followed

✓ Business glossary followed

✓ AI_CONTEXT followed

If any item cannot be confirmed, explain why.

---

# AIOS Golden Rule

Never build software that merely displays information.

Every feature should help the user:

Understand.

Prioritize.

Decide.

Act.

Improve.

Every screen should feel like part of one intelligent operating system—not a collection of disconnected dashboards.

If a feature does not move AIOS closer to becoming the world's leading AI Operating System for businesses, rethink the implementation before writing code.