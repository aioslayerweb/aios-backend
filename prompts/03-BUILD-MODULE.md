# AIOS Module Builder

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Understand the AIOS architecture before changing code.
4. Never begin implementation until analysis is complete.

---

# Objective

Build a complete AIOS module.

A module is a major capability of AIOS that integrates deeply into the platform.

It is NOT a standalone application.

It must become a natural part of AIOS.

The module should feel like it has always existed.

---

# Phase 1 — Business Understanding

Before coding explain:

Module purpose

Business value

Problems solved

Primary users

Secondary users

Business outcomes

How it supports AIOS vision

Success metrics

---

# Phase 2 — Existing Platform Analysis

Analyze:

Navigation

Current modules

Backend services

Shared components

Shared layouts

Existing APIs

Database

Authentication

Permissions

Reusable utilities

Reusable hooks

Reusable charts

Reusable cards

Existing AI services

Explain what should be reused.

Never duplicate functionality.

---

# Phase 3 — Module Architecture

Design:

Pages

Subpages

Navigation

Component hierarchy

Backend services

Database structure

APIs

Permissions

AI integrations

Realtime functionality

Memory integration

Reporting

Notifications

Explain why this architecture is the best solution.

---

# Phase 4 — User Journey

Describe the complete experience.

Example:

User enters module

↓

Executive overview

↓

Review insights

↓

Open details

↓

Receive AI recommendations

↓

Approve AI actions

↓

Track outcomes

Every interaction should reduce manual work.

---

# Phase 5 — Functional Requirements

Describe all capabilities.

Examples:

Dashboard

Search

Filters

Sorting

Reports

Export

Notifications

Timeline

Activity Feed

AI Summary

Recommendations

Approvals

Settings

History

Permissions

Realtime updates

Every capability should support business decisions.

---

# Phase 6 — AI Integration

Identify:

AI Agents involved

Signals consumed

Memory usage

Reasoning

Predictions

Recommendations

Confidence scores

Next Best Actions

Automation opportunities

Every recommendation should explain:

Why

Business impact

Confidence

Suggested action

---

# Phase 7 — Components

Reuse existing components whenever possible.

Create new reusable components only when necessary.

Examples:

Module Header

Executive Summary

Insight Card

Recommendation Card

Timeline

Metric Card

Chart Container

Filter Panel

Action Panel

Details Drawer

Everything should become reusable.

---

# Phase 8 — Backend

Design:

Services

Routes

Database

Background jobs

WebSockets

Realtime events

Caching

Validation

Permissions

Logging

Error handling

No business logic inside routes.

---

# Phase 9 — Performance

Optimize:

Database queries

API calls

Rendering

Charts

Large tables

Realtime updates

Memory usage

Loading times

Support enterprise-scale datasets.

---

# Phase 10 — Security

Authentication

Authorization

Role-based permissions

Validation

Audit logging

Secure APIs

Protect sensitive information

Never expose secrets.

---

# Phase 11 — Implementation Plan

Before coding provide:

Architecture diagram (text)

Pages

Components

Services

Routes

Database changes

Files to create

Files to modify

Estimated complexity

Potential risks

Wait for approval.

---

# Phase 12 — Build

Implement gradually.

Recommended order:

Navigation

Layout

Components

Backend

Database

AI

Animations

Testing

Documentation

---

# Phase 13 — Validation

Confirm:

✓ Matches AIOS Design System

✓ Matches Product Vision

✓ Uses Business Glossary

✓ Uses reusable components

✓ Responsive

✓ Production ready

✓ No duplicate logic

✓ No console errors

✓ No lint errors

✓ Tested

---

# Phase 14 — Delivery

Provide:

Executive summary

Architecture summary

Files changed

New components

Backend services

Database changes

APIs created

AI integrations

Reusable assets

Future improvements

Technical debt (if any)

Lessons learned

---

# AIOS Module Philosophy

Every module should feel like an intelligent department inside the AI Operating System.

Modules should communicate with each other.

They should share memory.

They should share business intelligence.

They should share AI agents.

The user should experience AIOS as one intelligent platform—not a collection of separate products.

Every module should make the platform smarter.