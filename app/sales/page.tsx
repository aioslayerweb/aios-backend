import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp } from "lucide-react";

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Sales</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-6">
          Your pipeline, deals, and revenue analytics will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
}
