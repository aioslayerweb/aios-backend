import { type HTMLAttributes } from "react"
import { cn } from "@/utils"

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border bg-surface-canvas p-4 md:p-5", className)} {...props} />
}
