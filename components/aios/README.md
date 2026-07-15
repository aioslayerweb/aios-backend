# AIOS Component Library

This folder contains the reusable AIOS public design language and component system.

Primary entry point:

- `@/components/aios`

Composition layers:

- `theme/` tokens and config
- `animations/` shared Framer Motion presets
- `layout/` containers, stacks, grids, dividers
- `buttons/` button link variants
- `cards/` reusable card surfaces
- `sections/` section-level composition
- `hero/` hero layouts
- `backgrounds/` reusable light/background effects
- `navigation/` AIOS navbar and drawer
- `footer/` footer and CTA sections
- `forms/` form controls and groups
- `timeline/` timeline list and section primitives
- `architecture/` orbit and architecture visuals
- `charts/`, `modals/`, `loaders/`, `feedback/`, `icons/`, `typography/` supporting primitives

Legacy compatibility:

- `components/public-site/public-design-system.tsx` re-exports compatibility aliases from this library.
