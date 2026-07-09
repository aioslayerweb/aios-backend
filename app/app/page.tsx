import Link from "next/link";

const modules = [
  { title: "Corporate", description: "Executive operating context and strategic controls.", href: "/app/corporate" },
  { title: "Actions", description: "Workflow execution and cross-module orchestration.", href: "/app/actions" },
  { title: "Customers", description: "Customer intelligence and account health signals.", href: "/app/customers" },
  { title: "Knowledge", description: "Shared knowledge and policy memory.", href: "/app/knowledge" },
  { title: "Security", description: "Enterprise security, RBAC, auditability, and multi-tenancy controls.", href: "/app/security" },
  { title: "MCP Platform", description: "Host, server, gateway, and registry architecture for enterprise MCP orchestration.", href: "/app/mcp" },
];

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">AIOS Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Authenticated operating layer</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          The AIOS app shell now routes all authenticated experiences through the required navigation, workspace, and context panel structure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-white">{module.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
