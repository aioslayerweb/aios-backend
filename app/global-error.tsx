"use client"

import { AlertTriangle } from "lucide-react"
import { PublicButtonLink } from "@/components/aios"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-surface-app text-text-primary antialiased">
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-[var(--public-color-border)] bg-white p-8 text-center shadow-[0_24px_70px_rgba(7,19,61,0.08)]">
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <AlertTriangle size={18} />
            </span>
            <p className="public-eyebrow justify-center">Application Error</p>
            <h1 className="public-h2 mt-4">AIOS encountered an unexpected issue</h1>
            <p className="public-body-lg mt-4">{error.message || "Please retry or return to the homepage."}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={reset} className="public-button public-button-primary px-6 py-3 text-base">
                Retry
              </button>
              <PublicButtonLink href="/" variant="secondary" size="lg">Home</PublicButtonLink>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
