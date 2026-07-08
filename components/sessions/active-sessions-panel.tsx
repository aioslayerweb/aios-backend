"use client"

import type { SessionRecord } from "@/types"
import { Button } from "@/components/ui"

type ActiveSessionsPanelProps = {
  sessions: SessionRecord[]
  onRevokeSession: (id: string) => void
}

export function ActiveSessionsPanel({ sessions, onRevokeSession }: ActiveSessionsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Active sessions">
      <p className="text-xs uppercase tracking-wide text-text-muted">Active Sessions</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Current devices, browsers, locations, and revocation controls</h2>
      <div className="mt-4 space-y-3">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{session.user}</p>
                <p className="mt-1 text-[11px] text-text-muted">{session.device} · {session.browser}</p>
              </div>
              {session.current ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">Current</span> : null}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 text-xs text-text-secondary">
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Location</p><p className="mt-1 text-brand-navy">{session.location}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">IP</p><p className="mt-1 text-brand-navy">{session.ip}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Duration</p><p className="mt-1 text-brand-navy">{session.duration}</p></div>
            </div>
            {!session.current ? <Button className="mt-3" variant="ghost" size="sm" onClick={() => onRevokeSession(session.id)}>Revoke</Button> : null}
          </article>
        ))}
      </div>
    </section>
  )
}