"use client";

import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, Clock, ArrowRight } from "lucide-react";

const activities = [
  {
    id: 1,
    timestamp: "2 minutes ago",
    agent: "Agent #1 - Optimizer",
    action: "Completed optimization cycle",
    status: "success",
    details: "Analyzed 2,847 data points and applied 12 improvements",
  },
  {
    id: 2,
    timestamp: "15 minutes ago",
    agent: "Agent #2 - Analyzer",
    action: "System alert: High memory usage",
    status: "alert",
    details: "Memory utilization at 87%. Consider scaling resources.",
  },
  {
    id: 3,
    timestamp: "32 minutes ago",
    agent: "Agent #3 - Monitor",
    action: "Automated task executed",
    status: "success",
    details: "Processed 5 scheduled tasks without errors",
  },
  {
    id: 4,
    timestamp: "1 hour ago",
    agent: "System",
    action: "Configuration updated",
    status: "info",
    details: "Agent #1 parameters recalibrated by user input",
  },
  {
    id: 5,
    timestamp: "2 hours ago",
    agent: "Agent #2 - Analyzer",
    action: "Anomaly detected",
    status: "alert",
    details: "Unusual pattern in data stream. Manual review recommended.",
  },
  {
    id: 6,
    timestamp: "3 hours ago",
    agent: "Agent #4 - Orchestrator",
    action: "Task queue processed",
    status: "success",
    details: "12 pending tasks completed successfully",
  },
  {
    id: 7,
    timestamp: "5 hours ago",
    agent: "System",
    action: "Backup completed",
    status: "success",
    details: "Full system backup created and verified",
  },
  {
    id: 8,
    timestamp: "6 hours ago",
    agent: "Agent #1 - Optimizer",
    action: "Performance report generated",
    status: "info",
    details: "Daily performance analysis ready for review",
  },
];

const statusIcons = {
  success: <CheckCircle size={16} className="text-emerald-600" />,
  alert: <AlertCircle size={16} className="text-amber-600" />,
  info: <Info size={16} className="text-primary-600" />,
};

const statusBadges = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  alert: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-primary-50 text-primary-700 border-primary-200",
};

export default function ActivityContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Showing the latest system and agent activities</p>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
          Export Log <ArrowRight size={14} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="space-y-0">
          {activities.map((activity, idx) => {
            const statusIcon = statusIcons[activity.status as keyof typeof statusIcons];
            const statusBadge = statusBadges[activity.status as keyof typeof statusBadges];

            return (
              <div
                key={activity.id}
                className={`flex gap-4 p-4 hover:bg-slate-50 transition-colors ${
                  idx !== activities.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {statusIcon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusBadge}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">{activity.details}</p>
                  <p className="text-xs text-slate-400">{activity.agent}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                    <Clock size={12} />
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Load More Activities
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-slate-500 font-medium mb-2">Total Activities</p>
          <p className="text-2xl font-bold text-slate-900">247</p>
          <p className="text-xs text-slate-400 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-slate-500 font-medium mb-2">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-600">99.2%</p>
          <p className="text-xs text-slate-400 mt-2">2 failures detected</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-slate-500 font-medium mb-2">Avg Response Time</p>
          <p className="text-2xl font-bold text-slate-900">247ms</p>
          <p className="text-xs text-slate-400 mt-2">Within normal range</p>
        </div>
      </div>
    </div>
  );
}
