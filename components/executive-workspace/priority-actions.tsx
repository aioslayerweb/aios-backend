"use client"

import { useExecutiveWorkspace } from "@/hooks"
import { PriorityCard } from "./priority-card"

export function PriorityActions() {
  const { priorities, deferPriorityAction } = useExecutiveWorkspace()

  return (
    <section className="space-y-3" aria-label="Priority actions">
      <p className="text-lg font-semibold text-brand-navy">Priority Actions</p>

      <div className="grid gap-3 lg:grid-cols-2">
        {priorities.map((item) => (
          <PriorityCard key={item.id} item={item} onDefer={deferPriorityAction} />
        ))}
      </div>
    </section>
  )
}
