import { type ReactNode } from "react"
import { cn } from "@/utils"

type ContentContainerProps = {
  children: ReactNode
  className?: string
}

export function ContentContainer({ children, className }: ContentContainerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface-canvas p-4 shadow-sm md:p-6", className)}>
      {children}
    </div>
  )
}
