import type { Metadata } from "next"
import { PublicPageShell } from "@/components/aios"
import { BusinessDiscoveryExperience } from "@/components/business-discovery/business-discovery-experience"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "Business Discovery",
  "Explore an AIOS discovery experience that helps map business context and operating priorities.",
  "/pilot/discovery",
)

export default function PilotDiscoveryPage() {
  return (
    <PublicPageShell activeHref="/pilot" includeFooter={false} includeNewsletter={false}>
      <PublicStructuredData
        name="Intelligent Business Discovery"
        description="Adaptive conversation that discovers company operations and generates a Business Blueprint for AIOS."
        path="/pilot/discovery"
      />
      <BusinessDiscoveryExperience />
    </PublicPageShell>
  )
}
