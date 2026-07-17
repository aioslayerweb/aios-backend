import type { Metadata } from "next"
import { PublicPageShell } from "@/components/aios"
import { BusinessDiscoveryExperience } from "@/components/business-discovery/business-discovery-experience"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

export const metadata: Metadata = {
  title: "Business Discovery | AIOS",
  description: "Adaptive AI conversation that discovers how your company operates and generates the AIOS Business Blueprint.",
  alternates: { canonical: "https://aios.layer/pilot/discovery" },
}

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
