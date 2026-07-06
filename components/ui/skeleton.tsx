import { cn } from "@/utils"

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-surface-muted", className)} aria-hidden />
}
