import type { Metadata } from "next";
import { DemoExecutiveCommandCenter } from "@/components/demo/executive-command-center-demo";

export const metadata: Metadata = {
  title: "Demo Platform | AIOS Pilot",
  description: "Interactive AIOS Pilot demo — Executive Command Center, Spatial Intelligence Plane, AI Recommendations, and full platform navigation.",
  alternates: { canonical: "https://aiospilot.com/demo-platform" },
};

export default function DemoPlatformPage() {
  return <DemoExecutiveCommandCenter />;
}
