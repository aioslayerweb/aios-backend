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
import type { Metadata } from "next"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Architecture",
  "Explore the AIOS operating model from business signals and memory through intelligence, decisions, governance, and learning.",
  "/architecture",
)

const architectureLayers = [
  { title: "Data Layer", subtitle: "Illustrative sources include CRM, ERP, support, collaboration, and finance systems.", icon: <Database size={18} /> },
  { title: "Business Memory", subtitle: "A product concept for relating evidence, timelines, and outcomes.", icon: <Blocks size={18} /> },
  { title: "Role-Based Intelligence", subtitle: "Context windows per executive role, function, and decision scope.", icon: <Briefcase size={18} /> },
  { title: "Intelligence Engine", subtitle: "Reasoning, confidence scoring, narrative synthesis, and prioritization.", icon: <BrainCircuit size={18} /> },
  { title: "Decision Engine", subtitle: "Governed recommendation pathways with approval and ownership control.", icon: <GitBranch size={18} /> },
  { title: "AI Operators", subtitle: "A concept for specialized assistance across business functions.", icon: <Bot size={18} /> },
  { title: "Workflow Runtime", subtitle: "An intended model for policy-aware tasks and automation sequences.", icon: <Workflow size={18} /> },
  { title: "External Integrations", subtitle: "Potential connections through enterprise APIs and messaging systems.", icon: <Network size={18} /> },
  { title: "Execution Layer", subtitle: "A design for measuring actions and outcomes where configured.", icon: <Layers size={18} /> },
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
  { title: "Siloed data paths", body: "Teams may need to understand how data, analysis, and execution controls relate." },
  { title: "Opaque AI reasoning", body: "Reviewers need a way to examine why recommendations are presented." },
  { title: "Governance questions", body: "Identity, permissions, policy, and approval boundaries require explicit verification." },
  { title: "Integration scope", body: "Each connection needs clear ownership, access rules, and supported business capabilities." },
]

const architectureSolutions = [
  { title: "Layered intelligence model", body: "The conceptual model relates signals, memory, knowledge, decision support, and execution." },
  { title: "Explainability requirements", body: "A recommendation should be reviewed alongside evidence, confidence, and ownership." },
  { title: "Controls to verify", body: "Confirm authentication, tenant boundaries, permissions, and approvals in the target deployment." },
  { title: "Business-oriented APIs", body: "Define supported business capabilities and access rules for each integration." },
]

const architectureHowItWorks = [
  { label: "Stage 1", title: "Data sources to memory", body: "The model shows how business sources could contribute signals and memory objects." },
  { label: "Stage 2", title: "Knowledge and AI layers", body: "Knowledge and reasoning concepts add context for review." },
  { label: "Stage 3", title: "Role context and operators", body: "Role context can shape decision support without changing access permissions." },
  { label: "Stage 4", title: "Executive outputs", body: "The intended model connects decisions and workflows to governance and traceability." },
]

const architectureBenefits = [
  { title: "Architectural clarity", body: "CTOs and executives can reason about the same model with different depth." },
  { title: "Security review", body: "Evaluate identity, tenant isolation, policy checks, and auditability across each layer." },
  { title: "Integration planning", body: "Define supported business capabilities, ownership, and access requirements for each connection." },
]

const timelineItems = posterSteps.map((title, index) => ({
  label: `Stage ${index + 1}`,
  title,
  body:
    index === 0
      ? "The conceptual model begins with signals from relevant business sources."
      : index === posterSteps.length - 1
        ? "Measured outcomes could inform future recommendations where those capabilities are configured."
        : "The diagram illustrates how context and reasoning could progress through the proposed model.",
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
        body="This conceptual architecture guide is for teams evaluating signal flow, explainability, policy governance, and execution boundaries. It does not imply that every layer or integration is deployed."
        actions={
          <>
            <PublicButtonLink href="/demo-platform/executive" size="lg">
              Explore synthetic demo
            </PublicButtonLink>
            <PublicButtonLink href="/platform" variant="secondary" size="lg">
              Review platform
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
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicCompetitorComparisonSection />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Architecture Review"
        title="Review the AIOS operating model against your current enterprise stack"
        body="Use the architecture overview to compare the AIOS operating model with your systems, business context, and governance requirements."
        primaryHref="/demo-platform/executive"
        primaryLabel="Explore synthetic demo"
        secondaryHref="/platform"
        secondaryLabel="Review platform"
      />
    </PublicPageShell>
  )
}
