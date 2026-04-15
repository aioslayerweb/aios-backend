"use client";

import { TrendingUp, TrendingDown, Video as LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
  icon: LucideIcon;
  color: "blue" | "emerald" | "amber";
}

const colorMap = {
  blue: {
    bg: "bg-primary-50",
    icon: "text-primary-600",
    iconBg: "bg-primary-100",
    badge: "bg-primary-100 text-primary-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
};

export default function KpiCard({
  title,
  value,
  change,
  period,
  icon: Icon,
  color,
}: KpiCardProps) {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <Icon size={20} className={colors.icon} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{period}</p>
      </div>
    </div>
  );
}
