import type { Metadata } from "next"

const publicOrigin = "https://aiospilot.com"
const socialImage = "/opengraph-image"

export function publicPageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, publicOrigin).toString()
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "AIOS Pilot" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  }
}
