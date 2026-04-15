"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back — here's what's happening today." },
  "/agents": { title: "AI Agents", subtitle: "Manage and monitor your active AI agents." },
  "/sales": { title: "Sales", subtitle: "Track pipeline, deals, and revenue performance." },
  "/settings": { title: "Settings", subtitle: "Configure your workspace and preferences." },
};

export default function Topbar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? pageTitles["/"];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
          <Bell size={17} className="text-slate-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
        </button>

        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
