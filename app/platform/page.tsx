"use client"

import {
  Bot,
  BrainCircuit,
  Building2,
  Database,
  GitBranch,
  Network,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicComparison,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"

const orbitNodes = [
  { title: "Signals", x: "14%", y: "18%", icon: Database },
  { title: "Memory", x: "76%", y: "18%", icon: Database },
  { title: "Reasoning", x: "84%", y: "52%", icon: BrainCircuit },
  { title: "Decisions", x: "16%", y: "52%", icon: GitBranch },
  { title: "Operators", x: "28%", y: "84%", icon: Bot },
  { title: "Workflows", x: "72%", y: "84%", icon: Workflow },
]

const pillars = [
  { title: "Business Signals", body: "Unified signal ingestion from CRM, ERP, collaboration, support, and finance systems.", icon: Database },
  { title: "Business Memory", body: "Persistent memory objects that retain outcomes, context, and evidence over time.", icon: Database },
  { title: "Role Intelligence", body: "Decision context adapts by executive role without changing the system language.", icon: Building2 },
  { title: "Reasoning Engine", body: "Confidence-scored interpretation and recommendation synthesis grounded in evidence.", icon: BrainCircuit },
  { title: "Decision Governance", body: "Policy-aware recommendation routing, approvals, and explainable control.", icon: GitBranch },
  { title: "AI Operators", body: "Specialized agents collaborate through shared context and execution goals.", icon: Bot },
  { title: "Workflow Runtime", body: "Governed autonomous execution with measured outcomes and recovery patterns.", icon: Workflow },
  { title: "Enterprise Trust", body: "Security, observability, and resilient runtime controls built into the platform layer.", icon: ShieldCheck },
  { title: "Knowledge Graph", body: "Entity relationships and evidence linkage improve explainability and searchability.", icon: Network },
]

const platformRows = [
  { label: "Architecture", left: "Disconnected software categories", right: "One AI operating system" },
  { label: "Intelligence", left: "Static reporting and dashboards", right: "Continuous reasoning with confidence" },
  { label: "Execution", left: "Manual follow-through", right: "Governed autonomous workflows" },
  { label: "Learning", left: "Institutional memory loss", right: "Compounding business memory" },
]

export default function PlatformPage() {
  return (
    <PublicPageShell activeHref="/platform">
      <PublicHero
        eyebrow="AIOS Platform"
        title="The public platform system for one connected AI Operating System"
        body="Platform defines the shared visual, structural, and operating foundation that every public page and every AIOS module now inherits automatically."
        actions={
          <>
            <PublicButtonLink href="/contact" size="lg">
              Book Demo
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review Architecture
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Design tokens", value: "Shared", detail: "Typography, spacing, color, surface, and motion" },
          { label: "Responsive system", value: "100%", detail: "Desktop, laptop, tablet, and mobile consistency" },
          { label: "Accessibility goal", value: "WCAG AA", detail: "Keyboard support, contrast, focus, reduced motion" },
        ]}
        visual={<PublicOrbitVisual label="Platform" title="Connected Intelligence" nodes={orbitNodes} />}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="System Pillars"
            title="The platform page makes the new public design system explicit"
            body="Every pillar corresponds to a reusable system layer that future public pages can inherit without custom page-specific components."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={pillars} columns={3} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Why It Matters"
            title="AIOS moves from fragmented marketing patterns to one operating language"
            body="The public site should feel like a direct extension of the product, not a separate visual universe."
          />
          <div className="mt-14">
            <PublicComparison rows={platformRows} leftLabel="Legacy marketing stack" rightLabel="AIOS public system" />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicFooterCta
        eyebrow="Adopt The Platform"
        title="Use one public system across every present and future AIOS page"
        body="The AIOS public design system now gives every route a common shell, hierarchy, motion language, spacing rhythm, and premium enterprise feel."
      />
    </PublicPageShell>
  )
}