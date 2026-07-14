import type { ReactNode } from "react";

type AppAccessGateProps = {
  children: ReactNode;
};

export function AppAccessGate({ children }: AppAccessGateProps) {
  // Placeholder for future app auth checks; pass-through is intentional for demo mode.
  return <>{children}</>;
}