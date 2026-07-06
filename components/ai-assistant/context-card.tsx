type ContextCardProps = {
  label: string
  value: string
}

export function ContextCard({ label, value }: ContextCardProps) {
  return (
    <div className="rounded-md border border-border bg-surface-muted px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value}</p>
    </div>
  )
}
