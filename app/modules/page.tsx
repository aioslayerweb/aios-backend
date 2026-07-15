"use client"

import {
  Binary,
  Bot,
  Briefcase,
  Building2,
  Code2,
  Cpu,
  Database,
  Network,
  Radar,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
  PublicTabbedPanel,
} from "@/components/aios"

const modules = [
  {
    key: "executive",
    title: "Executive Center",
    icon: Building2,
    summary: "Strategic priorities, decision confidence, and board-level context in one operating view.",
    highlights: ["Critical decisions", "Executive briefings", "Priority shifts"],
    previewTitle: "Executive signal board",
  },
  {
    key: "command",
    title: "Command Center",
    icon: Radar,
    summary: "Cross-system command surface for orchestrating signals, tasks, and automated pathways.",
    highlights: ["Live orchestration", "Cross-team routing", "Escalation control"],
    previewTitle: "Operational command matrix",
  },
  {
    key: "memory",
    title: "Memory Center",
    icon: Database,
    summary: "Persistent business memory objects preserving outcomes, context, and evidence trails.",
    highlights: ["Memory timelines", "Outcome retention", "Context continuity"],
    previewTitle: "Business memory timeline",
  },
  {
    key: "knowledge",
    title: "Knowledge Center",
    icon: Network,
    summary: "Knowledge graph intelligence connecting policies, entities, and enterprise reasoning.",
    highlights: ["Graph insights", "Context linking", "Evidence indexing"],
    previewTitle: "Knowledge graph cluster",
  },
  {
    key: "workflow",
    title: "Workflow Builder",
    icon: Workflow,
    summary: "Governed autonomous workflows from approved decisions to measurable execution.",
    highlights: ["Policy gates", "Automation chains", "Runtime telemetry"],
    previewTitle: "Workflow orchestration canvas",
  },
  {
    key: "agent",
    title: "Agent Studio",
    icon: Bot,
    summary: "Specialized AI operators collaborating with shared memory and role-aware intelligence.",
    highlights: ["Operator network", "Capability packs", "Confidence routing"],
    previewTitle: "Agent collaboration map",
  },
  {
    key: "organization",
    title: "Organization Center",
    icon: Briefcase,
    summary: "Organizational structures, accountability context, and decision ownership intelligence.",
    highlights: ["Ownership mapping", "Entity intelligence", "Org alignment"],
    previewTitle: "Organization intelligence panel",
  },
  {
    key: "runtime",
    title: "Runtime Center",
    icon: Cpu,
    summary: "Runtime controls for safe execution, resilience, and enterprise policy enforcement.",
    highlights: ["Runtime health", "Policy enforcement", "Execution recovery"],
    previewTitle: "Runtime reliability cockpit",
  },
  {
    key: "developer",
    title: "Developer Center",
    icon: Code2,
    summary: "SDKs, extensions, and integration tooling for enterprise platform customization.",
    highlights: ["SDK surfaces", "Extension lifecycle", "Developer telemetry"],
    previewTitle: "Developer extension workspace",
  },
  {
    key: "role",
    title: "Role-Based Intelligence",
    icon: Binary,
    summary: "Adaptive intelligence views for each role, function, and decision horizon.",
    highlights: ["Role context", "Adaptive priorities", "Decision narratives"],
    previewTitle: "Role intelligence dashboard",
  },
]

export default function ModulesPage() {
  return (
    <PublicPageShell activeHref="/modules">
      <PublicHero
        eyebrow="AIOS Modules"
        title="One operating surface, specialized intelligence modules"
        body="Every module shares the same intelligence layer, business memory, motion system, spacing scale, and premium visual language."
        actions={
          <>
            <PublicButtonLink href="/products" size="lg">
              Explore Platform
            </PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary" size="lg">
              Book Demo
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Core modules", value: `${modules.length}`, detail: "All connected by one design and data system" },
          { label: "Shared runtime", value: "1", detail: "Execution, governance, and memory stay unified" },
          { label: "Role views", value: "Adaptive", detail: "Context changes without breaking consistency" },
        ]}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Explorer"
            title="Dive into the module stack without leaving the system"
            body="The modules page now reuses the same card system, interaction language, and typography tokens as the rest of the public site."
          />
          <div className="mt-14">
            <PublicTabbedPanel
              items={modules.map((item) => ({
                key: item.key,
                label: item.title,
                title: item.previewTitle,
                body: item.summary,
                bullets: item.highlights,
                icon: item.icon,
              }))}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Shared Principles"
            title="Reusable patterns keep every module part of the same AIOS ecosystem"
            body="The design system avoids page-specific drift by standardizing card behavior, layout rhythm, motion, and surface hierarchy."
          />
          <div className="mt-14">
            <PublicFeatureGrid
              items={[
                { title: "Shared memory", body: "Every module contributes to one persistent business memory graph.", icon: Database },
                { title: "Unified orchestration", body: "Signals, approvals, and workflows use the same runtime contract.", icon: Workflow },
                { title: "Role-based views", body: "Presentation adapts by function while system language remains stable.", icon: Binary },
                { title: "Organization context", body: "Modules align to executives, operators, and enterprise ownership models.", icon: Briefcase },
              ]}
              columns={4}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicFooterCta
        eyebrow="Module Walkthrough"
        title="See how the full AIOS stack feels as one connected operating system"
        body="From Executive Center to Runtime Center, every module now inherits a single reusable public design language."
      />
    </PublicPageShell>
  )
}
