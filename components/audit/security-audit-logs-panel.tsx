import type { SecurityAuditLog } from "@/types"

type SecurityAuditLogsPanelProps = {
  logs: SecurityAuditLog[]
}

export function SecurityAuditLogsPanel({ logs }: SecurityAuditLogsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Audit logs">
      <p className="text-xs uppercase tracking-wide text-text-muted">Audit Logs</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Immutable enterprise audit trail</h2>
      <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
        {logs.map((log) => (
          <article key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{log.actor}</p>
                <p className="mt-1 text-[11px] capitalize text-text-muted">{log.event} · {log.source}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{log.result}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{log.detail}</p>
            <p className="mt-2 text-[11px] text-text-muted">{new Date(log.timestamp).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  )
}