import { type ReactNode } from "react"
import { cn } from "@/utils"

type ResponsiveContainerProps = {
  children: ReactNode
  className?: string
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-screen-4xl px-4 md:px-6 lg:px-8 xl:px-10", className)}>
      {children}
    </div>
  )
}
