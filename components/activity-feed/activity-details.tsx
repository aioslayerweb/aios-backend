import { Pin, X } from "lucide-react"
import type { ActivityItem } from "@/types"
import { formatActivityDate } from "@/utils/activity-feed"
import { Button } from "@/components/ui"
import { ActivityBadge } from "./activity-badge"
import { ActivityIcon } from "./activity-icon"

type ActivityDetailsProps = {
  item: ActivityItem | null
  onClose: () => void
}

export function ActivityDetails({ item, onClose }: ActivityDetailsProps) {
  if (!item) {
    return (
      <aside className="rounded-xl border border-border bg-white p-5">
        <p className="text-sm text-text-muted">Select an activity to view details.</p>
      </aside>
    )
  }

  return (
    <aside className="rounded-xl border border-border bg-white" aria-label="Activity details panel">
      <header className="flex items-start justify-between border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-muted">Activity Details</p>
          <h3 className="mt-1 truncate text-base font-semibold text-brand-navy">{item.title}</h3>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close details panel">
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <ActivityIcon category={item.category} metadata={item.metadata} />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{item.summary}</p>
            <p className="mt-1 text-xs text-text-muted">{formatActivityDate(item.timestamp)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActivityBadge kind="priority" value={item.priority} />
          <ActivityBadge kind="status" value={item.metadata.status} />
          <ActivityBadge kind="pinned" value={item.pinned} />
          <ActivityBadge kind="unread" value={item.unread} />
        </div>

        <section className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-text-muted">Summary</p>
          <p className="text-sm text-text-secondary">{item.metadata.details ?? item.summary}</p>
        </section>

        <section className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-text-muted">Actor</p>
          <p className="text-sm text-text-secondary">{item.actor.name}</p>
        </section>

        <section className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-text-muted">Source</p>
          <p className="text-sm text-text-secondary">{item.source.label}</p>
        </section>

        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-muted">Metadata</p>
          <div className="rounded-lg bg-surface-muted p-3 text-xs text-text-secondary">
            <p>Type: {item.metadata.eventType}</p>
            <p>Status: {item.metadata.status}</p>
            <p>Workspace: {item.metadata.workspace}</p>
            <p>Tags: {item.metadata.tags.join(", ")}</p>
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-muted">Related Objects</p>
          {item.metadata.relatedObjects.length === 0 ? (
            <p className="text-xs text-text-muted">No related objects linked.</p>
          ) : (
            <ul className="space-y-1">
              {item.metadata.relatedObjects.map((related) => (
                <li key={`${related.type}-${related.id}`} className="rounded border border-border px-2 py-1 text-xs text-text-secondary">
                  {related.type}: {related.label}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-muted">Replay Support</p>
          <div className="rounded-lg border border-dashed border-border p-3 text-xs text-text-muted">
            <p className="font-medium text-text-secondary">Replay engine placeholder</p>
            <p className="mt-1">Future event replay will mount here using tokenized event traces.</p>
            <p className="mt-2 inline-flex items-center gap-1 text-brand-navy">
              <Pin className="h-3.5 w-3.5" />
              Replay token: {item.metadata.replayToken ?? "Not available"}
            </p>
          </div>
        </section>
      </div>
    </aside>
  )
}
