import type { Metadata } from "next"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Resources",
  "Explore AIOS product, architecture, and business intelligence resources.",
  "/resources",
)

export default function ResourcesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
