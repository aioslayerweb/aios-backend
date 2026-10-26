import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "Privacy Policy",
  "Review the AIOS privacy policy, including the principles that guide data handling, access, and business memory.",
  "/privacy",
)

export default function PrivacyPage() {
  return (
    <PublicPageShell activeHref="/" includeFooter={true} includeNewsletter={false}>
      <PublicStructuredData name="Privacy Policy" description="AIOS privacy policy and data handling overview." path="/privacy" />
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating">
            <PublicSectionHeader
              eyebrow="Privacy Policy"
              title="How AIOS handles data"
              titleAs="h1"
              body="This page summarizes privacy principles. An existing deployment's agreement, configuration, and applicable requirements govern its data practices."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Data minimization</h2>
                <p className="public-body mt-3">Data sources and collection scope should be limited to what is needed for the agreed service purpose.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Business memory controls</h2>
                <p className="public-body mt-3">For each deployment, define and verify which identities can access signals, memory objects, and recommendations.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Retention and access</h2>
                <p className="public-body mt-3">Customer data retention and access practices are designed to align with deployment agreements and policy needs.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Optional analytics</h2>
                <p className="public-body mt-3">
                  Optional website analytics remain disabled until you explicitly accept them. You can keep analytics off or change your choice at any time using Privacy settings, available on every page. Session replay is not enabled. If your browser cannot save the preference, the choice applies only for the current visit.
                </p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Contact for details</h2>
                <p className="public-body mt-3">This website does not currently collect security or privacy review requests. For an existing deployment, use its agreed support channel.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/security" size="lg">Review Security</PublicButtonLink>
            <PublicButtonLink href="/demo-platform/executive" variant="secondary" size="lg">Explore synthetic demo</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
