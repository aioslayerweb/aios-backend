import { PublicHomepageExperience } from "@/components/public-site/public-homepage-experience"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata = publicPageMetadata(
  "AIOS Pilot | Business Intelligence Operating System",
  "AIOS connects business signals, memory, role-based intelligence, decision support, and governed workflows.",
  "/",
)

export default function HomePage() {
  return <PublicHomepageExperience />
}
