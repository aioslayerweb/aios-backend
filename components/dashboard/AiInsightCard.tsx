"use client";

import { Sparkles, ArrowRight, Zap, TriangleAlert as AlertTriangle, Info } from "lucide-react";

interface AiInsight {
  id: string;
  title: string;
  body: string;
  action_label: string;
  action_type: string;
  priority: string;
}

interface AiInsightCardProps {
  insights: AiInsight[];
  onAction: (insight: AiInsight) => void;
  loading?: boolean;
}

const priorityConfig = {
  high: {
    badge: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
  medium: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-400",
    icon: Zap,
    iconColor: "text-amber-500",
  },
  low: {
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-400",
    icon: Info,
    iconColor: "text-blue-500",
  },
};

export default function AiInsightCard({
  insights,
  onAction,
  loading,
}: AiInsightCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-cyan-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-400 flex items-center justify-center shadow-sm">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">AI Insights</h2>
            <p className="text-xs text-slate-500">Powered by AIOS Engine</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full font-medium">
          {insights.length} active
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-6 py-8 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Analyzing data...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Sparkles size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No insights at the moment.</p>
          </div>
        ) : (
          insights.map((insight) => {
            const config =
              priorityConfig[insight.priority as keyof typeof priorityConfig] ??
              priorityConfig.low;
            const PriorityIcon = config.icon;

            return (
              <div
                key={insight.id}
                className="px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <PriorityIcon size={16} className={config.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {insight.title}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${config.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">
                      {insight.body}
                    </p>
                    <button
                      onClick={() => onAction(insight)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-all duration-150 group-hover:shadow-sm"
                    >
                      {insight.action_label}
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
