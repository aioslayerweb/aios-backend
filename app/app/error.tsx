"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui"

type AppErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="mx-auto flex min-h-[420px] w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-canvas p-8 text-center">
      <AlertTriangle className="h-8 w-8 text-semantic-error" aria-hidden />
      <div>
        <h2 className="text-xl font-semibold text-brand-navy">Workspace Route Error</h2>
        <p className="mt-2 text-sm text-text-secondary">
          {error.message || "An unexpected error occurred while loading this workspace route."}
        </p>
      </div>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
