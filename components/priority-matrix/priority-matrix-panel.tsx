"use client"

import type { PlanningPriorityCard } from "@/types"

type PriorityMatrixPanelProps = {
  cards: PlanningPriorityCard[]
  onSelectCard: (title: string) => void
  selectedTitle?: string
}

export function PriorityMatrixPanel({ cards, onSelectCard, selectedTitle }: PriorityMatrixPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Priority matrix">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Priority Matrix</p>
        <span className="text-[11px] text-text-muted">Drag simulation by quadrant</span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {cards.map((card) => {
          const active = selectedTitle === card.title
          return (
            <button
              key={card.id}
              type="button"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", card.title)}
              onClick={() => onSelectCard(card.title)}
              className={active ? "rounded-xl border border-brand-primary bg-brand-subtle p-3 text-left" : "rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-brand-primary"}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{card.title}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{card.description}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-text-muted">
                <span className="rounded border border-border px-1.5 py-0.5">Impact {card.impact}</span>
                <span className="rounded border border-border px-1.5 py-0.5">Urgency {card.urgency}</span>
              </div>
              <p className="mt-2 text-[11px] text-text-secondary">{card.simulationHint}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
