"use client"

import type { ReactNode } from "react"
import { AIOSLightBackground } from "@/components/aios/backgrounds"
import { AIOSFooter } from "@/components/aios/footer"
import { AIOSNavbar } from "@/components/aios/navigation"
import type { AIOSNavItem } from "@/components/aios/navigation"
import { AIOSPage } from "@/components/aios/layout"

export function AIOSPageShell(props: {
  activeHref: string
  children: ReactNode
  includeFooter?: boolean
  includeNewsletter?: boolean
  desktopNavigationItems?: readonly AIOSNavItem[]
  mobileNavigationItems?: readonly AIOSNavItem[]
}) {
  const {
    activeHref,
    children,
    includeFooter = true,
    desktopNavigationItems,
    mobileNavigationItems,
  } = props
  return (
    <AIOSPage>
      <a href="#main-content" className="public-skip-link">Skip to main content</a>
      <AIOSLightBackground />
      <AIOSNavbar activeHref={activeHref} desktopNavigationItems={desktopNavigationItems} mobileNavigationItems={mobileNavigationItems} />
      <main
        id="main-content"
        className="public-safe-bottom"
      >
        {children}
      </main>
      {includeFooter ? <AIOSFooter /> : null}
    </AIOSPage>
  )
}
