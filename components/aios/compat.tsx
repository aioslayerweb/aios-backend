"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { BrandLogo } from "@/components/branding"
import { AIOSArchitectureOrbit } from "@/components/aios/architecture"
import { AIOSFloatingCard, AIOSGlassCard } from "@/components/aios/cards"
import { AIOSButtonLink } from "@/components/aios/buttons"
import { AIOSCTASection, AIOSFooter } from "@/components/aios/footer"
import { AIOSHero } from "@/components/aios/hero"
import { AIOSContainer, AIOSPage, AIOSSection } from "@/components/aios/layout"
import { AIOSNavbar } from "@/components/aios/navigation"
import { AIOSFeatureGrid, AIOSSectionHeader } from "@/components/aios/sections"
import { AIOSTimelineList } from "@/components/aios/timeline"

export function AIOSComparisonCard({ rows, leftLabel, rightLabel }: { rows: Array<{ label: string; left: string; right: string }>; leftLabel: string; rightLabel: string }) {
  return (
    <AIOSFloatingCard className="overflow-hidden">
      <div className="grid gap-4 border-b border-[var(--public-color-border)] pb-4 md:grid-cols-[1.2fr_1fr_1fr]">
        <p className="public-caption">Category</p>
        <p className="public-caption text-[color:var(--public-color-text)]">{leftLabel}</p>
        <p className="public-caption text-[color:var(--public-color-primary)]">{rightLabel}</p>
      </div>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-3 rounded-2xl bg-[rgba(247,249,252,0.8)] px-4 py-4 md:grid-cols-[1.2fr_1fr_1fr]">
            <p className="font-semibold text-[color:var(--public-color-navy)]">{row.label}</p>
            <p className="public-small text-[color:var(--public-color-text)]">{row.left}</p>
            <p className="public-small text-[color:var(--public-color-primary)]">{row.right}</p>
          </div>
        ))}
      </div>
    </AIOSFloatingCard>
  )
}

export function AIOSTabbedPanel({ items, initialKey }: { items: Array<{ key: string; label: string; title: string; body: string; bullets: string[]; icon?: LucideIcon }>; initialKey?: string }) {
  const [activeKey, setActiveKey] = useState(initialKey ?? items[0]?.key ?? "")
  const reduceMotion = useReducedMotion()
  const active = items.find((item) => item.key === activeKey) ?? items[0]
  const ActiveIcon = active?.icon

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="flex flex-wrap gap-3 lg:flex-col" role="tablist" aria-label="Feature panels">
        {items.map((item) => (
          <button
            key={item.key}
            id={`${item.key}-tab`}
            type="button"
            role="tab"
            aria-selected={item.key === activeKey}
            aria-controls={`${item.key}-panel`}
            tabIndex={item.key === activeKey ? 0 : -1}
            onClick={() => setActiveKey(item.key)}
            className="public-chip max-w-full text-left"
            data-active={item.key === activeKey}
          >
            {item.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={active.key}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            role="tabpanel"
            id={`${active.key}-panel`}
            aria-labelledby={`${active.key}-tab`}
          >
            <AIOSFloatingCard className="overflow-hidden">
              {ActiveIcon ? <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]"><ActiveIcon size={18} /></span> : null}
              <h3 className="public-h3">{active.title}</h3>
              <p className="public-body-lg mt-4">{active.body}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {active.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-[var(--public-color-border)] bg-[rgba(247,249,252,0.7)] px-4 py-3 text-sm font-medium text-[color:var(--public-color-text)]">{bullet}</div>
                ))}
              </div>
            </AIOSFloatingCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function AIOSLogoMarquee({ items }: { items: string[] }) {
  const reduceMotion = useReducedMotion()
  const track = [...items, ...items]
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />
      <motion.div animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }} className="flex min-w-max items-center gap-4">
        {track.map((item, index) => (
          <AIOSGlassCard key={`${item}-${index}`} className="rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--public-color-text)]">{item}</AIOSGlassCard>
        ))}
      </motion.div>
    </div>
  )
}

export {
  AIOSArchitectureOrbit,
  AIOSButtonLink,
  AIOSCTASection,
  AIOSFeatureGrid,
  AIOSFooter,
  AIOSHero,
  AIOSContainer,
  AIOSNavbar,
  AIOSPage,
  AIOSSection,
  AIOSSectionHeader,
  AIOSTimelineList,
}

export function AIOSFooterBrand() {
  return <BrandLogo width={132} height={31} />
}

export function AIOSPublicLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href}>{children}</Link>
}
