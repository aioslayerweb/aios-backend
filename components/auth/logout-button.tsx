"use client"

import { LogOut } from "lucide-react"
import { signOutSafely } from "@/lib/auth/client"

type LogoutButtonProps = {
  className?: string
  callbackUrl?: string
  label?: string
}

export function LogoutButton({ className, callbackUrl = "/login", label = "Sign out" }: LogoutButtonProps) {
  return (
    <button
      type="button"
      className={className ?? "public-button public-button-secondary"}
      onClick={() => {
        void signOutSafely(callbackUrl)
      }}
    >
      <LogOut size={16} aria-hidden="true" />
      {label}
    </button>
  )
}
