import { Badge } from "@/components/ui"

type WorkspacePlaceholderProps = {
  title: string
  description: string
  milestoneNote?: string
  comingSoon?: boolean
}

export function WorkspacePlaceholder({
  title,
  description,
  milestoneNote = "Coming in upcoming milestone",
  comingSoon = false,
}: WorkspacePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center px-4 py-10">
      <article className="w-full rounded-2xl border border-border bg-surface-canvas p-7 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-brand-navy">{title}</h2>
          {comingSoon ? <Badge tone="warning">Roadmap</Badge> : null}
        </div>
        <p className="mt-3 text-sm text-text-secondary">{description}</p>
        <p className="mt-5 inline-flex rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-muted">
          {comingSoon ? "Coming Soon" : milestoneNote}
        </p>
      </article>
    </section>
  )
}
