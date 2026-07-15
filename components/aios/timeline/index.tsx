import { AIOSCard } from "@/components/aios/cards"

export type AIOSTimelineItem = { label: string; title: string; body: string }

export function AIOSTimelineList({ items }: { items: AIOSTimelineItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <AIOSCard key={item.title} variant="standard" hover className="relative overflow-hidden">
          <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--public-color-primary)] text-sm font-semibold text-white">{index + 1}</span>
          <p className="public-caption text-[color:var(--public-color-primary)]">{item.label}</p>
          <h3 className="public-h4 mt-3">{item.title}</h3>
          <p className="public-body mt-3">{item.body}</p>
        </AIOSCard>
      ))}
    </div>
  )
}

export const AIOSTimelineSection = AIOSTimelineList
