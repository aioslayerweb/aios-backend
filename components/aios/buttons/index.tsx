"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cx } from "@/components/aios/layout/utils"
import { aiosSpring } from "@/components/aios/animations"

type AIOSButtonProps = {
  href: string
  children: ReactNode
  icon?: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "text"
  ariaLabel?: string
  analyticsEvent?: string
}

function inferAnalyticsEvent(href: string, label: string) {
  const normalized = label.toLowerCase()

  if (normalized.includes("book demo") || href.includes("/contact")) {
    return normalized.includes("pilot") ? "pilot_click" : "demo_click"
  }

  if (normalized.includes("join pilot")) {
    return "pilot_application_click"
  }

  if (normalized.includes("request pricing")) {
    return "pricing_request_click"
  }

  if (normalized.includes("schedule discovery")) {
    return "discovery_click"
  }

  if (normalized.includes("download")) {
    return "download_click"
  }

  if (href.startsWith("/")) {
    return "navigation_click"
  }

  return undefined
}

export function AIOSButtonLink({ href, children, icon, className, size = "md", variant = "primary", ariaLabel, analyticsEvent }: AIOSButtonProps) {
  const reduceMotion = useReducedMotion()
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const x = useSpring(offsetX, aiosSpring)
  const y = useSpring(offsetY, aiosSpring)
  const text = typeof children === "string" ? children : ariaLabel ?? href
  const resolvedAnalyticsEvent = analyticsEvent ?? inferAnalyticsEvent(href, text)

  const sizeClass = size === "lg" ? "px-7 py-4 text-base" : size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-sm"

  return (
    <motion.div
      className="inline-flex"
      style={reduceMotion ? undefined : { x, y }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
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
      <Link href={href} aria-label={ariaLabel} data-analytics-event={resolvedAnalyticsEvent} className={cx("public-button", `public-button-${variant}`, sizeClass, className)}>
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
