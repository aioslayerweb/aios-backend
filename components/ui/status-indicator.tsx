import { cn } from "@/utils"

type StatusIndicatorTone = "success" | "warning" | "error" | "info" | "neutral"

type StatusIndicatorProps = {
  tone: StatusIndicatorTone
  label: string
  className?: string
}

const toneClass: Record<StatusIndicatorTone, string> = {
  success: "bg-semantic-success",
  warning: "bg-semantic-warning",
  error: "bg-semantic-error",
  info: "bg-semantic-info",
  neutral: "bg-text-muted",
}

export function StatusIndicator({ tone, label, className }: StatusIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-text-secondary", className)}>
      <span className={cn("h-2 w-2 rounded-full", toneClass[tone])} aria-hidden />
      {label}
    </span>
  )
}
