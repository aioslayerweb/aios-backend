import { type HTMLAttributes } from "react"
import { cn } from "@/utils"

type BadgeTone = "default" | "success" | "warning" | "error" | "info"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

const toneClass: Record<BadgeTone, string> = {
  default: "bg-surface-muted text-text-secondary",
  success: "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]",
  warning: "bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]",
  error: "bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)]",
  info: "bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)]",
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return <span className={cn("aios-badge", toneClass[tone], className)} {...props} />
}
