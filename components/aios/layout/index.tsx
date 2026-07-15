import type { CSSProperties, ReactNode } from "react"
import { cx } from "@/components/aios/layout/utils"

type AIOSPageProps = {
  children: ReactNode
  className?: string
}

export function AIOSPage({ children, className }: AIOSPageProps) {
  return <div className={cx("public-site", className)}>{children}</div>
}

export function AIOSContainer({ children, className, size = "default" }: { children: ReactNode; className?: string; size?: "default" | "wide" | "full" }) {
  return <div className={cx(size === "wide" ? "public-container public-container-wide" : size === "full" ? "public-container-full" : "public-container", className)}>{children}</div>
}

export function AIOSSection({ children, className, tight = false, id }: { children: ReactNode; className?: string; tight?: boolean; id?: string }) {
  return <section id={id} className={cx(tight ? "public-section public-section-tight" : "public-section", className)}>{children}</section>
}

export function AIOSGrid({ children, className, columns = 3 }: { children: ReactNode; className?: string; columns?: 1 | 2 | 3 | 4 }) {
  const gridClass = columns === 4 ? "xl:grid-cols-4 md:grid-cols-2" : columns === 2 ? "md:grid-cols-2" : columns === 1 ? "grid-cols-1" : "xl:grid-cols-3 md:grid-cols-2"
  return <div className={cx("grid gap-5", gridClass, className)}>{children}</div>
}

export function AIOSStack({ children, className, gap = "md" }: { children: ReactNode; className?: string; gap?: "sm" | "md" | "lg" | "xl" }) {
  const gapClass = gap === "sm" ? "gap-3" : gap === "lg" ? "gap-8" : gap === "xl" ? "gap-12" : "gap-5"
  return <div className={cx("flex flex-col", gapClass, className)}>{children}</div>
}

export function AIOSSpacer({ size = 24, axis = "vertical" }: { size?: number; axis?: "vertical" | "horizontal" }) {
  const style: CSSProperties = axis === "vertical" ? { height: size } : { width: size, display: "inline-block" }
  return <div aria-hidden style={style} />
}

export function AIOSDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cx("public-divider", className)} />
}
