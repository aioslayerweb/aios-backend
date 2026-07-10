import { Settings } from "lucide-react";

export default function AppSettingsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Settings size={28} className="text-slate-600" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-slate-800">Settings</h2>
      <p className="mb-6 max-w-sm text-sm text-slate-500">
        Workspace configuration, integrations, and team preferences.
      </p>
    </div>
  );
}
