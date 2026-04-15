"use client";

import { CircleCheck as CheckCircle2, Clock, Circle as XCircle, ArrowUpRight } from "lucide-react";

const activities = [
  {
    id: "1",
    label: "Deal closed with Acme Corp",
    value: "$24,000",
    time: "2m ago",
    status: "success",
  },
  {
    id: "2",
    label: "Follow-up email sent to TechStart",
    value: null,
    time: "18m ago",
    status: "success",
  },
  {
    id: "3",
    label: "AI Agent flagged low conversion",
    value: null,
    time: "1h ago",
    status: "warning",
  },
  {
    id: "4",
    label: "Proposal rejected by GlobalNet",
    value: "$9,500",
    time: "3h ago",
    status: "error",
  },
  {
    id: "5",
    label: "New lead qualified: BrightPath",
    value: null,
    time: "5h ago",
    status: "success",
  },
];

const statusIcon = {
  success: <CheckCircle2 size={15} className="text-emerald-500" />,
  warning: <Clock size={15} className="text-amber-500" />,
  error: <XCircle size={15} className="text-red-400" />,
};

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5 transition-colors">
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {activities.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <span className="flex-shrink-0">
              {statusIcon[item.status as keyof typeof statusIcon]}
            </span>
            <span className="flex-1 text-sm text-slate-700 truncate">
              {item.label}
            </span>
            <div className="flex items-center gap-3 flex-shrink-0">
              {item.value && (
                <span className="text-sm font-semibold text-slate-800">
                  {item.value}
                </span>
              )}
              <span className="text-xs text-slate-400 w-14 text-right">
                {item.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
