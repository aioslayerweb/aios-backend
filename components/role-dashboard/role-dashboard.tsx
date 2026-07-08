"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DollarSign, Handshake, Sparkles, Target } from "lucide-react"
import AiInsightCard from "@/components/dashboard/AiInsightCard"
import KpiCard from "@/components/dashboard/KpiCard"
import AgentStatusCard from "@/components/dashboard/AgentStatusCard"
import RecentActivity from "@/components/dashboard/RecentActivity"
import { RoleAlertsPanel } from "@/components/role-alerts/role-alerts-panel"
import { RoleAgentsPanel } from "@/components/role-agents/role-agents-panel"
import { RoleIntelligenceHero } from "@/components/role-intelligence/role-intelligence-hero"
import { RoleInsightsPanel } from "@/components/role-insights/role-insights-panel"
import { RoleKPIsPanel } from "@/components/role-kpis/role-kpis-panel"
import { RoleSwitcher } from "@/components/role-switcher/role-switcher"
import { useRoleDashboard } from "@/hooks/use-role-dashboard"

type PlatformKpiMetric = {
  id: string
  metric_name: string
  value: number
  change_percent: number
  period: string
}

type PlatformInsight = {
  id: string
  title: string
  body: string
  action_label: string
  action_type: string
  priority: string
}

const kpiIcons = {
  Revenue: DollarSign,
  Deals: Handshake,
  Conversion: Target,
} as const

const kpiColors = {
  Revenue: "blue",
  Deals: "emerald",
  Conversion: "amber",
} as const

type RoleDashboardProps = {
  platformKpis: PlatformKpiMetric[]
  platformInsights: PlatformInsight[]
  loadingKpis: boolean
  loadingInsights: boolean
  actionFeedback: string | null
  onInsightAction: (insight: PlatformInsight) => void
}

function formatKpiValue(name: string, value: number): string {
  if (name === "Revenue") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (name === "Conversion") {
    return `${value}%`
  }

  return value.toString()
}

export function RoleDashboard({ platformKpis, platformInsights, loadingKpis, loadingInsights, actionFeedback, onInsightAction }: RoleDashboardProps) {
  const shouldReduceMotion = useReducedMotion()
  const { availableRoles, currentRole, effectiveRole, previewRole, roleDashboard, simulationEnabled } = useRoleDashboard()

  return (
    <div className="space-y-6">
      <RoleIntelligenceHero
        effectiveRole={effectiveRole}
        currentRole={currentRole}
        previewRole={previewRole}
        simulationEnabled={simulationEnabled}
        summaryPoints={roleDashboard.summaryPoints}
      />

      <RoleSwitcher />

      {actionFeedback ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
        >
          <Sparkles className="mr-2 inline-block h-4 w-4" />
          {actionFeedback}
        </motion.div>
      ) : null}

      <RoleKPIsPanel />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <RoleInsightsPanel />

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-border bg-white p-5 shadow-sm"
            aria-label="Role recommendations"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Role recommendations</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">Actions, workflows, and prompts for this role</h2>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {roleDashboard.recommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-950">{recommendation.title}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200">
                      {recommendation.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{recommendation.reason}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-700">Action:</span> {recommendation.action}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-700">Expected outcome:</span> {recommendation.expectedOutcome}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {roleDashboard.workflows.map((workflow) => (
                <div key={workflow.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-950">{workflow.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{workflow.reason}</p>
                  <p className="mt-2 text-xs text-slate-500">{workflow.owner} · {workflow.status}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {roleDashboard.prompts.map((prompt) => (
                <div key={prompt.id} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-950">{prompt.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{prompt.prompt}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-700">{prompt.context}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-border bg-white p-5 shadow-sm"
            aria-label="Platform telemetry"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Platform telemetry</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">Shared platform health for {availableRoles.length} role profiles</h2>
              </div>
              <p className="text-sm text-slate-500">The role lens adapts the home view without removing runtime signals.</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loadingKpis
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-slate-100" />
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="mb-2 h-7 w-24 rounded bg-slate-100" />
                      <div className="mb-1 h-4 w-32 rounded bg-slate-100" />
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                  ))
                : platformKpis.map((kpi) => (
                    <KpiCard
                      key={kpi.id}
                      title={kpi.metric_name}
                      value={formatKpiValue(kpi.metric_name, kpi.value)}
                      change={kpi.change_percent}
                      period={kpi.period}
                      icon={kpiIcons[kpi.metric_name as keyof typeof kpiIcons] ?? Target}
                      color={kpiColors[kpi.metric_name as keyof typeof kpiColors] ?? "blue"}
                    />
                  ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <AiInsightCard insights={platformInsights} onAction={onInsightAction} loading={loadingInsights} />
              </div>
              <div className="space-y-6">
                <AgentStatusCard />
                <div className="rounded-xl bg-gradient-to-br from-blue-950 to-sky-600 p-6 text-white shadow-md">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-80">AIOS runtime</p>
                  <p className="mb-1 text-lg font-bold">Role-aware execution active</p>
                  <p className="mb-4 text-sm leading-relaxed opacity-80">The active role lens is layered on top of the platform runtime, memory, planning, and decision signals.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white/15 px-3 py-2 text-center">
                      <p className="text-xl font-bold">{roleDashboard.kpis.length}</p>
                      <p className="text-xs opacity-75">Role KPIs</p>
                    </div>
                    <div className="rounded-lg bg-white/15 px-3 py-2 text-center">
                      <p className="text-xl font-bold">{roleDashboard.recommendations.length}</p>
                      <p className="text-xs opacity-75">Recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <RecentActivity />
        </div>

        <div className="space-y-6">
          <RoleAgentsPanel />
          <RoleAlertsPanel />
        </div>
      </div>
    </div>
  )
}