import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Handshake, LifeBuoy, Megaphone, Rocket, TrendingUp } from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import {
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = {
  ...publicPageMetadata(
    "Contact AIOS",
    "Contact intake is not configured yet. Explore the AIOS public demo, platform, architecture, security, and pilot information.",
    "/contact",
  ),
  robots: { index: false, follow: false },
}

const contactTracks = [
  {
    title: "Synthetic product demo",
    body: "Explore the public Executive Command Center using synthetic example data.",
    icon: Rocket,
    href: "/demo-platform/executive",
  },
  {
    title: "Platform overview",
    body: "Review how the AIOS product model connects signals, memory, and decision support.",
    icon: Building2,
    href: "/platform",
  },
  {
    title: "Architecture",
    body: "Explore the conceptual architecture and its governance boundaries.",
    icon: Handshake,
    href: "/architecture",
  },
  {
    title: "Security",
    body: "Read about AIOS security and governance principles.",
    icon: LifeBuoy,
    href: "/security",
  },
  {
    title: "Pilot information",
    body: "Review topics to discuss when defining a pilot use case.",
    icon: Megaphone,
    href: "/pilot",
  },
  {
    title: "Resources",
    body: "Browse public information and materials about the AIOS product model.",
    icon: TrendingUp,
    href: "/resources",
  },
]

const orbitNodes = [
  { title: "Executive Signals", x: "13%", y: "21%" },
  { title: "Memory Graph", x: "70%", y: "16%" },
  { title: "Workflow Runtime", x: "78%", y: "52%" },
  { title: "Decision Engine", x: "18%", y: "58%" },
  { title: "Agent Network", x: "31%", y: "82%" },
  { title: "Policy Guardrails", x: "61%", y: "78%" },
]

export default function ContactPage() {
  return (
    <PublicPageShell activeHref="/contact">
      <PublicStructuredData
        name="Contact AIOS"
        description="Contact intake is not connected yet. Explore AIOS public product, architecture, security, and pilot information."
        path="/contact"
      />
      <PublicHero
        eyebrow="Contact AIOS"
        title="Contact intake is not connected yet"
        body="This site has no configured inquiry destination. Use the links below to explore AIOS information; messages are not currently collected or delivered through this page."
        actions={
          <>
            <PublicButtonLink href="/demo-platform/executive" size="lg">
              Explore synthetic demo
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review Architecture
            </PublicButtonLink>
          </>
        }
        visual={<PublicOrbitVisual label="AIOS" title="Global Intelligence" nodes={orbitNodes} />}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Explore AIOS"
            title="Browse product and governance information"
            body="These public pages are available while a contact submission endpoint is being configured."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contactTracks.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="public-card public-card-standard public-card-hover h-full">
                  <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="public-h4">{item.title}</h3>
                  <p className="public-body mt-3">{item.body}</p>
                </Link>
              )
            })}
          </div>
         </PublicContainer>
       </PublicSection>

      <PublicTrustAndProofSection
        title="Evidence before claims"
        body="No customer endorsements, certifications, or measured results are presented without verification."
      />

       <PublicFooterCta
         eyebrow="Meet AIOS"
         title="Review the AIOS operating model"
         body="Explore the public platform and its synthetic demo while contact intake is being configured."
         primaryHref="/demo-platform/executive"
         primaryLabel="Explore the synthetic demo"
         secondaryHref="/architecture"
         secondaryLabel="Review architecture"
       />
     </PublicPageShell>
   )
 }
