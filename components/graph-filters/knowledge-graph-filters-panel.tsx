"use client"

import type { BusinessEntityType, KnowledgeGraphDepartment, KnowledgeGraphFilters, KnowledgeEntityStatus } from "@/types"
import { Button } from "@/components/ui"

type KnowledgeGraphFiltersPanelProps = {
  filters: KnowledgeGraphFilters
  onUpdateFilters: (patch: Partial<KnowledgeGraphFilters>) => void
  onClearFilters: () => void
}

const entityTypes: BusinessEntityType[] = ["company", "deal", "workflow", "agent", "memory-node", "knowledge-document", "policy", "goal", "task", "project"]
const departments: KnowledgeGraphDepartment[] = ["executive", "sales", "operations", "support", "knowledge", "finance", "platform"]
const statuses: KnowledgeEntityStatus[] = ["active", "monitoring", "at-risk", "completed", "archived"]

function toggleValue<T extends string>(current: T[], value: T) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
}

export function KnowledgeGraphFiltersPanel({ filters, onUpdateFilters, onClearFilters }: KnowledgeGraphFiltersPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Graph filters">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Graph Filters</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Constrain the semantic view</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear</Button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Entity type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {entityTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onUpdateFilters({ entityTypes: toggleValue(filters.entityTypes, type) })}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${filters.entityTypes.includes(type) ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary"}`}
              >
                {type.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Department</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => onUpdateFilters({ departments: toggleValue(filters.departments, department) })}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${filters.departments.includes(department) ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary"}`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onUpdateFilters({ statuses: toggleValue(filters.statuses, status) })}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${filters.statuses.includes(status) ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary"}`}
              >
                {status.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Confidence</p>
            <span className="text-[11px] text-text-muted">{filters.confidenceMin}% min</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.confidenceMin}
            onChange={(event) => onUpdateFilters({ confidenceMin: Number(event.target.value) })}
            className="mt-2 w-full accent-[var(--color-brand-primary)]"
            aria-label="Minimum graph confidence"
          />
        </div>
      </div>
    </section>
  )
}