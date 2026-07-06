# AIOS Workspace Shell Blueprint v1

Status: Official Foundation Blueprint
Owner: Chief Product Designer, UX Architect, Frontend Architect, Enterprise Software Designer
Scope: Complete AIOS application shell architecture
Applies To: All current and future AIOS modules

---

## 0. Contract Statement

This document defines the operating system shell for AIOS.

It is the foundational interaction and layout contract that every module, workspace, and frontend implementation must inherit.

No module may create a custom shell.
No workspace may bypass shell regions or interaction rules.

This blueprint aligns with:

- AIOS Frontend Blueprint v1
- AIOS Brand Guidelines v1
- AIOS Design System v2
- AIOS UX Guidelines v1
- AIOS Component Library v2

---

## 1. Shell Philosophy

### 1.1 Operating System Experience

AIOS is experienced as an operating system, not a collection of pages.

Users should feel:

- Continuous context
- Persistent intelligence
- Immediate orientation
- Low-friction actionability

### 1.2 Design Character

The shell must feel:

- Calm
- Elegant
- Professional
- Fast
- Timeless
- Minimal

### 1.3 Interaction Principles

- UI recedes behind work
- Whitespace is structural, not decorative
- One dominant focus zone at a time
- Assistance appears where needed, not everywhere
- State is always legible

### 1.4 Anti-Patterns

- No cluttered chrome
- No dense top-level navigation overload
- No visually loud status indicators
- No competing animations
- No dashboard-style “tile chaos” shell

---

## 2. Global Shell Architecture

The AIOS shell consists of the following persistent regions:

1. Top Navigation
2. Left Sidebar
3. Main Workspace Canvas
4. Right AI Panel
5. Command Palette
6. Notification Layer
7. Status Bar
8. Floating AI Panel
9. Context Drawer
10. Modal System
11. Overlay System
12. Loading System
13. Error System
14. Search Experience

### 2.1 Canonical Region Map

- Frame: full viewport application frame
- Top strip: global controls and context
- Left rail: primary navigation and workspace entry points
- Center: task canvas
- Right rail: AI context and guidance
- Bottom strip: system state telemetry (subtle)
- Overlay tier: command palette, modals, drawers, alerts, quick layers

### 2.2 Z-Index and Attention Hierarchy

Priority order (high to low):

1. Critical modal overlays
2. Command palette
3. Context drawer
4. Notification toasts
5. Floating AI panel
6. Right AI panel
7. Top bar and sidebar
8. Main workspace canvas
9. Status bar

Rule:

- Only one high-attention overlay may be active at once, except non-blocking toasts.

---

## 3. Left Sidebar

### 3.1 Role

Primary navigation spine for module switching and OS orientation.

### 3.2 Behavior

- Permanent on desktop
- Collapsible (expanded and compact icon mode)
- Slide-drawer on tablet/mobile

### 3.3 Required Navigation Items

In this exact semantic order:

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

### 3.4 Item Composition

Each item includes:

- Icon
- Title
- Hover animation
- Active indicator
- Keyboard shortcut hint

### 3.5 Active and Hover States

- Active state uses brand-accent edge and text emphasis
- Hover uses subtle background tint only
- No large movement or bounce effects

### 3.6 Sidebar Modes

- Expanded: icon + label + optional badge
- Collapsed: icon-only with tooltips
- Hidden: mobile overlay mode

### 3.7 Interaction Rules

- Single-click navigates
- Keyboard shortcut jumps directly
- Right click (or long press mobile) opens context actions where applicable

### 3.8 Accessibility Rules

- Full keyboard traversable
- Active module announced to screen readers
- Icon-only mode requires aria labels and tooltips

---

## 4. Top Bar

### 4.1 Role

Global command and context control strip.

### 4.2 Required Elements

1. Workspace Selector
2. Global Search
3. Quick Actions
4. Notifications
5. Profile
6. AI Status
7. Memory Status
8. Connection Status
9. Current Context

### 4.3 Layout Rules

- Left cluster: workspace selector and current context
- Center cluster: global search
- Right cluster: quick actions, notifications, statuses, profile

### 4.4 Behavior Rules

- Top bar remains persistent across all workspaces
- Only context label changes by workspace/view
- Search remains globally available at all times

### 4.5 Status Indicators in Top Bar

Top bar statuses should be minimal micro-indicators:

- AI status dot and text label
- Memory sync badge
- Connection state glyph

No pulsing or aggressive animation unless system-critical.

---

## 5. Main Workspace Canvas

### 5.1 Role

Primary task and interpretation surface.

### 5.2 Visual Rules

- Maximum readability first
- Large margins
- Strong typographic hierarchy
- Adaptive grid layout
- High whitespace discipline

### 5.3 Layout Rules

- Desktop-first layout strategy
- 12-column grid baseline on desktop
- Content max-width rules by workspace type
- Optional right contextual subpanels inside canvas only when task requires

### 5.4 Scroll Behavior

- Main canvas owns vertical scroll
- Top bar and sidebar remain anchored
- In-canvas sticky sections allowed for key controls

### 5.5 Focus Rules

- One primary action cluster per viewport segment
- Secondary actions grouped and deemphasized

---

## 6. Right AI Panel

### 6.1 Role

Persistent intelligent co-pilot and context interpreter.

### 6.2 Signature Modes

- Collapsed
- Expanded
- Floating
- Docked

### 6.3 Displayed Modules

Must support all:

- Current task
- Suggested actions
- Running agents
- Memory
- Execution reasoning
- Context
- Recent decisions

### 6.4 Interaction Behavior

- Panel can be pinned/unpinned per session
- Context-aware content updates automatically when workspace context changes
- User can lock panel to specific context to prevent auto-switching

### 6.5 Visual Behavior

- Docked mode aligns to right rail
- Floating mode appears as elevated panel over canvas with constrained dimensions
- Collapsed mode becomes icon rail or compact strip

### 6.6 State Handling

- Idle state: guidance and suggested next actions
- Active state: live execution and reasoning updates
- Degraded state: fallback explanation and recovery actions

### 6.7 Accessibility

- Region landmark with clear label
- Keyboard shortcut to open/focus panel
- Announce major AI state transitions

---

## 7. Command Palette

### 7.1 Role

Keyboard-first universal control plane.

### 7.2 Invocation

- Primary shortcut: Command/Ctrl + K
- Alternate trigger via top bar

### 7.3 Search Domains

Must include:

- Commands
- Customers
- Companies
- Reports
- Agents
- Memory
- Actions
- Navigation
- Settings

### 7.4 Interaction Rules

- Arrow keys navigate
- Enter executes
- Tab reveals metadata/help where needed
- Escape dismisses

### 7.5 Result Presentation

Each result displays:

- Type icon
- Label
- Scope/context
- Shortcut or quick hint

### 7.6 Ranking Logic UX Contract

Results ordered by:

1. Context relevance
2. User recency/frequency
3. System priority

---

## 8. Notifications Layer

### 8.1 Role

Low-friction awareness without interruption.

### 8.2 Placement

- Bottom-right default on desktop
- Bottom stacked safe-area on mobile

### 8.3 Behavior

- Group related notifications
- Priority-based styling
- Auto-dismiss non-critical notices
- Persist critical alerts until user acknowledgment

### 8.4 Priority Model

- Critical
- High
- Normal
- Informational

### 8.5 Interaction Model

- Expand group
- Dismiss single or group
- Jump to source context

---

## 9. Status Bar

### 9.1 Role

Subtle OS telemetry strip.

### 9.2 Required Signals

- System Health
- AI Running
- Memory Sync
- Supabase
- Connected Services
- Background Jobs

### 9.3 Visual Treatment

- Very subtle
- Low-height, low-contrast neutral surface
- Status changes communicate through concise labels and mild semantic color accents

### 9.4 Behavior

- Always visible in desktop workspace mode
- Collapsible in smaller viewports
- Can expand to details panel on click

---

## 10. Floating AI Panel

### 10.1 Role

Quick assistant access when right panel is hidden or task-focused mode is active.

### 10.2 Behavior

- Draggable within safe viewport bounds
- Snap to preferred corners
- Minimize to icon bubble

### 10.3 Usage Constraints

- Never overlaps critical modal actions
- Never obstructs primary form submit areas

---

## 11. Context Drawer

### 11.1 Role

Deep contextual details without full navigation switch.

### 11.2 Placement

- Right-side drawer by default
- Bottom sheet variant on mobile

### 11.3 Typical Content

- Entity details
- Trace metadata
- Linked events
- Decision history
- Quick contextual actions

### 11.4 Behavior

- Open from contextual links and cards
- Preserve previous scroll and state in main canvas
- Close returns focus to origin trigger

---

## 12. Modal System

### 12.1 Purpose

Handle blocking tasks requiring focused decisions.

### 12.2 Modal Types

- Confirmation modal
- Form modal
- Wizard modal
- Fullscreen modal

### 12.3 Behavior Rules

- One modal layer at a time
- Critical confirmation for destructive actions
- Escape close allowed except where compliance/security requires explicit decision

### 12.4 Focus Management

- Focus trap inside modal
- Return focus to invoking control on close

---

## 13. Overlay System

### 13.1 Included Overlays

- Command palette
- Dropdown menus
- Context menus
- Popovers
- Tooltips
- Drawers

### 13.2 Overlay Governance

- Overlays inherit shell token system
- No ad hoc overlay styles
- Overlay stacking follows global hierarchy

---

## 14. Loading System

### 14.1 Philosophy

Loading should preserve structure and reduce uncertainty.

### 14.2 Required Patterns

- Skeletons for known layouts
- Inline loaders for localized async operations
- Global loading bar only for major route transitions

### 14.3 Behavior

- Prevent layout jumps
- Maintain action affordances where safe
- Show progress when duration is meaningful

---

## 15. Error System

### 15.1 Philosophy

Errors must be understandable, actionable, and calm.

### 15.2 Error Levels

- Inline field/component error
- Section-level error panel
- Workspace-level error state
- Global system alert

### 15.3 Required Error Content

- What failed
- Impact
- Next step
- Retry or fallback action

### 15.4 Recovery UX

- Retry where appropriate
- Safe fallback mode messaging
- Preserve user inputs whenever possible

---

## 16. Search Experience

### 16.1 Search Layers

- Global search in top bar
- Command palette search
- Local workspace search
- Contextual in-panel search

### 16.2 Search UX Rules

- Always show active scope
- Show recent searches and suggested entities
- Support fuzzy matching and exact id lookup
- Preserve search state while navigating result set

### 16.3 Result UX

- Type and source metadata
- Quick action inline
- Jump to context and highlight destination

---

## 17. Workspace Type Variations

### 17.1 Executive Workspace

Layout profile:

- High-level briefings first
- Recommendation and decision queue prominent
- Lower density, high clarity

Shell variation:

- Right AI panel expanded by default
- Status emphasis on risk and decision velocity

### 17.2 Sales Workspace

Layout profile:

- Pipeline and opportunity focus
- Faster list/detail transitions

Shell variation:

- Main canvas split layout common
- Context drawer heavily used

### 17.3 Corporate Workspace

Layout profile:

- Structure and hierarchy exploration
- Entity relationship context

Shell variation:

- Left-side hierarchy navigation support inside main canvas
- Rich breadcrumbs and path context

### 17.4 Analytics Workspace

Layout profile:

- Charts, tables, and comparative views
- Time-range controls persistent

Shell variation:

- Wider canvas mode with optional compact sidebars
- Dense but calm information zones

### 17.5 Knowledge Workspace

Layout profile:

- Knowledge object browsing and relationship mapping
- Search-centric workflows

Shell variation:

- Command palette prominence
- Context drawer for provenance and references

### 17.6 Memory Workspace

Layout profile:

- Timeline and replay-first
- Context deep inspection

Shell variation:

- Right AI panel reasoning and execution history blocks emphasized
- Status bar highlights sync and replay state

### 17.7 Agent Workspace

Layout profile:

- Agent fleet statuses and queues
- Execution control and override actions

Shell variation:

- Right panel defaults to running agents and queue diagnostics
- Status bar foregrounds background jobs and connected services

### 17.8 Settings Workspace

Layout profile:

- Structured categories and forms
- Low distraction environment

Shell variation:

- Secondary sidebar for settings sections
- Right AI panel collapsed by default

---

## 18. Responsive Behavior

### 18.1 Desktop

- Full top bar
- Permanent left sidebar
- Main canvas with wide margins
- Right AI panel docked by default where relevant
- Status bar visible

### 18.2 Tablet

- Sidebar becomes collapsible drawer
- Top bar retains core controls with condensed labels
- Right AI panel defaults collapsed, expandable overlay
- Status bar may collapse into top status capsule

### 18.3 Mobile

- Sidebar fully drawer-based
- Top bar compact with essential controls only
- Main canvas single-column with progressive disclosure
- Right AI panel becomes bottom sheet/floating assistant
- Status signals surfaced in compact status chip cluster
- Command palette uses full-screen modal

### 18.4 Region-by-Region Responsive Transform

- Top nav: compresses actions into overflow menus
- Left sidebar: permanent to overlay transition
- Main canvas: multi-column to single column
- Right AI panel: docked rail to sheet/floating mode
- Notifications: stacked and grouped with reduced visual weight
- Status bar: full strip to compact summary

---

## 19. Motion and Interaction System

### 19.1 Motion Engine

All shell interactions must be Framer Motion compatible.

### 19.2 Approved Motion Types

- Fade
- Slide
- Shared layout transitions
- Gentle scale
- Hover lift
- Panel expansion
- Drawer slide
- Soft transitions

### 19.3 Motion Timing

- Hover: 0.16 to 0.24s
- Standard transitions: 0.2 to 0.4s
- Panel and route transitions: 0.4 to 0.8s

### 19.4 Motion Constraints

- No flashy animation
- No high-amplitude movement
- No competing simultaneous transitions
- Respect reduced-motion preferences globally

### 19.5 Signature Interactions

- Sidebar collapse/expand smooth width transition
- Right AI panel dock/undock with shared layout
- Command palette open/close fade-scale
- Context drawer slide-in with focus transition

---

## 20. Visual Language Enforcement

Shell visuals must follow official AIOS brand and design tokens:

- White primary backgrounds
- Soft blue accents
- Rounded corners
- Premium soft shadows
- Large spacing rhythm
- Dark navy typography
- Minimal borders
- Very subtle glass only when justified by layering need

### 20.1 Typography in Shell Chrome

- Navigation labels: concise and medium weight
- Context labels: secondary neutral tone
- Status labels: compact and unobtrusive

### 20.2 Border and Surface Discipline

- Prefer separation via whitespace and subtle contrast first
- Use borders sparingly for functional grouping

---

## 21. Shell States and System Modes

### 21.1 Core Shell States

- Normal operating
- Focus mode
- Assistive mode
- Offline/degraded mode
- Recovery mode

### 21.2 Focus Mode

- Minimizes non-critical chrome
- Collapses right panel by default
- Hides low-priority notifications

### 21.3 Assistive Mode

- Expands AI guidance surfaces
- Promotes suggested actions and reasoning visibility

### 21.4 Offline/Degraded Mode

- Persistent status indicator
- Explicit stale-data messaging
- Safe action limitation cues

### 21.5 Recovery Mode

- Display clear remediation and retry controls
- Preserve user state

---

## 22. Accessibility Requirements for Shell

### 22.1 Navigation and Focus

- Full keyboard operability for all shell controls
- Skip links for top-level regions
- Deterministic focus order across overlays

### 22.2 Screen Reader Landmarks

Must expose landmarks for:

- Top navigation
- Primary navigation
- Main content
- Complementary AI panel
- Status region

### 22.3 Contrast and States

- All status indicators meet contrast requirements
- Active and selected states distinguishable without color alone

### 22.4 Reduced Motion

- Global reduced-motion mode applies to all shell transitions

---

## 23. Implementation Governance

### 23.1 Adoption Rule

Every future module must mount within this shell.

### 23.2 Prohibited Deviations

- Custom top bars per module
- Custom sidebars with different behavior model
- Ad hoc status indicators outside top/status regions
- Module-specific command systems bypassing global command palette

### 23.3 Change Control

Any shell-level modification requires architecture review and versioned update to this blueprint.

---

## 24. Final Experience Promise

AIOS Workspace Shell v1 ensures every module feels like part of one calm, intelligent operating system that continuously observes, understands, prioritizes, and helps execute business work with confidence.

This document is the foundation for all future AIOS interface implementations.
