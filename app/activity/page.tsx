import { ActivityFeed } from "@/components/activity-feed"
import { ContentContainer } from "@/components/layout/foundation"

export default function ActivityPage() {
  return (
    <ContentContainer className="space-y-4">
      <header className="rounded-xl border border-border bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">AIOS Universal Activity Feed</p>
        <h2 className="mt-1 text-xl font-semibold text-brand-navy">Operational Timeline</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Unified chronology across runtime, agents, memory, CRM, tasks, communications, reports, and system events.
        </p>
      </header>

      <ActivityFeed />
    </ContentContainer>
  )
}
