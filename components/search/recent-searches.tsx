type RecentSearchesProps = {
  searches: string[]
  onSelect: (value: string) => void
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Recent searches">
      <span className="text-[11px] text-text-muted">Recent:</span>
      {searches.slice(0, 6).map((item) => (
        <button
          key={item}
          type="button"
          className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary hover:bg-brand-subtle"
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
