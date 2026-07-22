"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  HandCoins,
  Link2,
  Sparkles,
} from "lucide-react"
import type { ReactNode } from "react"
import type { EntityRecord, Recommendation } from "./data"

function statusTone(status: EntityRecord["status"]): string {
  switch (status) {
    case "Healthy":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    case "Attention":
      return "border-amber-400/40 bg-amber-500/10 text-amber-100"
    case "Critical":
      return "border-rose-400/40 bg-rose-500/10 text-rose-100"
    case "Approved":
      return "border-sky-400/40 bg-sky-500/10 text-sky-100"
    case "In Progress":
      return "border-violet-400/40 bg-violet-500/10 text-violet-100"
    default:
      return "border-slate-400/40 bg-slate-400/10 text-slate-200"
  }
}

function priorityTone(priority: Recommendation["priority"]): string {
  if (priority === "Urgent") return "border-rose-400/40 bg-rose-500/10 text-rose-200"
  if (priority === "High") return "border-amber-400/40 bg-amber-500/10 text-amber-100"
  if (priority === "Medium") return "border-blue-400/40 bg-blue-500/10 text-blue-100"
  return "border-slate-400/40 bg-slate-500/10 text-slate-100"
}

export function SurfaceCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.article>
  )
}

export function AIBubble({ text, from = "assistant" }: { text: string; from?: "assistant" | "user" }) {
  const base = from === "assistant"
    ? "border-blue-400/30 bg-blue-500/10 text-blue-50"
    : "border-cyan-400/30 bg-cyan-500/10 text-cyan-50"

  return (
    <div className={`max-w-[90%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${base}`}>
      {text}
    </div>
  )
}

export function ThinkingBubble({ step }: { step: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{step}</span>
    </div>
  )
}

export function ConfidenceIndicator({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-200">
        <span>Confidence</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function SourceCitation({ source, detail }: { source: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-xs text-slate-300">
      <p className="font-semibold text-slate-100">{source}</p>
      <p className="mt-1">{detail}</p>
    </div>
  )
}

export function RecommendationCard({
  item,
  onApprove,
  onReject,
  onDetails,
}: {
  item: Recommendation
  onApprove: () => void
  onReject: () => void
  onDetails: () => void
}) {
  return (
    <SurfaceCard className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityTone(item.priority)}`}>
          {item.priority}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Impact: {item.impact}</div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">ROI: {item.roi}</div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Risk: {item.risk}</div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Savings: {item.estimatedSavings}</div>
      </div>
      <ConfidenceIndicator value={item.confidence} />
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button type="button" className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-emerald-100" onClick={onApprove}>Approve</button>
        <button type="button" className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-rose-100" onClick={onReject}>Reject</button>
        <button type="button" className="rounded-lg border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-blue-100" onClick={onDetails}>More Details</button>
      </div>
    </SurfaceCard>
  )
}

export function ApprovalCard({ title, owner, amount, onApprove }: { title: string; owner: string; amount: string; onApprove: () => void }) {
  return (
    <SurfaceCard className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <HandCoins className="h-4 w-4 text-amber-200" aria-hidden="true" />
      </div>
      <p className="text-xs text-slate-200">Owner: {owner}</p>
      <p className="text-xs text-slate-200">Amount: {amount}</p>
      <button type="button" onClick={onApprove} className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100">
        Approve Action <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </SurfaceCard>
  )
}

export function ForecastCard({ label, value, points }: { label: string; value: string; points: number[] }) {
  return (
    <SurfaceCard className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      <div className="flex h-20 items-end gap-1 rounded-xl border border-white/10 bg-slate-900/40 p-2">
        {points.map((point, index) => (
          <div key={`${label}-${index}`} className="flex-1 rounded-sm bg-gradient-to-t from-blue-500 to-cyan-300" style={{ height: `${Math.max(10, point)}%` }} />
        ))}
      </div>
    </SurfaceCard>
  )
}

export function BusinessHealthCard({ area, score, trend }: { area: string; score: number; trend: string }) {
  return (
    <SurfaceCard className="space-y-3">
      <p className="text-xs uppercase tracking-wide text-slate-300">{area}</p>
      <div className="relative mx-auto h-20 w-20 rounded-full border border-white/10 bg-slate-900/40">
        <div
          className="absolute inset-2 rounded-full border-4 border-cyan-300"
          style={{ clipPath: `inset(${100 - score}% 0 0 0)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">{score}</div>
      </div>
      <p className="text-center text-xs text-emerald-200">{trend}</p>
    </SurfaceCard>
  )
}

export function RootCauseTree({ nodes }: { nodes: Array<{ label: string; confidence: number; severity: "High" | "Medium" | "Low" }> }) {
  return (
    <SurfaceCard className="space-y-3">
      <h4 className="text-sm font-semibold text-white">Root Cause Analysis Tree</h4>
      <ul className="space-y-2">
        {nodes.map((node) => (
          <li key={node.label} className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-slate-100">
            <div className="flex items-center justify-between">
              <span>{node.label}</span>
              <span className="text-cyan-200">{node.confidence}%</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300">Severity: {node.severity}</p>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  )
}

export function ScenarioSimulator({
  price,
  hiring,
  churn,
  onPrice,
  onHiring,
  onChurn,
}: {
  price: number
  hiring: number
  churn: number
  onPrice: (value: number) => void
  onHiring: (value: number) => void
  onChurn: (value: number) => void
}) {
  const projectedRevenue = 42.2 + (price * 0.12) + (hiring * 0.18) - (churn * 0.26)
  const projectedMargin = 55 + (price * 0.24) - (hiring * 0.1) - (churn * 0.15)

  return (
    <SurfaceCard className="space-y-4">
      <h4 className="text-sm font-semibold text-white">Scenario Planning Simulator</h4>
      <label className="block text-xs text-slate-200">
        Increase prices (%): {price}
        <input type="range" min={0} max={20} value={price} onChange={(event) => onPrice(Number(event.target.value))} className="mt-2 w-full" />
      </label>
      <label className="block text-xs text-slate-200">
        Hire employees (count): {hiring}
        <input type="range" min={0} max={30} value={hiring} onChange={(event) => onHiring(Number(event.target.value))} className="mt-2 w-full" />
      </label>
      <label className="block text-xs text-slate-200">
        Customer loss events: {churn}
        <input type="range" min={0} max={12} value={churn} onChange={(event) => onChurn(Number(event.target.value))} className="mt-2 w-full" />
      </label>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-100">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Projected Revenue: ${projectedRevenue.toFixed(1)}M</div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Projected Margin: {projectedMargin.toFixed(1)}%</div>
      </div>
    </SurfaceCard>
  )
}

export function AgentCard({ agent }: { agent: EntityRecord }) {
  return (
    <SurfaceCard className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{agent.name}</h4>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusTone(agent.status)}`}>{agent.status}</span>
      </div>
      <p className="text-xs text-slate-300">{agent.summary}</p>
      <p className="text-xs text-slate-200">{agent.value}</p>
    </SurfaceCard>
  )
}

export function MemoryCard({ record }: { record: EntityRecord }) {
  return (
    <SurfaceCard className="space-y-2">
      <p className="text-xs text-slate-400">{record.updatedAt}</p>
      <h4 className="text-sm font-semibold text-white">{record.name}</h4>
      <p className="text-xs text-slate-300">{record.summary}</p>
      <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200">Owner: {record.owner}</div>
    </SurfaceCard>
  )
}

export function DocumentCard({ record }: { record: EntityRecord }) {
  return (
    <SurfaceCard className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{record.name}</h4>
        <FileText className="h-4 w-4 text-slate-300" aria-hidden="true" />
      </div>
      <p className="text-xs text-slate-300">{record.summary}</p>
      <p className="text-xs text-slate-200">Ref: {record.value}</p>
    </SurfaceCard>
  )
}

export function WorkflowCard({ record }: { record: EntityRecord }) {
  return (
    <SurfaceCard className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{record.name}</h4>
        <Clock3 className="h-4 w-4 text-cyan-200" aria-hidden="true" />
      </div>
      <p className="text-xs text-slate-300">{record.summary}</p>
      <p className="text-xs text-slate-200">{record.value}</p>
    </SurfaceCard>
  )
}

export function IntegrationCard({ name, connected }: { name: string; connected: boolean }) {
  return (
    <SurfaceCard className="flex items-center justify-between gap-3">
      <div>
        <h4 className="text-sm font-semibold text-white">{name}</h4>
        <p className="text-xs text-slate-300">{connected ? "Connected and healthy" : "Ready to connect"}</p>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] ${connected ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" : "border-slate-400/30 bg-slate-500/10 text-slate-200"}`}>
        <Link2 className="h-3 w-3" />
        {connected ? "Connected" : "Pending"}
      </span>
    </SurfaceCard>
  )
}

export function TimelineCard({ title, detail, severity }: { title: string; detail: string; severity: "info" | "warning" | "critical" }) {
  const tone = severity === "critical"
    ? "text-rose-200 border-rose-400/40 bg-rose-500/10"
    : severity === "warning"
      ? "text-amber-100 border-amber-400/40 bg-amber-500/10"
      : "text-sky-100 border-sky-400/40 bg-sky-500/10"

  return (
    <div className={`rounded-xl border px-3 py-2 text-xs ${tone}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-[11px] opacity-90">{detail}</p>
    </div>
  )
}

export function PermissionCard({ message, onRequest }: { message: string; onRequest: () => void }) {
  return (
    <SurfaceCard className="space-y-3 border-rose-400/30 bg-rose-500/10">
      <div className="flex items-center gap-2 text-rose-100">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <h4 className="text-sm font-semibold">Permission Required</h4>
      </div>
      <p className="text-xs text-rose-100/90">{message}</p>
      <button type="button" className="rounded-lg border border-rose-300/50 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-100" onClick={onRequest}>
        Request Access
      </button>
    </SurfaceCard>
  )
}

export function PriorityBadge({ level }: { level: "Urgent" | "High" | "Medium" | "Low" }) {
  return (
    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityTone(level as Recommendation["priority"] )}`}>
      {level}
    </span>
  )
}

export function BusinessImpactBadge({ value }: { value: string }) {
  return <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-100">Impact {value}</span>
}

export function ROIBadge({ value }: { value: string }) {
  return <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-100">ROI {value}</span>
}

export function SuggestedPromptChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-left text-xs text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-500/10"
    >
      {text}
    </button>
  )
}

export function PinnedInsight({ title, detail }: { title: string; detail: string }) {
  return (
    <SurfaceCard className="space-y-2">
      <div className="flex items-center gap-2 text-cyan-100">
        <CheckCircle2 className="h-4 w-4" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <p className="text-xs text-slate-300">{detail}</p>
    </SurfaceCard>
  )
}
