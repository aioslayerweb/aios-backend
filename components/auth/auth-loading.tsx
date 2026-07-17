"use client"

import { Loader2 } from "lucide-react"

type LoadingProps = {
  label?: string
}

function LoadingShell({ label }: LoadingProps) {
  return (
    <div className="flex min-h-[180px] w-full items-center justify-center rounded-2xl border border-[var(--public-color-border)] bg-white/70 p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--public-color-text-soft)]">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{label ?? "Loading..."}</span>
      </div>
    </div>
  )
}

export function AuthenticationLoading({ label = "Authenticating identity..." }: LoadingProps) {
  return <LoadingShell label={label} />
}

export function SessionLoading({ label = "Resolving session..." }: LoadingProps) {
  return <LoadingShell label={label} />
}

export function ProtectedRouteLoading({ label = "Checking access..." }: LoadingProps) {
  return <LoadingShell label={label} />
}
