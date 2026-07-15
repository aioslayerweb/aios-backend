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

export default function UniversePageClient() {
  return (
    <PublicPageShell activeHref="/universe">
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

      <PublicFooterCta
        eyebrow="See The Universe In Context"
        title="Map your enterprise onto one connected AI operating model"
        body="AIOS unifies modules, memory, intelligence, and execution into one coherent system that scales across future pages and product surfaces alike."
      />
    </PublicPageShell>
  )
}
