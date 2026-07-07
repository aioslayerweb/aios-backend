import { Skeleton } from "@/components/ui"

export function ActivityLoadingState() {
  return (
    <div className="space-y-4" aria-live="polite" aria-label="Loading activity feed">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={`activity-skeleton-${index}`} className="rounded-xl border border-border bg-white p-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
