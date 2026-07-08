"use client"

import { useMemo, useState } from "react"
import { Heart, Pin } from "lucide-react"
import { usePromptHistory, usePromptOS } from "@/hooks"

export function PromptHistoryPanel() {
  const [query, setQuery] = useState("")
  const { history, pinned, favorites } = usePromptHistory(query)
  const { pinHistory, favoriteHistory } = usePromptOS()

  const grouped = useMemo(
    () => ({
      pinned,
      favorites,
      recent: history.slice(0, 10),
    }),
    [favorites, history, pinned]
  )

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Prompt history">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Prompt History</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-40 rounded border border-border bg-surface-canvas px-2 py-1 text-xs text-text-primary"
          placeholder="Search history"
          aria-label="Search prompt history"
        />
      </div>

      <div className="mt-2 space-y-2">
        <Group title="Pinned" items={grouped.pinned} onPin={pinHistory} onFavorite={favoriteHistory} />
        <Group title="Favorites" items={grouped.favorites} onPin={pinHistory} onFavorite={favoriteHistory} />
        <Group title="Recent" items={grouped.recent} onPin={pinHistory} onFavorite={favoriteHistory} />
      </div>
    </section>
  )
}

function Group({
  title,
  items,
  onPin,
  onFavorite,
}: {
  title: string
  items: Array<{ id: string; prompt: string; status: string; timestamp: number; pinned: boolean; favorite: boolean }>
  onPin: (id: string) => void
  onFavorite: (id: string) => void
}) {
  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</p>
      <div className="mt-1 space-y-1">
        {items.length === 0 ? (
          <p className="text-[11px] text-text-muted">No {title.toLowerCase()} prompts.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] font-medium text-text-primary">{item.prompt}</p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-text-muted">
                <span className="capitalize">{item.status}</span>
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="mt-1 flex gap-1">
                <button type="button" onClick={() => onPin(item.id)} className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-secondary">
                  <Pin className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => onFavorite(item.id)} className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-secondary">
                  <Heart className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  )
}
