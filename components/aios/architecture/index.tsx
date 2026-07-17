"use client"

import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { AIOSCard } from "@/components/aios/cards"

export type AIOSOrbitNode = {
  title: string
  x: string
  y: string
  icon?: LucideIcon
  href?: string
}

export function AIOSArchitectureOrbit({ label, title, nodes }: { label: string; title: string; nodes: AIOSOrbitNode[] }) {
  const reduceMotion = useReducedMotion()
  const rotateXRaw = useMotionValue(0)
  const rotateYRaw = useMotionValue(0)
  const rotateX = useSpring(rotateXRaw, { stiffness: 120, damping: 18, mass: 0.6 })
  const rotateY = useSpring(rotateYRaw, { stiffness: 120, damping: 18, mass: 0.6 })

  return (
    <motion.div
      className="relative mx-auto aspect-square min-h-[340px] w-full max-w-[640px] sm:aspect-[1.08/1] sm:min-h-0 [transform-style:preserve-3d]"
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={(event) => {
        if (reduceMotion) {
          return
        }
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        rotateYRaw.set((px - 0.5) * 14)
        rotateXRaw.set((0.5 - py) * 12)
      }}
      onMouseLeave={() => {
        rotateXRaw.set(0)
        rotateYRaw.set(0)
      }}
    >
      <motion.div animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 72, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(200,214,241,0.9)] will-change-transform" />
      <motion.div animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[rgba(184,201,237,0.88)] will-change-transform" />

      <div className="absolute left-1/2 top-1/2 z-20 w-[clamp(170px,58vw,248px)] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,#1976FF,#66B5FF)] px-4 py-6 text-white shadow-[0_28px_70px_rgba(25,118,255,0.26)] sm:px-6 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">{label}</p>
        <p className="mt-3 text-xl font-semibold leading-tight sm:mt-4 sm:text-3xl">{title}</p>
      </div>

      {nodes.map((node, index) => {
        const Icon = node.icon
        const content = (
          <>
            {Icon ? <span className="mb-2 inline-flex rounded-xl bg-[var(--public-color-muted)] p-2 text-[color:var(--public-color-primary)]"><Icon size={15} /></span> : null}
            <span className="block text-[11px] font-semibold leading-tight text-[color:var(--public-color-navy)] sm:text-xs">{node.title}</span>
          </>
        )

        return (
          <motion.div key={node.title} style={{ left: node.x, top: node.y }} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: reduceMotion ? 0 : [0, index % 2 === 0 ? -8 : -5, 0], scale: 1 }} transition={reduceMotion ? { delay: index * 0.02, duration: 0.18 } : { delay: index * 0.05, y: { duration: 4 + index * 0.2, repeat: Infinity, ease: "easeInOut" } }} className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform">
            {node.href ? <Link href={node.href} className="public-card public-card-glass public-card-hover block max-w-[110px] px-2.5 py-2 text-center sm:max-w-[160px] sm:px-4 sm:py-3">{content}</Link> : <AIOSCard variant="glass" className="max-w-[110px] px-2.5 py-2 text-center sm:max-w-[160px] sm:px-4 sm:py-3">{content}</AIOSCard>}
          </motion.div>
        )
      })}

      {nodes.map((node, index) => {
        const numericX = Number.parseFloat(node.x)
        const numericY = Number.parseFloat(node.y)
        const angle = Math.atan2(numericY - 50, numericX - 50)
        const length = Math.hypot(numericX - 50, numericY - 50)

        return <motion.span key={`${node.title}-line`} className="pointer-events-none absolute left-1/2 top-1/2 block h-px origin-left bg-gradient-to-r from-[rgba(127,177,255,0.78)] to-transparent" style={{ width: `${length * 0.7}%`, rotate: `${(angle * 180) / Math.PI}deg` }} animate={reduceMotion ? { opacity: 0.36 } : { opacity: [0.18, 0.82, 0.18] }} transition={{ duration: 2 + index * 0.16, repeat: reduceMotion ? 0 : Infinity }} />
      })}
    </motion.div>
  )
}

export const AIOSArchitectureSection = AIOSArchitectureOrbit
