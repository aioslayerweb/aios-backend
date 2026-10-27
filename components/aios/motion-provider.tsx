"use client"

import type { ReactNode } from "react"
import { LazyMotion } from "framer-motion"

// Animation features load asynchronously so the framer-motion runtime stays out of the initial bundle.
const loadMotionFeatures = () => import("@/components/aios/motion-features").then((module) => module.default)

/**
 * Enables the lightweight `m` components from framer-motion across the app.
 * Shared AIOS components must import `m` (not `motion`) to benefit from the deferred feature bundle.
 */
export function AIOSMotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>
}
