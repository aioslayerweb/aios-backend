import type { ReactNode } from "react";
import { AIOSRuntimeProvider } from "@/components/layout/AIOSRuntimeContext";
import { WorkspaceLayout } from "@/components/layout/foundation";

/**
 * Demo platform layout — full app shell, NO authentication gate.
 * Accessible publicly at /demo-platform so prospects can experience
 * the full AIOS dashboard without requiring a login.
 */
export default function DemoPlatformLayout({ children }: { children: ReactNode }) {
  return (
    <AIOSRuntimeProvider>
      <WorkspaceLayout baseHref="/demo-platform" hideWorkspaceHeader>{children}</WorkspaceLayout>
    </AIOSRuntimeProvider>
  );
}
