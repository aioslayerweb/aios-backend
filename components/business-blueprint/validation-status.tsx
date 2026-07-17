import type { ValidationIssue } from "@/src/core/business-blueprint"

type ValidationStatusProps = {
  issues: ReadonlyArray<ValidationIssue>
}

export function ValidationStatus({ issues }: ValidationStatusProps) {
  const errors = issues.filter((item) => item.severity === "error").length
  const warnings = issues.filter((item) => item.severity === "warning").length

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation Status</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
          Errors: {errors}
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Warnings: {warnings}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          Total: {issues.length}
        </span>
      </div>
    </div>
  )
}
