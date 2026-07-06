import { type HTMLAttributes } from "react"
import { cn } from "@/utils"

type BadgeTone = "default" | "success" | "warning" | "error" | "info"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

const toneClass: Record<BadgeTone, string> = {
  default: "bg-surface-muted text-text-secondary",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-rose-50 text-rose-700",
  info: "bg-brand-subtle text-brand-navy",
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return <span className={cn("aios-badge", toneClass[tone], className)} {...props} />
}
