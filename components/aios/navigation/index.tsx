"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { BrandLogo } from "@/components/branding"
import { AIOSPrimaryButton, AIOSSecondaryButton } from "@/components/aios/buttons"
import { aiosMotion } from "@/components/aios/animations"
import { AIOSContainer } from "@/components/aios/layout"
import { cx } from "@/components/aios/layout/utils"
import { aiosNavigationItems, aiosTheme } from "@/components/aios/theme/tokens"

function isActive(currentHref: string, itemHref: string) {
  return itemHref === "/" ? currentHref === "/" : currentHref === itemHref
}

export function AIOSNavbar({ activeHref, ctaHref = "/contact", ctaLabel = "Book Demo" }: { activeHref?: string; ctaHref?: string; ctaLabel?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-header border-b border-[rgba(220,229,246,0.8)] bg-[rgba(255,255,255,0.74)] backdrop-blur-xl">
        <AIOSContainer size="wide" className="flex h-20 items-center justify-between gap-4">
          <button type="button" onClick={() => setMenuOpen(true)} className="public-button public-button-outline h-11 w-11 px-0 lg:hidden" aria-label="Open navigation menu">
            <Menu size={18} />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0" aria-label="AIOS home">
            <BrandLogo width={132} height={31} priority />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Global navigation">
            {aiosNavigationItems.map((item) => {
              const active = isActive(activeHref ?? "", item.href)
              return (
                <Link key={item.href} href={item.href} className={cx("relative py-2 text-sm font-medium transition-colors duration-200", active ? "text-[color:var(--public-color-primary)]" : "text-[color:var(--public-color-text)] hover:text-[color:var(--public-color-primary)]")}>
                  {item.label}
                  <span className={cx("absolute inset-x-0 -bottom-[13px] h-[2px] rounded-full bg-[color:var(--public-color-primary)] transition-opacity duration-200", active ? "opacity-100" : "opacity-0")} />
                </Link>
              )
            })}
          </nav>

          <AIOSSecondaryButton href={ctaHref} size="sm" className="hidden sm:inline-flex">
            {ctaLabel}
          </AIOSSecondaryButton>
        </AIOSContainer>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-[rgba(7,19,61,0.28)] backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)}>
            <motion.div variants={aiosMotion.drawer} initial="initial" animate="animate" exit="exit" role="dialog" aria-modal="true" aria-label="Navigation menu" className="ml-auto flex h-full w-full max-w-[520px] flex-col bg-[rgba(255,255,255,0.94)] p-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between">
                <BrandLogo width={128} height={30} priority />
                <button type="button" onClick={() => setMenuOpen(false)} className="public-button public-button-outline h-11 w-11 px-0" aria-label="Close navigation menu">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-10 grid gap-3">
                {aiosNavigationItems.map((item, index) => {
                  const active = isActive(activeHref ?? "", item.href)
                  return (
                    <motion.div key={item.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: aiosTheme.motion.state }}>
                      <Link href={item.href} onClick={() => setMenuOpen(false)} className={cx("block rounded-[24px] border px-4 py-4 text-base font-semibold transition-colors", active ? "border-[color:var(--public-color-primary)] bg-[var(--public-color-hover)] text-[color:var(--public-color-primary)]" : "border-[color:var(--public-color-border)] bg-white text-[color:var(--public-color-navy)]")}>
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-auto pt-8">
                <AIOSPrimaryButton href={ctaHref} className="w-full justify-center" size="lg">
                  {ctaLabel}
                </AIOSPrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
