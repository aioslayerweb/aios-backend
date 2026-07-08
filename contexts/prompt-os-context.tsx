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
import { useAgentWorkspaceContext } from "@/contexts/agent-workspace-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import type {
  PromptExecutionStatus,
  PromptHistoryEntry,
  PromptOSState,
  PromptSuggestion,
  PromptTemplate,
} from "@/types"
import {
  advanceAgents,
  advancePlan,
  advanceReasoning,
  advanceTimeline,
  buildInterpretation,
  createPromptInitialAgents,
  buildResult,
  createFollowUps,
  createInitialPlan,
  createInitialReasoning,
  createInitialTimeline,
  promptTemplates,
} from "@/utils/prompt-os"

const HISTORY_STORAGE_KEY = "aios.promptos.history"

type PromptOSContextValue = PromptOSState & {
  setPrompt: (value: string) => void
  runPrompt: () => void
  useTemplate: (templateId: string) => void
  pinHistory: (id: string) => void
  favoriteHistory: (id: string) => void
  searchHistory: (query: string) => PromptHistoryEntry[]
  applyFollowUp: (suggestion: PromptSuggestion) => void
}

const PromptOSContext = createContext<PromptOSContextValue | null>(null)

export function PromptOSProvider({ children }: { children: ReactNode }) {
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()
  const { agents: workspaceAgents } = useAgentWorkspaceContext()

  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState<PromptExecutionStatus>("idle")
  const [interpretation, setInterpretation] = useState<PromptOSState["interpretation"]>(null)
  const [plan, setPlan] = useState(createInitialPlan)
  const [reasoning, setReasoning] = useState(createInitialReasoning)
  const [agents, setAgents] = useState<PromptOSState["agents"]>([])
  const [timeline, setTimeline] = useState(createInitialTimeline)
  const [result, setResult] = useState<PromptOSState["result"]>(null)
  const [memoryUpdates, setMemoryUpdates] = useState<PromptOSState["memoryUpdates"]>([])
  const [history, setHistory] = useState<PromptHistoryEntry[]>([])

  const templates = useMemo<PromptTemplate[]>(() => promptTemplates(), [])
  const followUps = useMemo(() => createFollowUps(), [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
      if (!raw) {
        return
      }

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        return
      }

      const safe = parsed.filter(
        (item): item is PromptHistoryEntry =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.prompt === "string" &&
          typeof item.timestamp === "number"
      )

      setHistory(safe.slice(0, 80))
    } catch {
      // Ignore local storage parse failures.
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (status === "idle" || status === "completed" || status === "failed") {
      return
    }

    const timer = window.setInterval(() => {
      setPlan((previous) => advancePlan(previous))
      setReasoning((previous) => advanceReasoning(previous))
      setAgents((previous) => advanceAgents(previous))
      setTimeline((previous) => advanceTimeline(previous))

      setStatus((previous) => {
        if (previous === "planning") {
          return "searching"
        }
        if (previous === "searching") {
          return "analyzing"
        }
        if (previous === "analyzing") {
          return "executing"
        }
        if (previous === "executing") {
          return "reviewing"
        }
        return "completed"
      })
    }, 1300)

    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status !== "completed" || !interpretation || !prompt) {
      return
    }

    const finalResult = buildResult(prompt, interpretation)
    setResult(finalResult)

    const memoryUpdate = {
      id: `prompt-memory-${Date.now()}`,
      title: "Prompt execution memory stored",
      summary: `Stored outcome for prompt: ${prompt}`,
      timestamp: Date.now(),
    }

    setMemoryUpdates((previous) => [memoryUpdate, ...previous].slice(0, 12))

    addEntry({
      id: memoryUpdate.id,
      contextId: "prompt-os",
      summary: memoryUpdate.summary,
      createdAt: memoryUpdate.timestamp,
    })

    addActivity({
      id: `activity-prompt-os-${Date.now()}`,
      title: "Prompt OS execution completed",
      summary: prompt,
      timestamp: Date.now(),
      category: "ai-runtime",
      source: {
        key: "ai-runtime",
        label: "Prompt OS",
        workspace: "Prompt OS",
      },
      actor: {
        id: "prompt-os",
        name: "Prompt OS",
        kind: "ai",
      },
      priority: interpretation.priority === "critical" ? "critical" : "high",
      unread: true,
      pinned: false,
      metadata: {
        eventType: "AI Decision",
        workspace: "Prompt OS",
        status: "completed",
        relatedObjects: [{ type: "prompt", id: `prompt-${Date.now()}`, label: "Prompt Execution" }],
        tags: ["prompt-os", interpretation.domain],
      },
    })

    notify({
      title: "Prompt OS completed",
      description: "Execution plan completed and outcome report generated.",
      category: "AI",
      priority: "MEDIUM",
      level: "SUCCESS",
      toast: true,
      autoDismissMs: 4800,
    })

    setHistory((previous) => {
      const entry: PromptHistoryEntry = {
        id: `history-${Date.now()}`,
        prompt,
        status: "completed",
        timestamp: Date.now(),
        pinned: false,
        favorite: false,
      }

      return [entry, ...previous].slice(0, 80)
    })
  }, [addActivity, addEntry, interpretation, notify, prompt, status])

  const runPrompt = useCallback(() => {
    const trimmed = prompt.trim()
    if (!trimmed) {
      notify({
        title: "Prompt required",
        description: "Enter an objective to execute in Prompt OS.",
        category: "AI",
        priority: "LOW",
        level: "INFO",
        toast: true,
        autoDismissMs: 3200,
      })
      return
    }

    const nextInterpretation = buildInterpretation(trimmed)

    setInterpretation(nextInterpretation)
    setPlan(createInitialPlan())
    setReasoning(createInitialReasoning())
    setTimeline(createInitialTimeline())
    setResult(null)

    const assigned = createPromptInitialAgents(nextInterpretation.domain).map((agent) => {
      const workspaceMatch = workspaceAgents.find((item) => item.id === agent.id)
      if (!workspaceMatch) {
        return agent
      }

      return {
        ...agent,
        task: workspaceMatch.currentTask,
        confidence: workspaceMatch.confidence,
      }
    })

    setAgents(assigned)

    setHistory((previous) => {
      const entry: PromptHistoryEntry = {
        id: `history-running-${Date.now()}`,
        prompt: trimmed,
        status: "planning",
        timestamp: Date.now(),
        pinned: false,
        favorite: false,
      }

      return [entry, ...previous].slice(0, 80)
    })

    setStatus("planning")
  }, [notify, prompt, workspaceAgents])

  const useTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((item) => item.id === templateId)
      if (!template) {
        return
      }

      setPrompt(template.content)
    },
    [templates]
  )

  const pinHistory = useCallback((id: string) => {
    setHistory((previous) =>
      previous.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
    )
  }, [])

  const favoriteHistory = useCallback((id: string) => {
    setHistory((previous) =>
      previous.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    )
  }, [])

  const searchHistory = useCallback(
    (query: string) => {
      const normalized = query.trim().toLowerCase()
      if (!normalized) {
        return history
      }

      return history.filter((item) => item.prompt.toLowerCase().includes(normalized))
    },
    [history]
  )

  const applyFollowUp = useCallback(
    (suggestion: PromptSuggestion) => {
      setPrompt((previous) => `${previous.trim()}\nFollow-up: ${suggestion.label}`.trim())
    },
    []
  )

  const value = useMemo<PromptOSContextValue>(
    () => ({
      prompt,
      status,
      interpretation,
      plan,
      reasoning,
      agents,
      timeline,
      result,
      memoryUpdates,
      history,
      templates,
      followUps,
      setPrompt,
      runPrompt,
      useTemplate,
      pinHistory,
      favoriteHistory,
      searchHistory,
      applyFollowUp,
    }),
    [
      agents,
      applyFollowUp,
      favoriteHistory,
      followUps,
      history,
      interpretation,
      memoryUpdates,
      pinHistory,
      plan,
      prompt,
      reasoning,
      result,
      runPrompt,
      searchHistory,
      status,
      templates,
      timeline,
      useTemplate,
    ]
  )

  return <PromptOSContext.Provider value={value}>{children}</PromptOSContext.Provider>
}

export function usePromptOSContext(): PromptOSContextValue {
  const context = useContext(PromptOSContext)
  if (!context) {
    throw new Error("usePromptOSContext must be used within PromptOSProvider")
  }

  return context
}
