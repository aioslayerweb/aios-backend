# AIOS Navigation System Blueprint v1

Status: Official Navigation Architecture Contract
Owner: Chief UX Architect, Product Architect, Enterprise Navigation Designer
Scope: Complete navigation architecture across all AIOS surfaces
Applies To: Product, UX, Frontend, AI assistant flows, future modules and integrations

---

## 0. Contract Statement

This document defines the complete navigation system for AIOS.

It is the authoritative navigation contract for the platform and must be followed by all current and future frontend implementations.

AIOS navigation must feel like moving through a business operating system, not browsing disconnected pages.

This blueprint is aligned with:

- Constitution
- Architecture
- Business Ontology
- Chief Architect
- Developer Bible
- Hard Rules v2
- Frontend Blueprint v1
- Brand Guidelines v1
- Design System v2
- UX Guidelines v1
- Component Library v2
- Workspace Shell Blueprint v1

Non-negotiables:

- No module may ship independent navigation logic outside this system.
- Navigation must remain keyboard-first and context-aware.
- Navigation must prioritize user orientation and decision velocity.

---

## 1. Navigation Philosophy

### 1.1 Core Principle

Navigation is the operating model of AIOS, not just routing.

Users should always know:

- Where they are
- Why they are there
- What actions are available
- What AI is currently doing
- What the best next step is

### 1.2 Navigation Values

1. Minimal cognitive load
2. Predictable behavior
3. Context preservation
4. Intent-first interaction
5. Keyboard-first speed
6. Progressive disclosure
7. Calm visual hierarchy
8. Enterprise reliability

### 1.3 Experience Goals

Navigation must feel:

- Effortless
- Professional
- Elegant
- Fast
- Stable

### 1.4 Rationale

Enterprise users lose time when navigation forces re-orientation. AIOS navigation removes orientation overhead by maintaining persistent context, global tools, and deterministic pathways.

---

## 2. Primary Navigation

Primary navigation is the persistent left workspace rail.

### 2.1 Sidebar Structure

Default order:

1. Home
2. Executive
3. Corporate
4. Sales
5. Marketing
6. Support
7. Finance
8. Knowledge
9. Memory
10. Agents
11. Insights
12. Reports
13. Settings

### 2.2 Item Anatomy

Each item includes:

- Workspace icon
- Workspace label
- Optional status badge
- Hover affordance
- Active indicator
- Shortcut hint in tooltip or command metadata

### 2.3 Collapse Behavior

Modes:

- Expanded: icon + label
- Compact: icon-only with labels on hover/focus
- Hidden: drawer mode on constrained viewports

Rules:

- Collapsing sidebar must not reset workspace state.
- Active workspace remains visually obvious in all modes.

Rationale:

- Supports both spatial consistency and focus-intensive workflows.

### 2.4 Pinning

Users may pin:

- Frequently used workspaces
- High-priority workspace sections

Rules:

- Pinned workspaces appear at top of workspace list under system anchors.
- Pinning is user-specific and persistent.

### 2.5 Recently Visited

A recent list appears in sidebar utility region or quick switcher.

Rules:

- Includes last visited workspace and key entities.
- Ordered by recency with optional frequency weighting.

### 2.6 Favorite Workspaces

Users can favorite workspaces for one-click access.

Rules:

- Favorites are distinct from recents.
- Favorites stay stable unless manually edited.

### 2.7 Workspace Groups

Workspaces may be grouped by domain:

- Executive
- Revenue
- Operations
- Intelligence
- Platform

Rules:

- Groups are collapsible.
- Group headers are non-clickable labels unless configured as overview routes.

Rationale:

- Grouping reduces scanning burden in growing module ecosystems.

---

## 3. Secondary Navigation

Secondary navigation handles within-workspace movement.

### 3.1 Context Navigation

Context navigation appears under workspace header.

Includes:

- Local section tabs
- Sub-page switchers
- Entity mode selectors

Rules:

- Secondary nav must reflect workspace intent.
- Only relevant controls appear for current context.

### 3.2 Tabs and Sub-Pages

Rules:

- Tabs represent sibling views of same object scope.
- Deep sections use local menu or side rail, not tab overload.

Rationale:

- Preserves conceptual model of peer vs child navigation.

### 3.3 Workspace Menus

Workspace menus provide scoped actions and jumps:

- Open key entities
- Create scoped object
- Open settings for workspace

Rules:

- Menu content must be role-aware.
- Menu items prioritize high-frequency actions.

### 3.4 Sticky Navigation

Sticky secondary nav is allowed when:

- Page exceeds one viewport
- Context loss risk is high

Rules:

- Sticky regions must be compact and non-obstructive.

---

## 4. Global Search

Global search is a universal retrieval layer.

### 4.1 Search Scope

Global search must index and retrieve:

- Customers
- Companies
- Documents
- Knowledge
- Reports
- Emails
- Tasks
- Memory
- Agents
- Commands
- Projects
- Settings
- Additional platform entities as they are introduced

### 4.2 Search Behavior

Rules:

- Search is reachable from every authenticated screen.
- Query latency should feel instantaneous through progressive rendering and ranking.
- Partial, fuzzy, and exact matches are supported.

### 4.3 Result Composition

Each result contains:

- Entity type
- Display name
- Context path
- Relevance reason
- Quick action affordances

### 4.4 Ranking Logic

Ranking hierarchy:

1. Current context relevance
2. User history and recency
3. Organizational importance
4. Lexical match quality

Rationale:

- Users expect search to understand intent, not only text matching.

### 4.5 Search States

Required states:

- Idle suggestions
- Searching
- Results
- No results
- Error/fallback

### 4.6 Search Persistence

- Last queries and recent opens should be available per user.
- Sensitive search history follows policy and permissions.

---

## 5. Command Palette

Command palette is the fastest universal action layer.

### 5.1 Invocation

Primary shortcut:

- Command/Ctrl + K

Secondary triggers:

- Top bar action
- Quick action menu

### 5.2 Interaction Model

- Keyboard-first
- Zero-pointer required completion path
- Single input for navigation and action

### 5.3 Appearance

- Centered overlay
- Clear search field
- Categorized result sections
- Shortcut hints and command metadata

### 5.4 Command Categories

- Navigation
- Object open
- Object creation
- AI commands
- Workflow commands
- Settings and preferences
- Administrative actions (permission-gated)

### 5.5 Ranking

Ordered by:

1. Intent confidence
2. Contextual relevance
3. Recent command frequency
4. Pinned commands

### 5.6 Recent Commands

- Last executed commands listed when query empty.
- Supports fast repeat workflows.

### 5.7 Pinned Commands

- User can pin commands for quick access.
- Pinned commands appear in priority segment.

### 5.8 AI Commands

AI-assisted commands supported:

- Summarize current context
- Open AI reasoning for current object
- Show priorities
- Continue recent workflow

### 5.9 Natural Language Commands

Examples supported:

- Open Acme
- Show today priorities
- Create customer
- Summarize meeting

Rules:

- Natural language interpretation must provide disambiguation when needed.
- High-impact actions require confirmation path.

### 5.10 Keyboard Behavior

- Arrow keys navigate results
- Enter executes
- Tab expands result metadata where supported
- Esc closes and returns focus

Rationale:

- Enables expert-level velocity and reduced context switching.

---

## 6. Breadcrumb System

Breadcrumbs provide hierarchical orientation and jump-back.

### 6.1 Hierarchy Model

Path model:

Workspace > Sub-workspace > Entity > Detail

### 6.2 Behavior Rules

- Breadcrumbs appear for depth level 2 and deeper.
- Labels are business-semantic, never technical route ids.
- Intermediate crumbs are clickable jump points.

### 6.3 History and Back Navigation

- Back action preserves local state where possible.
- Breadcrumb jumps perform deterministic route + context restoration.

### 6.4 Cross-Workspace Context

When crossing workspace boundaries:

- Breadcrumb should reset to new workspace hierarchy root.
- Prior workspace context remains in recents/history.

Rationale:

- Users need both structural and chronological recovery paths.

---

## 7. Notifications Navigation

Notifications are a navigation input to high-priority work.

### 7.1 Priority Levels

- Critical
- High
- Normal
- Informational

### 7.2 Grouping

Group by:

- Source module
- Shared entity
- Shared workflow
- Time window

### 7.3 Notification Types

- AI notifications
- Business notifications
- Realtime runtime events

### 7.4 Dismiss Rules

- Informational: auto-dismiss allowed
- High/Critical: require explicit acknowledgment
- Group dismiss available where safe

### 7.5 Notification Center

The notification center must support:

- Priority filtering
- Source filtering
- Read/unread state
- Open in context
- Bulk acknowledgment actions

Rationale:

- Notification systems must triage attention, not generate noise.

---

## 8. Quick Actions

Quick actions provide high-frequency shortcuts without leaving context.

### 8.1 Floating Action Menu

Rules:

- Available where creation/action velocity is core.
- Contains only context-relevant top actions.

### 8.2 Contextual Actions

Actions adapt to current selection and workspace state.

Examples:

- Create report from current filter
- Open customer timeline
- Trigger AI summary for selected entity

### 8.3 AI Suggestions in Actions

AI may elevate quick actions based on context:

- Recommended next step
- Suggested follow-up
- Escalation actions

Rules:

- AI-suggested actions must be visibly labeled.

### 8.4 Recent Actions

Users can quickly re-run recent non-destructive actions.

### 8.5 Pinned Actions

Users may pin repetitive actions at workspace level.

Rationale:

- Decreases repeated navigation for operational tasks.

---

## 9. Context Awareness

Navigation must adapt to live context.

### 9.1 Context Dimensions

Navigation adapts based on:

- Current workspace
- Current customer
- Current company
- Current report
- Current AI agent
- Current project
- Current workflow

### 9.2 Adaptive Behavior Rules

- Secondary nav reflects current object type.
- Command suggestions prioritize context-compatible actions.
- Search result boosts current-context entities.
- Quick actions update as context changes.

### 9.3 Context Preservation

When moving between screens:

- Preserve filters, sort, date range when semantically compatible.
- On incompatibility, show explicit reset notice.

Rationale:

- Context continuity is central to OS-level navigation trust.

---

## 10. Keyboard Navigation

AIOS navigation must be fully keyboard-operable.

### 10.1 Core Keyboard Capabilities

Must support:

- Global navigation
- Workspace switching
- Search invocation and navigation
- Command palette operation
- Notification center access
- Quick action execution

### 10.2 Focus Management Rules

- Logical tab order across shell and content
- Visible focus indicators on all interactive elements
- Focus return to source after overlays close

### 10.3 Shortcut System

Shortcut classes:

- Global shortcuts
- Workspace shortcuts
- Contextual shortcuts

Guidelines:

- Avoid collisions
- Provide discoverability in command palette and help layer

### 10.4 Accessibility Alignment

- Keyboard behavior must align with ARIA navigation patterns.
- No keyboard traps.

Rationale:

- Keyboard-first design significantly improves speed for expert users and accessibility for all.

---

## 11. Mobile Navigation

Mobile navigation preserves operating-model continuity in compact form.

### 11.1 Core Regions

- Compact top bar
- Bottom navigation for primary modules
- Drawer for extended workspace list
- Context panels as bottom sheets

### 11.2 Behavior Rules

- Primary actions remain reachable with thumb-first ergonomics.
- Navigation labels stay explicit; avoid icon-only ambiguity for core areas.

### 11.3 Collapsible Panels

- Right AI panel becomes bottom sheet or floating assistant entry.
- Notification center as full-height sheet.

### 11.4 Touch Gestures

Allowed gestures:

- Swipe to open drawer
- Swipe to dismiss toasts
- Pull-to-refresh where contextually safe

Rules:

- Every gesture has visible control alternative.

### 11.5 Responsive Transition Logic

- Preserve navigation model, not just component layout.
- User should still recognize workspace hierarchy on mobile.

Rationale:

- Compact screens should reduce density, never reduce conceptual clarity.

---

## 12. AI Navigation

AI is a navigation partner, not just a content generator.

### 12.1 AI-Led Navigation Intents

AI should support intents like:

- Take me to John account
- Open yesterday meeting
- Show revenue report
- Continue my last workflow

### 12.2 Behavior Rules

- AI resolves intent to destination with context metadata.
- If ambiguity exists, AI provides disambiguation list.
- AI navigation actions should preview destination before executing high-risk transitions.

### 12.3 AI Navigation UX

- Show destination summary and context scope.
- Preserve previous location in navigation history.

### 12.4 Safety and Trust

- AI cannot bypass permission boundaries.
- AI-initiated navigation should be reversible and traceable.

Rationale:

- AI navigation reduces retrieval friction while maintaining user control.

---

## 13. Deep Linking

Deep links are mandatory for durable navigation and collaboration.

### 13.1 Required Stable URLs

Every object and screen must have a stable URL, including:

- Workspaces
- Customers
- Reports
- Workflows
- AI conversations
- Memory timelines
- Agent runs
- Settings scopes

### 13.2 Link Integrity Rules

- URLs must be deterministic and share-safe.
- Links should restore relevant context state when possible.
- Invalid or stale links must degrade gracefully with recovery guidance.

### 13.3 Context in URLs

Include where relevant:

- Entity id
- Workspace scope
- View mode
- Filter/time range parameters (for shareable analytical states)

Rationale:

- Deep links are essential for collaboration, auditability, and workflow continuity.

---

## 14. Future Scalability

Navigation must scale without redesign.

### 14.1 Scalability Targets

Must support:

- New modules
- Plugins
- Marketplace extensions
- Third-party integrations
- Custom workspaces
- Organization-specific modules

### 14.2 Extension Model

New nav entries must declare:

- Domain group
- Priority level
- Required permissions
- Search index type
- Command palette registration
- Deep link contract

### 14.3 Plugin Navigation Governance

Plugin and marketplace items:

- Appear in scoped groups
- Follow same icon/label rules
- Cannot break primary hierarchy semantics

### 14.4 Organizational Customization

Organizations may reorder and group allowed modules, but:

- Core anchors remain fixed
- Global search and command palette behavior remains consistent

Rationale:

- Sustainable scale requires predictable extension pathways.

---

## 15. Navigation State Architecture

### 15.1 Core State Layers

- Global navigation state
- Workspace navigation state
- Context state
- Search state
- Command palette state
- Notification navigation state

### 15.2 Persistence Rules

Persist per user:

- Sidebar collapse mode
- Favorites and pinned workspaces
- Recent workspaces/entities
- Recent and pinned commands
- Last relevant filters where safe

### 15.3 Session Rules

Session-only state includes:

- Temporary overlay stacks
- In-progress command query
- Local navigation highlights

Rationale:

- Correct state persistence maximizes speed while preventing stale confusion.

---

## 16. Error and Recovery in Navigation

### 16.1 Navigation Failure Types

- Route not found
- Permission denied
- Context unavailable
- Network degraded
- Search provider unavailable

### 16.2 Recovery UX

Must provide:

- Clear reason
- Context-safe fallback route
- One-click recovery action
- Preserve prior location where possible

### 16.3 Degraded Mode

If services degrade:

- Navigation remains functional to cached destinations where possible.
- Status indicators explain degraded capability.

Rationale:

- Navigation reliability directly affects trust in entire platform.

---

## 17. Visual and Motion Rules for Navigation

### 17.1 Visual Discipline

- Minimal borders
- Strong whitespace
- Dark navy text hierarchy
- Soft blue active accents
- Calm status indicators

### 17.2 Motion Rules

- Subtle hover transitions
- Panel and drawer slide behavior
- Shared layout transitions for state shifts
- No flashy animation bursts

### 17.3 Timing

- Hover: 0.16 to 0.24 seconds
- Standard transitions: 0.2 to 0.4 seconds
- Overlay transitions: 0.4 to 0.8 seconds

Rationale:

- Motion should improve orientation and perceived responsiveness.

---

## 18. Navigation Governance

### 18.1 Mandatory Review Gates

No new nav behavior ships without:

- UX consistency check
- Accessibility and keyboard validation
- Deep-link compliance
- Search and command integration
- Permission boundary verification

### 18.2 Change Control

Any navigation system change requires:

1. Rationale and impact statement
2. Cross-functional review
3. Versioned blueprint update

### 18.3 Priority Rule

If module-specific requests conflict with this navigation blueprint, this blueprint prevails unless revised through governance.

---

## 19. Final Navigation Promise

AIOS navigation must make users feel they are moving through a calm, intelligent operating system where every destination is obvious, every action is accessible, every context is preserved, and AI guidance accelerates progress without disrupting control.

This is the official navigation architecture contract for AIOS.
