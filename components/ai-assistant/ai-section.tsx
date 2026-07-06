import type { ReactNode } from "react"
import { cn } from "@/utils"

type AISectionProps = {
  title: string
  children: ReactNode
  className?: string
}

export function AISection({ title, children, className }: AISectionProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface-canvas p-3 shadow-sm", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  )
}
