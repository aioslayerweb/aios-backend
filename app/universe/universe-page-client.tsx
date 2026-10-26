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
  { title: "Scattered business context", body: "Information relevant to a decision may sit across separate business systems." },
  { title: "Hard-to-follow relationships", body: "A static architecture view may not make links between concepts easy to explore." },
  { title: "Unclear responsibilities", body: "People need to understand where human review and policy controls fit." },
  { title: "Different role priorities", body: "Decision-makers may need different context while access rules remain consistent." },
]

const universeSolutionCards = [
  { title: "Conceptual ecosystem", body: "The map groups AIOS concepts into an illustrative operating model." },
  { title: "Explore product areas", body: "Public pages describe the intended roles of modules, memory, and workflows." },
  { title: "Illustrative information flow", body: "The signal-to-outcome pathway explains how the product model is intended to work." },
  { title: "Governance in view", body: "The model highlights human review and policy as important parts of execution." },
]

const universeHowItWorks = [
  { label: "Layer 1", title: "Business signals", body: "The model starts with relevant information from business systems." },
  { label: "Layer 2", title: "Context and memory", body: "Related context can help explain the meaning of a signal." },
  { label: "Layer 3", title: "Decision support", body: "Role context can shape what information and options are presented for review." },
  { label: "Layer 4", title: "Governed workflows", body: "Where execution is configured, policy and human approval should guide actions." },
]

const universeBenefits = [
  { title: "Explore relationships", body: "Use the map to review how the product concepts are intended to relate." },
  { title: "Consider coordination", body: "See where shared context could support work across business functions." },
  { title: "Keep governance visible", body: "Review the roles of policy, human review, and explainability in the model." },
]

export default function UniversePageClient() {
  return (
    <PublicPageShell activeHref="/universe">
      <PublicStructuredData
        name="AIOS Universe"
        description="Explore an illustrative map of AIOS concepts, including signals, memory, role context, and governed workflows."
        path="/universe"
      />
      <PublicHero
        eyebrow="AIOS Universe"
        title="The connected operating map for the autonomous enterprise"
        body="Universe presents an illustrative map of AIOS concepts: modules, intelligence layers, memory, and role-aware surfaces in the intended operating model."
        actions={
          <>
            <PublicButtonLink href="/platform" size="lg">
              Explore Platform
            </PublicButtonLink>
            <PublicButtonLink href="/demo-platform/executive" variant="secondary" size="lg">
              Explore synthetic demo
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
        body="This illustrative map connects AIOS product concepts. It does not represent a live business connection or measured customer outcome."
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="See The Universe In Context"
        title="Explore the intended AIOS operating model"
        body="Review how AIOS concepts relate across signals, memory, decision support, and governed workflows. This page does not connect to enterprise systems."
      />
    </PublicPageShell>
  )
}
