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
import {
  PublicBenefitsOutcomesSection,
  PublicCompetitorComparisonSection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicHowItWorksSection,
  PublicProblemSolutionSection,
  PublicStructuredData,
} from "@/components/public-site/storytelling-sections"

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

const architectureProblems = [
  { title: "Siloed data paths", body: "Data pipelines, AI, and execution controls are often disconnected." },
  { title: "Opaque AI reasoning", body: "Architecture reviews struggle to trace why recommendations appear." },
  { title: "Governance gaps", body: "RBAC and policy controls are bolted on rather than core to design." },
  { title: "Weak API cohesion", body: "Integrations lack a business-oriented capability model." },
]

const architectureSolutions = [
  { title: "Layered intelligence design", body: "Signals, memory, knowledge, AI, and execution are architected as one chain." },
  { title: "Explainable decision engine", body: "Recommendations are linked to evidence, confidence, and ownership." },
  { title: "Built-in enterprise controls", body: "Security, RBAC, and approvals are first-class platform capabilities." },
  { title: "Capability-driven APIs", body: "APIs expose business capabilities instead of internal table structures." },
]

const architectureHowItWorks = [
  { label: "Stage 1", title: "Data sources to memory", body: "Enterprise data sources become business signals and durable memory objects." },
  { label: "Stage 2", title: "Knowledge and AI layers", body: "Knowledge graph and reasoning layers add explainable context." },
  { label: "Stage 3", title: "RBI and operators", body: "Role-Based Intelligence and operators tailor decisions by stakeholder." },
  { label: "Stage 4", title: "Executive outputs", body: "Decisions, workflows, and outcomes are delivered with governance and traceability." },
]

const architectureBenefits = [
  { title: "Architectural clarity", body: "CTOs and executives can reason about the same model with different depth." },
  { title: "Security by design", body: "RBAC, policy checks, and auditability are integrated across layers." },
  { title: "Faster integration", body: "Business capability APIs reduce implementation ambiguity and drift." },
]

const architectureOutcomes = [
  { label: "Integration speed", value: "+27%", detail: "Faster onboarding of critical business systems." },
  { label: "Audit readiness", value: "98%", detail: "Traceable decisions and execution records by default." },
  { label: "Architecture confidence", value: "93%", detail: "Stakeholders report clearer understanding of system operation." },
]

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
      <PublicStructuredData
        name="AIOS Architecture"
        description="Review AIOS architecture layers including data, memory, knowledge, AI, RBI, operators, executive outputs, security, RBAC, and APIs."
        path="/architecture"
      />
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

      <PublicProblemSolutionSection
        problemTitle="Enterprise AI architecture is often fragmented"
        problemBody="Organizations stitch together data, AI, workflow, and governance into brittle patterns that are hard to explain and scale."
        problemItems={architectureProblems}
        solutionTitle="AIOS provides one coherent architecture chain"
        solutionBody="From data sources to executive outputs, every architectural layer is connected, governed, and explainable."
        solutionItems={architectureSolutions}
      />

      <PublicHowItWorksSection
        title="How architectural layers translate into business outcomes"
        body="AIOS architecture moves from raw signals to governed decisions without breaking context across layers."
        steps={architectureHowItWorks}
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

      <PublicBenefitsOutcomesSection
        title="Architecture that supports enterprise adoption"
        body="The AIOS architecture model is designed to satisfy technical rigor and executive clarity at the same time."
        benefits={architectureBenefits}
        outcomes={architectureOutcomes}
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicCompetitorComparisonSection />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Architecture Review"
        title="Review the AIOS operating model against your current enterprise stack"
        body="Map existing systems, governance needs, and runtime requirements onto a reusable public system that mirrors the product itself."
      />
    </PublicPageShell>
  )
}
