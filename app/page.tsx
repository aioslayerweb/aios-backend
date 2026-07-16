import type { Metadata } from "next"
import { PublicHomePage } from "@/components/public-site/public-home-page";

export const metadata: Metadata = {
  title: "AIOS | The AI Operating System for Businesses",
  description:
    "AIOS connects people, systems, data, workflows, and AI into one enterprise intelligence operating layer.",
  alternates: {
    canonical: "https://aios.layer/",
  },
  openGraph: {
    title: "AIOS | The AI Operating System for Businesses",
    description:
      "AIOS connects people, systems, data, workflows, and AI into one enterprise intelligence operating layer.",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 1200, alt: "AIOS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIOS | The AI Operating System for Businesses",
    description:
      "AIOS connects people, systems, data, workflows, and AI into one enterprise intelligence operating layer.",
    images: ["/twitter-image.png"],
  },
}

export default function HomePage() {
  return <PublicHomePage />;
}
