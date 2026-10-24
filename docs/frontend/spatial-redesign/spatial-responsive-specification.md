# Spatial Redesign: Visual and Responsive Specification

## Intent

Treat the supplied Executive Command Center and QBI desktop images as the
visual source of truth. Build a shared spatial language without making the
two sections look or behave identically. The Executive Command Center
communicates the connected operating model and prioritized action; QBI
communicates analysis, uncertainty, evidence, and optimization.

The layouts below are responsive design recommendations derived from the
desktop references. They are not claims of founder-approved mobile artwork.

## Shared visual and interaction principles

### Environment, depth, and hierarchy

- Use a bright, predominantly white/light-blue environmental canvas with
  subdued architectural atmosphere consistent with the references.
- Establish foreground, midground, and background through restrained
  elevation, lighting, scale, and overlap. Keep text and charts on surfaces
  with sufficient contrast; blur and translucency must never reduce legibility.
- Let the spatial model carry meaning: lines and proximity indicate business
  relationships; scale and placement communicate hierarchy; color communicates
  domain or status. Every spatial cue must have a product purpose.
- Avoid repetitive equal-weight square-card grids, generic glass panels, and
  conventional sidebar-plus-cards compositions as the defining page. Use
  floating surfaces only where they belong to the reference’s spatial
  environment.
- Preserve clear executive reading order: overview, connected business
  context, evidence, then recommended next action. QBI should lead from the
  analytical core into outcomes, evidence, and strategy.

### Navigation and transitions

- Keep a stable brand/orientation anchor and recognizable route identity.
  Desktop may use the reference’s persistent left rail; smaller layouts need
  compact, touch-accessible navigation that retains the same hierarchy.
- Selecting a domain should identify it in the spatial model and reveal
  related evidence/actions without losing the user’s location in the whole.
- Use purposeful transitions to communicate selection, focus, and movement
  between levels. Avoid perpetual motion that competes with business content.
- Ensure every hover interaction has a keyboard focus and touch equivalent.
  Spatial scenes must not require pointer hover, drag, or precise mouse input.

### Type, color, and business information

- Reuse approved AIOS type, semantic color, spacing, focus, surface, and
  motion tokens where they fit. Do not introduce a competing token system
  without a documented migration.
- Use strong, readable labels and numeric hierarchy. Maintain contrast for
  small text over environmental backgrounds.
- Distinguish actual versus sample/synthetic information and actual versus
  simulated actions in the interface. UI copy must match the route’s data
  mode.
- Recommendations should expose observation, evidence, reasoning, confidence,
  impact, action, and expected outcome where the underlying data supports
  those fields. Do not invent data or a prioritization formula.

### Accessibility, motion, and states

- Respect `prefers-reduced-motion` for entrance, parallax, animated charts,
  pulsing nodes, and continuous effects. Provide a static composition that
  retains the same hierarchy and selected state.
- Preserve semantic headings, landmarks, status announcements, descriptive
  accessible names, visible keyboard focus, logical focus order, and usable
  zoom/reflow.
- Keep interactive targets comfortably touch-sized (at least 44 CSS pixels
  where practical) and adequately separated.
- Define skeleton/loading, empty, error, and offline presentations that use
  the same spatial language but do not masquerade as valid live results.
- Do not make meaning depend only on color, motion, position, or hover.

## Executive Command Center adaptations

The desktop reference’s key relationship is the central AIOS hub connected
to business domains, framed by pipeline/opportunity evidence on the left,
customer health/risk/activity on the right, and recommendations below.
Retain that structure as the screen changes size.

| Viewport | Recommended composition |
|---|---|
| **Large desktop** | Use a generous landscape: persistent brand/navigation rail; KPI/Ask AIOS band above; connected domain archipelago centered as the visual anchor; pipeline and opportunity evidence to its left; customer health, churn, and activity to its right; recommendations spanning the lower foreground. Keep readable density and deliberate depth; do not let ambient decoration overpower labels. |
| **Standard laptop** | Keep the rail compact and the central hub visible. Let side areas use narrower, scrollable or collapsible detail regions while preserving the left-evidence/center-network/right-risk order. Move secondary metrics into a horizontally navigable KPI ribbon only if their labels and values remain fully readable. Avoid forcing the full large-desktop composition into a narrower fixed canvas. |
| **Tablet** | Recompose the navigation into a compact top or bottom control with clear active location. Keep the connected hub and its domain links as the first interactive scene. Present pipeline, customer health, activity, and recommendations as adjacent focusable layers or ordered sections that can be opened from domain selection. Ensure opening a detail does not hide the route context or selected domain. |
| **Mobile portrait** | Show a concise KPI summary and an intentionally composed, vertically bounded hub-and-domain scene. Maintain visible connections from the central AIOS node to a small set of selectable domain nodes; provide an accessible domain list/selector as an equivalent. Selecting a domain reveals its evidence in a full-width detail sheet or following section. Sequence pipeline/opportunities, customer health/risks, activity, and recommendations in an executive reading order, rather than squeezing all desktop regions beside the network. Keep navigation reachable and explicit. |
| **Narrow mobile** | Prefer a focused central hub with one relationship at a time: selected domain plus its connection to AIOS, with a next/previous or domain picker. Stack numeric KPIs and evidence without horizontal page overflow. Use short labels with wrapped secondary copy, not clipped text. Charts become labeled compact views or accessible summaries; no critical evidence is hover-only. Actions remain separated and touch-sized. |

## QBI adaptations

The QBI reference’s key relationship is a central connected intelligence
core, surrounded by business-domain signals and analytical evidence. Preserve
the core as the conceptual anchor while supporting the user’s ability to
inspect health, scenario outcomes, probability, journey evidence, insights,
and optimization.

| Viewport | Recommended composition |
|---|---|
| **Large desktop** | Keep the persistent brand/navigation rail and QBI header/KPI band. Center the connected QBI core with business-domain nodes. Place business health to the left and Monte Carlo/probability analysis to the right. Arrange customer journey, executive insights, and optimization as an ordered lower analytical layer. Keep charts and supporting captions readable at the same time as the core. |
| **Standard laptop** | Retain the QBI core with visible domain relationships and a compact KPI header. Reposition health and Monte Carlo analysis into narrower side regions or selected-detail layers. Keep probability outcomes and labels available without making all columns compete for width. Lower journey, insights, and optimization may be navigated as related sections with persistent QBI context. |
| **Tablet** | Use a compact navigation control and KPI summary. Show the core/network first, with domain nodes selectable and a clear selected state. Place health, Monte Carlo, probability, journey, insights, and optimization in ordered, reachable analysis sections or a contextual detail layer. Use tabs only when their labels make the analytical scope explicit and the content remains discoverable. |
| **Mobile portrait** | Present QBI identity and a concise outcome/KPI summary, followed by a compact but legible connected-core visualization. Allow selection via a domain list as well as spatial nodes. Reveal one analytical focus at a time—health, scenario outcomes, probability heat map, journey, insights, or optimization—with headings and persistent context tying it back to the selected domain/core. Provide summaries and legends alongside visualizations. |
| **Narrow mobile** | Prioritize the central QBI concept and key decision outcome; defer secondary analysis into clearly named, sequential sections. Replace dense chart plots with legible simplified plots or labeled values and summaries, never with unreadable miniatures. Keep controls full-width or comfortably touchable, prevent label/chart overflow, and maintain the selected domain and analysis context during navigation. |

## Shared responsive behavior

- Preserve a common route/location cue and brand identity at every size.
- Reflow by changing relationships and focus, not by only changing CSS grid
  columns or shrinking a fixed scene.
- On touch devices, use explicit selection, tap-to-open details, and an
  accessible list/selector corresponding to spatial nodes. Avoid hover-only
  descriptions and hover-dependent action controls.
- At all widths, keep text within the viewport; allow intentional wrapping;
  avoid clipped data labels, inaccessible horizontal page scrolling, and
  overlapping nodes. Use local, clearly indicated chart scrolling only when
  it improves comprehension.
- Validate at browser zoom and with keyboard/screen reader checks; a breakpoint
  declaration alone is not evidence of responsive usability.
- Use deterministic visualization inputs so server/client render and
  screenshot comparisons remain stable.

## Data-mode boundary

Spatial presentation components should receive typed display data and action
callbacks; they should not choose a data source or infer authorization from
the route, selected organization, or caller-supplied record ID.

- `/demo-platform` remains synthetic-only with local preview actions and
  visible sample/simulation labeling.
- `/app` retains its authenticated route and existing data mode. The shared
  design layer must not bypass its providers or introduce a live business
  request.
- No real business endpoint is eligible for a new visualization until its
  server-side identity, organization authorization, query scope, and
  ownership requirements are separately cleared. The current tenant-isolation
  implementation gate is not satisfied.
- These source-level constraints do not prove deployment behavior or live
  database policy.
