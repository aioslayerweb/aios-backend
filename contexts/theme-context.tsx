"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type ThemeMode = "light" | "dark" | "system"

type ThemeContextValue = {
  mode: ThemeMode
  resolvedMode: "light" | "dark"
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light")
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    const next = mode === "system" ? resolveSystemMode() : mode
    setResolvedMode(next)
    document.documentElement.dataset.theme = next
    document.documentElement.dataset.aiosTheme = next
    document.documentElement.style.colorScheme = next
  }, [mode])

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider")
  }

  return context
}

export const AIOSThemeProvider = ThemeProvider
