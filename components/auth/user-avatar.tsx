"use client"

import { useAuth } from "@/hooks"

export function UserAvatar() {
  const { currentUser } = useAuth()

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((token) => token[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--public-color-border)] bg-[var(--public-color-surface)] text-xs font-semibold text-[color:var(--public-color-text-soft)]">
      {initials}
    </span>
  )
}
