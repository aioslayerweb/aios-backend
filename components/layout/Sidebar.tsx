"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Lightbulb,
  Activity,
  Settings,
  ChevronRight,
} from "lucide-react";
import { BrandLogo, brandIcons } from "@/components/branding";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Executive Center", href: "/app/executive", icon: Lightbulb },
  { label: "Agent Studio", href: "/app/agents", icon: Bot },
  { label: "Activity", href: "/app/activity", icon: Activity },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r border-border bg-gradient-to-b from-white to-surface-app">
      <div className="flex items-center border-b border-border px-6 py-5">
        <BrandLogo width={140} height={40} priority />
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "border border-brand-subtle bg-brand-subtle text-brand-navy"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              <Icon
                size={brandIcons.large}
                className={
                  isActive
                    ? "text-brand-primary"
                    : "text-text-muted group-hover:text-text-secondary"
                }
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight size={brandIcons.small} className="text-brand-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-soft text-xs font-semibold text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">Admin</p>
            <p className="truncate text-xs text-text-muted">admin@aios.layer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
