# AIOS Performance Optimization

Before performing any work:

1. Read prompts/00-START-HERE.md
2. Follow every instruction.
3. Never optimize code before identifying actual bottlenecks.
4. Measure first. Optimize second.

---

# Objective

Improve the performance of AIOS while preserving existing functionality.

Performance improvements must be measurable.

Never sacrifice readability or maintainability for insignificant performance gains.

Optimize only where meaningful improvements exist.

---

# Phase 1 — Performance Analysis

Before changing code explain:

Current performance

Observed bottlenecks

Affected users

Affected modules

Business impact

Expected improvements

Never optimize based on assumptions.

---

# Phase 2 — Frontend Review

Analyze:

Rendering

Re-renders

Large components

Charts

Animations

Images

React hooks

State updates

Routing

Lazy loading

Bundle size

Network requests

Reusable components

Loading indicators

Explain bottlenecks.

---

# Phase 3 — Backend Review

Review:

FastAPI routes

Services

Business logic

Background jobs

WebSockets

Signal processing

Memory processing

Logging

Caching

Concurrency

Async execution

Identify slow operations.

---

# Phase 4 — Database Review

Analyze:

Indexes

Queries

Joins

Sorting

Filtering

Pagination

Aggregations

Views

Functions

RLS policies

Connection usage

Large datasets

Recommend improvements.

---

# Phase 5 — API Performance

Review:

Request size

Response size

Latency

Validation

Serialization

Caching

Compression

Authentication

Error handling

Batch operations

Optimize API efficiency.

---

# Phase 6 — AI Performance

Review:

Reasoning speed

Memory lookups

Signal detection

Recommendations

Predictions

Prompt efficiency

Agent collaboration

Execution time

Avoid unnecessary AI processing.

---

# Phase 7 — Frontend Improvements

Possible optimizations:

Memoization

Component splitting

Virtualization

Lazy loading

Image optimization

Code splitting

Reusable hooks

Shared state

Loading skeletons

Progressive rendering

Only implement improvements with measurable value.

---

# Phase 8 — Backend Improvements

Possible optimizations:

Caching

Connection pooling

Async processing

Queue processing

Reusable services

Reduced API calls

Reduced database queries

Background processing

Avoid premature optimization.

---

# Phase 9 — Database Improvements

Possible improvements:

Indexes

Materialized views

Optimized joins

Query simplification

Partitioning

Caching

Search optimization

Archiving

Always preserve data integrity.

---

# Phase 10 — Validation

Confirm:

✓ Faster rendering

✓ Faster API responses

✓ Faster queries

✓ Reduced memory usage

✓ Reduced CPU usage

✓ No regressions

✓ No functionality changes

✓ Production ready

---

# Phase 11 — Metrics

Provide measurable improvements.

Examples:

Page Load

API Response

Database Query

Bundle Size

Memory Usage

CPU Usage

Render Time

Realtime Latency

Estimate improvements where exact benchmarks are unavailable.

---

# Phase 12 — Delivery

Provide:

Performance summary

Files modified

Optimizations completed

Expected improvements

Potential future optimizations

Technical debt identified

Long-term recommendations

---

# AIOS Performance Philosophy

Performance should be invisible.

Users should never wait unnecessarily.

Executives should receive insights instantly.

AI recommendations should feel immediate.

Optimize for enterprise-scale businesses with large datasets, many concurrent users and continuous AI processing.

Never optimize only for benchmark numbers.

Optimize for real business productivity.