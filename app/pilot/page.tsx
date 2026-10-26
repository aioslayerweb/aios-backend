import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Pilot Program",
  "Learn about the AIOS pilot discovery process and how to discuss a scoped evaluation for your organization.",
  "/pilot",
)

export default function PilotPage() {
  return (
    <PublicPageShell activeHref="/pilot" includeFooter={true} includeNewsletter={false}>
      <PublicStructuredData name="Pilot Program" description="AIOS pilot program and onboarding overview." path="/pilot" />
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating">
            <PublicSectionHeader
              eyebrow="Pilot Program"
              title="Start with a structured enterprise pilot"
              titleAs="h1"
              body="Use these topics to scope a possible evaluation. Scope, availability, timing, and outcomes must be agreed before any pilot begins."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Qualification</h2>
                <p className="public-body mt-3">A possible evaluation should identify an accountable owner, a specific business question, and measurable goals.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Timeline</h2>
                <p className="public-body mt-3">Discovery, integration, activation, and review timing depends on the agreed scope and deployment needs.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Deliverables</h2>
                <p className="public-body mt-3">Potential deliverables should be agreed in advance, including any architecture, role, workflow, or outcome documentation.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Success metrics</h2>
                <p className="public-body mt-3">Value is measured through time saved, recovered opportunities, decision speed, and payback period.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/pilot/discovery" size="lg">Explore local business discovery</PublicButtonLink>
            <PublicButtonLink href="/products" variant="secondary" size="lg">Review Products</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
