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
import { DecisionStatus } from "@/src/domain/common/enums"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useExecutiveWorkspaceContext } from "@/contexts/executive-workspace-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useOrchestratorContext } from "@/contexts/orchestrator-context"
import { usePlanningEngineContext } from "@/contexts/planning-engine-context"
import { usePromptOSContext } from "@/contexts/prompt-os-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import type {
  ActivityStatus,
  BusinessSignal,
  ConfidenceAnalysis,
  DecisionEngineState,
  DecisionOutcome,
  DecisionPriorityScore,
  DecisionQueueItem,
  DecisionReasoning,
  DecisionTimelineEntry,
  RecommendedAction,
} from "@/types"
import {
  confidenceLevel,
  createDecisionEngineDefaults,
  decisionSummary,
  filterDecisionQueue,
  priorityBand,
  selectDecisionActions,
  selectDecisionSignals,
} from "@/utils/decision-engine"

type DecisionEngineContextValue = DecisionEngineState & {
  filteredQueue: DecisionQueueItem[]
  selectedDecision: DecisionQueueItem | null
  selectedSignals: BusinessSignal[]
  selectedScore: DecisionPriorityScore | null
  selectedReasoning: DecisionReasoning | null
  selectedActions: RecommendedAction[]
  selectedConfidence: ConfidenceAnalysis | null
  selectedOutcomes: DecisionOutcome[]
  summary: string
  setSelectedDecisionId: (id: string) => void
  updateQuery: (query: string) => void
  setLiveMode: (enabled: boolean) => void
  approveAction: (actionId: string) => void
  rejectAction: (actionId: string) => void
  executeAction: (actionId: string) => void
}

const DecisionEngineContext = createContext<DecisionEngineContextValue | null>(null)

function timelineEvent(decisionId: string, label: DecisionTimelineEntry["label"], type: DecisionTimelineEntry["type"], description: string): DecisionTimelineEntry {
  return {
    id: `decision-timeline-${Date.now()}-${Math.round(Math.random() * 999)}`,
    decisionId,
    label,
    type,
    timestamp: Date.now(),
    description,
  }
}

function updateQueue(queue: DecisionQueueItem[], decisionId: string, updater: (item: DecisionQueueItem) => DecisionQueueItem) {
  return queue.map((item) => (item.id === decisionId ? updater(item) : item))
}

export function DecisionEngineProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createDecisionEngineDefaults(), [])
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()
  const runtimeLive = useRuntimeLiveContext()
  const planning = usePlanningEngineContext()
  const orchestrator = useOrchestratorContext()
  const prompt = usePromptOSContext()
  const executive = useExecutiveWorkspaceContext()

  const [queue, setQueue] = useState(defaults.queue)
  const [signals, setSignals] = useState(defaults.signals)
  const [scores, setScores] = useState(defaults.scores)
  const [reasoning] = useState(defaults.reasoning)
  const [actions, setActions] = useState(defaults.actions)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [confidence, setConfidence] = useState(defaults.confidence)
  const [outcomes, setOutcomes] = useState(defaults.outcomes)
  const [selectedDecisionId, setSelectedDecisionIdState] = useState(defaults.selectedDecisionId)
  const [query, setQuery] = useState(defaults.query)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const lastRuntimeEventId = useRef<string | null>(null)
  const lastOrchestratorMessageId = useRef<string | null>(null)
  const lastPrompt = useRef<string | null>(null)

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setSignals((previous) =>
        previous.map((signal, index) => ({
          ...signal,
          strength: Math.max(42, Math.min(98, signal.strength + (index % 3 === 0 ? 2 : -1))),
          trend: index % 3 === 0 ? "up" : index % 4 === 0 ? "flat" : signal.trend,
        }))
      )
      setScores((previous) =>
        previous.map((score, index) => ({
          ...score,
          confidence: Math.max(50, Math.min(96, score.confidence + (index % 2 === 0 ? 1 : 0))),
          urgency: Math.max(40, Math.min(99, score.urgency + (index === 0 ? 1 : 0))),
          overallPriorityScore: Math.max(50, Math.min(98, score.overallPriorityScore + (index === 0 ? 1 : 0))),
        }))
      )
      setQueue((previous) =>
        previous.map((item, index) => {
          const nextConfidence = Math.max(50, Math.min(96, item.confidence + (index % 2 === 0 ? 1 : 0)))
          const nextPriority = Math.max(50, Math.min(98, item.priorityScore + (index === 0 ? 1 : 0)))

          return {
            ...item,
            confidence: nextConfidence,
            confidenceLevel: confidenceLevel(nextConfidence),
            priorityScore: nextPriority,
            priorityBand: priorityBand(nextPriority),
          }
        })
      )
      setConfidence((previous) =>
        previous.map((item, index) => {
          const nextScore = Math.max(50, Math.min(96, item.score + (index % 2 === 0 ? 1 : 0)))
          return { ...item, score: nextScore, level: confidenceLevel(nextScore) }
        })
      )
    }, 3600)

    return () => window.clearInterval(timer)
  }, [liveMode])

  useEffect(() => {
    const latest = runtimeLive.events[0]
    if (!latest || latest.id === lastRuntimeEventId.current) {
      return
    }

    lastRuntimeEventId.current = latest.id

    setSignals((previous) =>
      previous.map((signal) =>
        signal.source === "runtime"
          ? {
              ...signal,
              strength: Math.max(55, Math.min(98, signal.strength + 3)),
              detail: `Runtime Engine observed ${runtimeLive.queueDepth} queued events and ${runtimeLive.runningAgents} active agents.`,
              trend: "up",
            }
          : signal
      )
    )
    setTimeline((previous) => [timelineEvent(selectedDecisionId, "Signals updated", "signals-updated", latest.title), ...previous].slice(0, 24))
  }, [runtimeLive.events, runtimeLive.queueDepth, runtimeLive.runningAgents, selectedDecisionId])

  useEffect(() => {
    const latest = orchestrator.messages[0]
    if (!latest || latest.id === lastOrchestratorMessageId.current) {
      return
    }

    lastOrchestratorMessageId.current = latest.id

    setSignals((previous) =>
      previous.map((signal) =>
        signal.source === "agent"
          ? {
              ...signal,
              strength: Math.max(45, Math.min(96, signal.strength + 2)),
              detail: `Orchestrator update: ${latest.message}`,
              trend: "up",
            }
          : signal
      )
    )
    setTimeline((previous) => [timelineEvent(selectedDecisionId, "Recommendation changed", "recommendation-changed", latest.message), ...previous].slice(0, 24))
  }, [orchestrator.messages, selectedDecisionId])

  useEffect(() => {
    if (!prompt.prompt || prompt.prompt === lastPrompt.current) {
      return
    }

    lastPrompt.current = prompt.prompt

    setTimeline((previous) => [timelineEvent(selectedDecisionId, "Signals updated", "signals-updated", `Prompt OS context updated: ${prompt.prompt.slice(0, 88)}`), ...previous].slice(0, 24))
  }, [prompt.prompt, selectedDecisionId])

  useEffect(() => {
    const selectedPlan = planning.selectedPlan
    if (!selectedPlan) {
      return
    }

    setSignals((previous) =>
      previous.map((signal) =>
        signal.source === "workflow"
          ? {
              ...signal,
              detail: `Planning Engine selected ${selectedPlan.objective} with ${selectedPlan.confidence}% confidence.`,
            }
          : signal
      )
    )
  }, [planning.selectedPlan])

  const filteredQueue = useMemo(() => filterDecisionQueue(queue, query), [queue, query])
  const selectedDecision = useMemo(() => queue.find((item) => item.id === selectedDecisionId) ?? filteredQueue[0] ?? null, [filteredQueue, queue, selectedDecisionId])
  const selectedSignals = useMemo(() => selectDecisionSignals(signals, selectedDecision?.id ?? ""), [selectedDecision?.id, signals])
  const selectedScore = useMemo(() => scores.find((item) => item.decisionId === selectedDecision?.id) ?? null, [scores, selectedDecision?.id])
  const selectedReasoning = useMemo(() => reasoning.find((item) => item.decisionId === selectedDecision?.id) ?? null, [reasoning, selectedDecision?.id])
  const selectedActions = useMemo(() => selectDecisionActions(actions, selectedDecision?.id ?? ""), [actions, selectedDecision?.id])
  const selectedConfidence = useMemo(() => confidence.find((item) => item.decisionId === selectedDecision?.id) ?? null, [confidence, selectedDecision?.id])
  const selectedOutcomes = useMemo(() => outcomes.filter((item) => item.decisionId === selectedDecision?.id), [outcomes, selectedDecision?.id])
  const summary = useMemo(() => decisionSummary(queue, confidence), [confidence, queue])

  const setSelectedDecisionId = useCallback((id: string) => {
    setSelectedDecisionIdState(id)
  }, [])

  const writeDecisionActivity = useCallback(
    (title: string, description: string, decisionId: string, status: ActivityStatus) => {
      const decision = queue.find((item) => item.id === decisionId)
      addActivity({
        id: `activity-decision-engine-${Date.now()}`,
        title,
        summary: description,
        timestamp: Date.now(),
        category: "ai-runtime",
        source: { key: "ai-runtime", label: "Decision Engine", workspace: "Executive" },
        actor: { id: "decision-engine", name: "Decision Engine", kind: "ai" },
        priority: decision?.priorityScore && decision.priorityScore > 85 ? "high" : "medium",
        pinned: false,
        unread: true,
        metadata: {
          eventType: "AI Decision",
          workspace: "Executive",
          status,
          relatedObjects: decision ? [{ type: "decision", id: decision.id, label: decision.title }] : [],
          tags: ["decision-engine", status],
        },
      })
    },
    [addActivity, queue]
  )

  const approveAction = useCallback(
    (actionId: string) => {
      const action = actions.find((item) => item.id === actionId)
      if (!action) {
        return
      }

      setActions((previous) => previous.map((item) => (item.id === actionId ? { ...item, status: "accepted" } : item)))
      setQueue((previous) => updateQueue(previous, action.decisionId, (item) => ({ ...item, status: DecisionStatus.Approved })))
      setOutcomes((previous) => [
        {
          id: `outcome-${Date.now()}`,
          decisionId: action.decisionId,
          title: action.title,
          status: "accepted" as const,
          businessOutcome: action.expectedImpact,
          executionResult: "Awaiting workflow execution",
          learningOpportunity: "Compare accepted recommendation outcomes to rejected alternatives.",
        },
        ...previous,
      ].slice(0, 12))
      setTimeline((previous) => [timelineEvent(action.decisionId, "Action approved", "action-approved", `${action.title} accepted by ${action.owner}.`), ...previous].slice(0, 24))
      addEntry({
        id: `decision-memory-${Date.now()}`,
        contextId: action.decisionId,
        summary: `Decision approved: ${action.title}`,
        createdAt: Date.now(),
      })
      writeDecisionActivity("Recommendation approved", action.title, action.decisionId, "completed")
      notify({
        title: "Decision approved",
        description: action.title,
        category: "AI",
        priority: "HIGH",
        level: "INFO",
        toast: true,
        autoDismissMs: 3600,
      })
      executive.approveDecision(executive.decisions[0]?.id ?? "")
    },
    [actions, addEntry, executive, notify, writeDecisionActivity]
  )

  const rejectAction = useCallback(
    (actionId: string) => {
      const action = actions.find((item) => item.id === actionId)
      if (!action) {
        return
      }

      setActions((previous) => previous.map((item) => (item.id === actionId ? { ...item, status: "rejected" } : item)))
      setQueue((previous) => updateQueue(previous, action.decisionId, (item) => ({ ...item, status: DecisionStatus.Rejected })))
      setOutcomes((previous) => [
        {
          id: `outcome-${Date.now()}`,
          decisionId: action.decisionId,
          title: action.title,
          status: "rejected" as const,
          businessOutcome: "Human review overrode the current recommendation.",
          executionResult: "No workflow triggered",
          learningOpportunity: "Capture override patterns to refine future policy guidance.",
        },
        ...previous,
      ].slice(0, 12))
      setTimeline((previous) => [timelineEvent(action.decisionId, "Outcome recorded", "outcome-recorded", `${action.title} was rejected for manual review.`), ...previous].slice(0, 24))
      writeDecisionActivity("Recommendation rejected", action.title, action.decisionId, "warning")
    },
    [actions, writeDecisionActivity]
  )

  const executeAction = useCallback(
    (actionId: string) => {
      const action = actions.find((item) => item.id === actionId)
      if (!action) {
        return
      }

      setActions((previous) => previous.map((item) => (item.id === actionId ? { ...item, status: "executing" } : item)))
      setQueue((previous) => updateQueue(previous, action.decisionId, (item) => ({ ...item, status: DecisionStatus.Executed })))
      setTimeline((previous) => [timelineEvent(action.decisionId, "Workflow executed", "workflow-executed", `${action.title} routed into Workflow Builder execution.`), ...previous].slice(0, 24))
      setOutcomes((previous) => [
        {
          id: `outcome-${Date.now()}`,
          decisionId: action.decisionId,
          title: action.title,
          status: "executed" as const,
          businessOutcome: action.expectedImpact,
          executionResult: "Execution dispatched to Runtime Engine",
          learningOpportunity: "Track downstream business impact and timing after execution completes.",
        },
        ...previous,
      ].slice(0, 12))
      writeDecisionActivity("Recommendation executed", action.title, action.decisionId, "running")
    },
    [actions, writeDecisionActivity]
  )

  const value = useMemo<DecisionEngineContextValue>(
    () => ({
      queue,
      signals,
      scores,
      reasoning,
      actions,
      timeline,
      confidence,
      outcomes,
      selectedDecisionId: selectedDecision?.id ?? selectedDecisionId,
      query,
      liveMode,
      filteredQueue,
      selectedDecision,
      selectedSignals,
      selectedScore,
      selectedReasoning,
      selectedActions,
      selectedConfidence,
      selectedOutcomes,
      summary,
      setSelectedDecisionId,
      updateQuery: setQuery,
      setLiveMode,
      approveAction,
      rejectAction,
      executeAction,
    }),
    [
      actions,
      approveAction,
      confidence,
      executeAction,
      filteredQueue,
      liveMode,
      outcomes,
      query,
      queue,
      reasoning,
      rejectAction,
      scores,
      selectedActions,
      selectedConfidence,
      selectedDecision,
      selectedDecisionId,
      selectedOutcomes,
      selectedReasoning,
      selectedScore,
      selectedSignals,
      setSelectedDecisionId,
      signals,
      summary,
      timeline,
    ]
  )

  return <DecisionEngineContext.Provider value={value}>{children}</DecisionEngineContext.Provider>
}

export function useDecisionEngineContext() {
  const context = useContext(DecisionEngineContext)
  if (!context) {
    throw new Error("useDecisionEngineContext must be used within DecisionEngineProvider")
  }

  return context
}