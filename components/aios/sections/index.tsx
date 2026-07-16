"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { aiosMotion, aiosMotionViewport } from "@/components/aios/animations"
import { AIOSCard } from "@/components/aios/cards"
import { AIOSContainer, AIOSGrid, AIOSSection } from "@/components/aios/layout"
import { AIOSTimelineList, type AIOSTimelineItem } from "@/components/aios/timeline"

export function AIOSSectionHeader({ eyebrow, title, body, align = "left", className }: { eyebrow?: string; title: string; body?: string; align?: "left" | "center"; className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className ?? ""}`.trim()}
      variants={aiosMotion.sectionReveal}
      initial={reduceMotion ? "reduced" : "hidden"}
      whileInView={reduceMotion ? "reduced" : "show"}
      viewport={aiosMotionViewport}
    >
      {eyebrow ? <p className="public-eyebrow">{eyebrow}</p> : null}
      <h2 className="public-h2 mt-5">{title}</h2>
      {body ? <p className="public-body-lg mt-5 text-balance">{body}</p> : null}
    </motion.div>
  )
}

export type AIOSFeatureItem = { title: string; body: string; icon?: LucideIcon; detail?: string; badge?: string }

export function AIOSFeatureGrid({ items, columns = 3 }: { items: AIOSFeatureItem[]; columns?: 2 | 3 | 4 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div variants={aiosMotion.staggerChildren} initial={reduceMotion ? "show" : "hidden"} whileInView="show" viewport={aiosMotionViewport}>
      <AIOSGrid columns={columns}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <motion.div key={item.title} variants={aiosMotion.fadeUp} className="public-motion-reveal">
              <AIOSCard variant="feature" hover className="h-full">
                {item.badge ? <p className="public-eyebrow">{item.badge}</p> : null}
                {Icon ? <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]"><Icon size={18} /></span> : null}
                <h3 className="public-h4">{item.title}</h3>
                <p className="public-body mt-3">{item.body}</p>
                {item.detail ? <p className="public-small mt-4">{item.detail}</p> : null}
              </AIOSCard>
            </motion.div>
          )
        })}
      </AIOSGrid>
    </motion.div>
  )
}

export function AIOSStatsSection({ eyebrow, title, body, stats }: { eyebrow: string; title: string; body?: string; stats: ReactNode }) {
  return <AIOSSection><AIOSContainer><AIOSSectionHeader eyebrow={eyebrow} title={title} body={body} /><div className="mt-14">{stats}</div></AIOSContainer></AIOSSection>
}

export function AIOSFeatureSection({ eyebrow, title, body, items, columns = 3 }: { eyebrow: string; title: string; body?: string; items: AIOSFeatureItem[]; columns?: 2 | 3 | 4 }) {
  return <AIOSSection><AIOSContainer><AIOSSectionHeader eyebrow={eyebrow} title={title} body={body} /><div className="mt-14"><AIOSFeatureGrid items={items} columns={columns} /></div></AIOSContainer></AIOSSection>
}

export function AIOSCTASection({ children }: { children: ReactNode }) {
  return <AIOSSection><AIOSContainer>{children}</AIOSContainer></AIOSSection>
}

export function AIOSTimelineSection({ eyebrow, title, body, items }: { eyebrow: string; title: string; body?: string; items: AIOSTimelineItem[] }) {
  return <AIOSSection><AIOSContainer><AIOSSectionHeader eyebrow={eyebrow} title={title} body={body} /><div className="mt-14"><AIOSTimelineList items={items} /></div></AIOSContainer></AIOSSection>
}

export function AIOSComparisonSection({ eyebrow, title, body, comparison }: { eyebrow: string; title: string; body?: string; comparison: ReactNode }) {
  return <AIOSSection><AIOSContainer><AIOSSectionHeader eyebrow={eyebrow} title={title} body={body} /><div className="mt-14">{comparison}</div></AIOSContainer></AIOSSection>
}
