"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { aiosMotion } from "@/components/aios/animations"
import { AIOSFloatingParticles, AIOSLightBackground } from "@/components/aios/backgrounds"
import { AIOSFooter } from "@/components/aios/footer"
import { AIOSNavbar } from "@/components/aios/navigation"
import { AIOSPage } from "@/components/aios/layout"

export function AIOSPageShell({ activeHref, children, includeFooter = true, includeNewsletter = true }: { activeHref: string; children: ReactNode; includeFooter?: boolean; includeNewsletter?: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <AIOSPage>
      <a href="#main-content" className="public-skip-link">Skip to main content</a>
      <AIOSLightBackground />
      <AIOSFloatingParticles />
      <AIOSNavbar activeHref={activeHref} />
      <motion.main
        id="main-content"
        initial={reduceMotion ? "animate" : "initial"}
        animate="animate"
        exit="exit"
        variants={aiosMotion.pageTransition}
        className="public-safe-bottom"
      >
        {children}
      </motion.main>
      {includeFooter ? <AIOSFooter includeNewsletter={includeNewsletter} /> : null}
    </AIOSPage>
  )
}
