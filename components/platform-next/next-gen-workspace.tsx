"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { enterpriseDatasets, enterpriseKpis } from "@/lib/demo/enterprise-seed-data";
import { WorkspaceCard, WorkspaceSection, WorkspaceShell } from "@/components/workspace";
import { BrandLogo } from "@/components/branding";
import { cn } from "@/utils";

type NextGenWorkspaceProps = {
  pageTitle: string;
  pageDescription: string;
  centerLabel: string;
  emphasis?: "standard" | "roadmap";
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
}: NextGenWorkspaceProps) {
  return (
    <WorkspaceShell className="space-y-4">
      <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_12%_0%,#dbeafe,transparent_42%),radial-gradient(circle_at_88%_8%,#e0f2fe,transparent_40%),linear-gradient(180deg,#f8fbff_0%,#f1f5f9_54%,#f8fafc_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-5">
        <div className="absolute -left-12 top-6 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl" aria-hidden="true" />
        <div className="absolute -right-12 bottom-10 h-36 w-36 rounded-full bg-cyan-200/35 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/65 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{centerLabel}</p>
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
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{kpi.value}</p>
              <p className="mt-1 text-xs font-medium text-emerald-600">{kpi.delta} vs baseline</p>
            </motion.article>
          ))}
        </div>
      </section>

      <WorkspaceSection
        id="next-gen-enterprise-datasets"
        title="Enterprise Data Fabric"
        subtitle="Unified operating context across all AIOS centers"
        actionLabel="AIOS"
      >
        <div className="grid gap-3 xl:grid-cols-2">
          {enterpriseDatasets.map((dataset) => (
            <WorkspaceCard key={dataset.title}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">{dataset.title}</h2>
                </div>
                <div className="max-h-[360px] overflow-y-auto p-3">
                  <ul className="space-y-2">
                    {dataset.entities.map((entity) => (
                      <li key={entity.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-700">{entity.name}</p>
                          <span
                            className={cn(
                              "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              statusTone(entity.status),
                            )}
                          >
                            {entity.status}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{entity.owner}</span>
                          <span>{entity.value}</span>
                          <span>Confidence {entity.confidence}%</span>
                          <span>{entity.updatedAt}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </WorkspaceCard>
          ))}
        </div>
      </WorkspaceSection>
    </WorkspaceShell>
  );
}
