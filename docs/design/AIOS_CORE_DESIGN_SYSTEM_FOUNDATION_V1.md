# AIOS Core Design System Foundation V1

Status: Foundational cross-surface UI contract
Owner: Frontend architecture
Scope: Public website, authenticated platform, and future AIOS applications

## Objective

AIOS now has a core design-system foundation that both the public website and the authenticated platform can inherit.

Primary implementation layers:

- `src/components/aios/` as the scalable source-facing architecture
- `components/aios/` as the implementation library and compatibility layer
- `styles/tokens.css` as the shared CSS token bridge for platform and public surfaces

## Architecture

Design system chain:

- AIOS Theme
- Design Tokens
- Primitive Components
- Layout Components
- Business Components
- Pages

## Source Of Truth

Primary TypeScript entry points:

- [src/components/aios/index.ts](/workspaces/aios-backend/src/components/aios/index.ts)
- [components/aios/index.ts](/workspaces/aios-backend/components/aios/index.ts)

Token sources:

- [components/aios/theme/tokens.ts](/workspaces/aios-backend/components/aios/theme/tokens.ts)
- [styles/tokens.css](/workspaces/aios-backend/styles/tokens.css)

Theme provider path:

- [src/components/aios/providers/theme-provider.tsx](/workspaces/aios-backend/src/components/aios/providers/theme-provider.tsx)
- [contexts/theme-context.tsx](/workspaces/aios-backend/contexts/theme-context.tsx)

## Folder Structure

Core architecture now exists under `src/components/aios/`:

- `theme/`
- `ui/`
- `layout/`
- `navigation/`
- `cards/`
- `buttons/`
- `forms/`
- `typography/`
- `animations/`
- `backgrounds/`
- `feedback/`
- `charts/`
- `diagrams/`
- `sections/`
- `business/`
- `intelligence/`
- `workflow/`
- `memory/`
- `knowledge/`
- `organization/`
- `operators/`
- `executive/`
- `runtime/`
- `integrations/`
- `shared/`
- `hooks/`
- `utils/`
- `providers/`

## Token Strategy

The CSS foundation now exposes centralized AIOS token namespaces that bridge both the older platform variables and the public website variables.

Key families:

- `--aios-platform-*`
- `--aios-public-*`
- `--aios-semantic-*`
- `--aios-space-*`
- `--aios-radius-*`
- `--aios-shadow-*`
- `--aios-z-*`

Rules:

- Platform variables (`--color-*`) are derived from AIOS token aliases.
- Public variables (`--public-*`) are derived from AIOS token aliases.
- New work should attach to AIOS token families first, then expose compatibility variables only when needed.

## Theme Provider

The global theme provider now applies both:

- `data-theme`
- `data-aios-theme`

and keeps `color-scheme` synchronized.

This preserves the current app behavior while creating a future-safe hook for AIOS-wide theming extensions.

## Shared Primitives

Implemented AIOS primitives include:

- layout: `AIOSPage`, `AIOSPageShell`, `AIOSContainer`, `AIOSSection`, `AIOSGrid`, `AIOSStack`, `AIOSSpacer`, `AIOSDivider`
- typography: `AIOSDisplayXL`, `AIOSDisplay`, `AIOSH1`, `AIOSH2`, `AIOSH3`, `AIOSH4`, `AIOSBodyLarge`, `AIOSBody`, `AIOSSmall`, `AIOSCaption`
- buttons: `AIOSButtonLink`, `AIOSPrimaryButton`, `AIOSSecondaryButton`, `AIOSOutlineButton`, `AIOSGhostButton`, `AIOSIconButton`
- cards: `AIOSCard`, `AIOSFeatureCard`, `AIOSModuleCard`, `AIOSProductCard`, `AIOSGlassCard`, `AIOSFloatingCard`, `AIOSStatCard`, `AIOSInsightCard`, `AIOSArticleCard`, `AIOSPricingCard`, `AIOSTeamCard`
- forms: `AIOSFormGroup`, `AIOSInput`, `AIOSTextArea`, `AIOSSelect`, `AIOSCheckbox`, `AIOSRadio`
- feedback: `AIOSBadge`
- navigation: `AIOSNavbar`
- footer: `AIOSFooter`, `AIOSCTASection`
- hero/sections: `AIOSHero`, `AIOSHeroSplit`, `AIOSHeroCentered`, `AIOSFeatureGrid`, `AIOSSectionHeader`, `AIOSFeatureSection`, `AIOSStatsSection`, `AIOSTimelineSection`, `AIOSComparisonSection`
- backgrounds: `AIOSMeshGradient`, `AIOSLightBackground`, `AIOSFloatingParticles`, `AIOSBlurLayer`, `AIOSGridBackground`, `AIOSNoiseTexture`
- diagrams: `AIOSArchitectureOrbit`

## Platform Inheritance

Public routes are already powered by the AIOS library.

The authenticated platform now inherits the core system through:

- global token bridging in [styles/tokens.css](/workspaces/aios-backend/styles/tokens.css)
- the global theme provider in [providers/app-providers.tsx](/workspaces/aios-backend/providers/app-providers.tsx)
- workspace shell typography adoption in [components/layout/foundation/application-layout.tsx](/workspaces/aios-backend/components/layout/foundation/application-layout.tsx)

This milestone focuses on the foundation and shared shell layer so future dashboard modules can converge on the same system incrementally without breaking existing platform structure.

## Usage Rules

- New cross-surface work should import from `@/src/components/aios` or `@/components/aios`.
- Do not add new one-off tokens directly into route files.
- Do not create a second public-only or platform-only design system.
- Prefer extending the AIOS library or adding scoped business components under the domain folders.

## Responsive Rules

- Use AIOS containers and AIOS sections for width and rhythm.
- Prefer adaptive grids over hardcoded per-page layout math.
- Respect reduced motion in animated components.

## Accessibility Rules

- Use visible focus states.
- Keep icon-only controls labeled.
- Support keyboard navigation for drawers, tabs, and navigation.
- Maintain WCAG AA contrast.

## Contribution Guidelines

- Add primitives to `components/aios/` implementation first.
- Mirror scalable source-facing exports through `src/components/aios/`.
- Use compatibility aliases only when migrating older code.
- Keep the AIOS token namespace authoritative for new shared values.

## Migration Direction

Next platform-facing migrations should target:

- dashboard shell buttons and cards
- executive, memory, knowledge, workflow, and runtime feature surfaces
- shared charts, diagrams, and business cards

The goal is progressive convergence rather than disruptive redesign.