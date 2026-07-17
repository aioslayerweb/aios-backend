"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Edit3,
  Filter,
  Play,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react"
import { useMemo, useState } from "react"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { BrandLogo } from "@/components/branding"
import { Drawer } from "@/components/ui/drawer"
import { Modal } from "@/components/ui/modal"
import { workspaceItems } from "@/utils/navigation"

type DatasetStatus = "healthy" | "attention" | "processing" | "draft"
type DatasetCategory = "Revenue" | "Operations" | "Customer" | "Finance" | "Compliance"
type DatasetPriority = "Critical" | "High" | "Medium"

type DemoDataset = {
  id: string
  name: string
  category: DatasetCategory
  status: DatasetStatus
  priority: DatasetPriority
  records: number
  owner: string
  lastSync: string
  summary: string
  recommendedAction: string
  workflow: string
  api: string
}

type DemoActionLog = {
  id: string
  datasetId: string
  message: string
  at: string
}

const initialDatasets: DemoDataset[] = [
  { id: "ds-01", name: "Revenue Forecast Delta", category: "Revenue", status: "healthy", priority: "Critical", records: 14820, owner: "Finance Ops", lastSync: "2m ago", summary: "Tracks forecast drift against regional pipeline and bookings.", recommendedAction: "Re-run weekly executive briefing", workflow: "Forecast Confidence Refresh", api: "finance.forecast.delta" },
  { id: "ds-02", name: "Churn Exposure Matrix", category: "Customer", status: "attention", priority: "Critical", records: 642, owner: "Customer Success", lastSync: "4m ago", summary: "Surfaces at-risk accounts with SLA, sentiment, and renewal timing.", recommendedAction: "Escalate top 12 accounts", workflow: "Retention Risk Escalation", api: "customer.churn.exposure" },
  { id: "ds-03", name: "Demand Quality Signals", category: "Revenue", status: "healthy", priority: "High", records: 9200, owner: "Marketing", lastSync: "6m ago", summary: "Measures pipeline quality by source, segment, and conversion timing.", recommendedAction: "Trigger attribution reconciliation", workflow: "Demand Quality Calibration", api: "marketing.demand.quality" },
  { id: "ds-04", name: "Pricing Exception Queue", category: "Revenue", status: "processing", priority: "High", records: 187, owner: "Revenue Strategy", lastSync: "Live", summary: "Captures discount approvals and margin exceptions for review.", recommendedAction: "Approve 3 pending exceptions", workflow: "Pricing Exception Governance", api: "revenue.pricing.exceptions" },
  { id: "ds-05", name: "Workflow Throughput Lens", category: "Operations", status: "healthy", priority: "High", records: 12110, owner: "Operations", lastSync: "3m ago", summary: "Monitors queue velocity, bottlenecks, and cross-team handoff delays.", recommendedAction: "Automate low-risk routing", workflow: "Queue Balancing", api: "ops.workflow.throughput" },
  { id: "ds-06", name: "Incident Recovery Monitor", category: "Operations", status: "attention", priority: "Critical", records: 214, owner: "Platform Reliability", lastSync: "9m ago", summary: "Combines incident severity, MTTR trends, and dependency blast radius.", recommendedAction: "Assign auto-remediation agent", workflow: "Incident Recovery", api: "runtime.incident.recovery" },
  { id: "ds-07", name: "Executive Briefing Memory", category: "Compliance", status: "healthy", priority: "Medium", records: 4800, owner: "Strategy", lastSync: "11m ago", summary: "Stores briefing narratives, actions taken, and outcome follow-through.", recommendedAction: "Generate board-ready summary", workflow: "Executive Briefing Generation", api: "memory.executive.briefings" },
  { id: "ds-08", name: "Policy Drift Registry", category: "Compliance", status: "draft", priority: "High", records: 311, owner: "Governance", lastSync: "1h ago", summary: "Highlights where operational behavior drifts from policy thresholds.", recommendedAction: "Review policy overrides", workflow: "Policy Drift Review", api: "governance.policy.drift" },
  { id: "ds-09", name: "Integration Health Stream", category: "Operations", status: "healthy", priority: "Medium", records: 23140, owner: "IT Systems", lastSync: "1m ago", summary: "Continuously scores integration freshness, latency, and API failure rate.", recommendedAction: "Refresh 2 degraded connectors", workflow: "Connector Recovery", api: "integrations.health.stream" },
  { id: "ds-10", name: "Customer Journey Friction", category: "Customer", status: "processing", priority: "High", records: 1830, owner: "CX Analytics", lastSync: "Live", summary: "Maps friction across onboarding, support, and renewal sequences.", recommendedAction: "Open remediation workflow", workflow: "Journey Friction Repair", api: "journey.friction.signals" },
  { id: "ds-11", name: "Cash Efficiency Watch", category: "Finance", status: "healthy", priority: "Critical", records: 780, owner: "Treasury", lastSync: "8m ago", summary: "Observes burn, runway, and payment timing signals across business units.", recommendedAction: "Publish CFO alert pack", workflow: "Cash Efficiency Review", api: "finance.cash.efficiency" },
  { id: "ds-12", name: "Vendor Risk Landscape", category: "Compliance", status: "attention", priority: "Medium", records: 428, owner: "Procurement", lastSync: "14m ago", summary: "Scores supplier concentration, contract exposure, and incident history.", recommendedAction: "Review top 5 suppliers", workflow: "Vendor Risk Escalation", api: "procurement.vendor.risk" },
  { id: "ds-13", name: "Opportunity Command Queue", category: "Revenue", status: "healthy", priority: "Critical", records: 2670, owner: "Sales Ops", lastSync: "2m ago", summary: "Sequences expansion and rescue opportunities by confidence and impact.", recommendedAction: "Launch opportunity swarm", workflow: "Opportunity Orchestration", api: "sales.opportunity.command" },
  { id: "ds-14", name: "Support Resolution Engine", category: "Customer", status: "draft", priority: "Medium", records: 9100, owner: "Support", lastSync: "26m ago", summary: "Routes tickets by urgency, customer tier, and expected downstream impact.", recommendedAction: "Approve automation rules", workflow: "Support Resolution", api: "support.resolution.engine" },
  { id: "ds-15", name: "Autonomous Task Ledger", category: "Operations", status: "healthy", priority: "High", records: 5340, owner: "Automation Office", lastSync: "5m ago", summary: "Tracks autonomous tasks, approvals, completion rates, and intervention needs.", recommendedAction: "Promote 4 safe automations", workflow: "Autonomous Task Governance", api: "workflow.autonomous.ledger" },
]

const statusStyles: Record<DatasetStatus, string> = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  attention: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  draft: "border-slate-200 bg-slate-100 text-slate-600",
}

function createLogMessage(action: string, datasetName: string): string {
  return `${action} executed for ${datasetName}`
}

function statValue(datasets: DemoDataset[], status: DatasetStatus): number {
  return datasets.filter((dataset) => dataset.status === status).length
}

const demoBackendMobileNavItems = workspaceItems.map((item) => ({ href: item.href, label: item.title }))

export function DemoPlatformPage() {
  const reduceMotion = useReducedMotion()
  const [datasets, setDatasets] = useState(initialDatasets)
  const [selectedDatasetId, setSelectedDatasetId] = useState(initialDatasets[0]?.id ?? "")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<DatasetCategory | "All">("All")
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [logs, setLogs] = useState<DemoActionLog[]>([
    { id: "log-1", datasetId: "ds-02", message: "Retention Risk Escalation triggered for Churn Exposure Matrix", at: "Just now" },
    { id: "log-2", datasetId: "ds-04", message: "Pricing exception review assigned to Revenue Strategy", at: "3m ago" },
    { id: "log-3", datasetId: "ds-11", message: "CFO alert pack generated from Cash Efficiency Watch", at: "7m ago" },
  ])

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch = [dataset.name, dataset.owner, dataset.summary, dataset.api].join(" ").toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === "All" || dataset.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, datasets, search])

  const selectedDataset = useMemo(
    () => filteredDatasets.find((dataset) => dataset.id === selectedDatasetId) ?? datasets.find((dataset) => dataset.id === selectedDatasetId) ?? filteredDatasets[0] ?? datasets[0],
    [datasets, filteredDatasets, selectedDatasetId],
  )

  const relatedLogs = useMemo(
    () => logs.filter((entry) => entry.datasetId === selectedDataset?.id).slice(0, 4),
    [logs, selectedDataset?.id],
  )

  function updateDataset(nextDataset: DemoDataset) {
    setDatasets((current) => current.map((dataset) => (dataset.id === nextDataset.id ? nextDataset : dataset)))
  }

  function runAction(action: string, status?: DatasetStatus) {
    if (!selectedDataset) {
      return
    }

    const updated = status ? { ...selectedDataset, status, lastSync: "Just now" } : { ...selectedDataset, lastSync: "Just now" }
    updateDataset(updated)
    setLogs((current) => [
      { id: `log-${Date.now()}`, datasetId: selectedDataset.id, message: createLogMessage(action, selectedDataset.name), at: "Just now" },
      ...current,
    ])
  }

  return (
    <PublicPageShell
      activeHref="/demo-platform"
      includeFooter={false}
      includeNewsletter={false}
      mobileNavigationItems={demoBackendMobileNavItems}
    >
      <PublicSection>
        <PublicContainer>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-[var(--public-color-border)] bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.55),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.94)_100%)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur">
              <BrandLogo width={162} height={38} priority />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <Sparkles size={14} /> Demo Platform
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 size={14} /> 15 interactive datasets
                </span>
              </div>
              <h1 className="public-h2 mt-5">Explore a full AIOS backend demo without signing in</h1>
              <p className="public-body mt-3 max-w-2xl text-[color:var(--public-color-text-soft)]">
                Every dataset below is clickable, editable, and actionable. Use this sandbox to test orchestration, approvals, sync actions, and decision support on a fully responsive demo surface.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <PublicCard variant="glass" className="rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">Healthy datasets</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-800">{statValue(datasets, "healthy")}</p>
                </PublicCard>
                <PublicCard variant="glass" className="rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">Need attention</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-800">{statValue(datasets, "attention")}</p>
                </PublicCard>
                <PublicCard variant="glass" className="rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">Processing</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-800">{statValue(datasets, "processing")}</p>
                </PublicCard>
              </div>
            </div>

            <div className="rounded-[32px] border border-[var(--public-color-border)] bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <PublicSectionHeader
                eyebrow="Demo Capabilities"
                title="Backend-grade controls in a public sandbox"
                body="Edit metadata, trigger workflows, refresh syncs, assign AI actions, and inspect action logs from a single responsive command surface."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Dataset editing",
                  "Workflow triggers",
                  "Sync refresh actions",
                  "Action logs",
                  "Mobile detail drawer",
                  "Public demo access",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PublicButtonLink href="/login" variant="secondary" size="lg">Back to login</PublicButtonLink>
                <button
                  type="button"
                  className="public-button public-button-primary"
                  onClick={() => {
                    setDetailOpen(true)
                  }}
                >
                  Open active dataset
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <div className="rounded-[32px] border border-[var(--public-color-border)] bg-white/80 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:p-5">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      className="public-input w-full pl-10"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search dataset, owner, or API"
                    />
                  </label>
                  <label className="relative block min-w-[180px]">
                    <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      className="public-input w-full pl-10"
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value as DatasetCategory | "All")}
                    >
                      <option value="All">All categories</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer">Customer</option>
                      <option value="Finance">Finance</option>
                      <option value="Compliance">Compliance</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDatasets.map((dataset, index) => {
                    const isActive = dataset.id === selectedDataset?.id
                    return (
                      <motion.button
                        key={dataset.id}
                        type="button"
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : index * 0.02, duration: 0.22 }}
                        onClick={() => setSelectedDatasetId(dataset.id)}
                        onDoubleClick={() => setDetailOpen(true)}
                        className={`min-w-0 rounded-3xl border p-4 text-left transition ${isActive ? "border-blue-300 bg-blue-50/70 shadow-md" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-slate-800">{dataset.name}</p>
                            <p className="mt-1 break-all text-xs text-slate-500">{dataset.category} · {dataset.api}</p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${statusStyles[dataset.status]}`}>
                            {dataset.status}
                          </span>
                        </div>
                        <p className="mt-3 break-words text-xs text-slate-600">{dataset.summary}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span>{dataset.records.toLocaleString()} records</span>
                          <span>{dataset.lastSync}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">{dataset.priority}</span>
                          <span className="text-xs font-medium text-blue-700">Open</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4">
                {selectedDataset ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected dataset</p>
                        <h2 className="mt-1 break-words text-2xl font-semibold text-slate-800">{selectedDataset.name}</h2>
                        <p className="mt-2 break-words text-sm text-slate-600">{selectedDataset.summary}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusStyles[selectedDataset.status]}`}>
                        {selectedDataset.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</p>
                        <p className="mt-2 break-words text-sm font-medium text-slate-700">{selectedDataset.owner}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workflow</p>
                        <p className="mt-2 break-words text-sm font-medium text-slate-700">{selectedDataset.workflow}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Records</p>
                        <p className="mt-2 text-sm font-medium text-slate-700">{selectedDataset.records.toLocaleString()}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended action</p>
                        <p className="mt-2 break-words text-sm font-medium text-slate-700">{selectedDataset.recommendedAction}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button type="button" className="public-button public-button-secondary justify-center" onClick={() => setEditOpen(true)}>
                        <Edit3 size={16} /> Edit dataset
                      </button>
                      <button type="button" className="public-button public-button-secondary justify-center" onClick={() => runAction("Sync refresh", "processing")}>
                        <RefreshCw size={16} /> Refresh sync
                      </button>
                      <button type="button" className="public-button public-button-secondary justify-center" onClick={() => runAction("Workflow trigger", "healthy")}>
                        <Play size={16} /> Trigger workflow
                      </button>
                      <button type="button" className="public-button public-button-primary justify-center" onClick={() => runAction("AI operator assignment", "healthy")}>
                        <Bot size={16} /> Assign AI operator
                      </button>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent actions</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {relatedLogs.length ? relatedLogs.map((entry) => (
                          <li key={entry.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                            <p className="break-words">{entry.message}</p>
                            <p className="mt-1 text-xs text-slate-500">{entry.at}</p>
                          </li>
                        )) : <li className="text-sm text-slate-500">No actions yet.</li>}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={selectedDataset ? `Edit ${selectedDataset.name}` : "Edit dataset"}>
        {selectedDataset ? (
          <DemoDatasetEditor
            dataset={selectedDataset}
            onClose={() => setEditOpen(false)}
            onSave={(nextDataset) => {
              updateDataset(nextDataset)
              setLogs((current) => [
                { id: `log-${Date.now()}`, datasetId: nextDataset.id, message: createLogMessage("Dataset update", nextDataset.name), at: "Just now" },
                ...current,
              ])
              setEditOpen(false)
            }}
          />
        ) : null}
      </Modal>

      <Drawer open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedDataset?.name ?? "Dataset detail"}>
        {selectedDataset ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="break-words text-sm font-medium text-slate-700">{selectedDataset.summary}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-wide text-slate-500">API</p><p className="mt-1 break-all text-sm font-semibold text-slate-800">{selectedDataset.api}</p></div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-wide text-slate-500">Owner</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{selectedDataset.owner}</p></div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-wide text-slate-500">Status</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{selectedDataset.status}</p></div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-wide text-slate-500">Last sync</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{selectedDataset.lastSync}</p></div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="public-button public-button-primary justify-center" onClick={() => runAction("Demo launch", "processing")}>
                <Rocket size={16} /> Launch backend action
              </button>
              <button type="button" className="public-button public-button-secondary justify-center" onClick={() => runAction("Compliance review", "attention")}>
                <ShieldCheck size={16} /> Mark for review
              </button>
              <button type="button" className="public-button public-button-secondary justify-center" onClick={() => runAction("AI suggestion generation", "healthy")}>
                <Wand2 size={16} /> Generate AI suggestion
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </PublicPageShell>
  )
}

type DemoDatasetEditorProps = {
  dataset: DemoDataset
  onSave: (dataset: DemoDataset) => void
  onClose: () => void
}

function DemoDatasetEditor({ dataset, onSave, onClose }: DemoDatasetEditorProps) {
  const [name, setName] = useState(dataset.name)
  const [owner, setOwner] = useState(dataset.owner)
  const [summary, setSummary] = useState(dataset.summary)
  const [status, setStatus] = useState<DatasetStatus>(dataset.status)
  const [priority, setPriority] = useState<DatasetPriority>(dataset.priority)

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({
          ...dataset,
          name,
          owner,
          summary,
          status,
          priority,
          lastSync: "Just now",
        })
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Dataset name</span>
        <input className="public-input w-full" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Owner</span>
        <input className="public-input w-full" value={owner} onChange={(event) => setOwner(event.target.value)} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Summary</span>
        <textarea className="public-input min-h-[120px] w-full" value={summary} onChange={(event) => setSummary(event.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select className="public-input w-full" value={status} onChange={(event) => setStatus(event.target.value as DatasetStatus)}>
            <option value="healthy">Healthy</option>
            <option value="attention">Attention</option>
            <option value="processing">Processing</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select className="public-input w-full" value={priority} onChange={(event) => setPriority(event.target.value as DatasetPriority)}>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="public-button public-button-primary">
          Save changes
        </button>
        <button type="button" className="public-button public-button-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
