"use client"

import {
  ArrowRight,
  Briefcase,
  Building2,
  Cpu,
  Database,
  DollarSign,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicCard,
  PublicComparison,
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
  PublicCompetitorComparisonSection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicExecutiveRoleSection,
  PublicHowItWorksSection,
  PublicProblemSolutionSection,
  PublicRoiCalculatorSection,
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"

const ecosystemNodes = [
  { title: "Executive Center", x: "14%", y: "20%" },
  { title: "Command Center", x: "75%", y: "15%" },
  { title: "Memory Center", x: "8%", y: "52%" },
  { title: "Workflow Builder", x: "74%", y: "50%" },
  { title: "Knowledge Center", x: "20%", y: "76%" },
  { title: "Agent Studio", x: "62%", y: "77%" },
  { title: "Developer Center", x: "42%", y: "8%" },
  { title: "Runtime Center", x: "44%", y: "90%" },
]

const signalSources = ["CRM", "Email", "ERP", "Slack", "Teams", "Support", "Knowledge", "Finance", "HR"]

const modules = [
  { title: "Executive Center", icon: Building2, body: "Leadership priorities and decision confidence in one view." },
  { title: "Command Center", icon: Radar, body: "Cross-domain signal orchestration and task control." },
  { title: "Memory Center", icon: Database, body: "Persistent business memory from outcomes and evidence." },
  { title: "Knowledge Center", icon: Network, body: "Graph intelligence that explains business context." },
  { title: "Workflow Builder", icon: Workflow, body: "Autonomous workflow orchestration with approvals." },
  { title: "Agent Studio", icon: Cpu, body: "Specialized agents operating with shared memory." },
  { title: "Developer Center", icon: Briefcase, body: "SDK, extensions, and enterprise developer tools." },
  { title: "Runtime Center", icon: ShieldCheck, body: "Runtime reliability, policy controls, and governance." },
]

const memoryTimeline = [
  "Signals captured",
  "Signals contextualized",
  "Context becomes knowledge",
  "Knowledge becomes intelligence",
  "Intelligence drives action",
  "Outcomes reinforce memory",
]

const rolePanels = [
  {
    key: "ceo",
    label: "CEO",
    title: "Executive macro view",
    body: "Strategic context compresses into one narrative layer for leadership, board communication, and next-best decisions.",
    bullets: ["2 critical decisions", "4 opportunities", "1 systemic risk", "Confidence 94%"],
    icon: Sparkles,
  },
  {
    key: "sales",
    label: "Sales",
    title: "Revenue execution view",
    body: "Revenue signals, deal risk, and renewal timing are coordinated in the same operating surface.",
    bullets: ["Pipeline drift -8%", "3 deal interventions", "2 churn risks", "Forecast confidence 89%"],
    icon: DollarSign,
  },
  {
    key: "marketing",
    label: "Marketing",
    title: "Demand and narrative view",
    body: "Demand generation, attribution context, and segment quality stay explainable and measurable.",
    bullets: ["Campaign velocity rising", "4 segment opportunities", "Attribution clarity improved", "Signal confidence 91%"],
    icon: Radar,
  },
  {
    key: "finance",
    label: "Finance",
    title: "Capital and variance view",
    body: "Budget drift, margin exposure, and cash runway signals become decision-ready without spreadsheet translation.",
    bullets: ["Budget anomaly detected", "Cash runway stabilized", "Margin alert in one unit", "Confidence 93%"],
    icon: Briefcase,
  },
  {
    key: "operations",
    label: "Operations",
    title: "Execution reliability view",
    body: "Operational friction is surfaced as prioritized actions with confidence, ownership, and expected outcome.",
    bullets: ["Throughput +6%", "1 policy violation", "3 bottlenecks prioritized", "Recovery confidence 88%"],
    icon: Workflow,
  },
  {
    key: "hr",
    label: "HR",
    title: "People and capability view",
    body: "Capability gaps, hiring velocity, and retention risk are interpreted in context instead of buried in tooling silos.",
    bullets: ["Attrition signal moderate", "Hiring velocity on target", "2 leadership gaps flagged", "Confidence 86%"],
    icon: Users,
  },
]

const operators = [
  { title: "Revenue Operator", icon: DollarSign },
  { title: "Customer Operator", icon: Users },
  { title: "Operations Operator", icon: Workflow },
  { title: "Finance Operator", icon: Briefcase },
  { title: "HR Operator", icon: Users },
] as const

const comparisonRows = [
  { label: "CRM", left: "System of record", right: "Company intelligence layer" },
  { label: "Automation", left: "Rules and triggers", right: "Governed autonomous operations" },
  { label: "AI Copilot", left: "One-shot assistance", right: "Continuous intelligence" },
]

const timelineItems = memoryTimeline.map((title, index) => ({
  label: `Stage ${index + 1}`,
  title,
  body:
    index === 0
      ? "Signals enter AIOS from the systems teams already use."
      : index === memoryTimeline.length - 1
        ? "Outcomes reinforce memory so future recommendations improve over time."
        : "Context compounds as intelligence is interpreted, connected, and prepared for action.",
}))

const homeProblemCards = [
  { title: "Fragmented visibility", body: "Critical signals live across CRM, ERP, support, and collaboration tools." },
  { title: "Delayed decisions", body: "Leadership decisions depend on stale dashboards and manual synthesis." },
  { title: "Shallow automation", body: "Rule triggers execute tasks without strategic understanding." },
  { title: "Memory loss", body: "Teams repeat mistakes because context and outcomes are not retained." },
]

const homeSolutionCards = [
  { title: "Business intelligence layer", body: "AIOS continuously interprets business state and prioritizes what matters now." },
  { title: "Business memory", body: "Every signal, decision, and outcome compounds into reusable institutional memory." },
  { title: "AI operators", body: "Specialized operators coordinate around shared context and governed execution." },
  { title: "Executive support", body: "Leaders receive explainable recommendations with confidence and expected outcomes." },
]

const homeHowItWorks = [
  { label: "Step 1", title: "Signal ingestion", body: "AIOS ingests events from business systems without disrupting existing workflows." },
  { label: "Step 2", title: "Memory and knowledge", body: "Signals are grounded in persistent memory and linked knowledge context." },
  { label: "Step 3", title: "Reasoning and decisions", body: "AI reasoning generates confidence-scored recommendations for each role." },
  { label: "Step 4", title: "Governed execution", body: "Approved actions run through policy-aware workflows and operator runtime." },
]

const homeBenefitCards = [
  { title: "Faster decisions", body: "Leadership teams move from reporting lag to live executive intelligence." },
  { title: "Higher confidence", body: "Recommendations include evidence, rationale, and expected business impact." },
  { title: "Safer automation", body: "Humans remain in control through policy gates, approvals, and traceability." },
]

const homeOutcomeStats = [
  { label: "Decision latency", value: "-41%", detail: "Faster executive response to cross-functional changes." },
  { label: "Opportunity recovery", value: "+19%", detail: "Earlier detection of revenue and retention risk." },
  { label: "Workflow throughput", value: "+34%", detail: "Governed automation across priority operations." },
]

export function PublicHomePage() {
  return (
    <PublicPageShell activeHref="/">
      <PublicStructuredData
        name="AIOS Home"
        description="AIOS is the AI Operating System for Businesses, connecting business intelligence, memory, operators, and governed automation."
        path="/"
      />
      <PublicHero
        eyebrow="AIOS Home"
        title="One intelligence layer. One business memory. One operating system."
        body="AIOS continuously understands, prioritizes, and operates the business through one calm, premium operating surface that extends from product into the public website."
        actions={
          <>
            <PublicButtonLink href="/contact" variant="primary" size="lg">
              Book Demo
            </PublicButtonLink>
            <PublicButtonLink href="/platform" variant="secondary" size="lg" icon={<ArrowRight size={16} />}>
              Explore Platform
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Signal sources", value: "42+", detail: "CRM, ERP, collaboration, support, finance" },
          { label: "Role contexts", value: "12", detail: "Executive, revenue, finance, operations, people" },
          { label: "Operator confidence", value: "94%", detail: "Explainable recommendations with memory feedback" },
        ]}
        visual={<PublicOrbitVisual label="AIOS Core" title="Intelligence Layer" nodes={ecosystemNodes} />}
      />

      <PublicProblemSolutionSection
        problemTitle="Most businesses run with disconnected intelligence"
        problemBody="Teams have systems of record and automation tools, but no unified operating intelligence to interpret context and guide decisions."
        problemItems={homeProblemCards}
        solutionTitle="AIOS adds one operating layer above your stack"
        solutionBody="AIOS connects people, systems, data, workflows, and AI into one explainable, enterprise-ready intelligence system."
        solutionItems={homeSolutionCards}
      />

      <PublicHowItWorksSection
        title="From business signals to measurable business outcomes"
        body="AIOS follows a continuous loop that learns, improves, and keeps humans in control at every critical decision point."
        steps={homeHowItWorks}
      />

      <PublicBenefitsOutcomesSection
        title="Enterprise outcomes that compound over time"
        body="As memory quality improves, recommendations become stronger and workflow execution becomes more reliable."
        benefits={homeBenefitCards}
        outcomes={homeOutcomeStats}
      />

      <PublicSection id="platform">
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Platform"
            title="Connected intelligence feels spatial, calm, and decisive"
            body="The public experience now follows the same system as the AIOS dashboard: large whitespace, soft depth, measured hierarchy, and one visual language across modules, architecture, and outcomes."
            align="center"
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <PublicCard variant="floating" className="overflow-hidden">
              <p className="public-eyebrow">Signal Network</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {signalSources.map((source, index) => (
                  <div key={source} className="rounded-[22px] border border-[var(--public-color-border)] bg-[rgba(247,249,252,0.8)] px-4 py-4">
                    <p className="public-caption text-[color:var(--public-color-text-soft)]">Source {index + 1}</p>
                    <p className="mt-2 text-base font-semibold text-[color:var(--public-color-navy)]">{source}</p>
                  </div>
                ))}
              </div>
            </PublicCard>

            <PublicComparison rows={comparisonRows} leftLabel="Legacy stack" rightLabel="AIOS" />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Modules"
            title="One operating surface, specialized intelligence modules"
            body="Every module inherits the same design system, motion language, depth model, and information hierarchy."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={modules.map((item) => ({ title: item.title, body: item.body, icon: item.icon, detail: "Shared memory, shared execution, shared language." }))} columns={4} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Business Memory"
            title="Memory that compounds business intelligence over time"
            body="AIOS does not stop at analytics. Each stage strengthens evidence, reasoning, and future action quality."
          />
          <div className="mt-14">
            <PublicTimeline items={timelineItems} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Role-Based Intelligence"
            title="One system, role-specific executive context"
            body="Context shifts by role while visual language, motion, and information structure stay consistent."
          />
          <div className="mt-14">
            <PublicTabbedPanel items={rolePanels} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Operators"
            title="Specialized operators collaborate as one autonomous system"
            body="Operators run with shared memory, explainable reasoning, and aligned workflow orchestration."
            align="center"
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {operators.map((item) => {
              const Icon = item.icon
              return (
                <PublicCard key={item.title} variant="standard" hover className="text-center">
                  <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                    <Icon size={18} />
                  </span>
                  <h3 className="public-h4">{item.title}</h3>
                </PublicCard>
              )
            })}
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicRoiCalculatorSection />

      <PublicEnterpriseTrustMatrixSection />

      <PublicExecutiveRoleSection />

      <PublicCompetitorComparisonSection />

      <PublicBuyerJourneySection />

      <PublicTrustAndProofSection
        title="Built for enterprise confidence"
        body="AIOS public experience mirrors product reality: governed automation, role-based clarity, and measurable business impact."
        quote="AIOS changed how our executive team understands operations. We now act on live intelligence, not delayed reporting."
        person="Head of Strategy, Pilot Customer"
        role="Global Enterprise Pilot Program"
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Ready To See AIOS"
        title="Bring the AI Operating System into your own business context"
        body="See how AIOS connects signals, memory, role intelligence, and autonomous workflows in one enterprise-grade operating surface."
      />
    </PublicPageShell>
  )
}
