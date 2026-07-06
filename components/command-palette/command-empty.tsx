type CommandEmptyProps = {
  query: string
}

export function CommandEmpty({ query }: CommandEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
      <p className="text-sm font-medium text-text-primary">No results found</p>
      <p className="mt-1 text-xs text-text-muted">
        {query.trim() ? `No command matched \"${query}\".` : "Start typing to search commands, entities, and AI actions."}
      </p>
    </div>
  )
}
