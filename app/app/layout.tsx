import type { ReactNode } from "react";
import { WorkspaceLayout } from "@/components/layout/foundation";
import { AIOSRuntimeProvider } from "@/components/layout/AIOSRuntimeContext";
import { AppAccessGate } from "@/components/auth/app-access-gate";
import { DemoPlatformBanner } from "@/components/layout/demo-platform-banner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AIOSRuntimeProvider>
      <AppAccessGate>
        <div className="space-y-3 px-2 pt-2 md:px-3">
          <DemoPlatformBanner />
          <WorkspaceLayout>{children}</WorkspaceLayout>
        </div>
      </AppAccessGate>
    </AIOSRuntimeProvider>
  );
}
