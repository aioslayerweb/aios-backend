import type { Metadata } from "next";
import UniversePageClient from "./universe-page-client";

export const metadata: Metadata = {
  title: "AIOS Universe | The AI Operating System for Businesses",
  description:
    "Explore the AIOS Universe — the Company Intelligence Layer that connects Business Memory, Role-Based Intelligence, AI Operators and autonomous workflows into one operating system.",
  openGraph: {
    title: "AIOS Universe | The AI Operating System for Businesses",
    description:
      "Explore the AIOS Universe — the Company Intelligence Layer that connects Business Memory, Role-Based Intelligence, AI Operators and autonomous workflows into one operating system.",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 1200, alt: "AIOS Universe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIOS Universe | The AI Operating System for Businesses",
    description:
      "Explore the AIOS Universe — the Company Intelligence Layer that connects Business Memory, Role-Based Intelligence, AI Operators and autonomous workflows into one operating system.",
    images: ["/opengraph-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AIOS Universe",
  url: "https://aios.layer/universe",
  description:
    "Explore the AIOS Universe — the Company Intelligence Layer that connects Business Memory, Role-Based Intelligence, AI Operators and autonomous workflows into one operating system.",
  isPartOf: {
    "@type": "WebSite",
    name: "AIOS",
    url: "https://aios.layer",
  },
  publisher: {
    "@type": "Organization",
    name: "AIOS",
    url: "https://aios.layer",
  },
};

export default function UniversePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <UniversePageClient />
    </>
  );
}
