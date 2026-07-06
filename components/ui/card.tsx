import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/utils"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("aios-card", className)} {...props} />
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("border-b border-border px-4 py-3 md:px-5", className)} {...props} />
  }
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("p-4 md:p-5", className)} {...props} />
  }
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("border-t border-border px-4 py-3 md:px-5", className)} {...props} />
  }
)
