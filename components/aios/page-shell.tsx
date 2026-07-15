"use client"

import type { ReactNode } from "react"
import { AIOSFloatingParticles, AIOSLightBackground } from "@/components/aios/backgrounds"
import { AIOSFooter } from "@/components/aios/footer"
import { AIOSNavbar } from "@/components/aios/navigation"
import { AIOSPage } from "@/components/aios/layout"

export function AIOSPageShell({ activeHref, children, includeFooter = true, includeNewsletter = true }: { activeHref: string; children: ReactNode; includeFooter?: boolean; includeNewsletter?: boolean }) {
  return (
    <AIOSPage>
      <AIOSLightBackground />
      <AIOSFloatingParticles />
      <AIOSNavbar activeHref={activeHref} />
      <main>{children}</main>
      {includeFooter ? <AIOSFooter includeNewsletter={includeNewsletter} /> : null}
    </AIOSPage>
  )
}
