import {
  PublicContainer,
  PublicFooterCta,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"

const legalCards = [
  {
    title: "Security",
    body: "AIOS is designed for enterprise-grade security, governed workflows, and resilient runtime operations.",
  },
  {
    title: "Privacy",
    body: "Business memory, signal handling, and intelligence surfaces are designed for controlled access and clear accountability.",
  },
  {
    title: "Governance",
    body: "Policy-gated approvals, execution controls, and auditability are built into the operating model rather than added later.",
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
            body="Even the legal route now inherits the same AIOS public shell, surface hierarchy, and premium enterprise presentation."
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
        title="Talk to AIOS about enterprise governance and deployment requirements"
        body="Legal, privacy, and workflow governance now sit inside the same unified public design system as the rest of the site."
      />
    </PublicPageShell>
  )
}
