"use client";

import { Lightbulb, TrendingUp, CircleAlert as AlertCircle, Zap } from "lucide-react";

const insights = [
  {
    id: 1,
    category: "Performance",
    title: "System efficiency improved by 23%",
    description: "Your AI agents have optimized workflows, reducing execution time across all modules.",
    impact: "+23%",
    timestamp: "2 hours ago",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    id: 2,
    category: "Recommendation",
    title: "Enable autonomous decision-making",
    description: "Based on your usage patterns, enabling autonomous mode could save 4.5 hours daily.",
    impact: "4.5h/day",
    timestamp: "4 hours ago",
    icon: Zap,
    color: "amber",
  },
  {
    id: 3,
    category: "Alert",
    title: "Agent #3 requires recalibration",
    description: "Accuracy has dipped 8%. A quick recalibration cycle is recommended.",
    impact: "-8%",
    timestamp: "6 hours ago",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 4,
    category: "Optimization",
    title: "New optimization available",
    description: "A new algorithm variant is available for your primary workflow.",
    impact: "~15% faster",
    timestamp: "1 day ago",
    icon: Lightbulb,
    color: "blue",
  },
];

const colorClasses = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-primary-50 text-primary-700 border-primary-200",
};

const iconClasses = {
  emerald: "text-emerald-600 bg-emerald-100",
  amber: "text-amber-600 bg-amber-100",
  red: "text-red-600 bg-red-100",
  blue: "text-primary-600 bg-primary-100",
};

export default function InsightsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Active Insights</h2>
        <div className="space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            const colorClass = colorClasses[insight.color as keyof typeof colorClasses];
            const iconClass = iconClasses[insight.color as keyof typeof iconClasses];

            return (
              <div
                key={insight.id}
                className="flex gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-150 cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${colorClass}`}>
                      {insight.category}
                    </span>
                    <span className="text-xs text-slate-400">{insight.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mb-1">{insight.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{insight.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-800">{insight.impact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Insight Categories</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Performance</span>
              <span className="font-medium text-slate-800">12</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Recommendations</span>
              <span className="font-medium text-slate-800">8</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Alerts</span>
              <span className="font-medium text-slate-800">3</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Optimizations</span>
              <span className="font-medium text-slate-800">5</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-semibold mb-2">Next Steps</h3>
          <p className="text-xs opacity-80 mb-4">
            Review high-impact recommendations to optimize your autonomous system.
          </p>
          <button className="w-full bg-white/20 hover:bg-white/30 border border-white/40 text-white text-xs font-medium py-2 rounded-lg transition-colors">
            View Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
