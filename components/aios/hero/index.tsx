"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { aiosMotion, aiosMotionViewport } from "@/components/aios/animations"
import { AIOSContainer, AIOSSection } from "@/components/aios/layout"

export type AIOSHeroStat = { label: string; value: string; detail?: string }

export function AIOSHero({ eyebrow, title, body, actions, visual, stats }: { eyebrow: string; title: string; body: string; actions?: ReactNode; visual?: ReactNode; stats?: AIOSHeroStat[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <AIOSSection className="pb-10 pt-20 lg:pt-24">
      <AIOSContainer size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div variants={aiosMotion.fadeUp} initial={reduceMotion ? "reduced" : "hidden"} animate={reduceMotion ? "reduced" : "show"} viewport={aiosMotionViewport}>
            <p className="public-eyebrow">{eyebrow}</p>
            <h1 className="public-display-lg mt-6 max-w-4xl">{title}</h1>
            <p className="public-body-lg mt-7 max-w-2xl text-balance">{body}</p>
            {actions ? <div className="mt-10 flex flex-wrap gap-4">{actions}</div> : null}
            {stats?.length ? (
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="public-card public-card-kpi public-card-hover public-motion-reveal">
                    <p className="public-caption text-[color:var(--public-color-text-soft)]">{item.label}</p>
                    <p className="public-h4 mt-3">{item.value}</p>
                    {item.detail ? <p className="public-small mt-2">{item.detail}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
          <motion.div variants={aiosMotion.blurReveal} initial={reduceMotion ? "reduced" : "hidden"} animate={reduceMotion ? "reduced" : "show"} viewport={aiosMotionViewport} className="relative public-motion-reveal">
            {visual}
          </motion.div>
        </div>
      </AIOSContainer>
    </AIOSSection>
  )
}

export const AIOSHeroSplit = AIOSHero

export function AIOSHeroCentered({ eyebrow, title, body, actions }: { eyebrow: string; title: string; body: string; actions?: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <AIOSSection className="pb-10 pt-20 lg:pt-24">
      <AIOSContainer>
        <motion.div variants={aiosMotion.fadeUp} initial={reduceMotion ? "reduced" : "hidden"} animate={reduceMotion ? "reduced" : "show"} viewport={aiosMotionViewport} className="mx-auto max-w-4xl text-center">
          <p className="public-eyebrow justify-center">{eyebrow}</p>
          <h1 className="public-display-lg mt-6">{title}</h1>
          <p className="public-body-lg mt-7 text-balance">{body}</p>
          {actions ? <div className="mt-10 flex flex-wrap justify-center gap-4">{actions}</div> : null}
        </motion.div>
      </AIOSContainer>
    </AIOSSection>
  )
}
