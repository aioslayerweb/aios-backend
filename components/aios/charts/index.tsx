import type { ReactNode } from "react"
import { AIOSCard } from "@/components/aios/cards"

export function AIOSChartPanel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <AIOSCard variant="glass" className="overflow-hidden p-5">
      <p className="public-eyebrow">{title}</p>
      {subtitle ? <p className="public-small mt-2">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </AIOSCard>
  )
}
