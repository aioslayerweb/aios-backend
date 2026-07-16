import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

export const metadata: Metadata = {
  title: "Privacy Policy | AIOS",
  description: "Learn how AIOS handles data, privacy, memory, signal processing, and enterprise accountability.",
  alternates: { canonical: "https://aios.layer/privacy" },
}

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
              body="AIOS is built for enterprise environments where privacy, control, and accountability matter."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Data minimization</h2>
                <p className="public-body mt-3">We collect only the information needed to operate AIOS, support the service, and improve enterprise value.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Business memory controls</h2>
                <p className="public-body mt-3">Signals, memory objects, and recommendations are governed by enterprise access controls and review paths.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Retention and access</h2>
                <p className="public-body mt-3">Customer data retention and access practices are designed to align with deployment agreements and policy needs.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Contact for details</h2>
                <p className="public-body mt-3">Request a security or privacy review through the enterprise contact path.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/security" size="lg">Review Security</PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary" size="lg">Contact AIOS</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
