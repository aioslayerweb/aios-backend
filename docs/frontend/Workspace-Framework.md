# AIOS Workspace Framework v1.0

Status: Official Frontend Foundation
Scope: Reusable layout and component architecture for every AIOS workspace
Applies To: Executive Center, Command Center, Agent Studio, Workflow Builder, Memory Center, Knowledge Center, Decision Center, Organization Center, Runtime Center, Developer Center, Settings

## Architecture

The AIOS Workspace Framework separates the workspace experience into composable primitives:

- `WorkspaceShell` for page padding and outer composition.
- `WorkspaceHeader` for title, breadcrumbs, actions, search, status, organization selector, and notifications.
- `WorkspaceGrid` for responsive column layouts and auto-fit card arrangements.
- `WorkspaceSidebar` and `WorkspaceRightPanel` for persistent context rails.
- `WorkspaceContent` for primary content rails.
- `WorkspaceSection` for section framing and title patterns.
- `WorkspaceCard`, `MetricCard`, `InfoCard`, and `InsightCard` for consistent cards.
- `CommandBar` and `QuickActions` for reusable action/search surfaces.
- `StatusBadge`, `HealthBadge`, and `ConfidenceBadge` for normalized enterprise state.
- `LoadingState`, `EmptyState`, and `ErrorState` for reusable system feedback.

The framework is intentionally visual-preserving. It reuses the existing AIOS color tokens, typography, spacing, radius, and elevation values.

## Folder Structure

```text
components/workspace/
  index.ts
  types.ts
  workspace-motion.ts
  workspace-framework.tsx
hooks/
  use-responsive-layout.ts
  use-page-actions.ts
  use-workspace-filters.ts
  use-command-bar.ts
```

## Component Usage

### Workspace shell

```tsx
import { WorkspaceShell, WorkspaceGrid, WorkspaceSidebar, WorkspaceRightPanel } from "@/components/workspace";

export function ExampleWorkspace() {
  return (
    <WorkspaceShell>
      <WorkspaceGrid columns={3}>
        <WorkspaceSidebar ariaLabel="Left context" />
        <main />
        <WorkspaceRightPanel ariaLabel="Right context" />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
```

### Header

`WorkspaceHeader` should be used whenever a workspace needs a consistent title row, action cluster, breadcrumb row, or search bar.

### Grid

`WorkspaceGrid` supports:

- 1 column
- 2 columns
- 3 columns
- 4 columns
- auto-fit card layouts via `autoFitMin`

Use the grid mode that best matches the approved layout. Avoid inventing new nested grids when a shared grid can express the same structure.

### Cards

Use the shared card primitives for all new workspaces:

- `WorkspaceCard`
- `MetricCard`
- `InfoCard`
- `InsightCard`

These preserve radius, elevation, spacing, and hover patterns.

## Hooks

Use the shared hooks where they reduce duplication without changing behavior:

- `useResponsiveLayout` for responsive branching.
- `usePageActions` for normalized action lists.
- `useWorkspaceFilters` for reusable filtering state.
- `useCommandBar` for command/search surfaces.

## Best Practices

- Do not duplicate shell regions inside feature modules.
- Keep visual styling token-based.
- Prefer composition over new one-off containers.
- Use the framework without changing existing page appearance.
- Extend the framework for future workspaces before building new bespoke shells.

## Refactor Guidance

When updating an existing workspace:

1. Keep the rendered UI identical.
2. Replace local page scaffolding with framework primitives.
3. Reuse `WorkspaceGrid`, `WorkspaceSection`, and card primitives first.
4. Move local search/filter/action state into reusable hooks when the pattern repeats.
5. Only add new primitives when a true workspace pattern is shared across modules.

## Notes

This framework is the common architectural layer for all AIOS workspaces. Future workspaces should be composed from these primitives rather than reimplementing layout, card, and status patterns.
