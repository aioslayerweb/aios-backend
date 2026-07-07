import { useConnectionStatus } from "@/hooks"
import { RuntimeStatusIndicator } from "./runtime-status-indicator"

export function ConnectionStatus() {
  const { supabase, api, connectionState } = useConnectionStatus()

  return (
    <section className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm">
      <p className="text-sm font-semibold text-brand-navy">Connection Status</p>
      <p className="mt-1 text-xs text-text-muted">Primary connection: {connectionState}</p>
      <div className="mt-2 space-y-2">
        {supabase ? <RuntimeStatusIndicator module={supabase} /> : null}
        {api ? <RuntimeStatusIndicator module={api} /> : null}
      </div>
    </section>
  )
}
