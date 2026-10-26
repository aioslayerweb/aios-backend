import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "Security",
  "Learn about the security and governance concepts that guide AIOS, including access control, approvals, and auditability.",
  "/security",
)

export default function SecurityPage() {
  return (
    <PublicPageShell activeHref="/" includeFooter={true} includeNewsletter={false}>
      <PublicStructuredData name="Security" description="AIOS enterprise security and governance overview." path="/security" />
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating">
            <PublicSectionHeader
              eyebrow="Security"
              title="Enterprise security and governance"
              titleAs="h1"
              body="Security depends on each deployment's configuration. This page describes controls to evaluate; it is not a certification or deployment attestation."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">RBAC</h2>
                <p className="public-body mt-3">Verify server-side identity, organization membership, tenant boundaries, and permissions before protected data is returned or changed.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Human approval</h2>
                <p className="public-body mt-3">Configure and test approval requirements for each action that needs human review.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Audit trail</h2>
                <p className="public-body mt-3">Define which recommendations, approvals, and outcomes are recorded and how those records are reviewed.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Compliance readiness</h2>
                <p className="public-body mt-3">Assess applicable obligations with the organization&apos;s security and compliance owners. No certification is claimed here.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/architecture" size="lg">Review Architecture</PublicButtonLink>
            <PublicButtonLink href="/demo-platform/executive" variant="secondary" size="lg">Explore synthetic demo</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
