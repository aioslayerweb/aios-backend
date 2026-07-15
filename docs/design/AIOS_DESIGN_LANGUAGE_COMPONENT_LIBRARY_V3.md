# AIOS Design Language & Component Library V3

Status: Official public web component foundation
Owner: Frontend architecture and design systems
Scope: AIOS public website today, dashboard and authenticated platform alignment next

## Purpose

This document defines the reusable AIOS public component library introduced in M9.3.5.

It turns the marketing site into a composed system rather than a set of page-specific implementations.

Primary code entry point:

- `@/components/aios`

Legacy compatibility entry point:

- `@/components/public-site/public-design-system`

## Design Language

AIOS public surfaces must feel like one operating system.

Shared principles:

- calm spatial composition
- large whitespace
- premium enterprise depth
- rounded surfaces
- subtle glass only where needed
- restrained motion with purpose
- one consistent spacing rhythm
- one consistent hierarchy model

## Source Of Truth

Theme and config:

- [components/aios/theme/tokens.ts](/workspaces/aios-backend/components/aios/theme/tokens.ts)

Global CSS tokens and surface classes:

- [styles/tokens.css](/workspaces/aios-backend/styles/tokens.css)
- [styles/foundation.css](/workspaces/aios-backend/styles/foundation.css)

## Folder Structure

- `components/aios/theme/`
- `components/aios/animations/`
- `components/aios/layout/`
- `components/aios/navigation/`
- `components/aios/cards/`
- `components/aios/buttons/`
- `components/aios/sections/`
- `components/aios/hero/`
- `components/aios/backgrounds/`
- `components/aios/typography/`
- `components/aios/forms/`
- `components/aios/charts/`
- `components/aios/timeline/`
- `components/aios/architecture/`
- `components/aios/footer/`
- `components/aios/icons/`
- `components/aios/modals/`
- `components/aios/loaders/`
- `components/aios/feedback/`

## Tokens

Color families:

- `primary`, `primaryHover`, `primaryActive`
- `navy`
- `background`, `backgroundSecondary`
- `surface`, `surfaceGlass`
- `border`, `borderStrong`
- `text`, `textMuted`, `textSoft`
- `success`, `warning`, `danger`, `neutral`

Spacing scale:

- `4`, `8`, `12`, `16`, `24`, `32`, `40`, `48`, `64`, `80`, `96`, `128`

Radius:

- `sm`, `md`, `lg`, `xl`, `pill`

Motion:

- hover: `0.2s`
- state: `0.3s`
- enter: `0.6s`
- exit: `0.45s`
- easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`

Icons:

- `16`, `20`, `24`, `32`, `40`

Containers:

- default: `1200px`
- large: `1340px`

## Typography

Components:

- `AIOSDisplayXL`
- `AIOSDisplay`
- `AIOSH1`
- `AIOSH2`
- `AIOSH3`
- `AIOSH4`
- `AIOSBodyLarge`
- `AIOSBody`
- `AIOSSmall`
- `AIOSCaption`

Rules:

- use fluid heading sizes only
- keep uppercase eyebrow labels short
- body copy should stay readable and calm
- never introduce custom one-off heading scales on public pages

## Layout Primitives

Components:

- `AIOSPage`
- `AIOSPageShell`
- `AIOSContainer`
- `AIOSSection`
- `AIOSGrid`
- `AIOSStack`
- `AIOSSpacer`
- `AIOSDivider`

Usage guidance:

- `AIOSPageShell` is the default page wrapper for public routes
- `AIOSContainer` controls width; do not hardcode page max widths
- `AIOSSection` controls vertical rhythm; avoid custom section padding unless there is a strong reason

## Navigation

Primary component:

- `AIOSNavbar`

Capabilities:

- sticky header
- blurred background
- active underline
- mobile drawer
- accessible close behavior
- shared nav item config from theme tokens

## Buttons

Components:

- `AIOSButtonLink`
- `AIOSPrimaryButton`
- `AIOSSecondaryButton`
- `AIOSOutlineButton`
- `AIOSGhostButton`
- `AIOSIconButton`

Rules:

- one primary action per action group when possible
- use secondary for supportive actions
- use outline or ghost for lower-emphasis actions
- keep icon-only buttons labeled with `aria-label`

## Cards

Components:

- `AIOSCard`
- `AIOSFeatureCard`
- `AIOSModuleCard`
- `AIOSProductCard`
- `AIOSGlassCard`
- `AIOSFloatingCard`
- `AIOSStatCard`
- `AIOSInsightCard`
- `AIOSArticleCard`
- `AIOSPricingCard`
- `AIOSTeamCard`

Shared behavior:

- same border logic
- same elevation language
- same hover lift behavior
- same radius family

## Sections

Components:

- `AIOSHero`
- `AIOSHeroSplit`
- `AIOSHeroCentered`
- `AIOSSectionHeader`
- `AIOSFeatureGrid`
- `AIOSFeatureSection`
- `AIOSCTASection`
- `AIOSTimelineSection`
- `AIOSComparisonSection`
- `AIOSStatsSection`
- `AIOSArchitectureSection`

## Forms

Components:

- `AIOSFormGroup`
- `AIOSInput`
- `AIOSTextArea`
- `AIOSSelect`
- `AIOSCheckbox`
- `AIOSRadio`

Requirements:

- preserve visible labels
- preserve focus rings
- surface errors and hints consistently
- keep controls minimum 44px tall where appropriate

## Background System

Components:

- `AIOSMeshGradient`
- `AIOSLightBackground`
- `AIOSFloatingParticles`
- `AIOSBlurLayer`
- `AIOSGridBackground`
- `AIOSNoiseTexture`

Rules:

- backgrounds must support content, not compete with it
- animation should remain subtle
- reduced motion must be respected

## Motion System

Primary motion source:

- `aiosMotion` from [components/aios/animations/index.ts](/workspaces/aios-backend/components/aios/animations/index.ts)

Supported presets:

- `fade`
- `fadeUp`
- `fadeDown`
- `blurReveal`
- `scale`
- `float`
- `cardLift`
- `hoverGlow`
- `drawer`
- `staggerChildren`
- `sectionReveal`
- `navigationReveal`
- `pageTransition`

## Page Usage

Current public routes now compose from the AIOS library:

- [components/public-site/public-home-page.tsx](/workspaces/aios-backend/components/public-site/public-home-page.tsx)
- [app/universe/universe-page-client.tsx](/workspaces/aios-backend/app/universe/universe-page-client.tsx)
- [app/platform/page.tsx](/workspaces/aios-backend/app/platform/page.tsx)
- [app/architecture/page.tsx](/workspaces/aios-backend/app/architecture/page.tsx)
- [app/modules/page.tsx](/workspaces/aios-backend/app/modules/page.tsx)
- [app/products/page.tsx](/workspaces/aios-backend/app/products/page.tsx)
- [app/resources/page.tsx](/workspaces/aios-backend/app/resources/page.tsx)
- [app/about/page.tsx](/workspaces/aios-backend/app/about/page.tsx)
- [app/contact/page.tsx](/workspaces/aios-backend/app/contact/page.tsx)
- [app/legal/page.tsx](/workspaces/aios-backend/app/legal/page.tsx)

## Naming Conventions

Rules:

- public reusable components use the `AIOS*` prefix
- layout and section primitives stay generic and composable
- page-specific content belongs in route files, not library files
- temporary compatibility exports may keep `Public*` names, but new code should import from `@/components/aios`

## Usage Example

```tsx
import {
  AIOSPageShell,
  AIOSHero,
  AIOSPrimaryButton,
  AIOSSection,
  AIOSContainer,
  AIOSSectionHeader,
  AIOSFeatureGrid,
} from "@/components/aios"
```

## Do

- compose pages from library primitives
- reuse section wrappers before creating new layout markup
- keep tokens centralized
- respect reduced motion and accessibility defaults

## Don’t

- hardcode brand values in route files
- create page-only button styles
- duplicate nav, footer, or hero logic in route modules
- introduce one-off spacing systems

## Migration Notes

- `components/public-site/public-design-system.tsx` now re-exports from the AIOS component library
- existing pages have been repointed to `@/components/aios`
- future dashboard convergence can reuse the same component families incrementally
