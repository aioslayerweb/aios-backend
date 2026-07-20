"use client";

import { createContext, useContext, type ReactNode } from "react";

interface NavigationContextType {
  baseHref: string;
  hideWorkspaceHeader: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({
  children,
  baseHref = "/app",
  hideWorkspaceHeader = false,
}: {
  children: ReactNode;
  baseHref?: string;
  hideWorkspaceHeader?: boolean;
}) {
  return <NavigationContext.Provider value={{ baseHref, hideWorkspaceHeader }}>{children}</NavigationContext.Provider>;
}

export function useNavigationBase() {
  const context = useContext(NavigationContext);
  if (!context) {
    return { baseHref: "/app", hideWorkspaceHeader: false };
  }
  return context;
}
