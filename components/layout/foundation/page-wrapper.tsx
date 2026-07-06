import { type ReactNode } from "react"
import { ResponsiveContainer } from "./responsive-container"
import { cn } from "@/utils"

type PageWrapperProps = {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <ResponsiveContainer className={cn("py-6 md:py-8", className)}>
      <div className="space-y-6 md:space-y-8">{children}</div>
    </ResponsiveContainer>
  )
}
