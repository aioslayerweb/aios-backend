import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

export const metadata: Metadata = {
  title: "Terms of Service | AIOS",
  description: "Review the AIOS terms of service for enterprise use, pilot programs, and platform access.",
  alternates: { canonical: "https://aios.layer/terms" },
}

export default function TermsPage() {
  return (
    <PublicPageShell activeHref="/" includeFooter={true} includeNewsletter={false}>
      <PublicStructuredData name="Terms of Service" description="AIOS terms of service for enterprise platform access." path="/terms" />
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating">
            <PublicSectionHeader
              eyebrow="Terms"
              title="Terms of service"
              body="AIOS is provided under enterprise terms that emphasize governance, security, and responsible use."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Acceptable use</h2>
                <p className="public-body mt-3">Platform access is intended for legitimate business operations, evaluation, and approved production use.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Enterprise responsibilities</h2>
                <p className="public-body mt-3">Customers remain responsible for their data, internal approvals, and operational policy decisions.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Pilot programs</h2>
                <p className="public-body mt-3">Pilot engagement terms are defined during discovery, including scope, timelines, and success metrics.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Contact and review</h2>
                <p className="public-body mt-3">Enterprise legal review and custom contractual needs can be handled through AIOS sales and support.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/contact" size="lg">Talk to Sales</PublicButtonLink>
            <PublicButtonLink href="/privacy" variant="secondary" size="lg">Review Privacy</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
