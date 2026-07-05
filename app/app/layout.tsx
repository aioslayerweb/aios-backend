import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import { AIOSRuntimeProvider } from "@/components/layout/AIOSRuntimeContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AIOSRuntimeProvider>
      <AppShell>{children}</AppShell>
    </AIOSRuntimeProvider>
  );
}
