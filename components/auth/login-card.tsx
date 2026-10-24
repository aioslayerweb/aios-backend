"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AlertCircle, Lock, Mail } from "lucide-react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AuthenticationLoading } from "@/components/auth/auth-loading"
import { AuthenticationButton } from "@/components/auth/auth-button"
import { signInWithCredentials } from "@/lib/auth/client"
import {
  getVerifiedSupabaseIdentity,
  signInWithSupabase,
  signOutSupabase,
  type VerifiedSupabaseIdentity,
} from "@/lib/auth/supabase-bff-client"

export function LoginCard() {
  const reduceMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const [authMode, setAuthMode] = useState<"demo" | "supabase">("demo")
  const [verifiedIdentity, setVerifiedIdentity] = useState<VerifiedSupabaseIdentity | null>(null)
  const [identityError, setIdentityError] = useState(false)
  const [authError, setAuthError] = useState(false)

  const error = searchParams.get("error") || authError
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/app", [searchParams])

  const canSubmit = email.trim().length > 3 && password.length >= 8

  async function handleAuthenticate() {
    if (!canSubmit || isSubmitting) {
      return
    }

    setSubmitting(true)
    setAuthError(false)
    setIdentityError(false)
    if (authMode === "supabase") {
      setVerifiedIdentity(null)
    }

    try {
      if (authMode === "demo") {
        await signInWithCredentials(email.trim(), password, callbackUrl)
        setSubmitting(false)
        return
      }
      await signInWithSupabase(email.trim(), password)
    } catch {
      setAuthError(true)
      setSubmitting(false)
      return
    }

    try {
      const identity = await getVerifiedSupabaseIdentity()
      if (!identity) {
        throw new Error("Identity verification failed")
      }
      setVerifiedIdentity(identity)
    } catch {
      setIdentityError(true)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignOut() {
    setSubmitting(true)
    setIdentityError(false)
    try {
      await signOutSupabase()
      setVerifiedIdentity(null)
      setPassword("")
    } catch {
      setIdentityError(true)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCheckIdentity() {
    setIdentityError(false)
    try {
      setVerifiedIdentity(await getVerifiedSupabaseIdentity())
    } catch {
      setIdentityError(true)
    }
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

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            aria-pressed={authMode === "demo"}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${authMode === "demo" ? "bg-white shadow-sm" : "text-slate-600"}`}
            onClick={() => {
              setAuthMode("demo")
              setAuthError(false)
            }}
          >
            Demo access
          </button>
          <button
            type="button"
            aria-pressed={authMode === "supabase"}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${authMode === "supabase" ? "bg-white shadow-sm" : "text-slate-600"}`}
            onClick={() => {
              setAuthMode("supabase")
              setAuthError(false)
              setVerifiedIdentity(null)
              void handleCheckIdentity()
            }}
          >
            Supabase account
          </button>
        </div>

        {authMode === "supabase" && verifiedIdentity ? (
          <div className="mt-5 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Identity verified</p>
              <p className="mt-1 break-all text-xs text-emerald-800">Subject: {verifiedIdentity.sub}</p>
              <p className="mt-2 text-xs text-emerald-800">
                This confirms identity only. Organization access is not enabled in this stage.
              </p>
            </div>
            {identityError ? (
              <p className="text-sm text-rose-700">Unable to complete sign-out. Please try again.</p>
            ) : null}
            <button
              type="button"
              className="public-button public-button-secondary w-full justify-center"
              disabled={isSubmitting}
              onClick={() => void handleSignOut()}
            >
              Sign out of Supabase account
            </button>
          </div>
        ) : (
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

          {isSubmitting ? <AuthenticationLoading label={authMode === "demo" ? "Signing in..." : "Verifying identity..."} /> : null}

          {authMode === "demo" ? (
            <>
              <AuthenticationButton
                email={email}
                password={password}
                disabled={!canSubmit || isSubmitting}
                label="Sign in to demo"
                onAuthenticate={() => {
                  void handleAuthenticate()
                }}
              />
              <p className="text-xs text-[color:var(--public-color-text-soft)]">
                Demo callback destination: <span className="font-semibold">{callbackUrl}</span>
              </p>
            </>
          ) : (
            <>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="public-button public-button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                Verify Supabase identity
              </button>
              <p className="text-xs text-[color:var(--public-color-text-soft)]">
                Your password is sent over HTTPS to AIOS and Supabase Auth for verification. Supabase tokens stay in HttpOnly cookies and are never returned to browser JavaScript.
              </p>
              {identityError ? (
                <>
                  <p className="text-sm text-rose-700">Unable to verify the current identity. Please try again.</p>
                  <button
                    type="button"
                    className="public-button public-button-secondary w-full justify-center"
                    disabled={isSubmitting}
                    onClick={() => void handleSignOut()}
                  >
                    Sign out of Supabase account
                  </button>
                </>
              ) : null}
            </>
          )}

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
            <p className="font-semibold">Need a guided walkthrough first?</p>
            <p className="mt-1 text-xs text-blue-800/80">Open the fully interactive demo platform with 15 dummy datasets, editing controls, and backend-style actions.</p>
            <Link href="/demo-platform" className="mt-3 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900">
              Launch demo platform
            </Link>
          </div>
        </form>
        )}
      </div>
    </motion.div>
  )
}
