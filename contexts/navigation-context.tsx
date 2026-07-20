"use client";

import { createContext, useContext, type ReactNode } from "react";

interface NavigationContextType {
  baseHref: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({
  children,
  baseHref = "/app",
}: {
  children: ReactNode;
  baseHref?: string;
}) {
  return <NavigationContext.Provider value={{ baseHref }}>{children}</NavigationContext.Provider>;
}

export function useNavigationBase() {
  const context = useContext(NavigationContext);
  if (!context) {
    return { baseHref: "/app" };
  }
  return context;
}
