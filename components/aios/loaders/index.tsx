export function AIOSLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-[color:var(--public-color-text)]" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[rgba(25,118,255,0.2)] border-t-[color:var(--public-color-primary)]" />
      <span>{label}</span>
    </div>
  )
}
