import { type ReactNode } from "react"
import { cn } from "@/utils"

type SectionWrapperProps = {
  children: ReactNode
  className?: string
}

export function SectionWrapper({ children, className }: SectionWrapperProps) {
  return <section className={cn("py-6 md:py-8", className)}>{children}</section>
}
