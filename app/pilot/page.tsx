import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

export const metadata: Metadata = {
  title: "Pilot Program | AIOS",
  description: "Learn how to qualify for the AIOS enterprise pilot program, timelines, deliverables, and next steps.",
  alternates: { canonical: "https://aios.layer/pilot" },
}

export default function PilotPage() {
  return (
    <PublicPageShell activeHref="/contact" includeFooter={true} includeNewsletter={false}>
      <PublicStructuredData name="Pilot Program" description="AIOS pilot program and onboarding overview." path="/pilot" />
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating">
            <PublicSectionHeader
              eyebrow="Pilot Program"
              title="Start with a structured enterprise pilot"
              body="AIOS pilots are built to validate business value quickly, with executive sponsorship and measurable outcomes."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Qualification</h2>
                <p className="public-body mt-3">Ideal for businesses with clear operational complexity, strong ownership, and measurable goals.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Timeline</h2>
                <p className="public-body mt-3">Discovery, integration, activation, and value review are typically completed in staged phases.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Deliverables</h2>
                <p className="public-body mt-3">You receive a pilot plan, architecture map, role setup, workflow blueprint, and outcome report.</p>
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
            <PublicButtonLink href="/contact" size="lg">Book Pilot</PublicButtonLink>
            <PublicButtonLink href="/products" variant="secondary" size="lg">Review Products</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
