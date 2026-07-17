"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks"
import { LogoutButton } from "@/components/auth/logout-button"
import { UserAvatar } from "@/components/auth/user-avatar"

export function UserMenu() {
  const { currentUser, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--public-color-border)] bg-white px-3 py-2 text-sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar />
        <span className="font-medium">{currentUser?.name ?? "User"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[220px] rounded-xl border border-[var(--public-color-border)] bg-white p-3 shadow-lg">
          <p className="text-sm font-semibold">{currentUser?.name ?? "User"}</p>
          <p className="mt-1 text-xs text-[color:var(--public-color-text-soft)]">{currentUser?.email ?? ""}</p>
          <div className="mt-3">
            <LogoutButton className="public-button public-button-secondary w-full justify-center" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
