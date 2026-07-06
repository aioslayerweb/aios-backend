import { type HTMLAttributes } from "react"
import { cn } from "@/utils"

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string
}

export function Avatar({ name, className, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-subtle text-xs font-semibold text-brand-navy",
        className
      )}
      aria-label={name}
      {...props}
    >
      {initials}
    </div>
  )
}
