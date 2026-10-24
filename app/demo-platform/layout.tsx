import type { ReactNode } from "react";
import { AIOSRuntimeProvider } from "@/components/layout/AIOSRuntimeContext";
import { WorkspaceLayout } from "@/components/layout/foundation";
import { AppProviders } from "@/providers";

/**
 * Demo platform layout — full app shell, NO authentication gate.
 * Accessible publicly at /demo-platform so prospects can experience
 * the full AIOS dashboard without requiring a login.
 */
export default function DemoPlatformLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders authSessionEnabled={false} liveDataEnabled={false}>
      <AIOSRuntimeProvider>
        <div className="space-y-3 px-2 pt-2 md:px-3">
          <div
            role="note"
            className="mx-auto w-full max-w-[1400px] rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs text-blue-900"
          >
            <strong className="font-semibold">Demo preview · synthetic sample data.</strong>
            <span className="ml-1">Interactions are local previews only; they do not change business data.</span>
          </div>
          <WorkspaceLayout baseHref="/demo-platform" hideWorkspaceHeader>{children}</WorkspaceLayout>
        </div>
      </AIOSRuntimeProvider>
    </AppProviders>
  );
}
