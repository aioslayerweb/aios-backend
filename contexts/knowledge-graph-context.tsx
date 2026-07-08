"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useDecisionEngineContext } from "@/contexts/decision-engine-context"
import { useGlobalSearchContext } from "@/contexts/global-search-context"
import { useGovernanceContext } from "@/contexts/governance-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { usePlanningEngineContext } from "@/contexts/planning-engine-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"
import type {
  BusinessEntityType,
  EntityInspectorModel,
  KnowledgeGraphEdge,
  KnowledgeGraphFilters,
  KnowledgeGraphNode,
  KnowledgeGraphState,
  KnowledgeTimelineEvent,
} from "@/types"
import {
  createKnowledgeGraphDefaults,
  filterKnowledgeGraphNodes,
  searchKnowledgeGraph,
  selectEntityInspector,
  selectKnowledgeTimeline,
  visibleKnowledgeGraphEdges,
} from "@/utils/knowledge-graph"

type KnowledgeGraphContextValue = KnowledgeGraphState & {
  visibleNodes: KnowledgeGraphNode[]
  visibleEdges: KnowledgeGraphEdge[]
  selectedNode: KnowledgeGraphNode | null
  selectedInspector: EntityInspectorModel | null
  selectedTimeline: KnowledgeTimelineEvent[]
  setSelectedNodeId: (id: string) => void
  updateSearch: (query: string) => void
  updateFilters: (patch: Partial<KnowledgeGraphFilters>) => void
  clearFilters: () => void
  setLiveMode: (enabled: boolean) => void
}

const KnowledgeGraphContext = createContext<KnowledgeGraphContextValue | null>(null)

function defaultFilters(): KnowledgeGraphFilters {
  return {
    entityTypes: [],
    departments: [],
    businessUnits: [],
    statuses: [],
    priorities: [],
    owners: [],
    confidenceMin: 0,
  }
}

export function KnowledgeGraphProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createKnowledgeGraphDefaults(), [])
  const runtimeLive = useRuntimeLiveContext()
  const planning = usePlanningEngineContext()
  const decisionEngine = useDecisionEngineContext()
  const governance = useGovernanceContext()
  const workflowBuilder = useWorkflowBuilderContext()
  const globalSearch = useGlobalSearchContext()
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()

  const [nodes, setNodes] = useState(defaults.nodes)
  const [edges, setEdges] = useState(defaults.edges)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [inspectors, setInspectors] = useState(defaults.inspectors)
  const [selectedNodeId, setSelectedNodeIdState] = useState(defaults.selectedNodeId)
  const [search, setSearch] = useState(defaults.search)
  const [filters, setFilters] = useState(defaults.filters)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const lastRuntimeEventId = useRef<string | null>(null)
  const lastDecisionTitle = useRef<string | null>(null)

  useEffect(() => {
    const nextSearch = searchKnowledgeGraph(nodes, globalSearch.query)
    setSearch(nextSearch)
  }, [globalSearch.query, nodes])

  useEffect(() => {
    setNodes((previous) =>
      previous.map((node) => {
        if (node.id === "workflow-support-recovery" && workflowBuilder.selectedWorkflow) {
          return {
            ...node,
            summary: `Workflow connected to ${workflowBuilder.selectedWorkflow.name} and runtime execution context.`,
            confidence: Math.max(node.confidence, 84),
          }
        }

        if (node.id === "deal-expansion" && planning.selectedPlan) {
          return {
            ...node,
            summary: `Planning Engine selected ${planning.selectedPlan.objective} with ${planning.selectedPlan.confidence}% confidence.`,
            confidence: Math.max(node.confidence, planning.selectedPlan.confidence),
          }
        }

        return node
      })
    )
  }, [planning.selectedPlan, workflowBuilder.selectedWorkflow])

  useEffect(() => {
    const selectedDecision = decisionEngine.selectedDecision
    if (!selectedDecision || selectedDecision.title === lastDecisionTitle.current) {
      return
    }

    lastDecisionTitle.current = selectedDecision.title
    setTimeline((previous) => [
      {
        id: `timeline-decision-${Date.now()}`,
        entityId: "deal-expansion",
        timestamp: Date.now(),
        type: "connected" as const,
        title: "Decision influence updated",
        detail: `${selectedDecision.title} changed the semantic path across workflow, memory, and company nodes.`,
      },
      ...previous,
    ].slice(0, 36))
    addActivity({
      id: `activity-knowledge-graph-${Date.now()}`,
      title: "Knowledge graph updated",
      summary: selectedDecision.title,
      timestamp: Date.now(),
      category: "knowledge",
      source: { key: "knowledge", label: "Knowledge Graph", workspace: "Knowledge" },
      actor: { id: "knowledge-graph", name: "Knowledge Graph", kind: "system" },
      priority: selectedDecision.priorityBand === "critical" ? "critical" : selectedDecision.priorityBand === "high" ? "high" : "medium",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Knowledge Updated",
        workspace: "Knowledge",
        status: "running",
        relatedObjects: [{ type: "decision", id: selectedDecision.id, label: selectedDecision.title }],
        tags: ["knowledge-graph", "decision-influence"],
      },
    })
  }, [addActivity, decisionEngine.selectedDecision])

  useEffect(() => {
    const latest = runtimeLive.events[0]
    if (!latest || latest.id === lastRuntimeEventId.current) {
      return
    }

    lastRuntimeEventId.current = latest.id
    setNodes((previous) =>
      previous.map((node) =>
        node.id === "event-runtime"
          ? {
              ...node,
              summary: `Runtime Engine observed ${runtimeLive.queueDepth} queued events and ${runtimeLive.runningAgents} active agents.`,
              confidence: Math.max(80, Math.min(98, node.confidence + 1)),
            }
          : node
      )
    )
    setTimeline((previous) => [
      {
        id: `timeline-runtime-${Date.now()}`,
        entityId: "event-runtime",
        timestamp: Date.now(),
        type: "updated" as const,
        title: "Runtime event ingested",
        detail: latest.title,
      },
      ...previous,
    ].slice(0, 36))
  }, [runtimeLive.events, runtimeLive.queueDepth, runtimeLive.runningAgents])

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setNodes((previous) =>
        previous.map((node, index) => ({
          ...node,
          x: Math.max(120, Math.min(820, node.x + (index % 2 === 0 ? 3 : -3))),
          y: Math.max(50, Math.min(520, node.y + (index % 3 === 0 ? 2 : -2))),
        }))
      )
    }, 4200)

    return () => window.clearInterval(timer)
  }, [liveMode])

  useEffect(() => {
    setInspectors((previous) =>
      previous.map((inspector) =>
        inspector.entityId === "company-northwind"
          ? {
              ...inspector,
              openActions: Array.from(new Set([...inspector.openActions, governance.selectedDecision?.title ?? ""])).filter(Boolean),
            }
          : inspector
      )
    )
  }, [governance.selectedDecision])

  const visibleNodes = useMemo(() => filterKnowledgeGraphNodes(nodes, filters, search.matchedNodeIds), [filters, nodes, search.matchedNodeIds])
  const visibleNodeIds = useMemo(() => visibleNodes.map((node) => node.id), [visibleNodes])
  const visibleEdges = useMemo(() => visibleKnowledgeGraphEdges(edges, visibleNodeIds), [edges, visibleNodeIds])
  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? visibleNodes[0] ?? null, [nodes, selectedNodeId, visibleNodes])
  const selectedInspector = useMemo(() => selectEntityInspector(inspectors, selectedNode?.id ?? ""), [inspectors, selectedNode?.id])
  const selectedTimeline = useMemo(() => selectKnowledgeTimeline(timeline, selectedNode?.id ?? ""), [selectedNode?.id, timeline])

  const setSelectedNodeId = useCallback((id: string) => {
    setSelectedNodeIdState(id)
  }, [])

  const updateSearch = useCallback((query: string) => {
    setSearch(searchKnowledgeGraph(nodes, query))
  }, [nodes])

  const updateFilters = useCallback((patch: Partial<KnowledgeGraphFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters())
    setSearch((previous) => ({ ...previous, query: "", matchedNodeIds: [] }))
    addEntry({
      id: `knowledge-graph-${Date.now()}`,
      contextId: selectedNodeId,
      summary: "Knowledge graph filters reset and semantic view normalized.",
      createdAt: Date.now(),
    })
    notify({
      title: "Knowledge graph reset",
      description: "Filters and search were cleared.",
      category: "AI",
      priority: "LOW",
      level: "INFO",
      toast: true,
      autoDismissMs: 2400,
    })
  }, [addEntry, notify, selectedNodeId])

  const value = useMemo<KnowledgeGraphContextValue>(
    () => ({
      nodes,
      edges,
      timeline,
      inspectors,
      selectedNodeId: selectedNode?.id ?? selectedNodeId,
      search,
      filters,
      liveMode,
      visibleNodes,
      visibleEdges,
      selectedNode,
      selectedInspector,
      selectedTimeline,
      setSelectedNodeId,
      updateSearch,
      updateFilters,
      clearFilters,
      setLiveMode,
    }),
    [
      clearFilters,
      edges,
      filters,
      inspectors,
      liveMode,
      nodes,
      search,
      selectedInspector,
      selectedNode,
      selectedNodeId,
      selectedTimeline,
      setSelectedNodeId,
      timeline,
      updateFilters,
      updateSearch,
      visibleEdges,
      visibleNodes,
    ]
  )

  return <KnowledgeGraphContext.Provider value={value}>{children}</KnowledgeGraphContext.Provider>
}

export function useKnowledgeGraphContext() {
  const context = useContext(KnowledgeGraphContext)
  if (!context) {
    throw new Error("useKnowledgeGraphContext must be used within KnowledgeGraphProvider")
  }

  return context
}