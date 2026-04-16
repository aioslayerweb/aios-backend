"use client";

import Image from "next/image";
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

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "AI Agents", href: "/agents", icon: Bot },
  { label: "Activity Log", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 flex flex-col z-20">
      <div className="flex items-center px-6 py-5 border-b border-slate-100/50">
        <Image
          src="/aios_logo_horizontal.png"
          alt="AIOS Layer"
          width={140}
          height={40}
          className="object-contain"
          priority
        />
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
                  ? "bg-primary-50 text-primary-700 border border-primary-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-primary-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight size={14} className="text-primary-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@aios.layer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
