"use client";

import { Bot, Activity } from "lucide-react";

const agents = [
  { name: "Sales Qualifier", status: "active", tasks: 14, model: "GPT-4o" },
  { name: "Email Drafter", status: "active", tasks: 8, model: "Claude 3.5" },
  { name: "Lead Scorer", status: "idle", tasks: 0, model: "GPT-4o" },
  { name: "Report Generator", status: "active", tasks: 3, model: "Gemini Pro" },
];

export default function AgentStatusCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-primary-600" />
          <h2 className="text-sm font-semibold text-slate-800">AI Agents</h2>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-medium">
          3 running
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {agents.map((agent) => (
          <li key={agent.name} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{agent.name}</p>
              <p className="text-xs text-slate-400">{agent.model}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {agent.status === "active" && (
                <span className="text-xs text-slate-500">{agent.tasks} tasks</span>
              )}
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  agent.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {agent.status === "active" && (
                  <Activity size={10} className="animate-pulse" />
                )}
                {agent.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
