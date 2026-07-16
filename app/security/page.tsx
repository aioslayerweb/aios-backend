import type { Metadata } from "next"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

export const metadata: Metadata = {
  title: "Security | AIOS",
  description: "Review the AIOS enterprise security posture, RBAC, governance, auditability, and trust controls.",
  alternates: { canonical: "https://aios.layer/security" },
}

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
              body="AIOS is designed for enterprise trust with role-based access, human approvals, audit trails, and policy controls."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="public-card public-card-feature">
                <h2 className="public-h4">RBAC</h2>
                <p className="public-body mt-3">Role-based access ensures users only see and act on the data they are authorized to use.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Human approval</h2>
                <p className="public-body mt-3">High-impact actions can require explicit approval before execution.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Audit trail</h2>
                <p className="public-body mt-3">Recommendations, approvals, and outcomes are traceable for enterprise review.</p>
              </div>
              <div className="public-card public-card-feature">
                <h2 className="public-h4">Compliance readiness</h2>
                <p className="public-body mt-3">Security and governance controls are designed to support compliance workflows and reviews.</p>
              </div>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
      <PublicSection>
        <PublicContainer>
          <div className="flex flex-wrap gap-4">
            <PublicButtonLink href="/architecture" size="lg">Review Architecture</PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary" size="lg">Book Demo</PublicButtonLink>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
