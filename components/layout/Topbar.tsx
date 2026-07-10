"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { brandIcons } from "@/components/branding";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back — here's what's happening today." },
  "/insights": { title: "Insights", subtitle: "AI-powered recommendations and analysis." },
  "/agents": { title: "AI Agents", subtitle: "Manage and monitor your autonomous agents." },
  "/activity": { title: "Activity Log", subtitle: "Monitor all system events and agent activities." },
  "/settings": { title: "Settings", subtitle: "Configure your workspace and preferences." },
};

export default function Topbar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? pageTitles["/"];

  return (
    <header className="fixed left-64 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white/95 px-8 backdrop-blur-sm">
      <div>
        <h1 className="leading-tight text-lg font-semibold text-brand-navy">{page.title}</h1>
        <p className="mt-0.5 text-xs text-text-muted">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            size={brandIcons.small}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 rounded-lg border border-border bg-surface-muted py-2 pl-9 pr-4 text-sm text-text-secondary transition-all placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-subtle"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-surface-muted">
          <Bell size={brandIcons.medium} className="text-text-secondary" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-brand-primary" />
        </button>

        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-soft text-sm font-semibold text-white shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
