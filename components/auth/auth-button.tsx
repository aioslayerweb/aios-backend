"use client"

import { LogIn } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { signInWithCredentials } from "@/lib/auth/client"

type AuthenticationButtonProps = {
  email: string
  password: string
  disabled?: boolean
  label?: string
  onAuthenticate?: () => void
}

export function AuthenticationButton({ email, password, disabled = false, label = "Sign in", onAuthenticate }: AuthenticationButtonProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/app"

  return (
    <button
      type={onAuthenticate ? "button" : "submit"}
      disabled={disabled}
      className="public-button public-button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      onClick={() => {
        if (onAuthenticate) {
          onAuthenticate()
          return
        }

        void signInWithCredentials(email, password, callbackUrl)
      }}
    >
      <LogIn size={16} aria-hidden="true" />
      {label}
    </button>
  )
}
