"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const modules = [
  { title: "Executive Center", description: "Leadership visibility, narratives, and operating context.", href: "/app/executive" },
  { title: "Command Center", description: "Cross-workspace command operations and control.", href: "/app/commands" },
  { title: "Agent Studio", description: "Agent orchestration, health, and execution controls.", href: "/app/agents" },
  { title: "Workflow Builder", description: "Build and operate autonomous workflow pipelines.", href: "/app/workflows" },
  { title: "Memory Center", description: "Memory objects, history, and state continuity.", href: "/app/memory" },
  { title: "Knowledge Center", description: "Knowledge graph and organizational intelligence assets.", href: "/app/knowledge" },
  { title: "Decision Center", description: "Decision queues, evidence, and recommendation flow.", href: "/app/decisions" },
  { title: "Intelligence Center", description: "Signals, analytics interpretation, and insight synthesis.", href: "/app/intelligence" },
  { title: "Organization Center", description: "Corporate context, ownership, and operating structures.", href: "/app/corporate" },
  { title: "Integrations", description: "Connected systems, APIs, and enterprise sync.", href: "/app/integrations" },
  { title: "Activity", description: "Live platform activity timeline and event tracking.", href: "/app/activity" },
  { title: "Reports", description: "Executive reporting outputs and generated briefs.", href: "/app/reports" },
  { title: "Planning", description: "Strategic planning and scenario prioritization.", href: "/app/planning" },
  { title: "Governance", description: "Policies, approvals, and compliance oversight.", href: "/app/governance" },
  { title: "MCP", description: "Model Context Protocol platform and gateway controls.", href: "/app/mcp" },
  { title: "Prompt OS", description: "Prompt operations, templates, and orchestration logic.", href: "/app/prompt-os" },
  { title: "Security", description: "Enterprise access, controls, and audit readiness.", href: "/app/security" },
  { title: "Settings", description: "Workspace preferences and platform configuration.", href: "/app/settings" },
];

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">AIOS Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Global workspace navigation</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Navigate every AIOS workspace from this dashboard preview with connected routing across the full operating system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <motion.div
            key={module.href}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18 }}
          >
            <Link
              href={module.href}
              className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:border-cyan-500/40 hover:bg-slate-900"
              aria-label={`Open ${module.title}`}
            >
              <h2 className="text-lg font-semibold text-white">{module.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{module.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
