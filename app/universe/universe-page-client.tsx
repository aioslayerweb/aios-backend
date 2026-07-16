"use client"

import {
  Bot,
  Briefcase,
  Building2,
  Cable,
  Database,
  Layers,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
  PublicTabbedPanel,
  PublicTimeline,
} from "@/components/aios"
import {
  PublicBenefitsOutcomesSection,
  PublicBuyerJourneySection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicHowItWorksSection,
  PublicProblemSolutionSection,
  PublicSocialProofSection,
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"

const districts = [
  { title: "Executive Center", href: "/app/executive", icon: Building2, x: "18%", y: "14%" },
  { title: "Command Center", href: "/app/commands", icon: Radar, x: "76%", y: "12%" },
  { title: "Memory Center", href: "/app/memory", icon: Database, x: "9%", y: "46%" },
  { title: "Knowledge Center", href: "/app/knowledge", icon: Network, x: "81%", y: "45%" },
  { title: "Workflow Builder", href: "/app/workflows", icon: Workflow, x: "17%", y: "76%" },
  { title: "Agent Studio", href: "/app/agents", icon: Bot, x: "73%", y: "76%" },
  { title: "Organization Center", href: "/app/corporate", icon: Briefcase, x: "34%", y: "90%" },
  { title: "Developer Center", href: "/app/developer-center", icon: Wrench, x: "54%", y: "8%" },
  { title: "Runtime Center", href: "/app/runtime-center", icon: Layers, x: "48%", y: "94%" },
  { title: "Security Center", href: "/app/security", icon: ShieldCheck, x: "62%", y: "90%" },
  { title: "Integrations", href: "/app/integrations", icon: Cable, x: "4%", y: "66%" },
]

const signalFlow = [
  "Signals",
  "Business Memory",
  "Role-Based Intelligence",
  "Intelligence Engine",
  "Decision Engine",
  "AI Operators",
  "Workflow Runtime",
  "Business Outcomes",
]

const rolePanels = [
  {
    key: "ceo",
    label: "CEO",
    title: "Strategic command narrative",
    body: "Executives see one evolving view of priorities, decisions, and systemic business motion.",
    bullets: ["2 high-impact decisions", "4 expansion windows", "1 systemic risk", "Confidence 94%"],
    icon: Sparkles,
  },
  {
    key: "sales",
    label: "Sales",
    title: "Pipeline and revenue orchestration",
    body: "Revenue teams inherit the same operating language with deal risk, forecast drift, and expansion timing in one place.",
    bullets: ["Forecast variance -7%", "3 deal interventions", "2 churn flags", "Confidence 89%"],
    icon: Radar,
  },
  {
    key: "finance",
    label: "Finance",
    title: "Capital and risk intelligence",
    body: "Finance decisions stay contextual, explainable, and linked to business memory rather than isolated snapshots.",
    bullets: ["Margin drift isolated", "Cash runway stable", "Budget anomaly isolated", "Confidence 93%"],
    icon: Briefcase,
  },
  {
    key: "operations",
    label: "Operations",
    title: "Execution throughput control",
    body: "Operational bottlenecks, policy exceptions, and recovery actions are surfaced with ownership and confidence.",
    bullets: ["Throughput +6%", "1 policy exception", "3 bottlenecks queued", "Confidence 88%"],
    icon: Workflow,
  },
  {
    key: "customer-success",
    label: "Customer Success",
    title: "Customer continuity intelligence",
    body: "Renewal risk, service health, and expansion potential remain connected to shared organizational context.",
    bullets: ["Renewal risk heatmap", "Escalation backlog down", "Knowledge hit-rate +14%", "Confidence 90%"],
    icon: ShieldCheck,
  },
]

const operators = [
  { title: "Revenue Operator", body: "Forecast shifts, expansion timing, and pipeline interventions." },
  { title: "Customer Intelligence", body: "Health scoring, journey signals, and churn prevention." },
  { title: "Operations Operator", body: "Bottleneck routing, escalation paths, and workflow throughput." },
  { title: "Finance Operator", body: "Capital variance, margin signals, and approval orchestration." },
  { title: "HR Operator", body: "Hiring readiness, attrition signals, and capability mapping." },
]

const integrations = ["CRM", "ERP", "Email", "Slack", "Teams", "HubSpot", "Salesforce", "Stripe", "Knowledge Base", "Databases", "MCP", "Workflow Engine"]

const timelineItems = signalFlow.map((title, index) => ({
  label: `Layer ${index + 1}`,
  title,
  body:
    index === 0
      ? "Signals enter from core business systems without changing the operating language."
      : index === signalFlow.length - 1
        ? "Measured outcomes feed directly back into memory and future recommendations."
        : "Each layer adds context, explainability, and governed execution to the same intelligence chain.",
}))

const universeProblemCards = [
  { title: "Disconnected modules", body: "Enterprise tools operate as islands without shared intelligence." },
  { title: "Static architecture diagrams", body: "Most platform maps fail to show live information movement." },
  { title: "Siloed operators", body: "AI agents often act without shared memory and governance." },
  { title: "Role blind spots", body: "Teams miss cross-functional dependencies and compounding risks." },
]

const universeSolutionCards = [
  { title: "Interactive ecosystem", body: "Universe visualizes AIOS as one connected enterprise operating map." },
  { title: "Clickable nodes", body: "Modules, operators, and layers can be explored as living system components." },
  { title: "Animated intelligence flow", body: "Signal-to-outcome pathways are visible and explainable to every role." },
  { title: "Unified control", body: "Humans, operators, and workflows coordinate in one governed runtime." },
]

const universeHowItWorks = [
  { label: "Layer 1", title: "Core AIOS", body: "The AIOS core coordinates context, memory, and orchestration contracts." },
  { label: "Layer 2", title: "Connected modules", body: "Every module contributes data and decisions to the same operating layer." },
  { label: "Layer 3", title: "Operator collaboration", body: "Operators share memory and reasoning before execution." },
  { label: "Layer 4", title: "Workflow outcomes", body: "Governed workflows execute actions and feed outcomes back into memory." },
]

const universeBenefits = [
  { title: "Faster understanding", body: "Teams understand system relationships and intelligence flow within minutes." },
  { title: "Better coordination", body: "Operators and modules work with shared context instead of isolated tasks." },
  { title: "Enterprise confidence", body: "Architecture remains explainable across technical and executive stakeholders." },
]

const universeOutcomes = [
  { label: "System visibility", value: "+63%", detail: "Improvement in architecture comprehension for pilot teams." },
  { label: "Cross-team alignment", value: "+28%", detail: "Shared understanding of dependencies and decision pathways." },
  { label: "Execution confidence", value: "91%", detail: "Teams can trace what happened, why, and what should happen next." },
]

export default function UniversePageClient() {
  return (
    <PublicPageShell activeHref="/universe">
      <PublicStructuredData
        name="AIOS Universe"
        description="Explore the AIOS ecosystem: core intelligence, modules, operators, memory, workflows, and governed enterprise outcomes."
        path="/universe"
      />
      <PublicHero
        eyebrow="AIOS Universe"
        title="The connected operating map for the autonomous enterprise"
        body="Universe translates the full AIOS ecosystem into one spatial system: modules, intelligence layers, memory loops, and role-aware surfaces working as a single operating model."
        actions={
          <>
            <PublicButtonLink href="/platform" size="lg">
              Explore Platform
            </PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary" size="lg">
              Book Demo
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Connected modules", value: "11", detail: "One system with shared memory and runtime" },
          { label: "Business layers", value: "8", detail: "Signals through outcomes in one architecture" },
          { label: "Enterprise integrations", value: "12+", detail: "Cross-system context without fragmentation" },
        ]}
        visual={<PublicOrbitVisual label="AIOS Core" title="Operating Universe" nodes={districts} />}
      />

      <PublicProblemSolutionSection
        problemTitle="Most enterprise ecosystems are not truly connected"
        problemBody="Architecture views are static, operators are fragmented, and module relationships are hard to understand in real time."
        problemItems={universeProblemCards}
        solutionTitle="Universe turns AIOS into a navigable intelligence map"
        solutionBody="The ecosystem is visual, interactive, and continuously tied to how AIOS reasons, decides, and executes."
        solutionItems={universeSolutionCards}
      />

      <PublicHowItWorksSection
        title="How intelligence moves across the AIOS universe"
        body="Each ecosystem layer is connected to memory, role-based context, and workflow execution."
        steps={universeHowItWorks}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Signal Flow"
            title="Everything in AIOS moves through one intelligence chain"
            body="The Universe page now shares the same visual grammar as every public page while making the platform map easier to understand, compare, and extend."
          />
          <div className="mt-14">
            <PublicTimeline items={timelineItems} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Role Intelligence"
            title="Role-specific context without breaking system consistency"
            body="Each function sees the same operating system through the decision lens that matters to them."
          />
          <div className="mt-14">
            <PublicTabbedPanel items={rolePanels} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Operators And Integrations"
            title="Operators collaborate with shared memory and external systems"
            body="AIOS connects human teams, autonomous operators, and enterprise systems through one reusable visual and interaction system."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <PublicFeatureGrid items={operators.map((item) => ({ title: item.title, body: item.body }))} columns={3} />
            <div className="grid gap-3 sm:grid-cols-2">
              {integrations.map((item) => (
                <div key={item} className="public-card public-card-glass px-4 py-4 text-sm font-semibold text-[color:var(--public-color-text)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicBenefitsOutcomesSection
        title="A connected map leads to better enterprise decisions"
        body="Universe helps leaders and builders align quickly on what the system is doing and where value is created."
        benefits={universeBenefits}
        outcomes={universeOutcomes}
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicSocialProofSection />

      <PublicBuyerJourneySection />

      <PublicTrustAndProofSection
        title="Designed for technical depth and executive clarity"
        body="Universe supports enterprise storytelling, architecture reviews, and pilot onboarding from one consistent model."
        quote="Universe helped us align architecture and operations in one session. Everyone saw the same system reality."
        person="Enterprise Architect, Pilot Program"
        role="Global Financial Services"
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="See The Universe In Context"
        title="Map your enterprise onto one connected AI operating model"
        body="AIOS unifies modules, memory, intelligence, and execution into one coherent system that scales across future pages and product surfaces alike."
      />
    </PublicPageShell>
  )
}
