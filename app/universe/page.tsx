import type { Metadata } from "next"
import UniversePageClient from "./universe-page-client"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Universe",
  "Explore an illustrative map of AIOS modules, business memory, role context, decision support, and governed workflows.",
  "/universe",
)

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AIOS Universe",
  url: "https://aiospilot.com/universe",
  description:
    "Explore the AIOS Universe — the Company Intelligence Layer that connects Business Memory, Role-Based Intelligence, AI Operators and autonomous workflows into one operating system.",
  isPartOf: {
    "@type": "WebSite",
    name: "AIOS",
    url: "https://aiospilot.com",
  },
  publisher: {
    "@type": "Organization",
    name: "AIOS",
    url: "https://aiospilot.com",
  },
}

export default function UniversePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <UniversePageClient />
    </>
  )
}
