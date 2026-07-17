import type { ReactNode } from "react"

type BlueprintSectionCardProps = {
  title: string
  subtitle?: string
  status: "draft" | "in-progress" | "complete" | "needs-review"
  children: ReactNode
}

const statusStyle = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  complete: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "needs-review": "bg-amber-100 text-amber-700 border-amber-200",
} as const

export function BlueprintSectionCard({ title, subtitle, status, children }: BlueprintSectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}>
          {status}
        </span>
      </header>
      <div className="mt-4">{children}</div>
    </section>
  )
}
