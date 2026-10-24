# Spatial Redesign: Reference Design Audit

## Scope and evidence standard

This is a source-based design assessment, not an implementation or rendering
review. The two desktop image attachments supplied with the task were opened
and inspected. The assessment compares their visible composition with the
current repository source. Source code establishes intended structure and
behavior; it does not establish that a page is deployed or renders correctly
at any viewport.

The desktop references are the visual source of truth. Responsive directions
in the companion specification are recommendations derived from those images,
not founder-approved mobile screenshots.

## Reference 1: QBI / Quantum Business Intelligence

**Identity:** QBI analytical workspace, branded “AIOS Layer” in the supplied
image.

**Visible composition and hierarchy**

- A narrow, persistent left navigation rail anchors the AIOS brand, welcome
  context, workspace links, and system/agent status.
- The top of the primary workspace identifies QBI and presents an executive
  KPI ribbon.
- A central, connected intelligence core relates revenue, customers, sales,
  risk, growth, marketing, supply chain, operations, customer success, and
  profit.
- Business health is grouped to the left of the core; Monte Carlo outcomes,
  a probability heat map, and projected financial cases sit to its right.
- A lower band presents customer-journey playback, executive AI insights, and
  a quantum optimization engine. A secondary workspace selector sits near
  the lower edge.
- The visual environment is bright white and pale blue, with atmospheric
  architectural depth, soft illumination, elevated rounded surfaces, crisp
  blue network lines, and restrained semantic accent colors.
- Information is dense but organized by relationship and hierarchy. The
  charts, journey, scores, and recommendations are not simply a repeated grid
  of interchangeable tiles.

**Interaction cues:** Domain nodes and scenario controls are reasonably
implied to be selectable; journey stages and recommendations appear to invite
inspection. The still image cannot establish actual animation, navigation,
hover, keyboard, or touch behavior.

**Responsive implication:** Keep the QBI core and its connected-domain
relationship recognizable, while repositioning supporting analysis around
or below it. Do not scale the full desktop composition into an unreadable
miniature.

## Reference 2: Executive Command Center

**Identity:** AIOS Pilot Executive Command Center.

**Visible composition and hierarchy**

- A narrow left rail anchors the brand, executive welcome, and primary
  navigation.
- A broad top strip holds five business KPIs and an Ask AIOS control.
- A central, elevated AIOS hub connects to a spatial archipelago of
  departmental/business domains, each visually distinguished while remaining
  part of one operating environment.
- The left side provides a revenue-pipeline visualization and prioritized
  opportunities. The right side groups a customer-health map, churn alerts,
  and activity. A wide recommendation band occupies the lower area.
- The light architectural environment, soft blue lighting, floating
  platforms, connected pathways, and central-to-domain reading order are
  defining cues. Color differentiates domain or risk without replacing the
  spatial relationships.
- Content is dense, but the central network and side regions establish a
  hierarchy from overall business to domain detail and action.

**Interaction cues:** Selecting a domain, opening a workspace, inspecting a
customer-risk marker, and following a recommendation are reasonably implied.
The image alone does not establish motion or behavior.

**Responsive implication:** Preserve the central AIOS-to-domain model.
Recompose side analysis into navigable layers or focused details rather than
shrinking the whole operating landscape.

## Shared visual invariants and open design questions

Shared cues across both references include bright, predominantly white and
light-blue environments; architectural depth; an explicit central business
intelligence model; connected spatial elements; readable executive
information; restrained lighting; and clear paths from observation to
decision.

The references represent distinct experiences and should not be collapsed
into one generic dashboard: the Executive Command Center is an operating
landscape; QBI is an analytical workspace. Their shared shell and visual
grammar can be consistent while their visualizations and information
hierarchy remain purpose-specific.

The supplied images use different brand wording (“AIOS Layer” and “AIOS
Pilot”). Confirm which approved logo/brand asset applies to each experience
before implementation. No mobile image was supplied; mobile behavior must be
derived from the desktop relationships and tested.

## Current frontend comparison

| Evidence | Confirmed source facts | Gap or implication |
|---|---|---|
| Entry routes: `app/app/page.tsx`, `app/demo-platform/page.tsx` | Both render `ExecutiveCommandCenter`; the demo passes `baseHref="/demo-platform"`. | The shared entry component starts in the assistant mode, not the founder’s executive spatial composition. |
| `components/executive-command-center/executive-command-center.tsx` | Provides an assistant/“Spatial Legacy” tab; `BusinessOperatingAssistantWorkspace` is the initial mode and `ExecutiveCommandCenterLegacy` is the alternate. | A mode switch and legacy fallback do not yet establish the reference as the primary experience. |
| `components/executive-command-center/executive-command-center-legacy.tsx` | Contains a KPI strip, workspace links, a connected city mesh, pointer tilt, node selection, and recommendations. | It has useful interaction prototypes, but the visible source layout and content differ from the reference. It does not contain the reference’s pipeline, customer-health, churn, and activity arrangement as a coherent composition. |
| `app/demo-platform/executive/page.tsx` and `components/demo/executive-dashboard.tsx` | A separate executive dashboard exists with a spatial plane, connected nodes, side content, and recommendation/activity areas. | This duplicates the spatial executive experience. It uses randomly generated scatter-dot positions at module initialization, and its map uses fixed stage heights/absolute node placement that require viewport validation. |
| `app/app/qbi/page.tsx`, `app/demo-platform/qbi/page.tsx`, `components/platform-next/next-gen-workspace.tsx` | Both QBI routes use `NextGenWorkspace`; QBI widgets are supplied by `components/platform-next/domain-widgets.tsx`. | The shared template is organized as header, KPI strip, domain widgets, controls, and a data-fabric section; that is not the QBI reference’s core-and-analysis composition. |
| `components/workspace/workspace-framework.tsx` and `components/layout/foundation/` | Reusable shell, section, content, sidebar, card, and responsive-container primitives exist. | These are useful infrastructure, but many are conventional panel/grid primitives. Reuse should be selective so they do not define the spatial experience as a generic card grid. |
| `styles/tokens.css`, `styles/foundation.css`, `theme/tokens.ts`, `tailwind.config.ts` | Shared brand, surface, spacing, shadow, z-index, motion, breakpoints, and responsive utility foundations exist. Reduced-motion CSS is present. | Current tokens do not by themselves specify the reference’s architecture, spatial depth, visualization relationships, or mobile re-composition. |
| Demo data and providers | `app/demo-platform/layout.tsx` passes `liveDataEnabled={false}`; `app/app/layout.tsx` passes `liveDataEnabled`. Runtime/business-metric loaders and Supabase client initialization are gated by that setting. `app/demo-platform/insights/page.tsx` uses synthetic fixtures. | These are source-level boundaries, not proof of deployed isolation. The shared `NextGenWorkspace` shows the “Live Intelligence” label while using local seed data; copy and mode labeling need correction before a demo redesign. |
| SaaS insights | `app/app/insights/page.tsx` queries `insights` directly using `.select("*")`; no organization filter is visible in this query. | Do not connect a redesigned component to this query or another live business endpoint until authorization and tenant-scoping requirements are separately reviewed. The source query alone does not prove production exposure. |

## Confirmed gaps

1. The founder’s executive spatial experience is not the default home view.
2. Two executive spatial implementations exist, alongside the assistant view;
   the intended canonical implementation is not established.
3. The QBI route reuses a general domain template rather than expressing the
   supplied QBI composition.
4. Some shared demo content is static seed data but is labeled “Live
   Intelligence”; simulated/sample semantics are not consistent across every
   shared component.
5. Desktop breakpoint classes and some mobile-specific markup exist, but
   source inspection cannot confirm composition quality or usability at
   laptop, tablet, or mobile sizes.
6. Reduced-motion support is not consistently visible in the executive
   spatial prototypes.
7. The randomly generated scatter data in the separate demo executive view
   is not deterministic.
8. The ownership/tenant isolation implementation gate remains unsatisfied;
   no visual redesign should imply that current SaaS business routes are
   safely organization-scoped.

## Unknowns

- Rendering quality, interaction behavior, and performance at real viewport
  sizes and devices.
- Which supplied brand mark/name is authoritative for each section.
- Whether the current frontend routes are deployed or connected to production.
- Whether deployed policies or runtime services permit or deny the source
  query paths.
- Exact animation, keyboard, screen-reader, and touch behavior of the
  reference designs, which are static images.

## Evidence reviewed

The QBI and Executive Command Center PNG attachments supplied with this task;
`app/app/page.tsx`; `app/demo-platform/page.tsx`;
`app/demo-platform/executive/page.tsx`; both QBI route files;
`components/executive-command-center/`;
`components/demo/executive-dashboard.tsx`;
`components/platform-next/`;
`components/workspace/`;
`components/layout/foundation/`;
`styles/tokens.css`; `styles/foundation.css`;
`theme/tokens.ts`; `tailwind.config.ts`;
demo and SaaS layouts/providers; demo isolation tests and
`docs/security/stage-3b-8-c/tenant-isolation-implementation-gate.md`.
