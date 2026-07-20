"use client";

import { memo, Suspense, lazy, useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Mail, MoreHorizontal, RefreshCcw, Sparkles, X } from "lucide-react";
import { enterpriseDatasets, enterpriseKpis, type EnterpriseEntity } from "@/lib/demo/enterprise-seed-data";
import { WorkspaceCard, WorkspaceSection, WorkspaceShell } from "@/components/workspace";
import { BrandLogo } from "@/components/branding";
import { cn } from "@/utils";
import { type NextGenDomain } from "./domain-widgets";
import { NextGenSkeleton } from "./skeleton";

// Heavy interactive panels loaded lazily — excluded from initial server render bundle
const NextGenDomainWidgets = lazy(() =>
  import("./domain-widgets").then((m) => ({ default: m.NextGenDomainWidgets }))
);
const NextGenInteractivePanel = lazy(() =>
  import("./domain-interactive").then((m) => ({ default: m.NextGenInteractivePanel }))
);

type DomainCounter = { label: string; value: string; tone: "blue" | "emerald" | "amber" | "rose" };

const domainCounters: Record<NextGenDomain, DomainCounter[]> = {
  blueprint: [
    { label: "Coverage", value: "97%", tone: "blue" },
    { label: "AI Readiness", value: "89/100", tone: "emerald" },
    { label: "Pending Approvals", value: "14", tone: "amber" },
    { label: "Active Priorities", value: "10", tone: "blue" },
  ],
  qbi: [
    { label: "Simulations", value: "10K", tone: "blue" },
    { label: "P50 Revenue", value: "€37.6M", tone: "emerald" },
    { label: "Confidence", value: "94%", tone: "blue" },
    { label: "Drift", value: "2.1%", tone: "amber" },
  ],
  runtime: [
    { label: "Uptime", value: "99.96%", tone: "emerald" },
    { label: "Throughput", value: "1,284/m", tone: "blue" },
    { label: "Incidents", value: "0", tone: "emerald" },
    { label: "Readiness", value: "92%", tone: "blue" },
  ],
  developer: [
    { label: "Requests", value: "2.8M", tone: "blue" },
    { label: "SDK Teams", value: "64", tone: "emerald" },
    { label: "Error Budget", value: "81%", tone: "amber" },
    { label: "Keys", value: "128", tone: "blue" },
  ],
  organization: [
    { label: "Units", value: "10", tone: "blue" },
    { label: "Ownership", value: "95%", tone: "emerald" },
    { label: "Eco Risk", value: "Med", tone: "amber" },
    { label: "Velocity", value: "+18%", tone: "blue" },
  ],
  users: [
    { label: "Active", value: "142", tone: "blue" },
    { label: "Operators", value: "98%", tone: "emerald" },
    { label: "Access Flags", value: "11", tone: "amber" },
    { label: "ID Score", value: "96%", tone: "blue" },
  ],
  teams: [
    { label: "Workflows", value: "36", tone: "blue" },
    { label: "Utilization", value: "84%", tone: "emerald" },
    { label: "Escalations", value: "7", tone: "amber" },
    { label: "Confidence", value: "91%", tone: "blue" },
  ],
  roles: [
    { label: "Core Roles", value: "10", tone: "blue" },
    { label: "Precision", value: "93%", tone: "emerald" },
    { label: "Conflicts", value: "5", tone: "rose" },
    { label: "Coverage", value: "99%", tone: "blue" },
  ],
  permissions: [
    { label: "Rules", value: "240", tone: "blue" },
    { label: "Least Priv", value: "88/100", tone: "emerald" },
    { label: "Violations", value: "14", tone: "rose" },
    { label: "Policy Score", value: "94%", tone: "blue" },
  ],
  audit: [
    { label: "Events", value: "12.4K", tone: "blue" },
    { label: "Completeness", value: "99.2%", tone: "emerald" },
    { label: "Pending", value: "18", tone: "amber" },
    { label: "Control", value: "92%", tone: "blue" },
  ],
  "api-keys": [
    { label: "Keys", value: "128", tone: "blue" },
    { label: "Rotation", value: "96%", tone: "emerald" },
    { label: "Expiring", value: "9", tone: "amber" },
    { label: "Risk", value: "Low", tone: "blue" },
  ],
  mcp: [
    { label: "Servers", value: "22", tone: "blue" },
    { label: "Reliability", value: "97%", tone: "emerald" },
    { label: "Alerts", value: "6", tone: "amber" },
    { label: "Freshness", value: "94%", tone: "blue" },
  ],
  sales: [
    { label: "Pipeline", value: "€37.6M", tone: "blue" },
    { label: "Win Rate", value: "34%", tone: "emerald" },
    { label: "At Risk", value: "12", tone: "amber" },
    { label: "AI Prob Avg", value: "68%", tone: "blue" },
  ],
  finance: [
    { label: "Revenue YTD", value: "€24.8M", tone: "emerald" },
    { label: "Margin", value: "71%", tone: "blue" },
    { label: "Variance", value: "-2.4%", tone: "amber" },
    { label: "Cash Conv", value: "62d", tone: "blue" },
  ],
  operations: [
    { label: "Projects", value: "28", tone: "blue" },
    { label: "Utilisation", value: "84%", tone: "emerald" },
    { label: "Incidents", value: "7", tone: "amber" },
    { label: "Supply Risk", value: "Low", tone: "blue" },
  ],
  hr: [
    { label: "Headcount", value: "342", tone: "blue" },
    { label: "Retention", value: "91%", tone: "emerald" },
    { label: "Open Roles", value: "18", tone: "amber" },
    { label: "Skills", value: "78%", tone: "blue" },
  ],
  customer: [
    { label: "Healthy", value: "489", tone: "emerald" },
    { label: "Churn Risk", value: "23", tone: "amber" },
    { label: "Avg LTV", value: "€142K", tone: "blue" },
    { label: "NPS", value: "+62", tone: "emerald" },
  ],
};

/** Max entity rows rendered initially per dataset card — avoids 160-node DOM on first paint */
const VISIBLE_ROWS_DEFAULT = 5;

/** Stable entity row — memo prevents re-render when only sibling state changes */
const EntityRow = memo(function EntityRow({ entity }: { entity: EnterpriseEntity }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<EnterpriseEntity["status"]>(entity.status);
  const [dismissed, setDismissed] = useState(false);

  const cycleStatus = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus((prev) => prev === "healthy" ? "watch" : prev === "watch" ? "risk" : "healthy");
  }, []);

  if (dismissed) return null;

  return (
    <li className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
        aria-expanded={expanded}
      >
        <p className="truncate text-sm font-semibold text-slate-700">{entity.name}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleStatus}
            aria-label={`Toggle status for ${entity.name}`}
            className={cn(
              "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors",
              statusTone(status),
            )}
          >
            {status}
          </button>
          <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", expanded && "rotate-180")} aria-hidden />
        </div>
      </button>

      <div className="px-3 pb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{entity.owner}</span>
        <span>{entity.value}</span>
        <span>Confidence {entity.confidence}%</span>
        <span>{entity.updatedAt}</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-slate-50/60 px-3 py-2">
              <button
                type="button"
                onClick={() => setStatus("healthy")}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Check className="h-3 w-3" /> Approve
              </button>
              <button
                type="button"
                onClick={() => setStatus("watch")}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Mail className="h-3 w-3" /> Contact
              </button>
              <button
                type="button"
                onClick={() => setStatus("watch")}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <RefreshCcw className="h-3 w-3" /> Review
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="h-3 w-3" /> Dismiss
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <MoreHorizontal className="h-3 w-3" /> More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
});

/** Dataset card with expand/collapse to cap DOM nodes */
const DatasetCard = memo(function DatasetCard({
  title,
  entities,
}: {
  title: string;
  entities: EnterpriseEntity[];
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleEntities = useMemo(
    () => (expanded ? entities : entities.slice(0, VISIBLE_ROWS_DEFAULT)),
    [expanded, entities],
  );

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <WorkspaceCard>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">{title}</h2>
        </div>
        <ul className="space-y-2 p-3">
          {visibleEntities.map((entity) => (
            <EntityRow key={entity.id} entity={entity} />
          ))}
        </ul>
        {entities.length > VISIBLE_ROWS_DEFAULT ? (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            aria-label={expanded ? `Show fewer ${title}` : `Show all ${entities.length} ${title}`}
            className="flex w-full items-center justify-center gap-1 border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> Show less</>
            ) : (
              <><ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> Show all {entities.length}</>
            )}
          </button>
        ) : null}
      </div>
    </WorkspaceCard>
  );
});

const counterBg: Record<DomainCounter["tone"], string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
};

type NextGenWorkspaceProps = {
  pageTitle: string;
  pageDescription: string;
  centerLabel: string;
  emphasis?: "standard" | "roadmap";
  domain?: NextGenDomain;
};

function statusTone(status: "healthy" | "watch" | "risk") {
  if (status === "healthy") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "watch") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export function NextGenWorkspace({
  pageTitle,
  pageDescription,
  centerLabel,
  emphasis = "standard",
  domain,
}: NextGenWorkspaceProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <WorkspaceShell className="space-y-4">
      <section
        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_12%_0%,#dbeafe,transparent_42%),radial-gradient(circle_at_88%_8%,#e0f2fe,transparent_40%),linear-gradient(180deg,#f8fbff_0%,#f1f5f9_54%,#f8fafc_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-5"
        aria-label={`${pageTitle} header`}
      >
        <div className="absolute -left-12 top-6 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl" aria-hidden="true" />
        <div className="absolute -right-12 bottom-10 h-36 w-36 rounded-full bg-cyan-200/35 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/65 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{centerLabel}</p>
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy md:text-3xl">{pageTitle}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{pageDescription}</p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
            <BrandLogo width={124} height={30} />
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
                emphasis === "roadmap"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-blue-200 bg-blue-50 text-blue-700",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {emphasis === "roadmap" ? "Roadmap Enabled" : "Live Intelligence"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {enterpriseKpis.map((kpi) => (
            <motion.article
              key={kpi.label}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">{kpi.delta} vs baseline</p>
            </motion.article>
          ))}
        </div>

        {domain ? (
          <div className="mt-3 flex flex-wrap items-center gap-2" role="region" aria-label="Domain status counters">
            {domainCounters[domain].map((counter) => (
              <span
                key={counter.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                  counterBg[counter.tone],
                )}
              >
                <span className="font-bold">{counter.value}</span>
                <span className="opacity-70">{counter.label}</span>
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {domain ? (
        <WorkspaceSection
          id="next-gen-domain-widgets"
          title="Domain Intelligence Widgets"
          subtitle="Executive-grade controls and diagnostics for this center"
          actionLabel="AIOS"
        >
          <Suspense fallback={<NextGenSkeleton />}>
            <NextGenDomainWidgets domain={domain} />
          </Suspense>
        </WorkspaceSection>
      ) : null}

      {domain ? (
        <WorkspaceSection
          id="next-gen-operational-controls"
          title="Operational Controls"
          subtitle="Approvals, scenario control, risk, and responsive telemetry"
          actionLabel="AIOS"
        >
          <Suspense fallback={<NextGenSkeleton />}>
            <NextGenInteractivePanel domain={domain} />
          </Suspense>
        </WorkspaceSection>
      ) : null}

      <WorkspaceSection
        id="next-gen-enterprise-datasets"
        title="Enterprise Data Fabric"
        subtitle="Unified operating context across all AIOS centers"
        actionLabel="AIOS"
      >
        <div className="grid gap-3 xl:grid-cols-2">
          {enterpriseDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.title}
              title={dataset.title}
              entities={dataset.entities}
            />
          ))}
        </div>
      </WorkspaceSection>
    </WorkspaceShell>
  );
}
