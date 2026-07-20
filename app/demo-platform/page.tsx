import type { Metadata } from "next";
import { ExecutiveCommandCenter } from "@/components/executive-command-center/executive-command-center";

export const metadata: Metadata = {
  title: "Demo Platform | AIOS Pilot",
  description: "Interactive AIOS Pilot demo — Executive Command Center, Spatial Intelligence Plane, AI Recommendations, and full platform navigation.",
  alternates: { canonical: "https://aiospilot.com/demo-platform" },
};

export default function DemoPlatformPage() {
  return <ExecutiveCommandCenter baseHref="/demo-platform" />;
}
