import DashboardLayout from "@/components/layout/DashboardLayout";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Settings size={28} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-6">
          Workspace configuration, integrations, and team preferences.
        </p>
      </div>
    </DashboardLayout>
  );
}
