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

export default function ProductsPage() {
  return (
    <PublicPageShell activeHref="/products">
      <PublicHero
        eyebrow="AIOS Products"
        title="Enterprise products built on one intelligence operating system"
        body="Every product package in AIOS inherits the same memory model, governance layer, design system, and operating logic."
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
          { label: "Product lines", value: `${products.length}`, detail: "Role-specific value on one shared platform" },
          { label: "Decision lift", value: "40%", detail: "Faster strategic decisions in Executive Center" },
          { label: "Efficiency gain", value: "35%", detail: "Workflow and operations acceleration" },
        ]}
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

      <PublicFooterCta
        eyebrow="Product Walkthrough"
        title="See which AIOS products fit your operating model"
        body="Explore the product stack with one consistent system that scales from revenue and customer intelligence to executive decision orchestration."
      />
    </PublicPageShell>
  )
}
