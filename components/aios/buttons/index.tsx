"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cx } from "@/components/aios/layout/utils"

type AIOSButtonProps = {
  href: string
  children: ReactNode
  icon?: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "text"
  ariaLabel?: string
}

export function AIOSButtonLink({ href, children, icon, className, size = "md", variant = "primary", ariaLabel }: AIOSButtonProps) {
  const reduceMotion = useReducedMotion()
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const x = useSpring(offsetX, { stiffness: 160, damping: 18, mass: 0.45 })
  const y = useSpring(offsetY, { stiffness: 160, damping: 18, mass: 0.45 })

  const sizeClass = size === "lg" ? "px-7 py-4 text-base" : size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-sm"

  return (
    <motion.div
      className="inline-flex"
      style={reduceMotion ? undefined : { x, y }}
      onMouseMove={(event) => {
        if (reduceMotion) {
          return
        }
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        offsetX.set((event.clientX - (rect.left + rect.width / 2)) * 0.12)
        offsetY.set((event.clientY - (rect.top + rect.height / 2)) * 0.12)
      }}
      onMouseLeave={() => {
        offsetX.set(0)
        offsetY.set(0)
      }}
    >
      <Link href={href} aria-label={ariaLabel} className={cx("public-button", `public-button-${variant}`, sizeClass, className)}>
        <span>{children}</span>
        {icon ?? (variant === "primary" ? <ArrowRight size={16} /> : null)}
      </Link>
    </motion.div>
  )
}

export function AIOSPrimaryButton(props: Omit<AIOSButtonProps, "variant">) {
  return <AIOSButtonLink {...props} variant="primary" />
}

export function AIOSSecondaryButton(props: Omit<AIOSButtonProps, "variant">) {
  return <AIOSButtonLink {...props} variant="secondary" />
}

export function AIOSOutlineButton(props: Omit<AIOSButtonProps, "variant">) {
  return <AIOSButtonLink {...props} variant="outline" />
}

export function AIOSGhostButton(props: Omit<AIOSButtonProps, "variant">) {
  return <AIOSButtonLink {...props} variant="ghost" />
}

export function AIOSIconButton({ href, icon, ariaLabel, className }: { href: string; icon: ReactNode; ariaLabel: string; className?: string }) {
  return <AIOSButtonLink href={href} icon={icon} ariaLabel={ariaLabel} className={cx("h-11 w-11 px-0", className)} variant="outline"><span className="sr-only">{ariaLabel}</span></AIOSButtonLink>
}
