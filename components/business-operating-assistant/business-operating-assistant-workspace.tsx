"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Bot,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Command,
  FileSearch,
  Globe2,
  Languages,
  Lightbulb,
  Loader2,
  Mic,
  Moon,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Upload,
  UserCircle2,
  Volume2,
  Workflow,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  aiAgents,
  businessMemoryCollections,
  customers,
  integrationSystems,
  invoices,
  knowledgeArticles,
  meetings,
  projects,
  recommendations,
  reasoningSteps,
  reports,
  rolePresets,
  suppliers,
  workflows,
  type BusinessRole,
  type EntityRecord,
} from "./data"
import {
  AIBubble,
  AgentCard,
  ApprovalCard,
  BusinessHealthCard,
  BusinessImpactBadge,
  ConfidenceIndicator,
  DocumentCard,
  ForecastCard,
  IntegrationCard,
  MemoryCard,
  PermissionCard,
  PinnedInsight,
  PriorityBadge,
  RecommendationCard,
  ROIBadge,
  RootCauseTree,
  ScenarioSimulator,
  SourceCitation,
  SuggestedPromptChip,
  SurfaceCard,
  ThinkingBubble,
  TimelineCard,
  WorkflowCard,
} from "./cards"

type WorkspaceSection =
  | "conversations"
  | "search"
  | "saved-prompts"
  | "agents"
  | "memory"
  | "documents"
  | "workflows"
  | "reports"
  | "settings"

type ChatMessage = {
  id: string
  by: "user" | "assistant"
  text: string
  kind?: "normal" | "briefing" | "customer" | "forecast" | "rca" | "report" | "workflow" | "email"
}

const sidebarItems: Array<{ id: WorkspaceSection; label: string; icon: typeof Command }> = [
  { id: "conversations", label: "New Conversation", icon: Plus },
  { id: "search", label: "Search Everything", icon: Search },
  { id: "saved-prompts", label: "Saved Prompts", icon: Sparkles },
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "memory", label: "Business Memory", icon: Briefcase },
  { id: "documents", label: "Documents", icon: FileSearch },
  { id: "workflows", label: "Workflows", icon: Workflow },
  { id: "reports", label: "Reports", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
]

const recentChats = [
  "Executive Morning Briefing - July 22",
  "Root Cause: EMEA Revenue Dip",
  "ACME Ltd. Renewal Recovery",
  "Q3 Scenario Planning - Price and Hiring",
  "Board Report Draft Review",
]

const globalDatasets: Array<{ label: string; records: EntityRecord[] }> = [
  { label: "Customers", records: customers },
  { label: "Meetings", records: meetings },
  { label: "Reports", records: reports },
  { label: "Workflows", records: workflows },
  { label: "Invoices", records: invoices },
  { label: "Suppliers", records: suppliers },
  { label: "Projects", records: projects },
  { label: "AI Agents", records: aiAgents },
  { label: "Knowledge", records: knowledgeArticles },
]

function roleStyle(role: BusinessRole): string {
  if (role === "CEO") return "text-cyan-100 border-cyan-400/40 bg-cyan-500/10"
  if (role === "CFO") return "text-emerald-100 border-emerald-400/40 bg-emerald-500/10"
  if (role === "COO") return "text-blue-100 border-blue-400/40 bg-blue-500/10"
  if (role === "Legal") return "text-amber-100 border-amber-400/40 bg-amber-500/10"
  return "text-violet-100 border-violet-400/40 bg-violet-500/10"
}

function matchesBusinessIntent(input: string): boolean {
  const verbs = [
    "show",
    "explain",
    "compare",
    "generate",
    "predict",
    "create",
    "search",
    "find",
    "analyse",
    "recommend",
    "summarise",
    "translate",
    "rewrite",
  ]

  const normalized = input.toLowerCase()
  return verbs.some((verb) => normalized.includes(verb))
}

function assistantReply(input: string): ChatMessage {
  const normalized = input.toLowerCase()

  if (normalized.includes("morning briefing") || normalized.includes("briefing")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "briefing",
      text: "Executive Morning Briefing generated: 4 priorities, 3 risks, 5 wins, and 7 recommended actions with projected impact of $1.46M this quarter.",
    }
  }

  if (normalized.includes("acme") || normalized.includes("customer")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "customer",
      text: "Customer Intelligence profile loaded for ACME Ltd. Churn score is 78, open deals are $640K, unpaid invoices are $184K, and next-best-action is executive escalation with legal fast-track.",
    }
  }

  if (normalized.includes("forecast") || normalized.includes("predict")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "forecast",
      text: "Forecasting engine completed. Revenue baseline is $48.7M, projected upside scenario is $54.3M, downside scenario is $44.9M, and confidence interval is 82%.",
    }
  }

  if (normalized.includes("why") || normalized.includes("root cause")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "rca",
      text: "Root cause analysis complete. Revenue dip linked to delayed enterprise renewals, discount overrun in EMEA, and lower demand conversion from two channels. Recommended mitigation actions are ready for approval.",
    }
  }

  if (normalized.includes("workflow")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "workflow",
      text: "Workflow generated with triggers, conditions, approvals, and autonomous action nodes. Human-in-the-loop checkpoints are active at high-risk transitions.",
    }
  }

  if (normalized.includes("report")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "report",
      text: "Interactive report draft is ready. It includes KPI summary, trends, evidence timeline, recommendations, and expected financial impact tables.",
    }
  }

  if (normalized.includes("email")) {
    return {
      id: `assistant-${Date.now()}`,
      by: "assistant",
      kind: "email",
      text: "Email assistant produced three variants: Professional, Friendly, and Executive. Translation is available in Spanish, French, and German.",
    }
  }

  return {
    id: `assistant-${Date.now()}`,
    by: "assistant",
    text: "Business Operating Assistant processed your request and prepared an actionable response with context, evidence, confidence score, and recommended next actions.",
  }
}

function responseForPermission(target: string): string {
  return `Your current role does not include access to ${target}. Request elevated permission through governance, and the assistant will continue without exposing restricted information.`
}

export function BusinessOperatingAssistantWorkspace({
  baseHref = "/app",
}: {
  baseHref?: string
}) {
  const [section, setSection] = useState<WorkspaceSection>("conversations")
  const [role, setRole] = useState<BusinessRole>("CEO")
  const [query, setQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState("")
  const [isVoiceOn, setIsVoiceOn] = useState(false)
  const [activeReasoningIndex, setActiveReasoningIndex] = useState(0)
  const [activeRecommendation, setActiveRecommendation] = useState(recommendations[0])
  const [approvedRecommendationIds, setApprovedRecommendationIds] = useState<string[]>([])
  const [approvalCount, setApprovalCount] = useState(0)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? "")
  const [priceScenario, setPriceScenario] = useState(6)
  const [hiringScenario, setHiringScenario] = useState(8)
  const [churnScenario, setChurnScenario] = useState(2)
  const [languageMode, setLanguageMode] = useState<"Simple" | "Advanced">("Simple")
  const [actionConfirm, setActionConfirm] = useState<string | null>(null)
  const [pinnedInsights, setPinnedInsights] = useState<string[]>([
    "Cash trend improved for 4 consecutive weeks.",
    "Support SLA recovered to 94.7% after routing automation.",
  ])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      by: "assistant",
      text: "AIOS Business Operating Assistant is ready. Ask for insights, decisions, reports, workflows, forecasts, or direct actions across your business systems.",
    },
  ])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const rolePreset = useMemo(() => rolePresets.find((item) => item.role === role) ?? rolePresets[0], [role])
  const selectedCustomer = useMemo(() => customers.find((item) => item.id === selectedCustomerId) ?? customers[0], [selectedCustomerId])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const normalized = searchQuery.toLowerCase()
    const results: Array<{ dataset: string; record: EntityRecord }> = []

    for (const dataset of globalDatasets) {
      for (const record of dataset.records) {
        const text = [record.name, record.summary, record.owner, record.value].join(" ").toLowerCase()
        if (text.includes(normalized)) {
          results.push({ dataset: dataset.label, record })
        }
      }
    }

    return results.slice(0, 14)
  }, [searchQuery])

  const connectedSystems = integrationSystems.map((name, index) => ({ name, connected: index < 9 }))

  const memoryTimeline = [
    { title: "Executive Decision", detail: "Approved ACME rescue workflow and legal fast-track.", severity: "critical" as const },
    { title: "Forecast Update", detail: "Cash run-rate improved by 6.4% after receivables acceleration.", severity: "info" as const },
    { title: "Policy Alert", detail: "Three discount exceptions exceeded governance threshold.", severity: "warning" as const },
    { title: "Project Milestone", detail: "Workflow Automation Scale completed phase 2 rollout.", severity: "info" as const },
    { title: "Security Notice", detail: "Identity provider incident recovered; root cause logged.", severity: "warning" as const },
  ]

  const rootCauses = [
    { label: "Renewal delays in top 5 EMEA accounts", confidence: 89, severity: "High" as const },
    { label: "Average discount rate increased from 17% to 24%", confidence: 84, severity: "Medium" as const },
    { label: "Demand conversion drop in paid social channel", confidence: 76, severity: "Medium" as const },
    { label: "Delayed implementation start for enterprise package", confidence: 69, severity: "Low" as const },
  ]

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveReasoningIndex((current) => (current + 1) % reasoningSteps.length)
    }, 2800)

    return () => window.clearInterval(interval)
  }, [])

  function startStreamingReply(message: ChatMessage) {
    setStreaming(true)
    setStreamedText("")

    const fullText = message.text
    let idx = 0
    const timer = window.setInterval(() => {
      idx += 2
      setStreamedText(fullText.slice(0, idx))
      if (idx >= fullText.length) {
        window.clearInterval(timer)
        setStreaming(false)
        setMessages((current) => [...current, { ...message, text: fullText }])
      }
    }, 14)
  }

  function handleSend() {
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }

    setMessages((current) => [...current, { id: `user-${Date.now()}`, by: "user", text: trimmed }])
    setQuery("")

    if (!matchesBusinessIntent(trimmed)) {
      const fallback = {
        id: `assistant-${Date.now()}`,
        by: "assistant" as const,
        text: "Try asking with a business intent such as Show me, Explain, Compare, Generate, Predict, Create, Search, Find, Analyse, Recommend, Summarise, Translate, or Rewrite.",
      }
      startStreamingReply(fallback)
      return
    }

    if (trimmed.toLowerCase().includes("salary") || trimmed.toLowerCase().includes("payroll")) {
      if (rolePreset.restrictedAreas.includes("Payroll Files")) {
        startStreamingReply({
          id: `assistant-${Date.now()}`,
          by: "assistant",
          text: responseForPermission("Payroll Files"),
        })
        return
      }
    }

    startStreamingReply(assistantReply(trimmed))
  }

  function handleApproveRecommendation(id: string) {
    if (approvedRecommendationIds.includes(id)) {
      return
    }

    setApprovedRecommendationIds((current) => [...current, id])
    setApprovalCount((count) => count + 1)
  }

  function handlePinnedInsight(newInsight: string) {
    setPinnedInsights((current) => {
      if (current.includes(newInsight)) {
        return current
      }
      return [newInsight, ...current].slice(0, 5)
    })
  }

  const rootTheme = themeMode === "dark"
    ? "bg-[radial-gradient(circle_at_top_right,rgba(14,116,144,0.25),transparent_35%),radial-gradient(circle_at_top_left,rgba(30,64,175,0.3),transparent_30%),linear-gradient(160deg,#050816_0%,#0b1225_45%,#101a31_100%)] text-slate-100"
    : "bg-[radial-gradient(circle_at_top_right,rgba(14,116,144,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(30,64,175,0.14),transparent_30%),linear-gradient(160deg,#eef4ff_0%,#e8f0ff_45%,#edf6ff_100%)] text-slate-900"

  const panelTone = themeMode === "dark"
    ? "border-white/10 bg-white/5"
    : "border-slate-300/70 bg-white/70"

  const textSoft = themeMode === "dark" ? "text-slate-300" : "text-slate-600"
  const textCard = themeMode === "dark" ? "text-slate-100" : "text-slate-800"

  return (
    <section className={`relative overflow-hidden rounded-[30px] border p-3 shadow-[0_24px_80px_rgba(3,7,18,0.42)] lg:p-4 ${rootTheme} ${themeMode === "dark" ? "border-white/10" : "border-slate-300/70"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(16,185,129,0.12),transparent_30%)]" />

      <header className={`relative z-10 mb-3 rounded-2xl border px-3 py-3 backdrop-blur-xl lg:px-4 ${panelTone}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textSoft}`}>AIOS Flagship Interface</p>
            <h1 className="mt-1 text-xl font-semibold lg:text-2xl">Business Operating Assistant</h1>
            <p className={`mt-1 text-xs ${textSoft}`}>Run business intelligence, decisions, workflows, and operations from one unified AI workspace.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${panelTone}`}
              aria-label="Toggle color mode"
            >
              {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <label className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${panelTone}`}>
              <UserCircle2 className="h-4 w-4" />
              <span>Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as BusinessRole)}
                className="rounded-md border border-white/20 bg-transparent px-2 py-1 text-xs outline-none"
                aria-label="Current role"
              >
                {rolePresets.map((preset) => (
                  <option key={preset.role} value={preset.role} className="text-slate-900">
                    {preset.role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid gap-3 xl:grid-cols-[250px_minmax(0,1fr)_320px]">
        <aside className={`rounded-2xl border p-3 backdrop-blur-xl ${panelTone}`}>
          <button type="button" className="mb-3 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-100">
            <Plus className="h-4 w-4" />
            New Conversation
          </button>

          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const active = section === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${active ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100" : `${themeMode === "dark" ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-300/70 bg-white/70 text-slate-800"}`}`}
                >
                  <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </button>
              )
            })}
          </div>

          <div className={`mt-3 rounded-xl border p-3 ${panelTone}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${textSoft}`}>Recent Chats</p>
            <ul className="mt-2 space-y-2">
              {recentChats.map((chat) => (
                <li key={chat}>
                  <button type="button" className={`w-full rounded-lg border border-white/10 px-2 py-2 text-left text-xs ${themeMode === "dark" ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}>
                    {chat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className={`rounded-2xl border p-3 backdrop-blur-xl ${panelTone}`}>
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="space-y-3">
              <div className={`rounded-2xl border p-3 ${panelTone}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                    <Bot className="h-3.5 w-3.5" />
                    Natural Language Business Assistant
                  </div>
                  <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${roleStyle(role)}`}>
                    RBI Active: {role}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {messages.slice(-5).map((message) => (
                    <div key={message.id} className={`flex ${message.by === "assistant" ? "justify-start" : "justify-end"}`}>
                      <AIBubble text={message.text} from={message.by === "assistant" ? "assistant" : "user"} />
                    </div>
                  ))}

                  {streaming ? (
                    <div className="flex justify-start">
                      <AIBubble text={streamedText || "..."} from="assistant" />
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {rolePreset.prompts.map((prompt) => (
                    <SuggestedPromptChip key={prompt} text={prompt} onClick={() => setQuery(prompt)} />
                  ))}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                  <label className="relative">
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSend()
                        }
                      }}
                      placeholder="Ask AIOS to run the business..."
                      className={`w-full rounded-xl border bg-transparent px-3 py-3 pr-10 text-sm outline-none ${themeMode === "dark" ? "border-white/15 text-slate-100 placeholder:text-slate-500" : "border-slate-300 text-slate-800 placeholder:text-slate-400"}`}
                    />
                    <Command className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${textSoft}`} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsVoiceOn((current) => !current)}
                    className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isVoiceOn ? "border-violet-400/40 bg-violet-500/20 text-violet-100" : panelTone}`}
                  >
                    <Mic className={`h-4 w-4 ${isVoiceOn ? "animate-pulse" : ""}`} />
                    Voice
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-100"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {rolePreset.kpis.map((kpi) => (
                  <SurfaceCard key={kpi.label} className="space-y-2">
                    <p className={`text-[11px] uppercase tracking-wide ${textSoft}`}>{kpi.label}</p>
                    <p className={`text-2xl font-semibold ${textCard}`}>{kpi.value}</p>
                    <p className="text-xs text-emerald-200">{kpi.trend}</p>
                  </SurfaceCard>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <ScenarioSimulator
                  price={priceScenario}
                  hiring={hiringScenario}
                  churn={churnScenario}
                  onPrice={setPriceScenario}
                  onHiring={setHiringScenario}
                  onChurn={setChurnScenario}
                />

                <RootCauseTree nodes={rootCauses} />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <ForecastCard label="Revenue" value="$54.3M" points={[20, 32, 38, 47, 55, 64, 74, 82]} />
                <ForecastCard label="Cash Flow" value="$13.1M" points={[26, 36, 40, 44, 50, 58, 66, 72]} />
                <ForecastCard label="Demand" value="+19%" points={[18, 22, 28, 36, 49, 58, 63, 77]} />
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <SurfaceCard className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Decision Assistant</h3>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-300">
                      <Shield className="h-4 w-4 text-cyan-200" /> Human-in-the-loop
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">Pros, cons, risk, ROI, dependencies, teams, and timelines are generated for every recommendation.</p>
                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge level={activeRecommendation.priority} />
                    <BusinessImpactBadge value={activeRecommendation.impact} />
                    <ROIBadge value={activeRecommendation.roi} />
                  </div>
                  <ConfidenceIndicator value={activeRecommendation.confidence} />
                  <SourceCitation source="Evidence" detail="Revenue intelligence, customer health graph, workflow telemetry, and governance logs." />
                </SurfaceCard>

                <SurfaceCard className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Action Mode</h3>
                  <p className="text-xs text-slate-300">Execute tasks with confirmation dialogs: create task, assign owner, approve invoice, schedule meeting, send report, open ticket.</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "Create task",
                      "Assign owner",
                      "Approve invoice",
                      "Schedule meeting",
                      "Send report",
                      "Create project",
                    ].map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => setActionConfirm(action)}
                        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-blue-100"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </SurfaceCard>
              </div>

              <section className="grid gap-3 lg:grid-cols-2">
                <SurfaceCard className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Multimodal Assistant</h3>
                  <p className="text-xs text-slate-300">Drop voice notes, PDFs, Word, Excel, PowerPoint, images, CSV, and screenshots.</p>
                  <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 p-3 text-center text-xs text-slate-300">
                    <Upload className="mb-2 h-5 w-5 text-cyan-200" />
                    Drag and drop files or click to upload
                    <input type="file" multiple className="hidden" />
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-200">
                    <span className="rounded-lg border border-white/15 px-2 py-1">PDF Intelligence</span>
                    <span className="rounded-lg border border-white/15 px-2 py-1">Invoice Extraction</span>
                    <span className="rounded-lg border border-white/15 px-2 py-1">Obligation Mining</span>
                  </div>
                </SurfaceCard>

                <SurfaceCard className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Enterprise Knowledge Search</h3>
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search customers, policies, files, contracts, reports, notes..."
                      className={`w-full rounded-xl border bg-transparent px-3 py-2 pl-10 text-sm outline-none ${themeMode === "dark" ? "border-white/15 text-slate-100" : "border-slate-300 text-slate-800"}`}
                    />
                  </label>
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                    {searchResults.length === 0 ? (
                      <p className="text-xs text-slate-300">Search results will appear here with linked business context.</p>
                    ) : (
                      searchResults.map((item) => (
                        <button
                          type="button"
                          key={`${item.dataset}-${item.record.id}`}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-200"
                        >
                          <p className="font-semibold">{item.record.name}</p>
                          <p className="mt-1 text-slate-300">{item.dataset} • {item.record.summary}</p>
                        </button>
                      ))
                    )}
                  </div>
                </SurfaceCard>
              </section>
            </section>

            <section className="space-y-3">
              <SurfaceCard className="space-y-3">
                <h3 className="text-sm font-semibold text-white">AI Recommendation Engine</h3>
                <div className="space-y-2">
                  {recommendations.slice(0, 4).map((item) => (
                    <RecommendationCard
                      key={item.id}
                      item={item}
                      onApprove={() => {
                        handleApproveRecommendation(item.id)
                        setActiveRecommendation(item)
                        handlePinnedInsight(`${item.title} approved with ${item.roi} ROI.`)
                      }}
                      onReject={() => setActiveRecommendation(item)}
                      onDetails={() => setActiveRecommendation(item)}
                    />
                  ))}
                </div>
              </SurfaceCard>

              <ApprovalCard title="Approve invoice INV-2026-1168" owner="Finance Controller" amount="$78,250" onApprove={() => setApprovalCount((count) => count + 1)} />

              {rolePreset.restrictedAreas.includes("Legal Hold Documents") ? (
                <PermissionCard message={responseForPermission("Legal Hold Documents")} onRequest={() => setPinnedInsights((current) => ["Access request submitted for Legal Hold Documents.", ...current].slice(0, 5))} />
              ) : null}

              <SurfaceCard className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Multi-Step AI Reasoning</h3>
                <ThinkingBubble step={reasoningSteps[activeReasoningIndex] ?? reasoningSteps[0]} />
                <div className="space-y-2">
                  {reasoningSteps.map((step, index) => (
                    <div key={step} className={`rounded-lg border px-2 py-2 text-xs ${index === activeReasoningIndex ? "border-violet-300/50 bg-violet-500/15 text-violet-100" : "border-white/10 bg-white/5 text-slate-300"}`}>
                      {index + 1}. {step}
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </section>
          </div>

          <section className="mt-3 grid gap-3 lg:grid-cols-3">
            <SurfaceCard className="space-y-3 lg:col-span-2">
              <h3 className="text-sm font-semibold text-white">Business Memory Explorer</h3>
              <div className="flex flex-wrap gap-2">
                {businessMemoryCollections.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-slate-200">{item}</span>
                ))}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {meetings.slice(0, 4).map((record) => (
                  <MemoryCard key={record.id} record={record} />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Business Health Score</h3>
              <div className="grid grid-cols-2 gap-2">
                <BusinessHealthCard area="Finance" score={86} trend="+3" />
                <BusinessHealthCard area="Operations" score={82} trend="+5" />
                <BusinessHealthCard area="Sales" score={79} trend="+2" />
                <BusinessHealthCard area="Security" score={88} trend="+4" />
              </div>
              <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2 py-2 text-xs text-cyan-100">Overall Score: 84/100</p>
            </SurfaceCard>
          </section>

          <section className="mt-3 grid gap-3 lg:grid-cols-3">
            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Customer Intelligence</h3>
              <select
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-transparent px-2 py-2 text-xs"
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id} className="text-slate-900">
                    {customer.name}
                  </option>
                ))}
              </select>
              <div className="space-y-2 text-xs text-slate-200">
                <p className="font-semibold text-white">{selectedCustomer.name}</p>
                <p>{selectedCustomer.summary}</p>
                <p>Revenue: {selectedCustomer.value}</p>
                <p>Open Deals: $640K</p>
                <p>Churn Score: {selectedCustomer.status === "Critical" ? 88 : selectedCustomer.status === "Attention" ? 72 : 41}</p>
                <p className="text-cyan-100">Next Best Action: Executive sponsor outreach and contract fast-track.</p>
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Workflow Generator</h3>
              <p className="text-xs text-slate-300">Prompt: Create onboarding workflow</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-100">
                <div className="rounded-lg border border-white/15 bg-white/5 p-2">Trigger: Signed contract</div>
                <div className="rounded-lg border border-white/15 bg-white/5 p-2">Condition: Enterprise tier</div>
                <div className="rounded-lg border border-white/15 bg-white/5 p-2">Approval: Security + Legal</div>
                <div className="rounded-lg border border-white/15 bg-white/5 p-2">Action: Provision stack</div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">AI Agent Builder</h3>
              <div className="space-y-2 text-xs text-slate-200">
                <input placeholder="Name: Procurement Optimizer" className={`w-full rounded-lg border bg-transparent px-2 py-2 ${themeMode === "dark" ? "border-white/20" : "border-slate-300"}`} />
                <input placeholder="Department: Procurement" className={`w-full rounded-lg border bg-transparent px-2 py-2 ${themeMode === "dark" ? "border-white/20" : "border-slate-300"}`} />
                <input placeholder="Goals: Reduce supplier risk" className={`w-full rounded-lg border bg-transparent px-2 py-2 ${themeMode === "dark" ? "border-white/20" : "border-slate-300"}`} />
                <button type="button" className="w-full rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-2 py-2 font-semibold text-emerald-100">Create AI Employee</button>
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-3 grid gap-3 lg:grid-cols-3">
            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Meeting Assistant</h3>
              <p className="text-xs text-slate-300">Before meeting: agenda, participants, history, open actions, docs, KPI context.</p>
              <p className="text-xs text-slate-300">After meeting: minutes, summary, action items, owners, deadlines.</p>
              <div className="space-y-2">
                {meetings.slice(0, 3).map((meeting) => (
                  <TimelineCard key={meeting.id} title={meeting.name} detail={meeting.summary} severity={meeting.status === "Attention" ? "warning" : "info"} />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Email Assistant</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  "Draft",
                  "Reply",
                  "Summarise",
                  "Rewrite",
                  "Professional",
                  "Friendly",
                  "Executive",
                  "Translate",
                ].map((mode) => (
                  <button key={mode} type="button" className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-slate-100">{mode}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Languages className="h-4 w-4 text-cyan-200" />
                Mode: {languageMode}
                <button type="button" onClick={() => setLanguageMode(languageMode === "Simple" ? "Advanced" : "Simple")} className="rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-2 py-1 text-cyan-100">
                  Toggle
                </button>
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Report Generator</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-100">
                {["Board", "Weekly", "Monthly", "Quarterly", "Department", "Investor"].map((reportType) => (
                  <button key={reportType} type="button" className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2 py-2">
                    {reportType} Report
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-300">Interactive preview includes KPI cards, timeline, risks, and recommendations.</p>
            </SurfaceCard>
          </section>
        </main>

        <aside className={`rounded-2xl border p-3 backdrop-blur-xl ${panelTone}`}>
          <div className={`rounded-xl border p-3 ${panelTone}`}>
            <h3 className="text-sm font-semibold">Context Panel</h3>
            <div className={`mt-2 space-y-2 text-xs ${textSoft}`}>
              <p>Current Company: AIOS Global Holdings</p>
              <p>Current User: Alex Morgan</p>
              <p>Current Role: {role}</p>
              <p>Connected Systems: {connectedSystems.filter((item) => item.connected).length}/{connectedSystems.length}</p>
              <p>Active AI Agents: {aiAgents.filter((agent) => agent.status !== "Draft").length}</p>
              <p>Memory Context: {businessMemoryCollections.length} collections</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Suggested Questions</h4>
            {rolePreset.prompts.map((prompt) => (
              <SuggestedPromptChip key={`ctx-${prompt}`} text={prompt} onClick={() => setQuery(prompt)} />
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Recent Decisions</h4>
            {memoryTimeline.map((item) => (
              <TimelineCard key={item.title} title={item.title} detail={item.detail} severity={item.severity} />
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Pinned Insights</h4>
            {pinnedInsights.map((insight) => (
              <PinnedInsight key={insight} title="Pinned Insight" detail={insight} />
            ))}
          </div>
        </aside>
      </div>

      <section className="relative z-10 mt-3 grid gap-3 lg:grid-cols-4">
        <SurfaceCard className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Autonomous Monitoring</h3>
          <p className="text-xs text-slate-300">Revenue, sales, security, operations, finance, HR, and support are monitored continuously with smart alert thresholds.</p>
        </SurfaceCard>

        <SurfaceCard className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Smart Notifications</h3>
          <p className="text-xs text-slate-300">Priority inbox grouped by Urgent, High, Medium, and Low with contextual deduplication.</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-100">
            <span className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-2 py-1">Urgent 3</span>
            <span className="rounded-lg border border-amber-300/40 bg-amber-500/15 px-2 py-1">High 7</span>
            <span className="rounded-lg border border-blue-300/40 bg-blue-500/15 px-2 py-1">Medium 14</span>
            <span className="rounded-lg border border-slate-300/40 bg-slate-500/15 px-2 py-1">Low 22</span>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-2">
          <h3 className="text-sm font-semibold text-white">AIOS Universe Guide</h3>
          <p className="text-xs text-slate-300">Interactive guide to architecture, modules, workflows, memory, RBI, RBAC, and integrations.</p>
          <a href={`${baseHref}/architecture`} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100">
            <Globe2 className="h-4 w-4" /> Open Universe Guide
          </a>
        </SurfaceCard>

        <SurfaceCard className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Business Tutor</h3>
          <p className="text-xs text-slate-300">Interactive learning across finance, sales, operations, leadership, compliance, security, and KPI literacy.</p>
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <Lightbulb className="h-4 w-4 text-amber-200" />
            Personalized based on role and recent decisions
          </div>
        </SurfaceCard>
      </section>

      <section className="relative z-10 mt-3 grid gap-3 lg:grid-cols-2">
        <SurfaceCard className="space-y-3">
          <h3 className="text-sm font-semibold text-white">AI Agents</h3>
          <div className="grid gap-2">
            {aiAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Documents, Workflows, Integrations</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {knowledgeArticles.slice(0, 6).map((record) => (
              <DocumentCard key={record.id} record={record} />
            ))}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {workflows.slice(0, 6).map((record) => (
              <WorkflowCard key={record.id} record={record} />
            ))}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {connectedSystems.map((integration) => (
              <IntegrationCard key={integration.name} name={integration.name} connected={integration.connected} />
            ))}
          </div>
        </SurfaceCard>
      </section>

      <AnimatePresence>
        {actionConfirm ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm action"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-slate-100"
            >
              <h4 className="text-sm font-semibold">Confirm Action</h4>
              <p className="mt-2 text-xs text-slate-300">Do you want AIOS to execute: {actionConfirm}?</p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionConfirm(null)}
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApprovalCount((count) => count + 1)
                    setPinnedInsights((current) => [`Action executed: ${actionConfirm}.`, ...current].slice(0, 5))
                    setActionConfirm(null)
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <footer className={`relative z-10 mt-3 rounded-2xl border px-3 py-2 text-xs ${panelTone}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={textSoft}>Autonomous Business Operator mode: Recommend, Plan, Execute with approval, Monitor, Optimize, Learn.</p>
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-cyan-100"><Loader2 className="h-3.5 w-3.5 animate-spin" />Streaming</span>
            <span className="inline-flex items-center gap-1 text-emerald-100"><Volume2 className="h-3.5 w-3.5" />Voice {isVoiceOn ? "On" : "Ready"}</span>
            <span className="inline-flex items-center gap-1 text-violet-100"><Check className="h-3.5 w-3.5" />Approvals {approvalCount}</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
