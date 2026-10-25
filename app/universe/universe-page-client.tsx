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
  { title: "Executive Center", href: "/demo-platform/executive", icon: <Building2 size={15} />, x: "18%", y: "14%" },
  { title: "Command Center", href: "/demo-platform/commands", icon: <Radar size={15} />, x: "76%", y: "12%" },
  { title: "Memory Center", href: "/demo-platform/memory", icon: <Database size={15} />, x: "9%", y: "46%" },
  { title: "Knowledge Center", href: "/demo-platform/knowledge", icon: <Network size={15} />, x: "81%", y: "45%" },
  { title: "Workflow Builder", href: "/demo-platform/workflows", icon: <Workflow size={15} />, x: "17%", y: "76%" },
  { title: "Agent Studio", href: "/demo-platform/agents", icon: <Bot size={15} />, x: "73%", y: "76%" },
  { title: "Organization Center", href: "/demo-platform/corporate", icon: <Briefcase size={15} />, x: "34%", y: "90%" },
  { title: "Developer Center", href: "/demo-platform/developer-center", icon: <Wrench size={15} />, x: "54%", y: "8%" },
  { title: "Runtime Center", href: "/demo-platform/runtime-center", icon: <Layers size={15} />, x: "48%", y: "94%" },
  { title: "Security Center", href: "/demo-platform/security", icon: <ShieldCheck size={15} />, x: "62%", y: "90%" },
  { title: "Integrations", href: "/demo-platform/integrations", icon: <Cable size={15} />, x: "4%", y: "66%" },
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
    bullets: ["Leadership priorities", "Decision context", "Cross-functional dependencies", "Suggested review"],
    icon: <Sparkles size={18} />,
  },
  {
    key: "sales",
    label: "Sales",
    title: "Pipeline and revenue orchestration",
    body: "Revenue teams inherit the same operating language with deal risk, forecast drift, and expansion timing in one place.",
    bullets: ["Pipeline context", "Account history", "Forecast assumptions", "Suggested review"],
    icon: <Radar size={18} />,
  },
  {
    key: "finance",
    label: "Finance",
    title: "Capital and risk intelligence",
    body: "Finance decisions stay contextual, explainable, and linked to business memory rather than isolated snapshots.",
    bullets: ["Financial assumptions", "Resource decisions", "Variance context", "Suggested review"],
    icon: <Briefcase size={18} />,
  },
  {
    key: "operations",
    label: "Operations",
    title: "Execution throughput control",
    body: "Operational bottlenecks, policy exceptions, and recovery actions are surfaced with ownership and confidence.",
    bullets: ["Process dependencies", "Operational handoffs", "Policy considerations", "Suggested review"],
    icon: <Workflow size={18} />,
  },
  {
    key: "customer-success",
    label: "Customer Success",
    title: "Customer continuity intelligence",
    body: "Renewal risk, service health, and expansion potential remain connected to shared organizational context.",
    bullets: ["Customer history", "Service context", "Account ownership", "Suggested review"],
    icon: <ShieldCheck size={18} />,
  },
]

const operators = [
  { title: "Revenue Operator", body: "Forecast shifts, expansion timing, and pipeline interventions." },
  { title: "Customer Intelligence", body: "Health scoring, journey signals, and churn prevention." },
  { title: "Operations Operator", body: "Bottleneck routing, escalation paths, and workflow throughput." },
  { title: "Finance Operator", body: "Capital variance, margin signals, and approval orchestration." },
  { title: "HR Operator", body: "Hiring readiness, attrition signals, and capability mapping." },
]

const integrations = ["CRM", "ERP", "Finance", "Support", "Email", "Collaboration", "Knowledge", "Databases", "APIs", "MCP", "Workflows", "Other systems"]

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
              Contact
            </PublicButtonLink>
          </>
        }
        visual={<PublicOrbitVisual label="AIOS Core" title="Operating Universe" nodes={districts} />}
      />

      <PublicProblemSolutionSection
        problemTitle="Most enterprise ecosystems are not truly connected"
        problemBody="Architecture views can be static, operators can be fragmented, and module relationships can be difficult to understand."
        problemItems={universeProblemCards}
        solutionTitle="Universe turns AIOS into a navigable intelligence map"
        solutionBody="This interactive map illustrates how AIOS concepts can connect intelligence, memory, modules, and governed workflows."
        solutionItems={universeSolutionCards}
      />

      <PublicHowItWorksSection
        title="How intelligence moves across the AIOS universe"
        body="The illustrative model connects information, business memory, role context, and governed workflow concepts."
        steps={universeHowItWorks}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Signal Flow"
            title="Everything in AIOS moves through one intelligence chain"
            body="The diagram explains the intended product model. It does not represent a live system connection or activity feed."
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
            body="These synthetic examples show how decision context can vary by role without changing access permissions."
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
            title="Business functions and system categories"
            body="These illustrative examples describe possible areas of focus. They are not a list of connected services or active operators."
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
        title="A connected map makes the operating model easier to explore"
        body="Universe is a conceptual guide to AIOS components and their relationships, not evidence of a production deployment."
        benefits={universeBenefits}
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicSocialProofSection />

      <PublicBuyerJourneySection />

      <PublicTrustAndProofSection
        title="Designed for technical depth and executive clarity"
        body="The universe overview connects the product concepts described across AIOS public pages. No customer endorsements or measured outcomes are represented here."
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
