import type { Metadata } from "next"
import {
  PublicContainer,
  PublicFooterCta,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "Legal & Trust",
  "Find AIOS legal, privacy, and security information and contact the team with enterprise review questions.",
  "/legal",
)

const legalCards = [
  {
    title: "Security",
    body: "Review the security controls, configuration, and evidence applicable to a specific deployment.",
  },
  {
    title: "Privacy",
    body: "Review how a deployment handles business data, access, retention, and accountability.",
  },
  {
    title: "Governance",
    body: "Confirm which approval policies, execution controls, and audit records are actually configured.",
  },
]

export default function LegalPage() {
  return (
    <PublicPageShell activeHref="/legal">
      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Legal"
            title="Enterprise trust, privacy, and governance"
            titleAs="h1"
            body="Review the public information available about AIOS privacy, security, and governance."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {legalCards.map((item) => (
              <article key={item.title} className="public-card public-card-standard public-card-hover h-full">
                <h2 className="public-h4">{item.title}</h2>
                <p className="public-body mt-3">{item.body}</p>
              </article>
            ))}
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicFooterCta
        eyebrow="Questions"
        title="Review governance and deployment topics"
        body="Contact intake is not configured on this website. The linked pages describe public AIOS product principles and policy information."
      />
    </PublicPageShell>
  )
}
