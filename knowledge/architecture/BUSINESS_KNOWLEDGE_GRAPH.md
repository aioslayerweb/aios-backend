# Business Knowledge Graph

## Purpose

The AIOS Business Knowledge Graph is the semantic brain of AIOS.

It models how companies, contacts, employees, departments, projects, tasks, meetings, emails, tickets, deals, products, services, documents, agents, workflows, memory nodes, events, systems, policies, goals, and KPIs relate to each other.

This is not a database viewer and not a CRM replacement. It is a relationship-aware context system for AI reasoning and executive understanding.

## Architecture

The graph is implemented as the authenticated knowledge workspace module at `/app/knowledge`.

Primary frontend areas:

- `components/knowledge-graph/`
- `components/entity-viewer/`
- `components/relationship-panel/`
- `components/graph-toolbar/`
- `components/entity-inspector/`
- `components/knowledge-search/`
- `components/graph-filters/`
- `contexts/knowledge-graph-context.tsx`
- `hooks/use-knowledge-graph.ts` and related graph selectors
- `types/knowledge-graph.ts`
- `utils/knowledge-graph.ts`

## Integrated AIOS Systems

The Business Knowledge Graph is connected to:

- Runtime Engine
- Event Processor
- Replay Engine
- Persistent Memory
- Supabase
- Planning Engine
- Decision Engine
- Governance Center
- Workflow Builder
- Executive Intelligence Center

## Interaction Model

The current graph layer supports architecture for:

- interactive graph visualization
- zoom and pan ready canvas model
- graph search
- entity and relationship filtering
- path and dependency highlighting
- node inspection
- timeline inspection
- memory and workflow linking

Mock data is used where production graph services do not yet exist. The state model is designed to evolve toward vector search, semantic retrieval, graph AI reasoning, RAG, embeddings, Neo4j-compatible models, and enterprise ontologies without major rewrites.

## Status

Implemented in the app shell with mock graph entities, relationships, and semantic inspectors.