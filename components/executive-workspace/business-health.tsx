"use client"

import { useBusinessHealth } from "@/hooks"
import { BusinessScoreCard } from "./business-score-card"

export function BusinessHealth() {
  const { health, businessScore } = useBusinessHealth()

  return (
    <section className="space-y-3" aria-label="Business health">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-brand-navy">Business Health</p>
        <span className="rounded-md border border-brand-primary/30 bg-brand-subtle px-2 py-1 text-xs font-semibold text-brand-navy">
          Overall Business Score {businessScore}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {health.map((item) => (
          <BusinessScoreCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
