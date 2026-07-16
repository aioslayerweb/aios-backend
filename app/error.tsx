"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"

type AppErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error("AIOS public route error", error)
  }, [error])

  return (
    <PublicPageShell activeHref="/" includeFooter={false}>
      <PublicSection>
        <PublicContainer>
          <div className="mx-auto max-w-3xl">
            <PublicCard variant="floating" className="text-center">
              <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                <AlertTriangle size={18} />
              </span>
              <PublicSectionHeader
                eyebrow="500"
                title="Something interrupted the AIOS experience"
                body={error.message || "An unexpected error occurred while loading this page."}
                align="center"
              />
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button type="button" onClick={reset} className="public-button public-button-primary px-6 py-3 text-base">
                  Try Again
                </button>
                <PublicButtonLink href="/contact" variant="secondary" size="lg">Book Demo</PublicButtonLink>
              </div>
            </PublicCard>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
