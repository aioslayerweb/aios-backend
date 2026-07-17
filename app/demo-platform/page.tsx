import type { Metadata } from "next"
import { DemoPlatformPage } from "@/components/demo-platform/demo-platform-page"

export const metadata: Metadata = {
  title: "Demo Platform | AIOS",
  description: "Interactive AIOS demo platform with 15 dummy datasets, editable backend workflows, and public sandbox actions.",
  alternates: { canonical: "https://aiospilot.com/demo-platform" },
}

export default function DemoPlatformRoute() {
  return <DemoPlatformPage />
}
