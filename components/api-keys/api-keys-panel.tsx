"use client"

import type { ApiKeyRecord } from "@/types"
import { Button } from "@/components/ui"

type ApiKeysPanelProps = {
  apiKeys: ApiKeyRecord[]
  onRotateApiKey: (id: string) => void
}

export function ApiKeysPanel({ apiKeys, onRotateApiKey }: ApiKeysPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="API keys">
      <p className="text-xs uppercase tracking-wide text-text-muted">API Keys</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Key generation, rotation, expiration, scopes, revocation</h2>
      <div className="mt-4 space-y-3">
        {apiKeys.map((key) => (
          <article key={key.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{key.name}</p>
                <p className="mt-1 text-[11px] text-text-muted">Expires {key.expiresAt}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{key.status}</span>
            </div>
            <p className="mt-2 text-xs text-text-secondary">Scopes: {key.scope.join(", ")}</p>
            <p className="mt-1 text-[11px] text-text-muted">Usage: {key.usage}</p>
            <Button className="mt-3" variant="secondary" size="sm" onClick={() => onRotateApiKey(key.id)}>Rotate</Button>
          </article>
        ))}
      </div>
    </section>
  )
}