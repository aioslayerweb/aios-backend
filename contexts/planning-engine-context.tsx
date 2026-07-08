"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useOrchestratorContext } from "@/contexts/orchestrator-context"
import { usePromptOSContext } from "@/contexts/prompt-os-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import type {
  PlanningDecisionNode,
  PlanningEngineState,
  PlanningGoal,
  PlanningPlan,
  PlanningPriorityCard,
  PlanningSimulation,
  PlanningTimelineEvent,
} from "@/types"
import {
  advancePlanningTimeline,
  buildPlanningSummary,
  createPlanningEngineDefaults,
  cyclePlanningRoadmap,
  filterExecutionPlans,
  filterPlanningGoals,
  movePriorityFocus,
} from "@/utils/planning-engine"

type PlanningEngineContextValue = PlanningEngineState & {
  selectedGoal: PlanningGoal | null
  selectedPlan: PlanningPlan | null
  selectedDecision: PlanningDecisionNode | null
  selectedSimulation: PlanningSimulation | null
  filteredGoals: PlanningGoal[]
  filteredPlans: PlanningPlan[]
  summary: string
  setSelectedGoalId: (id: string) => void
  setSelectedPlanId: (id: string) => void
  setSelectedDecisionId: (id: string) => void
  setSelectedSimulationId: (id: string) => void
  updateQuery: (query: string) => void
  setLiveMode: (enabled: boolean) => void
  runSimulation: (simulationId: string) => void
  recalculatePlans: () => void
}

const PlanningEngineContext = createContext<PlanningEngineContextValue | null>(null)

export function PlanningEngineProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createPlanningEngineDefaults(), [])
  const runtimeLive = useRuntimeLiveContext()
  const runtimeStatus = useRuntimeStatusContext()
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()
  const orchestrator = useOrchestratorContext()
  const prompt = usePromptOSContext()

  const [goals, setGoals] = useState(defaults.goals)
  const [plans, setPlans] = useState(defaults.plans)
  const [roadmap, setRoadmap] = useState(defaults.roadmap)
  const [decisionTree, setDecisionTree] = useState(defaults.decisionTree)
  const [dependencies] = useState(defaults.dependencies)
  const [priorityMatrix, setPriorityMatrix] = useState(defaults.priorityMatrix)
  const [suggestedActions] = useState(defaults.suggestedActions)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [simulation, setSimulation] = useState(defaults.simulation)
  const [selectedGoalId, setSelectedGoalId] = useState(defaults.selectedGoalId)
  const [selectedPlanId, setSelectedPlanId] = useState(defaults.selectedPlanId)
  const [selectedDecisionId, setSelectedDecisionId] = useState(defaults.selectedDecisionId)
  const [selectedSimulationId, setSelectedSimulationId] = useState(defaults.selectedSimulationId)
  const [query, setQuery] = useState(defaults.query)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setTimeline((previous) => advancePlanningTimeline(previous))
      setRoadmap((previous) => cyclePlanningRoadmap(previous))
      setPriorityMatrix((previous) => movePriorityFocus(previous, previous[0]?.title ?? ""))
      setPlans((previous) =>
        previous.map((plan, index) => ({
          ...plan,
          progress: Math.min(100, plan.progress + (plan.status === "executing" ? 4 : index === 0 ? 1 : 0)),
          confidence: Math.min(99, plan.confidence + (index % 2 === 0 ? 1 : 0)),
        }))
      )
    }, 3200)

    return () => window.clearInterval(timer)
  }, [liveMode])

  useEffect(() => {
    const summary = buildPlanningSummary(goals, plans)
    runtimeStatus.updateModuleStatus("automation", {
      status: "active",
      label: "Planning",
      description: summary,
    })
    runtimeStatus.updateModuleStatus("search", {
      status: "active",
      label: "Planning",
      description: "Planning engine is continuously evaluating cross-system signals.",
    })
  }, [goals, plans, runtimeStatus])

  useEffect(() => {
    const latestOrchestrator = orchestrator.messages[0]
    if (latestOrchestrator) {
      const nextEvent: PlanningTimelineEvent = {
        id: `timeline-orchestrator-${Date.now()}`,
        label: "Agent assigned",
        type: "agent-assigned",
        timestamp: Date.now(),
        description: `Orchestrator update: ${latestOrchestrator.message}`,
      }

      setTimeline((previous) => [
        nextEvent,
        ...previous,
      ].slice(0, 24))
    }
  }, [orchestrator.messages])

  useEffect(() => {
    if (!runtimeLive.events.length) {
      return
    }

    const latest = runtimeLive.events[0]
    if (latest.kind === "decision-made") {
      setDecisionTree((previous) =>
        previous.map((node) =>
          node.id === selectedDecisionId ? { ...node, summary: latest.summary, probability: Math.max(60, node.probability - 1) } : node
        )
      )
    }
  }, [runtimeLive.events, selectedDecisionId])

  const selectedGoal = useMemo(() => goals.find((goal) => goal.id === selectedGoalId) ?? null, [goals, selectedGoalId])
  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId) ?? null, [plans, selectedPlanId])
  const selectedDecision = useMemo(() => decisionTree.find((item) => item.id === selectedDecisionId) ?? null, [decisionTree, selectedDecisionId])
  const selectedSimulation = useMemo(() => simulation.find((item) => item.id === selectedSimulationId) ?? null, [selectedSimulationId, simulation])

  const filteredGoals = useMemo(() => filterPlanningGoals(goals, query), [goals, query])
  const filteredPlans = useMemo(() => filterExecutionPlans(plans, query), [plans, query])
  const summary = useMemo(() => buildPlanningSummary(goals, plans), [goals, plans])

  const recalculatePlans = useCallback(() => {
    const topGoal = goals[0]
    setPlans((previous) =>
      previous.map((plan, index) => ({
        ...plan,
        status: index === 0 ? "executing" : plan.status === "completed" ? "learning" : plan.status,
        progress: index === 0 ? Math.min(100, plan.progress + 8) : plan.progress,
        confidence: topGoal ? Math.min(99, plan.confidence + Math.round(topGoal.confidence / 100)) : plan.confidence,
      }))
    )
    setGoals((previous) =>
      previous.map((goal, index) => ({
        ...goal,
        progress: Math.min(100, goal.progress + (index === 0 ? 2 : 1)),
        confidence: Math.min(99, goal.confidence + (index % 2 === 0 ? 1 : 0)),
      }))
    )
    addActivity({
      id: `activity-planning-${Date.now()}`,
      title: "Planning engine recalculated",
      summary: summary,
      timestamp: Date.now(),
      category: "ai-runtime",
      source: { key: "ai-runtime", label: "Planning Engine", workspace: "Planning" },
      actor: { id: "planning-engine", name: "Planning Engine", kind: "ai" },
      priority: "high",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "AI Decision",
        workspace: "Planning",
        status: "running",
        relatedObjects: [{ type: "goal", id: topGoal?.id ?? "goal", label: topGoal?.title ?? "Strategic Goals" }],
        tags: ["planning", "strategy"],
      },
    })
  }, [addActivity, goals, summary])

  const runSimulation = useCallback(
    (simulationId: string) => {
      const item = simulation.find((entry) => entry.id === simulationId)
      if (!item) {
        return
      }

      setSelectedSimulationId(item.id)
      addEntry({
        id: `planning-simulation-${Date.now()}`,
        contextId: "autonomous-planning-engine",
        summary: `Simulation ran: ${item.title} -> ${item.estimatedImpact}`,
        createdAt: Date.now(),
      })
      setTimeline((previous) => [
        {
          id: `timeline-simulation-${Date.now()}`,
          label: "Plan simulation executed",
          type: "plan-updated",
          timestamp: Date.now(),
          description: item.scenario,
        } as PlanningTimelineEvent,
        ...previous,
      ].slice(0, 24))
      notify({
        title: "Planning simulation complete",
        description: item.estimatedImpact,
        category: "AI",
        priority: "MEDIUM",
        level: "INFO",
        toast: true,
        autoDismissMs: 4000,
      })
    },
    [addEntry, notify, simulation]
  )

  useEffect(() => {
    if (!prompt.prompt) {
      return
    }

    const nextEvent: PlanningTimelineEvent = {
      id: `timeline-prompt-${Date.now()}`,
      label: "Plan adjusted from Prompt OS",
      type: "plan-updated",
      timestamp: Date.now(),
      description: prompt.prompt.slice(0, 80),
    }

    setTimeline((previous) => [
      nextEvent,
      ...previous,
    ].slice(0, 24))
  }, [prompt.prompt])

  useEffect(() => {
    if (!runtimeLive.queueDepth) {
      return
    }

    setPriorityMatrix((previous) =>
      previous.map((card) =>
        card.title.includes("High Impact") ? { ...card, description: "Queue depth is elevating this quadrant." } : card
      )
    )
  }, [runtimeLive.queueDepth])

  useEffect(() => {
    if (!selectedPlan) {
      return
    }

    addActivity({
      id: `activity-plan-${Date.now()}`,
      title: "Plan inspection updated",
      summary: selectedPlan.objective,
      timestamp: Date.now(),
      category: "agents",
      source: { key: "agents", label: "Planning Engine", workspace: "Planning" },
      actor: { id: "planner-engine", name: "Planning Engine", kind: "system" },
      priority: selectedPlan.progress > 80 ? "high" : "medium",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Automation Executed",
        workspace: "Planning",
        status: selectedPlan.status === "completed" ? "completed" : "running",
        relatedObjects: [{ type: "plan", id: selectedPlan.id, label: selectedPlan.objective }],
        tags: [selectedPlan.status, "planning"],
      },
    })
  }, [addActivity, selectedPlan])

  const value = useMemo<PlanningEngineContextValue>(
    () => ({
      goals,
      plans,
      roadmap,
      decisionTree,
      dependencies,
      priorityMatrix,
      suggestedActions,
      timeline,
      simulation,
      selectedGoalId,
      selectedPlanId,
      selectedDecisionId,
      selectedSimulationId,
      query,
      liveMode,
      selectedGoal,
      selectedPlan,
      selectedDecision,
      selectedSimulation,
      filteredGoals,
      filteredPlans,
      summary,
      setSelectedGoalId,
      setSelectedPlanId,
      setSelectedDecisionId,
      setSelectedSimulationId,
      updateQuery: setQuery,
      setLiveMode,
      runSimulation,
      recalculatePlans,
    }),
    [
      dependencies,
      decisionTree,
      filteredGoals,
      filteredPlans,
      goals,
      liveMode,
      plans,
      priorityMatrix,
      query,
      roadmap,
      runSimulation,
      selectedDecision,
      selectedDecisionId,
      selectedGoal,
      selectedGoalId,
      selectedPlan,
      selectedPlanId,
      selectedSimulation,
      selectedSimulationId,
      simulation,
      summary,
      suggestedActions,
      timeline,
      recalculatePlans,
    ]
  )

  return <PlanningEngineContext.Provider value={value}>{children}</PlanningEngineContext.Provider>
}

export function usePlanningEngineContext(): PlanningEngineContextValue {
  const context = useContext(PlanningEngineContext)
  if (!context) {
    throw new Error("usePlanningEngineContext must be used within PlanningEngineProvider")
  }

  return context
}
