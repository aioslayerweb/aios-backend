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
import { DecisionStatus, RiskLevel } from "@/src/domain"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useDecisionEngineContext } from "@/contexts/decision-engine-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useOrchestratorContext } from "@/contexts/orchestrator-context"
import { usePlanningEngineContext } from "@/contexts/planning-engine-context"
import { usePromptOSContext } from "@/contexts/prompt-os-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import type {
  ActivityStatus,
  GovernanceApprovalAction,
  GovernanceApprovalItem,
  GovernanceAuditTrailEntry,
  GovernanceComplianceItem,
  GovernanceDecisionHistoryItem,
  GovernanceEvidenceEvent,
  GovernancePolicyRule,
  GovernanceReasoningItem,
  GovernanceRiskItem,
  GovernanceState,
  GovernanceSummary,
} from "@/types"
import {
  createGovernanceDefaults,
  filterComplianceItems,
  filterGovernanceDecisions,
  governanceSummary,
  selectGovernanceApprovals,
  selectGovernanceEvidence,
  selectGovernanceReasoning,
  selectGovernanceRisk,
} from "@/utils/governance"

type GovernanceContextValue = GovernanceState & {
  filteredDecisions: GovernanceDecisionHistoryItem[]
  selectedDecision: GovernanceDecisionHistoryItem | null
  selectedReasoning: GovernanceReasoningItem | null
  selectedEvidence: GovernanceEvidenceEvent[]
  selectedApprovals: GovernanceApprovalItem[]
  filteredCompliance: GovernanceComplianceItem[]
  selectedRisk: GovernanceRiskItem | null
  summary: GovernanceSummary
  setSelectedDecisionId: (id: string) => void
  updateQuery: (query: string) => void
  setComplianceView: (view: GovernanceState["complianceView"]) => void
  setLiveMode: (enabled: boolean) => void
  applyApprovalAction: (approvalId: string, action: GovernanceApprovalAction) => void
}

const GovernanceContext = createContext<GovernanceContextValue | null>(null)

function logEntry(decisionId: string, actor: string, action: string, reason: string, source: string, result: GovernanceAuditTrailEntry["result"]): GovernanceAuditTrailEntry {
  return {
    id: `audit-${Date.now()}-${Math.round(Math.random() * 999)}`,
    timestamp: Date.now(),
    actor,
    action,
    reason,
    source,
    result,
    decisionId,
  }
}

function evidenceEvent(decisionId: string, category: GovernanceEvidenceEvent["category"], title: string, detail: string, source: string): GovernanceEvidenceEvent {
  return {
    id: `evidence-${Date.now()}-${Math.round(Math.random() * 999)}`,
    decisionId,
    timestamp: Date.now(),
    category,
    title,
    detail,
    source,
  }
}

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createGovernanceDefaults(), [])
  const runtimeLive = useRuntimeLiveContext()
  const planning = usePlanningEngineContext()
  const prompt = usePromptOSContext()
  const orchestrator = useOrchestratorContext()
  const decisionEngine = useDecisionEngineContext()
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()

  const [decisions, setDecisions] = useState(defaults.decisions)
  const [reasoning, setReasoning] = useState(defaults.reasoning)
  const [evidence, setEvidence] = useState(defaults.evidence)
  const [approvals, setApprovals] = useState(defaults.approvals)
  const [policies] = useState(defaults.policies)
  const [auditTrail, setAuditTrail] = useState(defaults.auditTrail)
  const [compliance, setCompliance] = useState(defaults.compliance)
  const [risk, setRisk] = useState(defaults.risk)
  const [selectedDecisionId, setSelectedDecisionIdState] = useState(defaults.selectedDecisionId)
  const [query, setQuery] = useState(defaults.query)
  const [complianceView, setComplianceView] = useState(defaults.complianceView)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const lastRuntimeEventId = useRef<string | null>(null)
  const lastOrchestratorMessageId = useRef<string | null>(null)
  const lastPromptValue = useRef<string | null>(null)

  useEffect(() => {
    setDecisions((previous) =>
      previous.map((item, index) => {
        const source = decisionEngine.queue[index]
        if (!source) {
          return item
        }

        return {
          ...item,
          priority: source.priorityScore,
          confidence: source.confidence,
          status: source.status,
          department: source.department,
          relatedWorkflow: source.recommendedActionId,
          responsibleAgent: source.owner,
          title: source.title,
        }
      })
    )
  }, [decisionEngine.queue])

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setRisk((previous) =>
        previous.map((item, index) => ({
          ...item,
          businessRisk: Math.max(20, Math.min(98, item.businessRisk + (index === 0 ? 1 : -1))),
          operationalRisk: Math.max(20, Math.min(95, item.operationalRisk + (index === 2 ? 1 : 0))),
          complianceRisk: Math.max(15, Math.min(90, item.complianceRisk + (index === 3 ? 1 : 0))),
          trend: index === 0 ? "up" : index === 3 ? "down" : item.trend,
          overallRisk:
            item.businessRisk > 88 || item.complianceRisk > 82
              ? RiskLevel.Critical
              : item.businessRisk > 72 || item.operationalRisk > 72 || item.complianceRisk > 72
                ? RiskLevel.High
                : item.businessRisk > 48 || item.operationalRisk > 48 || item.complianceRisk > 48
                  ? RiskLevel.Medium
                  : RiskLevel.Low,
        }))
      )
    }, 4200)

    return () => window.clearInterval(timer)
  }, [liveMode])

  useEffect(() => {
    const latest = runtimeLive.events[0]
    if (!latest || latest.id === lastRuntimeEventId.current) {
      return
    }

    lastRuntimeEventId.current = latest.id
    setEvidence((previous) => [evidenceEvent(selectedDecisionId, "event", "Runtime event captured", latest.title, "Runtime Engine"), ...previous].slice(0, 36))
    setAuditTrail((previous) => [logEntry(selectedDecisionId, "Runtime Engine", "Captured governance evidence", latest.title, "Event Processor", "success"), ...previous].slice(0, 48))
  }, [runtimeLive.events, selectedDecisionId])

  useEffect(() => {
    const latest = orchestrator.messages[0]
    if (!latest || latest.id === lastOrchestratorMessageId.current) {
      return
    }

    lastOrchestratorMessageId.current = latest.id
    setEvidence((previous) => [evidenceEvent(selectedDecisionId, "workflow", "Agent coordination update", latest.message, "Multi-Agent Orchestrator"), ...previous].slice(0, 36))
  }, [orchestrator.messages, selectedDecisionId])

  useEffect(() => {
    if (!prompt.prompt || prompt.prompt === lastPromptValue.current) {
      return
    }

    lastPromptValue.current = prompt.prompt
    setEvidence((previous) => [evidenceEvent(selectedDecisionId, "knowledge", "Prompt context updated", prompt.prompt.slice(0, 88), "Prompt OS"), ...previous].slice(0, 36))
  }, [prompt.prompt, selectedDecisionId])

  useEffect(() => {
    const selectedPlan = planning.selectedPlan
    if (!selectedPlan) {
      return
    }

    setReasoning((previous) =>
      previous.map((item) =>
        item.decisionId === selectedDecisionId
          ? {
              ...item,
              businessObjectives: Array.from(new Set([...item.businessObjectives, selectedPlan.objective])),
              supportingEvidence: Array.from(new Set([...item.supportingEvidence, `Planning Engine selected ${selectedPlan.objective} with ${selectedPlan.confidence}% confidence.`])),
            }
          : item
      )
    )
  }, [planning.selectedPlan, selectedDecisionId])

  const filteredDecisions = useMemo(() => filterGovernanceDecisions(decisions, query), [decisions, query])
  const filteredCompliance = useMemo(() => filterComplianceItems(compliance, complianceView), [compliance, complianceView])
  const selectedDecision = useMemo(() => decisions.find((item) => item.id === selectedDecisionId) ?? filteredDecisions[0] ?? null, [decisions, filteredDecisions, selectedDecisionId])
  const selectedReasoning = useMemo(() => selectGovernanceReasoning(reasoning, selectedDecision?.id ?? ""), [reasoning, selectedDecision?.id])
  const selectedEvidence = useMemo(() => selectGovernanceEvidence(evidence, selectedDecision?.id ?? ""), [evidence, selectedDecision?.id])
  const selectedApprovals = useMemo(() => selectGovernanceApprovals(approvals, selectedDecision?.id ?? ""), [approvals, selectedDecision?.id])
  const selectedRisk = useMemo(() => selectGovernanceRisk(risk, selectedDecision?.id ?? ""), [risk, selectedDecision?.id])
  const summary = useMemo(() => governanceSummary({ decisions, reasoning, evidence, approvals, policies, auditTrail, compliance, risk, selectedDecisionId, query, complianceView, liveMode }), [approvals, auditTrail, compliance, complianceView, decisions, evidence, liveMode, policies, query, reasoning, risk, selectedDecisionId])

  const setSelectedDecisionId = useCallback((id: string) => {
    setSelectedDecisionIdState(id)
  }, [])

  const writeActivity = useCallback(
    (title: string, description: string, decisionId: string, status: ActivityStatus) => {
      const decision = decisions.find((item) => item.id === decisionId)
      addActivity({
        id: `activity-governance-${Date.now()}`,
        title,
        summary: description,
        timestamp: Date.now(),
        category: "system-events",
        source: { key: "system", label: "Governance Center", workspace: "Executive" },
        actor: { id: "governance-center", name: "Governance Center", kind: "system" },
        priority: decision && decision.priority > 85 ? "high" : "medium",
        pinned: false,
        unread: true,
        metadata: {
          eventType: "AI Decision",
          workspace: "Executive",
          status,
          relatedObjects: decision ? [{ type: "decision", id: decision.id, label: decision.title }] : [],
          tags: ["governance", status],
        },
      })
    },
    [addActivity, decisions]
  )

  const applyApprovalAction = useCallback(
    (approvalId: string, action: GovernanceApprovalAction) => {
      const approval = approvals.find((item) => item.id === approvalId)
      if (!approval) {
        return
      }

      const nextStatus: GovernanceApprovalItem["status"] =
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : action === "request-review"
              ? "review"
              : action === "delegate"
                ? "delegated"
                : "escalated"

      setApprovals((previous) => previous.map((item) => (item.id === approvalId ? { ...item, status: nextStatus } : item)))
      setAuditTrail((previous) => [logEntry(approval.decisionId, "Governance Center", `Approval action: ${action}`, approval.rationale, "Approval Center", nextStatus === "rejected" ? "warning" : "review"), ...previous].slice(0, 48))
      setEvidence((previous) => [evidenceEvent(approval.decisionId, "approval", `Approval action: ${action}`, `${approval.title} changed to ${nextStatus}.`, "Approval Center"), ...previous].slice(0, 36))
      setDecisions((previous) =>
        previous.map((item) =>
          item.id === approval.decisionId
            ? {
                ...item,
                status:
                  action === "approve"
                    ? DecisionStatus.Approved
                    : action === "reject"
                      ? DecisionStatus.Rejected
                      : item.status,
              }
            : item
        )
      )
      addEntry({
        id: `governance-memory-${Date.now()}`,
        contextId: approval.decisionId,
        summary: `Governance action ${action} applied to ${approval.title}`,
        createdAt: Date.now(),
      })
      writeActivity("Governance action applied", `${approval.title} set to ${nextStatus}.`, approval.decisionId, action === "reject" ? "warning" : "completed")
      notify({
        title: "Governance action recorded",
        description: `${approval.title}: ${nextStatus}`,
        category: "AI",
        priority: "MEDIUM",
        level: "INFO",
        toast: true,
        autoDismissMs: 3200,
      })
      setCompliance((previous) =>
        previous.map((item) =>
          item.framework === "ISO 27001" && action === "escalate"
            ? { ...item, status: "attention", summary: "Escalated governance decisions require additional control review." }
            : item
        )
      )
    },
    [addEntry, approvals, notify, writeActivity]
  )

  const value = useMemo<GovernanceContextValue>(
    () => ({
      decisions,
      reasoning,
      evidence,
      approvals,
      policies,
      auditTrail,
      compliance,
      risk,
      selectedDecisionId: selectedDecision?.id ?? selectedDecisionId,
      query,
      complianceView,
      liveMode,
      filteredDecisions,
      selectedDecision,
      selectedReasoning,
      selectedEvidence,
      selectedApprovals,
      filteredCompliance,
      selectedRisk,
      summary,
      setSelectedDecisionId,
      updateQuery: setQuery,
      setComplianceView,
      setLiveMode,
      applyApprovalAction,
    }),
    [
      approvals,
      applyApprovalAction,
      auditTrail,
      compliance,
      complianceView,
      decisions,
      evidence,
      filteredCompliance,
      filteredDecisions,
      liveMode,
      policies,
      query,
      reasoning,
      risk,
      selectedApprovals,
      selectedDecision,
      selectedDecisionId,
      selectedEvidence,
      selectedReasoning,
      selectedRisk,
      setSelectedDecisionId,
      summary,
    ]
  )

  return <GovernanceContext.Provider value={value}>{children}</GovernanceContext.Provider>
}

export function useGovernanceContext() {
  const context = useContext(GovernanceContext)
  if (!context) {
    throw new Error("useGovernanceContext must be used within GovernanceProvider")
  }

  return context
}