"use client"

import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"

export default function OfflinePage() {
  return (
    <PublicPageShell activeHref="/" includeFooter={false}>
      <PublicSection>
        <PublicContainer>
          <div className="mx-auto max-w-3xl">
            <PublicCard variant="floating" className="text-center">
              <PublicSectionHeader
                eyebrow="Offline"
                title="AIOS is temporarily unavailable"
                body="Check your connection and try again. Once you are back online, AIOS should load normally."
                align="center"
              />
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button type="button" onClick={() => window.location.reload()} className="public-button public-button-primary px-6 py-3 text-base">
                  Retry
                </button>
                <PublicButtonLink href="/" variant="secondary" size="lg">Return Home</PublicButtonLink>
              </div>
            </PublicCard>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
