import type { ReactNode } from "react";
import NavigationShell from "./NavigationShell";
import Workspace from "./Workspace";
import ContextPanel from "./ContextPanel";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72">
          <NavigationShell />
        </div>
        <div className="flex-1">
          <Workspace>{children}</Workspace>
        </div>
        <div className="lg:w-80">
          <ContextPanel />
        </div>
      </div>
    </div>
  );
}
