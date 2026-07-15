import type { ReactNode } from "react"
import { cx } from "@/components/aios/layout/utils"

export function AIOSBadge({ children, variant = "neutral", outline = false, className }: { children: ReactNode; variant?: "primary" | "success" | "warning" | "danger" | "neutral"; outline?: boolean; className?: string }) {
  const colorClass =
    variant === "primary"
      ? outline ? "border-[color:var(--public-color-primary)] text-[color:var(--public-color-primary)] bg-transparent" : "bg-[var(--public-color-hover)] text-[color:var(--public-color-primary)]"
      : variant === "success"
        ? outline ? "border-[color:var(--public-color-success)] text-[color:var(--public-color-success)] bg-transparent" : "bg-[rgba(18,161,90,0.12)] text-[color:var(--public-color-success)]"
        : variant === "warning"
          ? outline ? "border-[color:var(--public-color-warning)] text-[color:var(--public-color-warning)] bg-transparent" : "bg-[rgba(211,138,23,0.12)] text-[color:var(--public-color-warning)]"
          : variant === "danger"
            ? outline ? "border-[color:var(--public-color-danger)] text-[color:var(--public-color-danger)] bg-transparent" : "bg-[rgba(226,91,82,0.12)] text-[color:var(--public-color-danger)]"
            : outline ? "border-[color:var(--public-color-border-strong)] text-[color:var(--public-color-text)] bg-transparent" : "bg-[rgba(247,249,252,0.9)] text-[color:var(--public-color-text)]"

  return <span className={cx("inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold", colorClass, className)}>{children}</span>
}
