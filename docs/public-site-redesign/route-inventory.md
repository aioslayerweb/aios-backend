# Public-site redesign: route inventory and execution sequence

## Route inventory

### Marketing and product information

- `/` — home and product positioning.
- `/universe` — product story/visual explainer.
- `/platform` — operating-model overview.
- `/architecture` — technical architecture.
- `/modules` — module directory.
- `/products` — product and pilot information.
- `/resources` — resource index.
- `/about` — company/product story.
- `/contact` — conversion page.

### Trust, legal, and pilot conversion

- `/security`
- `/privacy`
- `/terms`
- `/legal`
- `/pilot`
- `/pilot/discovery`

### Public product demonstration

- `/demo-platform` and its nested pages are a separately routed synthetic product demo. It should remain clearly labeled as a demo, must not touch live business data, and should be visually consistent without being replaced by static marketing mockups.
- Demo route families discovered: activity, agents, API keys, audit, blueprint, commands, corporate, customer intelligence, decisions, developer center, executive, finance intelligence, governance, HR, insights, integrations, intelligence, knowledge, MCP (including gateway, health, prompts, registry, resources, tools), memory, operations, orchestrator, organizations, permissions, planning, Prompt OS, QBI, reports, roles, runtime center, sales intelligence, security, settings, teams, users, and workflows.

### App, authentication, and utility routes

- `/app` and nested routes are authenticated product experiences and remain out of redesign scope.
- `/login`, `/unauthorized`, `/offline`, `/settings`, `/activity`, and `/agents` are utility or product routes, not marketing pages; verify their ownership and indexing separately before any visual changes.
- API routes under `/api` are not public content pages.

## Execution sequence

1. Establish a central public visual system, navigation, footer, reduced-motion behavior, accurate shared hero treatment, and route-specific metadata while preserving app/demo boundaries.
2. Redesign the homepage around business signals, memory, role prioritization, explainable recommendations, and governed execution.
3. Refactor the platform, architecture, modules, products, and solutions pages with factual copy and distinct spatial layouts.
4. Improve resources, about, contact, pilot, and legal/trust content without fabricating proof or changing substantive legal terms.
5. Validate sitemap, robots, canonical/social metadata, structured data, links, accessibility, and responsive behavior across public routes.
6. Run focused checks and a production build; report all remaining content, integration, and evidence gaps.

## Discovery constraints

- The existing public pages contain unsupported performance figures, customer quotes, and logo placeholders. Remove them from rendered marketing content unless they can be verified.
- The contact page contains a form with no repository-backed submission endpoint. Do not present a successful contact submission until an approved destination exists.
- The repository has an existing AIOS palette and shared public component system. Reuse those foundations and do not alter authenticated `/app` behavior.
- The public demo has a separate synthetic-data boundary and is not evidence of production security or data isolation.
