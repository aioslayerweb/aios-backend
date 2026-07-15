"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  AgentStatus,
  AIAssistantState,
  AIAssistantTab,
  AIQuickAction,
  AISuggestion,
  CurrentContext,
  ExecutionEvent,
  MemoryEntry,
} from "@/types"
import {
  AI_PANEL_DEFAULT_WIDTH,
  AI_PANEL_MAX_WIDTH,
  AI_PANEL_MIN_WIDTH,
  aiQuickActions,
  clampPanelWidth,
  mockAgentStatuses,
  mockCurrentContext,
  mockExecutionEvents,
  mockMemoryEntries,
  mockSuggestions,
} from "@/utils/ai-assistant"

type AIAssistantContextValue = AIAssistantState & {
  currentContext: CurrentContext
  suggestions: AISuggestion[]
  agentStatuses: AgentStatus[]
  memoryEntries: MemoryEntry[]
  executionTimeline: ExecutionEvent[]
  quickActions: AIQuickAction[]
  setAgentStatuses: (updater: AgentStatus[] | ((previous: AgentStatus[]) => AgentStatus[])) => void
  setMemoryEntries: (updater: MemoryEntry[] | ((previous: MemoryEntry[]) => MemoryEntry[])) => void
  setExecutionTimeline: (
    updater: ExecutionEvent[] | ((previous: ExecutionEvent[]) => ExecutionEvent[])
  ) => void
  setOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  setWidth: (width: number) => void
  resizeBy: (delta: number) => void
  setSelectedTab: (tab: AIAssistantTab) => void
  setMobileExpanded: (expanded: boolean) => void
  setConversationDraft: (draft: string) => void
}

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null)

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [width, setWidthState] = useState(AI_PANEL_DEFAULT_WIDTH)
  const [selectedTab, setSelectedTab] = useState<AIAssistantTab>("context")
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const [conversationDraft, setConversationDraft] = useState("")
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(mockAgentStatuses)
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(mockMemoryEntries)
  const [executionTimeline, setExecutionTimeline] = useState<ExecutionEvent[]>(mockExecutionEvents)

  const setWidth = useCallback((nextWidth: number) => {
    setWidthState(clampPanelWidth(nextWidth))
  }, [])

  const resizeBy = useCallback((delta: number) => {
    setWidthState((previous) => clampPanelWidth(previous + delta))
  }, [])

  const value = useMemo<AIAssistantContextValue>(
    () => ({
      open,
      collapsed,
      width,
      minWidth: AI_PANEL_MIN_WIDTH,
      maxWidth: AI_PANEL_MAX_WIDTH,
      selectedTab,
      mobileExpanded,
      conversationDraft,
      currentContext: mockCurrentContext,
      suggestions: mockSuggestions,
      agentStatuses,
      memoryEntries,
      executionTimeline,
      quickActions: aiQuickActions,
      setAgentStatuses,
      setMemoryEntries,
      setExecutionTimeline,
      setOpen,
      setCollapsed,
      setWidth,
      resizeBy,
      setSelectedTab,
      setMobileExpanded,
      setConversationDraft,
    }),
    [
      agentStatuses,
      collapsed,
      conversationDraft,
      executionTimeline,
      memoryEntries,
      mobileExpanded,
      open,
      selectedTab,
      setWidth,
      resizeBy,
      width,
    ]
  )

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  )
}

export function useAIAssistantContext(): AIAssistantContextValue {
  const context = useContext(AIAssistantContext)
  if (!context) {
    throw new Error("useAIAssistantContext must be used within AIAssistantProvider")
  }

  return context
}
