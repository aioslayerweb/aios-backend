import type { Metadata } from "next"
import { PublicPageShell } from "@/components/aios"
import { BusinessDiscoveryExperience } from "@/components/business-discovery/business-discovery-experience"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = {
  ...publicPageMetadata(
    "Business Discovery Preview",
    "Explore a browser-only AIOS business discovery preview. Answers are stored locally only if you save a draft.",
    "/pilot/discovery",
  ),
  robots: { index: false, follow: false },
}

export default function PilotDiscoveryPage() {
  return (
    <PublicPageShell activeHref="/pilot" includeFooter={false} includeNewsletter={false}>
      <PublicStructuredData
        name="Intelligent Business Discovery"
        description="Browser-only discovery preview that builds a draft business blueprint locally without submitting answers to AIOS."
        path="/pilot/discovery"
      />
      <BusinessDiscoveryExperience />
    </PublicPageShell>
  )
}
