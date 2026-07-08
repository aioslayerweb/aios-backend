import Link from "next/link";
import { Bot, Building2, Database, BrainCircuit, Sparkles, ShieldCheck, Network } from "lucide-react";
import { moduleCatalog } from "@/modules";

const navItems = [
  { label: "Overview", href: "/app", icon: BrainCircuit },
  { label: "Insights", href: "/app/insights", icon: Sparkles },
  { label: "Executive", href: "/app/executive", icon: Building2 },
  { label: "Knowledge", href: "/app/knowledge", icon: Database },
  { label: "Orchestrator", href: "/app/orchestrator", icon: Network },
  { label: "Planning", href: "/app/planning", icon: BrainCircuit },
];

export default function NavigationShell() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950/95 p-4 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
          <Bot size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AIOS v1.0</p>
          <p className="text-xs text-slate-400">Enterprise Intelligence</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <ShieldCheck size={16} className="text-cyan-300" />
          Active Modules
        </p>
        <div className="space-y-2 text-sm text-slate-400">
          {moduleCatalog.slice(0, 4).map((module) => (
            <div key={module.path} className="flex items-center justify-between">
              <span>{module.name}</span>
              <span className="text-xs uppercase tracking-wide text-cyan-300">
                {module.mode}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
