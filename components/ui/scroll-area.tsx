import { type HTMLAttributes } from "react"
import { cn } from "@/utils"

export function ScrollArea({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("scrollbar-thin overflow-auto", className)} {...props} />
}
