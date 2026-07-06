import type { ReactNode } from "react";
import { WorkspaceLayout } from "@/components/layout/foundation";
import { AIOSRuntimeProvider } from "@/components/layout/AIOSRuntimeContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AIOSRuntimeProvider>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </AIOSRuntimeProvider>
  );
}
