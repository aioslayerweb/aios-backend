import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
