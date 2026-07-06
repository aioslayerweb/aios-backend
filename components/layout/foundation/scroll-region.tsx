import { type ReactNode } from "react"
import { cn } from "@/utils"

type ScrollRegionProps = {
  children: ReactNode
  className?: string
}

export function ScrollRegion({ children, className }: ScrollRegionProps) {
  return <div className={cn("scrollbar-thin overflow-auto", className)}>{children}</div>
}
