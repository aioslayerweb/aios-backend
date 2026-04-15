import DashboardLayout from "@/components/layout/DashboardLayout";
import { Bot, Plus } from "lucide-react";

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
          <Bot size={28} className="text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">AI Agents</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-6">
          Configure, deploy and monitor your AI agents from this panel.
        </p>
        <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Plus size={15} />
          Create Agent
        </button>
      </div>
    </DashboardLayout>
  );
}
