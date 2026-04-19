import { type LucideIcon, Check, Users, Slash } from "lucide-react";

interface InsightData {
  id: string;
  type: "Risk" | "Opportunity" | "Alert";
  title: string;
  description: string;
  impact_score: number;
  confidence_score: number;
  status: string;
  created_at: string;
}

interface InsightCardProps {
  insight: InsightData;
  icon: LucideIcon;
  onAction: (action: string) => void;
}

const typeStyles: Record<string, { bg: string; border: string; text: string; label: string }> = {
  Risk: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    label: "Risk",
  },
  Opportunity: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    label: "Opportunity",
  },
  Alert: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    label: "Alert",
  },
};

export default function InsightCard({ insight, icon: Icon, onAction }: InsightCardProps) {
  const style = typeStyles[insight.type];

  return (
    <div className={`${style.bg} rounded-xl border ${style.border} p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`${style.text} p-2.5 rounded-lg bg-white/60`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
                {style.label}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{insight.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/60 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-500 font-medium mb-1">Impact Score</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">{insight.impact_score}</span>
            <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  insight.impact_score >= 70
                    ? "bg-red-500"
                    : insight.impact_score >= 40
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${insight.impact_score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-500 font-medium mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">{insight.confidence_score}%</span>
            <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${insight.confidence_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAction("resolve")}
          className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          Resolve
        </button>
        <button
          onClick={() => onAction("assign")}
          className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Assign
        </button>
        <button
          onClick={() => onAction("ignore")}
          className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
        >
          <Slash className="w-4 h-4" />
          Ignore
        </button>
      </div>
    </div>
  );
}
