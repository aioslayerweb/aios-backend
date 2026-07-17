"use client"

import { ShieldCheck } from "lucide-react"
import { useAuth } from "@/hooks"

export function SessionBadge() {
  const { isAuthenticated, currentUser } = useAuth()

  return (
    <span className="public-chip inline-flex items-center gap-2">
      <ShieldCheck size={14} aria-hidden="true" />
      {isAuthenticated ? `Active session: ${currentUser?.email ?? "user"}` : "Not authenticated"}
    </span>
  )
}
