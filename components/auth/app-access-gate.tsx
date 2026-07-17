import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route"

type AppAccessGateProps = {
  children: ReactNode;
};

export function AppAccessGate({ children }: AppAccessGateProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}