import { cn } from "@/utils"

type LoadingSpinnerProps = {
  className?: string
  label?: string
}

export function LoadingSpinner({ className, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-sm text-text-muted", className)} role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
