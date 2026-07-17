"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AlertCircle, Lock, Mail } from "lucide-react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AuthenticationLoading } from "@/components/auth/auth-loading"
import { AuthenticationButton } from "@/components/auth/auth-button"
import { signInWithCredentials } from "@/lib/auth/client"

export function LoginCard() {
  const reduceMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)

  const error = searchParams.get("error")
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/app", [searchParams])

  const canSubmit = email.trim().length > 3 && password.length >= 8

  async function handleAuthenticate() {
    if (!canSubmit || isSubmitting) {
      return
    }

    setSubmitting(true)
    await signInWithCredentials(email.trim(), password, callbackUrl)
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--public-color-border)] bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-8"
    >
      <div className="absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),rgba(37,99,235,0))]" aria-hidden="true" />
      <div className="relative">
        <h1 className="public-h3">Sign in to AIOS</h1>
        <p className="public-body mt-2 text-[color:var(--public-color-text-soft)]">Secure access to your enterprise intelligence workspace.</p>

        {error ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <AlertCircle size={14} aria-hidden="true" />
            Authentication failed. Verify your credentials.
          </p>
        ) : null}

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault()
            await handleAuthenticate()
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--public-color-text-soft)]" aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                className="public-input w-full pl-10"
                placeholder="admin@aios.local"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--public-color-text-soft)]" aria-hidden="true" />
              <input
                type="password"
                autoComplete="current-password"
                className="public-input w-full pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>
          </label>

          {isSubmitting ? <AuthenticationLoading label="Signing in..." /> : null}

          <AuthenticationButton
            email={email}
            password={password}
            disabled={!canSubmit || isSubmitting}
            label="Sign in securely"
            onAuthenticate={() => {
              void handleAuthenticate()
            }}
          />

          <p className="text-xs text-[color:var(--public-color-text-soft)]">
            Callback destination: <span className="font-semibold">{callbackUrl}</span>
          </p>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
            <p className="font-semibold">Need a guided walkthrough first?</p>
            <p className="mt-1 text-xs text-blue-800/80">Open the fully interactive demo platform with 15 dummy datasets, editing controls, and backend-style actions.</p>
            <Link href="/demo-platform" className="mt-3 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900">
              Launch demo platform
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
