"use client"

import { useEffect, useMemo, useState } from "react"
import { breakpoints } from "@/theme/tokens"

type Breakpoint = "small-mobile" | "mobile" | "tablet" | "laptop" | "desktop" | "ultra"

function resolveBreakpoint(width: number): Breakpoint {
  if (width < breakpoints.sm) {
    return "small-mobile"
  }
  if (width < breakpoints.md) {
    return "mobile"
  }
  if (width < breakpoints.lg) {
    return "tablet"
  }
  if (width < breakpoints["2xl"]) {
    return "laptop"
  }
  if (width < breakpoints["4xl"]) {
    return "desktop"
  }

  return "ultra"
}

export function useBreakpoint() {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const breakpoint = useMemo(() => resolveBreakpoint(width), [width])

  return {
    width,
    breakpoint,
    isMobile: breakpoint === "small-mobile" || breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop" || breakpoint === "ultra" || breakpoint === "laptop",
  }
}
