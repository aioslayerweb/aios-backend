"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Cable, Clock3, KeyRound, ShieldCheck, Workflow } from "lucide-react"
import {
  useAvailableIntegrations,
  useConnectionManager,
  useIntegrationHealth,
  useIntegrationLogs,
  useIntegrations,
  useSyncStatus,
} from "@/hooks"
import { integrationAuthLabel, integrationHealthLabel, integrationHealthTone, type IntegrationCategory } from "@/lib/integrations"
import { Button, StatusIndicator } from "@/components/ui"
import { cn } from "@/utils"

const categoryLabels: Record<IntegrationCategory, string> = {
  communication: "Communication",
  crm: "CRM",
  erp: "ERP",
  finance: "Finance",
  support: "Support",
  storage: "Storage",
  knowledge: "Knowledge",
  productivity: "Productivity",
  marketing: "Marketing",
  hr: "HR",
}

const surfaceMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

function toneClass(tone: ReturnType<typeof integrationHealthTone>) {
  switch (tone) {
    case "success":
      return "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)] ring-1 ring-emerald-100"
    case "warning":
      return "bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)] ring-1 ring-amber-100"
    case "error":
      return "bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)] ring-1 ring-rose-100"
    case "info":
      return "bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)] ring-1 ring-sky-100"
  }
}

function syncBarClass(status: "queued" | "running" | "completed" | "failed") {
  switch (status) {
    case "queued":
      return "bg-amber-400"
    case "running":
      return "bg-brand-primary"
    case "completed":
      return "bg-semantic-success"
    case "failed":
      return "bg-semantic-error"
  }
}

export function IntegrationHubView() {
  const reduceMotion = useReducedMotion()
  const { filteredAvailableIntegrations, selectedCategory, setSelectedCategory } = useAvailableIntegrations()
  const { connectedSystems, healthSummary } = useIntegrationHealth()
  const { connectSystem, pauseSystem } = useConnectionManager()
  const { syncJobs, syncSummary, triggerSync } = useSyncStatus()
  const { logs, retryLog } = useIntegrationLogs()
  const { activities, touchpoints, developerMode, toggleDeveloperMode, developerTools } = useIntegrations()

  const categoryOptions = useMemo(
    () => ["all", ...Object.keys(categoryLabels)] as Array<IntegrationCategory | "all">,
    []
  )

  const groupedIntegrations = useMemo(() => {
    const groups = new Map<IntegrationCategory, typeof filteredAvailableIntegrations>()

    for (const integration of filteredAvailableIntegrations) {
      const current = groups.get(integration.category) ?? []
      groups.set(integration.category, [...current, integration])
    }

    return Array.from(groups.entries())
  }, [filteredAvailableIntegrations])

  const highRiskSystems = useMemo(
    () => connectedSystems.filter((system) => system.health === "warning" || system.health === "offline" || system.health === "rate-limited" || system.health === "auth-required").length,
    [connectedSystems]
  )

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : surfaceMotion.initial}
        animate={reduceMotion ? undefined : surfaceMotion.animate}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-[var(--color-semantic-info)] bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Enterprise Integration Center overview"
      >
        <div className="relative bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-100/60 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Enterprise Integration Center</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">
                AIOS becomes the enterprise intelligence layer across every business platform.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Adapter-based integration control for synchronization, authentication, health, replay, and orchestration across the digital ecosystem. External providers remain mocked where production APIs are not yet available.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-semantic-info-soft)] px-3 py-1 text-xs font-medium text-[var(--color-semantic-info-text)] ring-1 ring-sky-100">Adapter architecture</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Runtime Engine linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Memory Layer linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Prompt OS linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Workflow Builder linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[460px]">
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Connected systems</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{connectedSystems.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Extensible adapters registered in the integration provider.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">High attention</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{highRiskSystems}</p>
                <p className="mt-1 text-xs text-text-secondary">Warnings, offline systems, rate limits, or auth-required states.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Synchronization</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{syncSummary.running}</p>
                <p className="mt-1 text-xs text-text-secondary">Running sync pipelines now across adapter queues.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Developer mode</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={developerMode ? "info" : "neutral"} label={developerMode ? "Enabled" : "Disabled"} />
                  <Button variant="secondary" size="sm" onClick={toggleDeveloperMode} aria-pressed={developerMode}>
                    {developerMode ? "Hide" : "Show"}
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <main className="space-y-4" aria-label="Integration center primary content">
          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.04 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="Connected systems"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Connected Systems</p>
                <h2 className="mt-1 text-xl font-semibold text-brand-navy">Live connection control across the organization</h2>
                <p className="mt-1 text-sm text-text-secondary">Every card tracks health, authentication, synchronization depth, and linked AIOS surfaces.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {healthSummary.map((item) => (
                  <span key={item.state} className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", toneClass(integrationHealthTone(item.state)))}>
                    {integrationHealthLabel(item.state)} {item.count}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {connectedSystems.map((system, index) => {
                const tone = integrationHealthTone(system.health)

                return (
                  <motion.article
                    key={system.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: reduceMotion ? 0 : index * 0.02 }}
                    className="rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-semantic-info-soft)] text-sm font-semibold text-brand-primary ring-1 ring-sky-100">
                            {system.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-brand-navy">{system.name}</h3>
                            <p className="text-xs text-text-muted">{categoryLabels[system.category]}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", toneClass(tone))}>{integrationHealthLabel(system.health)}</span>
                        {system.mock ? <span className="text-[11px] text-text-muted">Mock adapter state</span> : null}
                      </div>
                    </div>

                    <p className="mt-3 min-h-[40px] text-xs leading-5 text-text-secondary">{system.statusDetail}</p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-text-muted">Last sync</p>
                        <p className="mt-1 text-sm font-medium text-brand-navy">{system.lastSync}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-text-muted">Objects synchronized</p>
                        <p className="mt-1 text-sm font-medium text-brand-navy">{system.synchronizedObjects.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-text-muted">Authentication</p>
                        <p className="mt-1 text-sm font-medium capitalize text-brand-navy">{integrationAuthLabel(system.authState)}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-text-muted">Errors</p>
                        <p className="mt-1 text-sm font-medium text-brand-navy">{system.errors}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {system.linkedModules.map((module) => (
                        <span key={module} className="rounded-full border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] px-2 py-1 text-[11px] text-[var(--color-semantic-info-text)]">
                          {module}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="primary" size="sm" onClick={() => connectSystem(system.id)}>
                        Connect
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => triggerSync(system.id, system.supportedObjects[0])}>
                        Sync now
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => pauseSystem(system.id)}>
                        {system.health === "paused" ? "Resume" : "Pause"}
                      </Button>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="Available integrations"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Available Integrations</p>
                <h2 className="mt-1 text-xl font-semibold text-brand-navy">Adapter gallery grouped by business domain</h2>
                <p className="mt-1 text-sm text-text-secondary">Future providers only require a new adapter definition and provider implementation.</p>
              </div>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Integration category filters">
                {categoryOptions.map((category) => {
                  const active = selectedCategory === category
                  const label = category === "all" ? "All" : categoryLabels[category]

                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        active ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary hover:bg-surface-muted"
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {groupedIntegrations.map(([category, integrations]) => (
                <section key={category} aria-label={`${categoryLabels[category]} integrations`}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-brand-navy">{categoryLabels[category]}</h3>
                    <span className="text-xs text-text-muted">{integrations.length} providers</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {integrations.map((integration) => (
                      <article key={integration.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-brand-navy">{integration.name}</h4>
                            <p className="mt-1 text-xs leading-5 text-text-secondary">{integration.description}</p>
                          </div>
                          <span className={cn("rounded-full px-2 py-1 text-[11px] font-medium", integration.status === "connected" ? "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]" : "bg-slate-100 text-slate-700")}>
                            {integration.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {integration.authMethods.map((method) => (
                            <span key={method} className="rounded-full border border-border bg-white px-2 py-1 text-[11px] uppercase tracking-wide text-text-muted">
                              {method}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-[11px] text-text-muted">Objects: {integration.supportedObjects.join(", ")}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </motion.section>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <motion.section
              initial={reduceMotion ? false : surfaceMotion.initial}
              animate={reduceMotion ? undefined : surfaceMotion.animate}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm"
              aria-label="Synchronization dashboard"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">Synchronization</p>
                  <h2 className="mt-1 text-xl font-semibold text-brand-navy">Queue and object flow visibility</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                  <span>Queued {syncSummary.queued}</span>
                  <span>Running {syncSummary.running}</span>
                  <span>Completed {syncSummary.completed}</span>
                  <span>Failed {syncSummary.failed}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {syncJobs.map((job) => {
                  const total = Math.max(1, job.queued + job.running + job.completed + job.failed)
                  const completedWidth = Math.max(8, Math.round((job.completed / total) * 100))

                  return (
                    <article key={job.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-brand-navy">{job.systemName}</p>
                          <p className="text-xs capitalize text-text-muted">{job.object} • {job.updatedAt}</p>
                        </div>
                        <StatusIndicator tone={job.status === "failed" ? "error" : job.status === "completed" ? "success" : job.status === "running" ? "info" : "warning"} label={job.status} />
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          className={cn("h-full rounded-full", syncBarClass(job.status))}
                          initial={reduceMotion ? false : { width: 0 }}
                          animate={{ width: `${completedWidth}%` }}
                          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Queued</p><p className="mt-1 font-semibold text-brand-navy">{job.queued}</p></div>
                        <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Running</p><p className="mt-1 font-semibold text-brand-navy">{job.running}</p></div>
                        <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Completed</p><p className="mt-1 font-semibold text-brand-navy">{job.completed}</p></div>
                        <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Failed</p><p className="mt-1 font-semibold text-brand-navy">{job.failed}</p></div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </motion.section>

            <motion.section
              initial={reduceMotion ? false : surfaceMotion.initial}
              animate={reduceMotion ? undefined : surfaceMotion.animate}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm"
              aria-label="Authentication architecture"
            >
              <p className="text-xs uppercase tracking-wide text-text-muted">Authentication</p>
              <h2 className="mt-1 text-xl font-semibold text-brand-navy">Enterprise connection architecture</h2>
              <div className="mt-4 space-y-3">
                <article className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-brand-navy"><KeyRound className="h-4 w-4" /><p className="text-sm font-semibold">OAuth + Enterprise SSO</p></div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">Preferred for Microsoft 365, Google Workspace, Salesforce, and other delegated enterprise access providers.</p>
                </article>
                <article className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-brand-navy"><ShieldCheck className="h-4 w-4" /><p className="text-sm font-semibold">API keys + service accounts</p></div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">Available for finance, storage, and backend business systems when delegated user auth is not appropriate.</p>
                </article>
                <article className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-brand-navy"><Clock3 className="h-4 w-4" /><p className="text-sm font-semibold">Connection states</p></div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">Healthy, warning, offline, authentication required, rate limited, and paused are all first-class adapter states.</p>
                </article>
              </div>
            </motion.section>
          </div>
        </main>

        <aside className="space-y-4" aria-label="Integration center secondary content">
          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="AIOS touchpoints"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted">AIOS Integration Touchpoints</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy">Internal systems already connected</h2>
            <div className="mt-4 space-y-3">
              {touchpoints.map((touchpoint, index) => (
                <motion.article
                  key={touchpoint.id}
                  initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.03 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{touchpoint.name}</p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">{touchpoint.description}</p>
                    </div>
                    <StatusIndicator tone={touchpoint.state === "ready" ? "success" : touchpoint.state === "replaying" ? "warning" : "info"} label={touchpoint.state} />
                  </div>
                  <p className="mt-2 text-[11px] text-text-muted">{touchpoint.adapterCount} adapters share this control path.</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.14 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="Recent activity"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted">Activity</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy">Recent integration activity</h2>
            <div className="mt-4 space-y-3">
              {activities.map((activity) => (
                <article key={activity.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{activity.title}</p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">{activity.detail}</p>
                    </div>
                    <StatusIndicator tone={activity.status === "warning" ? "warning" : activity.status === "updated" ? "info" : "success"} label={activity.timestamp} />
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-text-muted">Source {activity.source}</p>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.18 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="Integration logs"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted">Logs</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy">Integration execution log</h2>
            <div className="mt-4 space-y-3">
              {logs.map((log) => (
                <article key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{log.source} <span className="text-text-muted">to</span> {log.target}</p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">{log.detail}</p>
                    </div>
                    <StatusIndicator tone={log.status === "failed" ? "error" : log.status === "warning" ? "warning" : "success"} label={log.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                    <span>{log.timestamp}</span>
                    <span>{log.duration}</span>
                  </div>
                  {log.retryable ? (
                    <Button className="mt-3" variant="secondary" size="sm" onClick={() => retryLog(log.id)}>
                      Retry
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={reduceMotion ? false : surfaceMotion.initial}
            animate={reduceMotion ? undefined : surfaceMotion.animate}
            transition={{ duration: 0.3, delay: 0.22 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            aria-label="Developer tools"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Developer Tools</p>
                <h2 className="mt-1 text-lg font-semibold text-brand-navy">Adapter architecture viewer</h2>
              </div>
              <StatusIndicator tone={developerMode ? "info" : "neutral"} label={developerMode ? "Expanded" : "Summary"} />
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)]/50 p-3 text-xs leading-5 text-text-secondary">
              Providers are organized under adapters, providers, hooks, contexts, services, types, and utils. Production APIs are intentionally not invented here; mock states preserve the interaction model and adapter contract.
            </div>

            <div className="mt-4 space-y-3">
              {(developerMode ? developerTools : developerTools.slice(0, 4)).map((tool) => (
                <article key={tool.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{tool.name}</p>
                      <p className="mt-1 text-xs text-text-muted">Queue {tool.queue}</p>
                    </div>
                    <div className="flex items-center gap-1 text-brand-primary"><Cable className="h-4 w-4" /><ArrowRight className="h-3.5 w-3.5" /><Workflow className="h-4 w-4" /></div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Transport</p><p className="mt-1 text-xs text-brand-navy">{tool.transport.join(", ")}</p></div>
                    <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Rate limit</p><p className="mt-1 text-xs text-brand-navy">{tool.rateLimitPerMinute} rpm</p></div>
                    <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Retries</p><p className="mt-1 text-xs text-brand-navy">{tool.retries}</p></div>
                    <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Polling</p><p className="mt-1 text-xs text-brand-navy">{tool.pollingWindow}</p></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tool.webhookTopics.map((topic) => (
                      <span key={topic} className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">
                        {topic}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </aside>
      </div>
    </div>
  )
}