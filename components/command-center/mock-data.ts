import {
  BellRing,
  Database,
  FileText,
  LineChart,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { CommandCenterData } from "./types";

export const commandCenterData: CommandCenterData = {
  suggestions: [
    { id: "s1", label: "Show today's executive priorities", category: "priority" },
    { id: "s2", label: "Prepare board meeting briefing", category: "workflow" },
    { id: "s3", label: "Analyze customer churn risk", category: "risk" },
    { id: "s4", label: "Launch Sales Workflow", category: "workflow" },
    { id: "s5", label: "Ask Finance Agent for forecast", category: "agent" },
    { id: "s6", label: "Find GDPR documentation", category: "knowledge" },
    { id: "s7", label: "Summarize company memory", category: "knowledge" },
  ],
  chips: [
    { id: "c1", label: "Q3 Strategy", tone: "info" },
    { id: "c2", label: "North America", tone: "neutral" },
    { id: "c3", label: "Board Prep", tone: "warning" },
    { id: "c4", label: "Finance Agent", tone: "success" },
  ],
  leftNavigation: [
    { id: "ln1", label: "Command Center", href: "/app/commands", meta: "Active" },
    { id: "ln2", label: "Executive Center", href: "/app/executive", meta: "Workspace" },
    { id: "ln3", label: "Decision Engine", href: "/app/decisions", meta: "5 pending" },
    { id: "ln4", label: "Workflow Orchestrator", href: "/app/workflows", meta: "37 running" },
    { id: "ln5", label: "Knowledge Graph", href: "/app/knowledge", meta: "128 sources" },
  ],
  favorites: [
    { id: "f1", label: "Board Briefing", href: "/app/reports", meta: "Updated 12m" },
    { id: "f2", label: "Revenue Pulse", href: "/app/insights", meta: "High impact" },
    { id: "f3", label: "Security Ops", href: "/app/security", meta: "2 alerts" },
  ],
  recentWorkspaces: [
    { id: "rw1", label: "QBR Planning", href: "/app/planning", meta: "Today" },
    { id: "rw2", label: "Global Accounts", href: "/app/customers", meta: "1h ago" },
    { id: "rw3", label: "Go-to-Market Sync", href: "/app/corporate", meta: "2h ago" },
  ],
  agentShortcuts: [
    { id: "a1", label: "Finance Agent", href: "/app/agents", meta: "Forecast" },
    { id: "a2", label: "Sales Agent", href: "/app/agents", meta: "Pipeline" },
    { id: "a3", label: "Legal Agent", href: "/app/agents", meta: "Compliance" },
    { id: "a4", label: "Ops Agent", href: "/app/agents", meta: "Execution" },
  ],
  quickActions: [
    { id: "qa1", label: "Board Briefing", href: "#" },
    { id: "qa2", label: "Launch Workflow", href: "#" },
    { id: "qa3", label: "Escalate Alert", href: "#" },
    { id: "qa4", label: "Sync Memory", href: "#" },
  ],
  metrics: [
    { id: "m1", label: "Active Agents", value: "12", trend: "+2", tone: "good" },
    { id: "m2", label: "Org Confidence", value: "96%", trend: "+1.4%", tone: "good" },
    { id: "m3", label: "Pending Decisions", value: "5", trend: "2 urgent", tone: "warn" },
    { id: "m4", label: "Critical Alerts", value: "2", trend: "watch", tone: "critical" },
    { id: "m5", label: "Running Workflows", value: "37", trend: "+4", tone: "neutral" },
    { id: "m6", label: "Knowledge Sources", value: "128", trend: "+7", tone: "good" },
  ],
  priorities: [
    { id: "p1", title: "Protect renewal pipeline in EMEA", owner: "CRO", due: "Today 16:00", score: 94 },
    { id: "p2", title: "Finalize board financial narrative", owner: "CFO", due: "Tomorrow 09:00", score: 91 },
    { id: "p3", title: "Resolve SOC-2 evidence gap", owner: "Security", due: "Tomorrow 11:00", score: 88 },
  ],
  decisions: [
    { id: "d1", title: "Approve churn recovery campaign", impact: "€420k ARR at risk", confidence: 92, status: "pending" },
    { id: "d2", title: "Increase enterprise sales coverage", impact: "Q4 pipeline +14%", confidence: 86, status: "pending" },
    { id: "d3", title: "Pause low-yield demand spend", impact: "Budget efficiency +9%", confidence: 84, status: "approved" },
  ],
  workflows: [
    { id: "w1", name: "Board Briefing Automation", stage: "Executive Summary", owner: "Finance Agent", progress: 72 },
    { id: "w2", name: "Churn Risk Escalation", stage: "Risk Triage", owner: "Sales Agent", progress: 48 },
    { id: "w3", name: "Compliance Evidence Collection", stage: "Policy Mapping", owner: "Legal Agent", progress: 63 },
  ],
  recommendations: [
    { id: "r1", label: "Shift 8% budget from low-converting channels into enterprise ABM", href: "#", meta: "Confidence 89%" },
    { id: "r2", label: "Launch retention playbook for top 20 at-risk accounts", href: "#", meta: "Expected ARR protection: €1.1M" },
    { id: "r3", label: "Escalate vendor security review before expansion launch", href: "#", meta: "Risk severity: High" },
  ],
  recentActivity: [
    { id: "ra1", label: "Finance Agent published Q3 variance insight", href: "#", meta: "9m ago" },
    { id: "ra2", label: "Workflow Queue added 4 execution items", href: "#", meta: "21m ago" },
    { id: "ra3", label: "Legal Agent flagged GDPR processing clause", href: "#", meta: "33m ago" },
  ],
  memorySummary: [
    { id: "ms1", label: "Revenue slowdown pattern detected across 3 regions", href: "#", meta: "Memory confidence 91%" },
    { id: "ms2", label: "Procurement bottleneck recurring in onboarding", href: "#", meta: "Memory depth 6 cycles" },
  ],
  knowledgeSummary: [
    { id: "ks1", label: "12 policy documents updated in Governance domain", href: "#", meta: "Today" },
    { id: "ks2", label: "New board compliance template synced", href: "#", meta: "Yesterday" },
  ],
  agents: [
    { id: "ag1", name: "Finance Agent", role: "Forecasting", status: "active", tasks: 7 },
    { id: "ag2", name: "Sales Agent", role: "Pipeline Intelligence", status: "active", tasks: 9 },
    { id: "ag3", name: "Legal Agent", role: "Compliance", status: "attention", tasks: 3 },
    { id: "ag4", name: "Operations Agent", role: "Execution", status: "idle", tasks: 2 },
  ],
  notifications: [
    { id: "n1", title: "2 critical alerts require executive approval", detail: "Security and compliance workflows are blocked.", time: "Now", severity: "critical" },
    { id: "n2", title: "Board briefing draft generated", detail: "Finance Agent prepared version 3 for review.", time: "14m", severity: "info" },
    { id: "n3", title: "Churn risk increased in enterprise segment", detail: "14 accounts moved to high-risk band.", time: "22m", severity: "warning" },
  ],
  meetings: [
    { id: "mt1", title: "Executive Ops Review", time: "09:30", audience: "CEO, COO, CFO" },
    { id: "mt2", title: "Board Prep Sync", time: "13:00", audience: "CEO, CFO" },
    { id: "mt3", title: "Security Risk Council", time: "16:30", audience: "CTO, CISO" },
  ],
  connectedSystems: [
    { id: "cs1", name: "Salesforce", state: "connected", icon: Wallet },
    { id: "cs2", name: "SAP", state: "connected", icon: LineChart },
    { id: "cs3", name: "Confluence", state: "connected", icon: FileText },
    { id: "cs4", name: "Data Warehouse", state: "degraded", icon: Database },
    { id: "cs5", name: "Security Center", state: "connected", icon: ShieldCheck },
    { id: "cs6", name: "Alert Stream", state: "connected", icon: BellRing },
  ],
  enterpriseInsights: [
    { id: "ei1", label: "Operating margin expected to improve 2.3% if workflow backlog drops below 20", href: "#" },
    { id: "ei2", label: "Customer expansion likelihood up 11% in accounts with weekly executive touchpoints", href: "#" },
    { id: "ei3", label: "Top strategic risk this week: delayed legal review in EMEA contracts", href: "#" },
  ],
};
