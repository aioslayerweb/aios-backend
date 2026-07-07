import { SearchX } from "lucide-react"
import { Button } from "@/components/ui"

type ActivityEmptyStateProps = {
  hasFilters: boolean
  onReset: () => void
}

export function ActivityEmptyState({ hasFilters, onReset }: ActivityEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
        <SearchX className="h-5 w-5" />
      </div>
      <p className="text-base font-semibold text-brand-navy">No activity found</p>
      <p className="mt-1 text-sm text-text-muted">
        {hasFilters
          ? "No activities match your filters. Reset to view full runtime history."
          : "Activity providers have not published events yet."}
      </p>
      {hasFilters ? (
        <div className="mt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}
