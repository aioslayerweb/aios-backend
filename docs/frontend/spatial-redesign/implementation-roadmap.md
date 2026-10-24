# Spatial Redesign: Implementation Roadmap

## Delivery approach

Work in small, reviewable vertical slices. Use the Executive Command Center
and QBI references as separate representative compositions. Build shared
presentation primitives only after their data contracts and ownership are
separated from route/provider behavior. Do not roll an unapproved template
across the 40+ route families.

The current source indicates that the public demo uses a disabled live-data
mode and that `/app` enables its live-data mode. The tenant-isolation
implementation gate remains unsatisfied. Treat both as source facts—not
proof of production behavior or permission to connect sensitive routes.

## Stages

### 0. Approval and source-backed scope

**Targets:** Existing references and this documentation; no application-code
targets.

**Dependencies:** Founder/design-owner approval of the two desktop references,
approved AIOS logo/name for each section, any available original brand/source
assets, and approval of the first route slice. The task states that tablet and
mobile should be derived from desktop, so do not block on or request mobile
screenshots.

**Work:** Resolve the competing `AIOS Layer`/`AIOS Pilot` marks; confirm the
Executive Command Center as the first slice; agree the success criteria,
content semantics, and whether the `/demo-platform/executive` duplicate is
retired or retained during transition.

**Acceptance:** Written scope identifies the exact reference image for each
section, approved brand asset, route, data-mode contract, viewport test
matrix, and design reviewer. No implementation begins before the approval.

### 1. Spatial presentation foundations

**Likely targets:** `components/layout/foundation/`,
`components/workspace/`, `styles/tokens.css`, `styles/foundation.css`,
`theme/tokens.ts`, and a small new spatial-presentation module only if
existing primitives cannot express the approved design.

**Dependencies:** Stage 0 approval.

**Work:** Specify and implement only shared presentation contracts:
spatial canvas/environment, connected domain node and relationship,
selection/focus state, contextual detail surface, visualization frame,
recommendation/evidence presentation, and motion/reduced-motion behavior.
Keep route data providers out of these primitives.

**Acceptance:**

- Tokens and primitives support the bright architectural visual language
  without defaulting to repeated equal-weight card grids.
- Selection, focus, labels, status, and relationships are perceivable without
  motion, hover, or color alone.
- Reduced-motion mode retains hierarchy and selected state.
- No component in this stage adds data requests or mutates business data.

### 2. Executive Command Center demo vertical slice

**Likely targets:** `app/demo-platform/page.tsx`,
`components/executive-command-center/executive-command-center.tsx`,
`components/executive-command-center/executive-command-center-legacy.tsx`,
`components/demo/executive-dashboard.tsx`, and typed synthetic fixtures
under `lib/demo/`.

**Dependencies:** Approved Executive Command Center composition and Stage 1
presentation foundations.

**Work:** Establish one canonical spatial demo entry based on the second
reference. Reconcile the current assistant/legacy mode and separate
`/demo-platform/executive` implementation in a bounded way. Use deterministic
synthetic visualization fixtures. Show synthetic/sample status consistently;
all demo actions remain local previews.

**Acceptance:**

- `/demo-platform` presents the approved connected operating landscape as its
  primary experience.
- The central AIOS-to-domain structure remains understandable at large
  desktop, laptop, tablet, mobile portrait, and narrow mobile.
- Pipeline/opportunity evidence, customer health/risk/activity, and
  recommendations follow the approved hierarchy.
- All records and visualization points are synthetic; actions cannot call
  business APIs, Supabase queries, or live runtime loaders.
- Visible copy never labels fixture data as “Live Intelligence” or represents
  local previews as completed operations.

### 3. QBI demo analytical slice

**Likely targets:** `app/demo-platform/qbi/page.tsx`,
`components/platform-next/next-gen-workspace.tsx`,
`components/platform-next/domain-widgets.tsx`,
`components/platform-next/domain-interactive.tsx`, and separate QBI-specific
synthetic fixtures if needed.

**Dependencies:** Stage 1 foundations and validated Executive Command Center
patterns. Preserve a QBI-specific composition rather than making a generic
copy of the prior slice.

**Work:** Recompose the shared QBI route around the connected analytical
core, business health, Monte Carlo/probability outcomes, journey evidence,
executive insights, and optimization relationships shown in the first
reference. Reuse proven node, selection, detail, navigation, and accessibility
primitives, not an executive dashboard layout.

**Acceptance:**

- The QBI analytical core and supporting analyses match the supplied
  reference’s hierarchy and remain linked by visible context.
- Tablet and mobile use focus-based analysis selection and readable chart
  summaries rather than scaled-down desktop plots.
- Inputs remain synthetic in the public demo; controls are simulations only.

### 4. SaaS visual alignment

**Likely targets:** `app/app/page.tsx`, `app/app/qbi/page.tsx`,
`components/executive-command-center/`,
`components/platform-next/`, and selected route components for customer,
sales, agents, decisions, workflows, planning, operations, memory/knowledge,
organizations, and governance.

**Dependencies:** Demo vertical slices approved; a route-to-data-source and
authorization review for each SaaS experience before connecting business
data.

**Work:** Reuse only presentation components and design tokens. Keep
`/app`-specific data access in its existing authenticated/provider boundary.
Map each domain to a task-appropriate spatial composition. Do not spread a
new home/QBI layout across every domain route indiscriminately.

**Acceptance:**

- `/app` adopts approved visual language without changing authentication,
  authorization, organization selection, or query scope.
- Demo and SaaS share rendering primitives but have distinct explicit
  data-source wiring and tests.
- No tenant-sensitive component is connected to an endpoint until the
  applicable ownership and tenant-isolation gate is satisfied.

### 5. Responsive, accessibility, performance, and regression hardening

**Likely targets:** Touched spatial components and routes, shared responsive
primitives, `tests/security/demo-data-isolation.test.ts`, and new focused
component/visual tests if the repository’s test architecture supports them.

**Dependencies:** Stages 2–4 at the relevant route scope.

**Work:** Validate all specified viewport classes; keyboard and touch
interaction; reduced motion; contrast and zoom; empty/loading/error/offline
states; stable visualization data; animation and rendering costs; and
navigation regression across demo and SaaS routes.

**Acceptance:**

- No overlap, clipped key labels, unreadable charts, or accidental page-level
  horizontal overflow at approved viewport test points.
- No key information or action is hover-only; keyboard focus order is logical;
  touch targets are usable.
- Reduced-motion mode removes nonessential continuous motion while preserving
  state and relationships.
- Demo isolation and SaaS live-data-preservation checks pass independently.
- Performance budgets and supported browser/device matrix are documented and
  met; no production claim is inferred from local test results.

## Test and validation plan

Run only when implementation is separately authorized, dependencies are
already available, and test setup is confirmed safe:

- `npm run test:security` — currently documented as an offline local suite;
  it has active source/fixture checks and TODO security requirements. A pass
  is not evidence of production authorization or tenant isolation.
- `npm run typecheck` — TypeScript validation.
- `npm run lint` — repository lint command.
- `npm run build` — only after explicit implementation-stage approval; it is
  not part of this planning stage.
- Add focused tests that render the demo and SaaS route boundaries with
  injected/fake data sources and prove that demo paths cannot invoke live
  loaders or requests, while SaaS retains its configured loader behavior.
- Add deterministic visual regression coverage at representative desktop,
  laptop, tablet, mobile portrait, and narrow-mobile viewports. Visual tests
  must not use live services or business records.
- Validate keyboard, screen-reader announcements, focus visibility,
  reduced-motion preferences, touch interactions, zoom/reflow, and loading,
  empty, error, and offline states.

No test or build was run for this assessment. Actual test-runner safety and
rendered route behavior must be re-confirmed during an implementation stage.

## Principal regression risks and controls

| Risk | Control |
|---|---|
| Multiple executive implementations drift or silently change links | Establish one approved demo executive entry and test `baseHref` route mapping; make any retirement of duplicate routes a separately reviewed change. |
| General domain template flattens QBI into cards | Keep the QBI core-and-analysis composition distinct; reuse primitives rather than page layout. |
| Demo and SaaS share a component that begins fetching live data | Rendering components receive data by props; test route-level data modes; preserve demo `liveDataEnabled={false}` and SaaS live mode. |
| Unresolved ownership is obscured by polished UI | Do not connect sensitive SaaS views to business APIs until their identity, organization, ownership, and query-scope gate is satisfied. |
| Reduced-motion or touch users lose access to spatial relationships | Provide static selected states, explicit controls/list equivalents, and non-hover interactions. |
| Fixed positioning, density, or animations fail on smaller devices | Recompose per the responsive specification and test real viewport classes; avoid assuming CSS breakpoints guarantee usability. |
| Randomized or time-varying sample content causes visual instability | Use deterministic fixtures and stable timestamps/coordinates in render and snapshot paths. |
| Seed data appears to be real or current | Label synthetic values and demo-only actions; remove “live” wording for fixture-driven content. |

## Implementation-start announcement requirement

At the start of the first authorized frontend implementation response, display
this prominent notice before any code work:

> # 🚨 FRONTEND IMPLEMENTATION STARTING — VERIFY THE ORIGINAL AIOS DESKTOP REFERENCES ARE AVAILABLE 🚨
>
> The Executive Command Center and QBI desktop references are the visual
> source of truth. Tablet and mobile layouts will be derived from those
> references; no mobile screenshots are required. Confirm the original
> desktop images and approved brand assets are available before implementation.

This roadmap itself does not authorize implementation.
