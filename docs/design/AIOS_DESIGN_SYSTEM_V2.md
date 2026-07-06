# AIOS Design System V2

Status: Official, Active, Superseding
Owner: Chief Design Systems Architect
Applies To: Product Design, UX, Frontend Engineering, AI Coding Agents, Documentation
Supersedes: Prior design system documents

---

## 0. System Contract

This document is the implementation specification for the AIOS interface.

It defines the visual, structural, behavioral, and accessibility standards for all AIOS surfaces, including product UI, internal tools, and public-facing web experiences.

This is not a UI kit.
This is a contract for building consistent, enterprise-grade interfaces.

All implementations must align with:

- AIOS Constitution
- AIOS Architecture
- Business Ontology
- Developer Bible
- Hard Rules v2
- Frontend Blueprint V1
- Brand Guidelines V1
- Component Library V1
- Master PRD

Non-negotiables:

- AIOS Pilot logo is the official identity mark.
- Brand color and typography behavior must remain consistent with Brand Guidelines V1.
- Information clarity always outweighs visual decoration.

---

## 1. Design Philosophy

### 1.1 Core Principles

1. Enterprise-first
2. Minimal by default
3. Calm and composed interactions
4. Premium but restrained visual quality
5. Elegant hierarchy and spacing
6. Timeless over trend-driven styling
7. Information-first composition
8. Motion with purpose only
9. Accessibility-first as baseline quality

### 1.2 Practical Interpretation

- Every screen should reduce decision friction.
- Every visual choice must have functional value.
- Every interaction should communicate confidence and control.
- Every state should be explicit: loading, success, warning, error, empty.

### 1.3 Anti-Patterns

- No cluttered dashboards
- No neon/cyberpunk palettes
- No decorative motion chains
- No ambiguous component behavior
- No inaccessible contrast or hidden focus states

---

## 2. Colour Tokens

All token names below are semantic and implementation-ready.

### 2.1 Brand Foundation

- color.brand.primary = #1C82F2
- color.brand.primary.hover = #176EEA
- color.brand.primary.active = #125CC7
- color.brand.navy = #02154A
- color.brand.blue.soft = #4DA1FB
- color.brand.blue.subtle = #EAF4FF

### 2.2 Semantic Feedback

- color.semantic.success = #1F9D67
- color.semantic.success.bg = #EAF8F1
- color.semantic.warning = #C88719
- color.semantic.warning.bg = #FFF6E8
- color.semantic.error = #C73E3A
- color.semantic.error.bg = #FDEDED
- color.semantic.info = #1C82F2
- color.semantic.info.bg = #EAF4FF

### 2.3 Neutral Scale

- color.neutral.900 = #111827
- color.neutral.800 = #1F2937
- color.neutral.700 = #374151
- color.neutral.600 = #4B5563
- color.neutral.500 = #6B7280
- color.neutral.400 = #9CA3AF
- color.neutral.300 = #D1D5DB
- color.neutral.200 = #E5E7EB
- color.neutral.100 = #F3F4F6
- color.neutral.50 = #F9FAFB
- color.neutral.0 = #FFFFFF

### 2.4 Surface and Background Tokens

- color.bg.app = #F9FAFB
- color.bg.canvas = #FFFFFF
- color.bg.subtle = #EAF4FF
- color.surface.default = #FFFFFF
- color.surface.raised = #FFFFFF
- color.surface.muted = #F3F4F6
- color.surface.overlay = rgba(12, 21, 51, 0.72)

### 2.5 Border Tokens

- color.border.default = #E5E7EB
- color.border.strong = #D1D5DB
- color.border.focus = #1C82F2
- color.border.error = #C73E3A

### 2.6 Text Tokens

- color.text.primary = #111827
- color.text.secondary = #4B5563
- color.text.muted = #6B7280
- color.text.inverse = #FFFFFF
- color.text.brand = #02154A
- color.text.onBrand = #FFFFFF

### 2.7 Interactive Tokens

- color.action.primary.bg = #1C82F2
- color.action.primary.text = #FFFFFF
- color.action.primary.hover = #176EEA
- color.action.primary.active = #125CC7
- color.action.primary.disabled.bg = #BFDFFF
- color.action.primary.disabled.text = #EAF4FF

- color.action.secondary.bg = #FFFFFF
- color.action.secondary.text = #02154A
- color.action.secondary.border = #D1D5DB
- color.action.secondary.hover = #F3F4F6

### 2.8 Accessibility Contrast Rules

- Body text contrast minimum 4.5:1
- Large text minimum 3:1
- Control boundaries and icon-only buttons minimum 3:1
- Never communicate status by color alone

---

## 3. Typography Tokens

### 3.1 Font Families

- font.family.display = "Clash Display", "Satoshi", "Segoe UI", sans-serif
- font.family.body = "Satoshi", "Plus Jakarta Sans", "Segoe UI", sans-serif
- font.family.mono = "IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace

### 3.2 Font Weight Tokens

- font.weight.regular = 400
- font.weight.medium = 500
- font.weight.semibold = 600
- font.weight.bold = 700

### 3.3 Display and Hero Tokens

- type.hero.xl = 64/72, weight 600, tracking -0.02em
- type.hero.l = 56/64, weight 600, tracking -0.02em
- type.display.l = 48/56, weight 600, tracking -0.015em
- type.display.m = 40/48, weight 600, tracking -0.01em

### 3.4 Heading Tokens

- type.h1 = 36/44, weight 600
- type.h2 = 30/38, weight 600
- type.h3 = 24/32, weight 600
- type.h4 = 20/28, weight 600
- type.h5 = 18/26, weight 600
- type.h6 = 16/24, weight 600

### 3.5 Body and Utility Tokens

- type.body.l = 18/30, weight 400-500
- type.body.m = 16/26, weight 400-500
- type.body.s = 14/22, weight 400-500
- type.small = 13/20, weight 500
- type.caption = 12/18, weight 500

### 3.6 Component-Specific Typography

- type.button = 14/20, weight 600, tracking 0
- type.nav = 14/20, weight 500
- type.table.header = 12/18, weight 600
- type.table.cell = 14/20, weight 500
- type.form.label = 12/18, weight 600
- type.form.input = 14/22, weight 400-500
- type.code.inline = 13/20, mono, weight 500

### 3.7 Spacing Rules for Type

- Heading to body gap: 16 to 24
- Paragraph gap: minimum 1 line-height unit
- Avoid all-caps for long strings
- Reserve heavy weights for short headings and key labels

---

## 4. Grid System

### 4.1 Breakpoints

- Mobile: 360 to 767
- Tablet: 768 to 1023
- Laptop: 1024 to 1439
- Desktop: 1440 to 1919
- Ultra-wide: 1920+

### 4.2 Containers

- container.mobile.max = 100%
- container.tablet.max = 100%
- container.laptop.max = 1200
- container.desktop.max = 1440
- container.ultrawide.max = 1680

### 4.3 Column System

- Desktop: 12 columns
- Laptop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns

### 4.4 Gutters and Margins

- gutter.desktop = 24
- gutter.laptop = 20
- gutter.tablet = 16
- gutter.mobile = 12

- margin.desktop = 40
- margin.laptop = 32
- margin.tablet = 24
- margin.mobile = 16

### 4.5 Spacing Scale

- space.0 = 0
- space.1 = 4
- space.2 = 8
- space.3 = 12
- space.4 = 16
- space.5 = 24
- space.6 = 32
- space.7 = 40
- space.8 = 48
- space.9 = 64
- space.10 = 80
- space.11 = 96
- space.12 = 120

---

## 5. Layout Rules

### 5.1 Landing Pages

- Narrative-first structure
- Large typography and controlled pacing
- Section spacing at 96 plus
- Motion only to support story progression

### 5.2 Dashboard Layout

- Primary insight region at top-left
- Secondary KPI and alert rail on right or below, based on viewport
- Card grid with stable ordering by priority

### 5.3 Workspace Layout

- Global top bar + sidebar + main canvas
- Optional right context panel
- Sticky local actions when page depth > 1

### 5.4 Analytics Layout

- Summary header
- Chart zone
- Linked table zone
- Filter and timeframe controls above visuals

### 5.5 Table Layout

- Toolbar row for filters/actions
- Sticky header
- Optional summary row
- Pagination anchored bottom-right

### 5.6 Form Layout

- Single-column default for complex forms
- Two-column only for low-cognitive fields
- Inline validation with clear remediation guidance

### 5.7 Settings Layout

- Category navigation on left
- Detail panels on right
- Save and reset actions persistent

### 5.8 Authentication Layout

- Minimal distraction
- Focused card with clear hierarchy
- Secondary security guidance below primary form

### 5.9 Modal Layout

- Title, context text, body, footer actions
- Max widths by intent: compact, standard, large
- Escape and close behavior clearly defined

### 5.10 Split Layout

- Resizable panes for replay, diagnostics, and comparison workflows
- Preserve pane ratio in session state

---

## 6. Navigation

### 6.1 Top Navigation

Contains:

- Brand anchor
- Workspace switcher
- Global search
- Command palette trigger
- Notifications
- Profile menu

### 6.2 Sidebar Navigation

- Domain-based grouping
- Active and parent highlighting
- Collapsible behavior
- Permission-aware visibility

### 6.3 Secondary Navigation

- Tabs or subnav for local sections
- Keep under 7 primary items per scope

### 6.4 Breadcrumbs

- Required for nested depth beyond level 1
- Entity-aware labels, not route fragments

### 6.5 Command Palette

Capabilities:

- Navigate pages
- Trigger scoped actions
- Create core entities
- Open diagnostics and replay contexts

### 6.6 Global Search

Search targets:

- Pages
- Entities
- Memory contexts
- Signals
- Reports
- Agents

### 6.7 Notifications

- Prioritized: critical, high, normal, info
- Actionable deep links
- Time and source metadata

### 6.8 Profile and Workspace Switching

- Fast context switching
- Clear current workspace indicator
- Role and environment visibility

---

## 7. Card System

### 7.1 Standard Card

Use for:

- Summaries
- Lightweight object views
- Quick actions

Structure:

- Header, content, optional footer
- Radius 16
- Padding 24

### 7.2 Analytics Card

- KPI focus with trend context
- Optional sparkline
- Numeric alignment right when comparative

### 7.3 AI Card

- Recommendation summary
- Evidence count
- Confidence marker
- Suggested action

### 7.4 Metric Card

- Label
- Primary metric
- Delta and comparison period

### 7.5 Timeline Card

- Event title
- Timestamp
- Context ID or entity
- Status indicator

### 7.6 Customer Card

- Customer identity
- Health indicator
- Current risk/opportunity tags

### 7.7 Agent Card

- Agent role
- Active status
- Queue count
- Last execution outcome

### 7.8 Executive Card

- Decision recommendation
- Why it matters
- Expected outcome
- Approval action

Card standards:

- Stable header hierarchy
- Consistent action placement
- No overloaded dense text blocks

---

## 8. Table System

### 8.1 Enterprise Standards

- Clear headers
- Stable row height options: default and compact
- Strong keyboard support

### 8.2 Sorting

- Single and multi-column sort support
- Visible sort priority badges for multi-sort

### 8.3 Filtering

- Inline quick filters
- Advanced filter builder in drawer or popover
- Persist filters per workspace where useful

### 8.4 Pagination

- Page size control
- Direct page navigation
- Summary count and range

### 8.5 Bulk Actions

- Selection model with clear count
- Sticky bulk action bar on selection
- Guardrails for destructive actions

### 8.6 Sticky Headers

- Required for tables over one viewport height
- Keep column label visibility during scroll

### 8.7 Responsive Behavior

- Tablet: hide low-priority columns behind overflow controls
- Mobile: switch to card-list representation with key fields first

---

## 9. Form System

### 9.1 Inputs

- Clear labels above controls
- Placeholder never substitutes label
- Help text optional but concise

### 9.2 Dropdowns

- Searchable for lists above 10 items
- Keyboard navigation required

### 9.3 Search Fields

- Typeahead for indexed entities
- Loading and no-result states mandatory

### 9.4 Selection Controls

- Checkbox for multi-select
- Radio for mutually exclusive options

### 9.5 Date Picker

- Locale-aware formatting
- Timezone visibility for scheduling workflows

### 9.6 File Upload

- Supported format and size guidance
- Progress and failure feedback

### 9.7 Validation

- Immediate validation for formatting issues
- Deferred validation for server-side rules

### 9.8 Error and Success States

- Error message must explain fix path
- Success message must confirm persisted state

---

## 10. AI Components

### 10.1 Prompt Box

- Clear input focus
- Context indicator
- Submission states

### 10.2 Conversation Panel

- Message hierarchy
- Role distinction
- Traceable references when available

### 10.3 Agent Status Panel

- Agent health
- Queue position
- Last completed action

### 10.4 Execution Timeline

- Ordered events
- State transitions
- Timestamp fidelity

### 10.5 Reasoning View

- Observation
- Evidence
- Reasoning chain
- Confidence
- Recommendation

### 10.6 Memory Timeline

- Context replay controls
- Event clustering
- Time-range filters

### 10.7 Action Queue

- Pending, running, completed, failed lanes
- Retry and escalation actions

### 10.8 Event Viewer

- Event metadata
- Payload viewer
- Trace and context links

### 10.9 Replay Viewer

- Context selector
- Timeline playback controls
- Debug summary panel

AI component constraints:

- No anthropomorphic visual metaphors
- No opaque confidence displays
- Must preserve explainability

---

## 11. Dashboard Components

### 11.1 Charts

- Line, area, bar, and comparison charts
- Clear labels and legends
- Accessible alternatives required

### 11.2 Metrics and KPIs

- Unified metric card system
- Baseline and delta display

### 11.3 Activity Feed

- Chronological stream
- Filter by type and priority

### 11.4 Notifications Panel

- Prioritized alerts with actionable links

### 11.5 Recent Actions

- Last user/system changes with quick rollback context when available

### 11.6 Insights Panel

- Top insights grouped by impact
- Confidence and rationale preview

### 11.7 Goals and Tasks

- Objective progress
- Task ownership and due indicators

---

## 12. Feedback and State Components

### 12.1 Loading

- Use skeletons for known layouts
- Use spinners only for small inline waits

### 12.2 Skeletons

- Match final content shape
- Avoid generic placeholder blocks when structure is known

### 12.3 Success

- Compact confirmations
- Optional inline detail for what changed

### 12.4 Errors

- Severity-coded with guidance
- Retry options for recoverable failures

### 12.5 Warnings

- Non-blocking caution with implications

### 12.6 Empty States

- Explain why empty
- Provide best next action

### 12.7 Offline States

- Connectivity status visible
- Cached content behavior explicit

---

## 13. Motion System

Engine standard: Framer Motion

### 13.1 Timing

- Primary transitions: 0.4 to 0.8 seconds
- Hover: 0.16 to 0.24 seconds
- Micro feedback: 0.2 to 0.4 seconds

### 13.2 Easing

- Standard ease-out: cubic-bezier(0.22, 0.61, 0.36, 1)
- Exit ease-in where needed for continuity

### 13.3 Hover Behavior

- Subtle elevation and color shift
- Avoid aggressive scale-based hover

### 13.4 Scroll Animations

- Reserved for narrative sections
- Keep product surfaces mostly static and stable

### 13.5 Transitions

- Route transitions should aid orientation
- Keep dense workflow transitions short

### 13.6 Microinteractions

- Confirm intent and state change
- Reinforce control responsiveness

### 13.7 Reduced Motion

- Respect OS/user preference
- Swap movement for opacity emphasis

---

## 14. Responsive Behavior

### 14.1 Desktop

- Full navigation and multi-panel layouts
- Detailed analytics and tables

### 14.2 Laptop

- Similar to desktop with tighter gutters
- Priority controls remain visible

### 14.3 Tablet

- Condensed navigation
- Optional panel overlays
- Reduced simultaneous columns

### 14.4 Mobile

- Bottom navigation or compact top navigation
- Single-column flow for core tasks
- Progressive disclosure for advanced settings

### 14.5 Ultra-wide

- Constrain line lengths and panel widths
- Add contextual side rails instead of stretching central content

---

## 15. Accessibility

Standard: WCAG AA+ baseline

### 15.1 Keyboard

- Full keyboard path for all controls
- Logical focus order
- No keyboard traps

### 15.2 ARIA and Semantics

- Proper roles for custom controls
- Label and description relationships
- Landmark usage for major regions

### 15.3 Contrast

- Meet or exceed token contrast pair requirements
- Test interactive and disabled states

### 15.4 Reduced Motion

- Motion alternatives required for all non-essential movement

### 15.5 Focus Management

- Persistent visible focus indicator
- Modal and drawer focus trapping and restoration

### 15.6 Screen Readers

- Descriptive names for icon-only controls
- Chart data summaries available in text
- Status updates announced where required

---

## 16. Governance and Adoption

### 16.1 Adoption Rule

All new UI work must implement V2 tokens, layout rules, and component behavior contracts.

### 16.2 Migration Rule

Legacy screens should be migrated in priority order:

1. Global shell and navigation
2. High-traffic dashboard and workspace routes
3. Data tables and forms
4. AI and replay surfaces
5. Marketing and docs surfaces

### 16.3 Review Gates

No feature ships without:

- Token compliance check
- Accessibility check
- Responsive check
- Interaction behavior check
- Brand alignment check

---

## 17. Final Non-Negotiables

- Information-first over decoration
- Brand consistency over novelty
- Accessibility as default quality
- Motion only when useful
- Enterprise trust as primary experience outcome

AIOS Design System V2 is now the official implementation specification for all AIOS interfaces.
