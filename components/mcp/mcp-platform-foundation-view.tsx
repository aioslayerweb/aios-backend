"use client"

import { useMemo } from "react"
import { Activity, Blocks, BrainCircuit, Network, PlugZap, Route, ShieldCheck, Wrench } from "lucide-react"
import { useMCP, useMCPGateway, useMCPHealth, useMCPMetrics, useMCPPrompts, useMCPRegistry, useMCPResources, useMCPServers, useMCPTools } from "@/hooks"

function metricCard(label: string, value: string, detail: string) {
  return (
    <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-brand-navy">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{detail}</p>
    </article>
  )
}

export function MCPPlatformFoundationView() {
  const { platformModes, executionEvents } = useMCP()
  const { servers } = useMCPServers()
  const registry = useMCPRegistry()
  const { gateway } = useMCPGateway()
  const { tools } = useMCPTools()
  const { resources } = useMCPResources()
  const { prompts } = useMCPPrompts()
  const health = useMCPHealth()
  const metrics = useMCPMetrics()

  const stagePreview = useMemo(() => gateway.pipeline.slice(0, 6), [gateway.pipeline])

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]" aria-label="MCP platform header">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Enterprise MCP Platform</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS MCP Host, Server, Gateway, and Registry</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
            Architecture foundation for tenant-aware enterprise MCP orchestration with secure tool routing, policy enforcement, registry governance, and observability.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700 ring-1 ring-sky-100">Modes: {platformModes.join(", ")}</span>
            <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">Pipeline stages: {gateway.pipeline.length}</span>
            <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">Policy rules: {registry.installedServers.length > 0 ? "Active" : "Planned"}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="MCP metrics">
        {metricCard("Servers", String(servers.length), "External and internal MCP endpoints in the host connection manager")}
        {metricCard("Tools", String(tools.length), "Tool registry entries with permissions and capability requirements")}
        {metricCard("Resources", String(resources.length), "Resource registry entries across enterprise data classes")}
        {metricCard("Prompts", String(prompts.length), "Versioned prompts with approvals and release metadata")}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]" aria-label="MCP architecture panels">
        <article id="gateway" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><Route className="h-3.5 w-3.5 text-brand-primary" />Gateway Monitor</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Policy and context enriched orchestration pipeline</h2>
          <p className="mt-2 text-sm text-text-secondary">Every request is processed through authentication, tenant resolution, RBAC, role context, organization context, knowledge, memory, decision, workflow, routing, aggregation, and audit.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {stagePreview.map((stage) => (
              <span key={stage} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">{stage}</span>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-muted">Total stages: {gateway.pipeline.length} · Responsibilities: {gateway.responsibilities.length}</p>
        </article>

        <article id="health" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><Activity className="h-3.5 w-3.5 text-brand-primary" />Health Center</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Connection and compatibility monitoring</h2>
          <div className="mt-3 grid gap-2 text-xs text-text-secondary sm:grid-cols-2">
            <div className="rounded-xl bg-surface-canvas p-3"><p className="text-text-muted">Overall</p><p className="mt-1 font-medium text-brand-navy capitalize">{health.overall}</p></div>
            <div className="rounded-xl bg-surface-canvas p-3"><p className="text-text-muted">Avg latency</p><p className="mt-1 font-medium text-brand-navy">{health.averageLatencyMs} ms</p></div>
            <div className="rounded-xl bg-surface-canvas p-3"><p className="text-text-muted">Tool failures</p><p className="mt-1 font-medium text-brand-navy">{health.toolFailures}</p></div>
            <div className="rounded-xl bg-surface-canvas p-3"><p className="text-text-muted">Auth failures</p><p className="mt-1 font-medium text-brand-navy">{health.authenticationFailures}</p></div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3" aria-label="MCP registries">
        <article id="registry" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><Blocks className="h-3.5 w-3.5 text-brand-primary" />MCP Registry</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Installed server governance</h2>
          <p className="mt-2 text-sm text-text-secondary">{registry.installedServers.length} installed server records with assignment, latency, error, update, and approval metadata.</p>
        </article>
        <article id="tools" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><Wrench className="h-3.5 w-3.5 text-brand-primary" />Tool Registry</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Permission-aware tool contracts</h2>
          <p className="mt-2 text-sm text-text-secondary">Every tool is typed with provider, server, role, permissions, capability requirements, schemas, and health state.</p>
        </article>
        <article id="resources" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><Network className="h-3.5 w-3.5 text-brand-primary" />Resource Registry</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Enterprise resource mapping</h2>
          <p className="mt-2 text-sm text-text-secondary">Documents, databases, knowledge, CRM, ERP, files, emails, reports, and dashboard resources are represented in one shared registry.</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]" aria-label="MCP prompts and metrics">
        <article id="prompts" className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><BrainCircuit className="h-3.5 w-3.5 text-brand-primary" />Prompt Registry</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Versioned enterprise prompt governance</h2>
          <p className="mt-2 text-sm text-text-secondary">Prompt contracts include authoring metadata, approvals, change history, releases, and model or agent associations.</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />Observability</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Execution, latency, and cost analytics</h2>
          <p className="mt-2 text-sm text-text-secondary">Requests: {metrics.requestCount} · Success: {metrics.successRatePercent}% · Avg latency: {metrics.averageLatencyMs} ms · Cost estimate: {metrics.providerCostEstimate}</p>
          <p className="mt-2 text-xs text-text-muted">Execution history events: {executionEvents.length}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="MCP planned modules">
        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted"><PlugZap className="h-3.5 w-3.5 text-brand-primary" />Foundation Scope</p>
        <h2 className="mt-1 text-lg font-semibold text-brand-navy">Prepared architecture surfaces</h2>
        <p className="mt-2 text-sm text-text-secondary">MCP Dashboard, Connection Manager, Registry, Health Center, Tool Explorer, Prompt Explorer, Resource Explorer, and Gateway Monitor are now represented through shared platform architecture and hooks.</p>
      </section>
    </div>
  )
}
