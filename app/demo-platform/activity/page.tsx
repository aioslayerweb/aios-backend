import { ActivityFeed } from "@/components/activity-feed";
import { ContentContainer } from "@/components/layout/foundation";

export default function DemoActivityPage() {
  return (
    <ContentContainer className="space-y-4">
      <header className="rounded-xl border border-border bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Demo Activity Feed</p>
        <h2 className="mt-1 text-xl font-semibold text-brand-navy">Sample Operational Timeline</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Synthetic sample events with local-only interactions. No live business events or workflow executions are shown here.
        </p>
      </header>
      <ActivityFeed />
    </ContentContainer>
  );
}
