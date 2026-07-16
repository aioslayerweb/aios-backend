"use client"

import {
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Database,
  Network,
  Users,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicComparison,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
  PublicTabbedPanel,
} from "@/components/aios"
import {
  PublicBenefitsOutcomesSection,
  PublicBuyerJourneySection,
  PublicCompetitorComparisonSection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicExecutiveRoleSection,
  PublicHowItWorksSection,
  PublicIntelligenceCapacitySection,
  PublicPilotProgramSection,
  PublicProblemSolutionSection,
  PublicRoiCalculatorSection,
  PublicSocialProofSection,
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"

const products = [
  {
    key: "revenue-operator",
    title: "Revenue Operator",
    icon: ChartNoAxesCombined,
    benefits: ["Forecast variance alerts", "Pipeline risk detection", "Opportunity prioritization"],
    outcomes: ["Faster deal recovery", "Improved forecast confidence", "Higher win-rate consistency"],
    useCases: ["Quarterly pipeline stabilization", "Churn risk prevention", "Territory performance optimization"],
    roi: "Up to 12% forecast improvement",
    pricingTeaser: "Growth plan add-on",
  },
  {
    key: "customer-intelligence",
    title: "Customer Intelligence",
    icon: Users,
    benefits: ["Customer health scoring", "Journey anomaly detection", "Engagement signal synthesis"],
    outcomes: ["Reduced churn", "Higher retention", "Better account expansion timing"],
    useCases: ["At-risk account intervention", "Enterprise renewal strategy", "Support-to-success handoff"],
    roi: "Up to 18% churn reduction",
    pricingTeaser: "Included in Professional",
  },
  {
    key: "executive-center",
    title: "Executive Center",
    icon: Building2,
    benefits: ["Priority dashboards", "Decision context narratives", "Board-ready summaries"],
    outcomes: ["Lower decision latency", "Higher strategic clarity", "Improved leadership alignment"],
    useCases: ["Weekly operating reviews", "Executive briefings", "Cross-functional alignment"],
    roi: "40% faster strategic decisions",
    pricingTeaser: "Professional and Enterprise",
  },
  {
    key: "business-memory",
    title: "Business Memory",
    icon: Database,
    benefits: ["Persistent institutional memory", "Outcome-linked context", "Evidence indexing"],
    outcomes: ["Compounding intelligence", "Fewer repeated mistakes", "Higher recommendation quality"],
    useCases: ["Post-mortem learning loops", "Decision traceability", "Policy evolution"],
    roi: "3x faster context recall",
    pricingTeaser: "Core platform foundation",
  },
  {
    key: "workflow-builder",
    title: "Workflow Builder",
    icon: Workflow,
    benefits: ["Policy-governed automation", "Approval checkpoints", "Adaptive execution chains"],
    outcomes: ["Reduced manual operations", "More reliable execution", "Safer automation rollout"],
    useCases: ["Finance approval chains", "Ops escalation workflows", "Cross-team orchestration"],
    roi: "35% operations efficiency gain",
    pricingTeaser: "Professional and Enterprise",
  },
  {
    key: "knowledge-center",
    title: "Knowledge Center",
    icon: Network,
    benefits: ["Knowledge graph unification", "Signal-to-knowledge linkage", "Context-aware search"],
    outcomes: ["Faster investigation", "Stronger traceability", "More explainable recommendations"],
    useCases: ["Policy intelligence", "Entity relationship insights", "Regulatory evidence navigation"],
    roi: "50% faster root-cause analysis",
    pricingTeaser: "Included in Professional",
  },
  {
    key: "advanced-intelligence-pack",
    title: "Advanced Intelligence Pack",
    icon: BrainCircuit,
    benefits: ["Deep reasoning models", "Confidence calibration", "Predictive scenario testing"],
    outcomes: ["Higher precision recommendations", "Earlier risk detection", "More reliable automation outcomes"],
    useCases: ["Strategic what-if analysis", "Multi-factor risk forecasting", "Executive simulation briefs"],
    roi: "Up to 2.4x insight accuracy lift",
    pricingTeaser: "Enterprise premium package",
  },
]

const comparisonRows = [
  { label: "Decision speed", left: "Weekly review cadence", right: "Continuous intelligence updates" },
  { label: "Signal coverage", left: "Siloed system snapshots", right: "Cross-system unified intelligence" },
  { label: "Automation reliability", left: "Rule-based execution", right: "Policy-governed adaptive workflows" },
  { label: "Executive visibility", left: "Manual dashboards", right: "Live decision narratives" },
]

const productProblemCards = [
  { title: "Point-solution pricing", body: "Organizations buy many tools but still lack operating intelligence." },
  { title: "Unclear capacity planning", body: "Leaders cannot model value across users, workflows, and data scope." },
  { title: "Weak ROI narrative", body: "AI initiatives struggle to connect outputs to financial outcomes." },
  { title: "Pilot fragmentation", body: "Pilot programs often fail to scale into enterprise operating systems." },
]

const productSolutionCards = [
  { title: "AIOS Pilot", body: "A guided enterprise pilot focused on measurable business outcomes." },
  { title: "Future editions", body: "Expansion paths for role-based, function-based, and enterprise-wide adoption." },
  { title: "Capacity model", body: "Plan by intelligence scope: employees, workflows, operators, and integrations." },
  { title: "ROI-first packaging", body: "Every package ties value to time saved, recovery, and revenue impact." },
]

const productHowItWorks = [
  { label: "Phase 1", title: "Pilot discovery", body: "Define objectives, constraints, and executive success criteria." },
  { label: "Phase 2", title: "AIOS activation", body: "Connect key systems and configure memory, roles, and operators." },
  { label: "Phase 3", title: "Outcome tracking", body: "Measure decisions, throughput, and financial impact continuously." },
  { label: "Phase 4", title: "Enterprise scale", body: "Expand to additional modules and business functions with confidence." },
]

const productBenefits = [
  { title: "Clear commercial model", body: "A transparent path from pilot to enterprise adoption." },
  { title: "Capacity visibility", body: "Estimate platform fit across teams, customers, and workflows." },
  { title: "Business-backed ROI", body: "Value is linked to concrete operational and financial outcomes." },
]

const productOutcomes = [
  { label: "Pilot-to-scale conversion", value: "72%", detail: "Pilot organizations progressing to broader deployment." },
  { label: "Median payback", value: "< 6 months", detail: "Across validated pilot operating models." },
  { label: "Executive confidence", value: "95%", detail: "Leadership clarity on AIOS value and roadmap." },
]

export default function ProductsPage() {
  return (
    <PublicPageShell activeHref="/products">
      <PublicStructuredData
        name="AIOS Products"
        description="Explore AIOS Pilot, enterprise offerings, future editions, pricing overview, capacity modeling, and ROI pathways."
        path="/products"
      />
      <PublicHero
        eyebrow="AIOS Products"
        title="AIOS Pilot and enterprise offerings on one intelligence operating system"
        body="From pilot program to enterprise scale, AIOS products are designed around capacity, governance, and measurable business outcomes."
        actions={
          <>
            <PublicButtonLink href="/contact" size="lg">
              Book Demo
            </PublicButtonLink>
            <PublicButtonLink href="/modules" variant="secondary" size="lg">
              Explore Modules
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Offerings", value: `${products.length}+`, detail: "Pilot, product packs, and enterprise pathways" },
          { label: "Capacity model", value: "Role + Workflow", detail: "Plan by users, actions, and integrations" },
          { label: "ROI focus", value: "Outcome-first", detail: "Time, revenue, cost, and payback visibility" },
        ]}
      />

      <PublicProblemSolutionSection
        problemTitle="Buying AI tools does not create an operating system"
        problemBody="Most product portfolios optimize feature lists, not enterprise intelligence outcomes."
        problemItems={productProblemCards}
        solutionTitle="AIOS offerings are structured for enterprise adoption"
        solutionBody="Pilot-first, ROI-backed, and designed to scale into one governing intelligence layer."
        solutionItems={productSolutionCards}
      />

      <PublicHowItWorksSection
        title="How AIOS commercial adoption works"
        body="The product journey is designed to prove value quickly and scale with confidence."
        steps={productHowItWorks}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Comparison"
            title="AIOS replaces fragmented categories with one continuous operating layer"
            body="Products are no longer separate islands. They inherit one reusable public and product system."
          />
          <div className="mt-14">
            <PublicComparison rows={comparisonRows} leftLabel="Traditional stack" rightLabel="AIOS" />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Product Explorer"
            title="Evaluate each product through the same interaction and content model"
            body="Product detail presentation now follows one reusable system for benefits, outcomes, and use cases."
          />
          <div className="mt-14">
            <PublicTabbedPanel
              items={products.map((item) => ({
                key: item.key,
                label: item.title,
                title: `${item.title} · ${item.roi}`,
                body: `${item.pricingTeaser}. ${item.outcomes.join(" · ")}`,
                bullets: [...item.benefits.slice(0, 2), ...item.useCases.slice(0, 2)],
                icon: item.icon,
              }))}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Why It Compounds"
            title="Products improve because the system underneath is shared"
            body="Shared memory, role context, and governed execution make every AIOS product stronger together than apart."
          />
          <div className="mt-14">
            <PublicFeatureGrid
              items={[
                { title: "Revenue intelligence", body: "Forecast and opportunity interventions with context-rich reasoning.", icon: ChartNoAxesCombined },
                { title: "Customer continuity", body: "Journey, churn, and expansion signals stay connected to enterprise context.", icon: Users },
                { title: "Executive clarity", body: "Decision narratives and briefings align product surfaces with leadership needs.", icon: Building2 },
                { title: "Business memory", body: "Institutional memory compounds insight quality across every product.", icon: Database },
                { title: "Workflow governance", body: "Autonomous execution stays policy-aware and measurable.", icon: Workflow },
                { title: "Knowledge graph", body: "Recommendations are grounded in linked context and explainability.", icon: Network },
                { title: "Advanced intelligence", body: "Scenario reasoning and confidence calibration improve recommendation precision.", icon: BrainCircuit },
              ]}
              columns={4}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicBenefitsOutcomesSection
        title="Commercial confidence from pilot to enterprise"
        body="AIOS product strategy is built for measurable impact and responsible scale."
        benefits={productBenefits}
        outcomes={productOutcomes}
      />

      <PublicRoiCalculatorSection />

      <PublicIntelligenceCapacitySection />

      <PublicPilotProgramSection />

      <PublicEnterpriseTrustMatrixSection />

      <PublicExecutiveRoleSection />

      <PublicCompetitorComparisonSection />

      <PublicSocialProofSection />

      <PublicBuyerJourneySection />

      <PublicTrustAndProofSection
        title="Social proof and pilot readiness"
        body="Reusable trust sections are now available across public routes for customer stories, partner logos, and future case studies."
        quote="AIOS gave us a realistic path from pilot outcomes to enterprise rollout with clear value checkpoints."
        person="VP Strategy, Enterprise Pilot"
        role="Global B2B Technology"
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Product Walkthrough"
        title="See which AIOS products fit your operating model"
        body="Explore the product stack with one consistent system that scales from revenue and customer intelligence to executive decision orchestration."
      />
    </PublicPageShell>
  )
}
