"use client"

import {
  Blocks,
  Bot,
  BrainCircuit,
  Briefcase,
  Database,
  GitBranch,
  Layers,
  Network,
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
  PublicTimeline,
} from "@/components/aios"

const architectureLayers = [
  { title: "Data Layer", subtitle: "Signals from CRM, ERP, support, collaboration, and finance systems.", icon: Database },
  { title: "Business Memory", subtitle: "Persistent memory objects indexing evidence, timelines, and outcomes.", icon: Blocks },
  { title: "Role-Based Intelligence", subtitle: "Context windows per executive role, function, and decision scope.", icon: Briefcase },
  { title: "Intelligence Engine", subtitle: "Reasoning, confidence scoring, narrative synthesis, and prioritization.", icon: BrainCircuit },
  { title: "Decision Engine", subtitle: "Governed recommendation pathways with approval and ownership control.", icon: GitBranch },
  { title: "AI Operators", subtitle: "Specialized autonomous operators for revenue, customer, finance, and operations.", icon: Bot },
  { title: "Workflow Runtime", subtitle: "Runtime orchestration of approved policies, tasks, and automation sequences.", icon: Workflow },
  { title: "External Integrations", subtitle: "Bidirectional sync with enterprise APIs, SDKs, and messaging systems.", icon: Network },
  { title: "Execution Layer", subtitle: "Measured actions, business outcomes, and feedback loops into memory.", icon: Layers },
]

const posterSteps = [
  "Business Signals",
  "Contextualization",
  "Memory Formation",
  "Intelligence Synthesis",
  "Decision Coordination",
  "Operator Routing",
  "Workflow Execution",
  "Business Outcomes",
  "Learning Feedback",
]

const roleBlocks = ["CTO", "Enterprise Architect", "Finance Leadership", "Operations", "Revenue", "Customer Success"]

const integrationBlocks = ["CRM", "ERP", "Email", "Slack", "Teams", "Support", "Finance", "HRIS", "Warehouse", "Custom APIs"]

const timelineItems = posterSteps.map((title, index) => ({
  label: `Stage ${index + 1}`,
  title,
  body:
    index === 0
      ? "Business signals enter through existing enterprise systems and live feeds."
      : index === posterSteps.length - 1
        ? "Measured outcomes complete the learning loop and improve future recommendations."
        : "Context and reasoning deepen as information progresses through the AIOS architecture.",
}))

export default function ArchitecturePage() {
  return (
    <PublicPageShell activeHref="/architecture">
      <PublicHero
        eyebrow="AIOS Architecture"
        title="Enterprise architecture for autonomous business operations"
        body="Designed for CTOs and enterprise architects evaluating signal flow, explainability, policy governance, and execution reliability across the full AIOS stack."
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
          { label: "Core layers", value: `${architectureLayers.length}`, detail: "Data through outcomes with shared memory" },
          { label: "Enterprise roles", value: `${roleBlocks.length}`, detail: "Architecture stays legible for technical and business leaders" },
          { label: "Integration surfaces", value: `${integrationBlocks.length}+`, detail: "APIs, systems, runtime, and workflow endpoints" },
        ]}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Architecture Layers"
            title="A continuous intelligence flow instead of disconnected tooling"
            body="Each layer contributes evidence, context, reasoning, and governed execution while staying visually coherent across every page."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={architectureLayers.map((item) => ({ title: item.title, body: item.subtitle, icon: item.icon }))} columns={3} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Signal Poster"
            title="From business signals to measurable business outcomes"
            body="Architecture is presented as a readable operating chain rather than a static technical diagram."
          />
          <div className="mt-14">
            <PublicTimeline items={timelineItems} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="public-card public-card-floating">
              <p className="public-eyebrow">Designed For</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {roleBlocks.map((item) => (
                  <div key={item} className="public-chip">{item}</div>
                ))}
              </div>
            </div>
            <div className="public-card public-card-floating">
              <p className="public-eyebrow">Integration Surfaces</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {integrationBlocks.map((item) => (
                  <div key={item} className="rounded-[18px] border border-[var(--public-color-border)] bg-[rgba(247,249,252,0.8)] px-4 py-3 text-sm font-semibold text-[color:var(--public-color-text)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicFooterCta
        eyebrow="Architecture Review"
        title="Review the AIOS operating model against your current enterprise stack"
        body="Map existing systems, governance needs, and runtime requirements onto a reusable public system that mirrors the product itself."
      />
    </PublicPageShell>
  )
}
