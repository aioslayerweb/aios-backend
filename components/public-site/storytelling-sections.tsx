"use client"

import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Briefcase,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Cpu,
  Database,
  Factory,
  Gauge,
  Handshake,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicCard,
  PublicContainer,
  PublicFeatureGrid,
  PublicLogoMarquee,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"

export type StoryCardItem = {
  title: string
  body: string
  icon?: LucideIcon
}

export type StoryStep = {
  label: string
  title: string
  body: string
}

export function PublicProblemSolutionSection({
  problemTitle,
  problemBody,
  problemItems,
  solutionTitle,
  solutionBody,
  solutionItems,
}: {
  problemTitle: string
  problemBody: string
  problemItems: StoryCardItem[]
  solutionTitle: string
  solutionBody: string
  solutionItems: StoryCardItem[]
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <PublicSectionHeader eyebrow="Problem" title={problemTitle} body={problemBody} />
            <div className="mt-10">
              <PublicFeatureGrid items={problemItems} columns={2} />
            </div>
          </div>
          <div>
            <PublicSectionHeader eyebrow="Solution" title={solutionTitle} body={solutionBody} />
            <div className="mt-10">
              <PublicFeatureGrid items={solutionItems} columns={2} />
            </div>
          </div>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicHowItWorksSection({
  title,
  body,
  steps,
}: {
  title: string
  body: string
  steps: StoryStep[]
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader eyebrow="How AIOS Works" title={title} body={body} />
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <PublicCard key={step.title} variant="standard" hover className="h-full">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--public-color-primary)] text-sm font-semibold text-white">
                {index + 1}
              </div>
              <p className="public-caption text-[color:var(--public-color-primary)]">{step.label}</p>
              <h3 className="public-h4 mt-3">{step.title}</h3>
              <p className="public-body mt-3">{step.body}</p>
            </PublicCard>
          ))}
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicBenefitsOutcomesSection({
  title,
  body,
  benefits,
  outcomes,
}: {
  title: string
  body: string
  benefits: StoryCardItem[]
  outcomes: Array<{ label: string; value: string; detail: string }>
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader eyebrow="Benefits" title={title} body={body} />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PublicFeatureGrid items={benefits} columns={3} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {outcomes.map((item) => (
              <PublicCard key={item.label} variant="kpi" hover>
                <p className="public-caption text-[color:var(--public-color-text-soft)]">{item.label}</p>
                <p className="public-h3 mt-3">{item.value}</p>
                <p className="public-small mt-3">{item.detail}</p>
              </PublicCard>
            ))}
          </div>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

const defaultTrustLogos = [
  "Global Manufacturing Group",
  "Northwind Logistics",
  "Atlas Financial",
  "Crescent Health",
  "Orion Retail",
  "Apex Infrastructure",
]

export function PublicTrustAndProofSection({
  title,
  body,
  quote,
  person,
  role,
  logos = defaultTrustLogos,
}: {
  title: string
  body: string
  quote: string
  person: string
  role: string
  logos?: string[]
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader eyebrow="Enterprise Trust" title={title} body={body} />
        <div className="mt-12">
          <PublicLogoMarquee items={logos} />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <ShieldCheck size={18} />
            </span>
            <h3 className="public-h4">Security and governance</h3>
            <p className="public-body mt-3">Policy-aware controls, RBAC, and traceable decision evidence are built in.</p>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <TrendingUp size={18} />
            </span>
            <h3 className="public-h4">Measurable outcomes</h3>
            <p className="public-body mt-3">Every recommendation includes expected business impact and post-action learning.</p>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <Sparkles size={18} />
            </span>
            <h3 className="public-h4">Executive-ready clarity</h3>
            <p className="public-body mt-3">AIOS explains what changed, why it matters, and what to do next.</p>
          </PublicCard>
        </div>
        <PublicCard variant="floating" className="mt-8">
          <p className="public-body-lg">&quot;{quote}&quot;</p>
          <p className="public-small mt-4">{person}</p>
          <p className="public-caption mt-1">{role}</p>
        </PublicCard>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicRoiCalculatorSection() {
  const reduceMotion = useReducedMotion()
  const [employees, setEmployees] = useState(450)
  const [departments, setDepartments] = useState(8)
  const [revenue, setRevenue] = useState(12000000)
  const [opportunities, setOpportunities] = useState(420)
  const [customers, setCustomers] = useState(900)
  const [tickets, setTickets] = useState(1800)
  const [hours, setHours] = useState(1200)
  const [meetings, setMeetings] = useState(80)
  const [hourlyCost, setHourlyCost] = useState(62)
  const [hasTrackedUse, setHasTrackedUse] = useState(false)

  const metrics = useMemo(() => {
    const hoursSavedMonthly = Math.round(hours * 0.33 + meetings * 0.9 + departments * 6)
    const annualHoursSaved = hoursSavedMonthly * 12
    const costReduction = Math.round(annualHoursSaved * hourlyCost * 0.76)
    const opportunitiesRecovered = Math.round(opportunities * 0.11)
    const annualValue = Math.round(revenue * 0.012 + opportunitiesRecovered * 6800 + costReduction)
    const productivityIncrease = Math.min(48, Math.round((hoursSavedMonthly / Math.max(hours, 1)) * 100))
    const pilotCost = 180000
    const paybackMonths = Math.max(2, Math.round((pilotCost / Math.max(annualValue / 12, 1)) * 10) / 10)
    const roiPercentage = Math.max(10, Math.round(((annualValue - pilotCost) / pilotCost) * 100))
    const intelligenceCapacity = Math.round(
      employees * 22 +
      departments * 120 +
      customers * 1.8 +
      opportunities * 18 +
      tickets * 0.9,
    )

    return {
      annualHoursSaved,
      hoursSavedMonthly,
      opportunitiesRecovered,
      costReduction,
      annualValue,
      productivityIncrease,
      paybackMonths,
      roiPercentage,
      intelligenceCapacity,
      confidence: Math.min(97, 81 + Math.round(customers / 1800)),
    }
  }, [customers, departments, employees, hourlyCost, hours, meetings, opportunities, revenue, tickets])

  function markRoiUsage(field: string) {
    if (hasTrackedUse) {
      return
    }

    setHasTrackedUse(true)
    window.aiosTrackEvent?.("roi_calculator_use", { field })
  }

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="ROI Experience"
          title="Estimate enterprise value with the AIOS Pilot model"
          body="Configure team and business inputs to estimate time savings, recovered opportunities, and payback period."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <PublicCard variant="floating" className="space-y-4">
            <RoiInput label="Employees" value={employees} setValue={(value) => { markRoiUsage("employees"); setEmployees(value) }} min={25} max={10000} step={25} />
            <RoiInput label="Departments" value={departments} setValue={(value) => { markRoiUsage("departments"); setDepartments(value) }} min={2} max={60} step={1} />
            <RoiInput label="Revenue (annual EUR)" value={revenue} setValue={(value) => { markRoiUsage("revenue"); setRevenue(value) }} min={1000000} max={500000000} step={500000} />
            <RoiInput label="Customer count" value={customers} setValue={(value) => { markRoiUsage("customers"); setCustomers(value) }} min={100} max={200000} step={100} />
            <RoiInput label="Monthly opportunities" value={opportunities} setValue={(value) => { markRoiUsage("opportunities"); setOpportunities(value) }} min={20} max={24000} step={20} />
            <RoiInput label="Support tickets (annual)" value={tickets} setValue={(value) => { markRoiUsage("tickets"); setTickets(value) }} min={120} max={300000} step={50} />
            <RoiInput label="Hours lost to manual work / month" value={hours} setValue={(value) => { markRoiUsage("hours"); setHours(value) }} min={80} max={20000} step={20} />
            <RoiInput label="Meetings per week" value={meetings} setValue={(value) => { markRoiUsage("meetings"); setMeetings(value) }} min={8} max={400} step={1} />
            <RoiInput label="Average hourly employee cost (EUR)" value={hourlyCost} setValue={(value) => { markRoiUsage("hourly_cost"); setHourlyCost(value) }} min={20} max={320} step={1} />
          </PublicCard>

          <motion.div
            key={`${metrics.annualValue}-${metrics.roiPercentage}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0.84, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.34 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            <RoiStat title="Hours saved" value={`${metrics.hoursSavedMonthly.toLocaleString()} hrs/mo`} detail={`${metrics.annualHoursSaved.toLocaleString()} hours annually.`} />
            <RoiStat title="Cost reduction" value={`€${metrics.costReduction.toLocaleString()}`} detail="Lower manual operations and faster routing." />
            <RoiStat title="Recovered opportunities" value={`${metrics.opportunitiesRecovered.toLocaleString()} / year`} detail="Recovered with earlier risk and priority detection." />
            <RoiStat title="Estimated annual value" value={`€${metrics.annualValue.toLocaleString()}`} detail="Combined operational and commercial impact." />
            <RoiStat title="Productivity increase" value={`${metrics.productivityIncrease}%`} detail="Cross-functional productivity improvement estimate." />
            <RoiStat title="Payback period" value={`${metrics.paybackMonths} months`} detail={`Confidence model: ${metrics.confidence}%`} />
            <RoiStat title="ROI percentage" value={`${metrics.roiPercentage}%`} detail="Estimated first-year return on pilot investment." />
            <RoiStat title="Intelligence capacity" value={`${metrics.intelligenceCapacity.toLocaleString()} ICU`} detail="Potential capacity requirement for pilot sizing." />
          </motion.div>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

function RoiInput({
  label,
  value,
  setValue,
  min,
  max,
  step,
}: {
  label: string
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  step: number
}) {
  return (
    <label className="block text-sm font-medium text-[color:var(--public-color-text)]">
      <span>{label}</span>
      <div className="mt-2 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="public-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-label={label}
        />
        <span className="public-chip w-full justify-start sm:min-w-[120px] sm:w-auto sm:justify-end" aria-live="polite">
          {value.toLocaleString()}
        </span>
      </div>
    </label>
  )
}

function RoiStat({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <PublicCard variant="kpi" hover>
      <span className="mb-4 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
        <Calculator size={18} />
      </span>
      <p className="public-caption text-[color:var(--public-color-text-soft)]">{title}</p>
      <p className="public-h3 mt-3">{value}</p>
      <p className="public-small mt-2">{detail}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--public-color-primary)]">
        <CheckCircle2 size={15} /> Pilot-ready estimate
      </p>
    </PublicCard>
  )
}

const trustControls = [
  { title: "Enterprise Security", body: "Defense-in-depth controls for data, model operations, and runtime boundaries.", icon: ShieldCheck },
  { title: "RBAC", body: "Role-aware access controls aligned to enterprise operating structures.", icon: UserCheck },
  { title: "Role-Based Intelligence", body: "Intelligence context is tailored by role while system logic stays unified.", icon: Briefcase },
  { title: "Data Privacy", body: "Policy controls and data boundaries designed for enterprise privacy standards.", icon: Lock },
  { title: "Human Approval", body: "Critical actions route through explicit approvals before execution.", icon: ClipboardCheck },
  { title: "Audit Trail", body: "Recommendations, decisions, and actions are fully traceable.", icon: Scale },
  { title: "Governance", body: "Governed execution with explainability and accountability built in.", icon: Layers },
  { title: "Compliance Ready", body: "Architecture patterns designed to align with compliance workflows.", icon: CheckCircle2 },
  { title: "API First", body: "Business capability APIs accelerate integration and enterprise interoperability.", icon: Workflow },
  { title: "Scalable Architecture", body: "Designed for increasing signal volumes and organizational complexity.", icon: Factory },
  { title: "Enterprise-grade AI", body: "AI operators work with memory, policy, and confidence calibration.", icon: Cpu },
  { title: "Decision Support", body: "Executive-grade recommendations connected to outcomes and evidence.", icon: Gauge },
]

export function PublicEnterpriseTrustMatrixSection() {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Why Trust AIOS"
          title="Enterprise trust controls built into the operating system"
          body="AIOS is engineered for enterprise-grade reliability, governance, and human control from day one."
        />
        <div className="mt-14">
          <PublicFeatureGrid items={trustControls} columns={4} />
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicIntelligenceCapacitySection() {
  const [dataPoints, setDataPoints] = useState(240000)
  const [monthlyConsumption, setMonthlyConsumption] = useState(68)
  const [activePlan, setActivePlan] = useState<"pilot" | "growth" | "enterprise">("pilot")

  const plans = useMemo(() => {
    const capacityNeed = Math.round(dataPoints * (0.6 + monthlyConsumption / 100))
    const base = [
      { key: "pilot" as const, title: "Pilot Plan", range: "Up to 180k ICU", price: "€15k-€25k / month", fit: "Focused discovery + first production workflows" },
      { key: "growth" as const, title: "Growth Plan", range: "180k-750k ICU", price: "€30k-€75k / month", fit: "Multi-department scale and broader automation" },
      { key: "enterprise" as const, title: "Enterprise Plan", range: "750k+ ICU", price: "Custom commercial model", fit: "Global operations, advanced governance, and high-volume orchestration" },
    ]

    return { capacityNeed, base }
  }, [dataPoints, monthlyConsumption])

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Intelligence Capacity"
          title="Interactive pricing and capacity planning"
          body="Estimate capacity requirements and compare pilot, growth, and enterprise plans based on your operating scale."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <PublicCard variant="floating" className="space-y-4">
            <RoiInput label="Data points / month" value={dataPoints} setValue={setDataPoints} min={20000} max={2000000} step={10000} />
            <RoiInput label="Monthly intelligence consumption (%)" value={monthlyConsumption} setValue={setMonthlyConsumption} min={15} max={100} step={1} />
            <PublicCard variant="kpi" className="mt-4">
              <p className="public-caption text-[color:var(--public-color-text-soft)]">Estimated capacity need</p>
              <p className="public-h3 mt-3">{plans.capacityNeed.toLocaleString()} ICU</p>
              <p className="public-small mt-2">Capacity based on expected data throughput and active intelligence consumption.</p>
            </PublicCard>
          </PublicCard>

          <div className="grid gap-4">
            {plans.base.map((plan) => (
              <button
                key={plan.key}
                type="button"
                onClick={() => {
                  setActivePlan(plan.key)
                  window.aiosTrackEvent?.("pricing_plan_select", { plan: plan.key })
                }}
                className="text-left"
                aria-pressed={activePlan === plan.key}
              >
                <PublicCard variant="feature" hover className={activePlan === plan.key ? "border-[color:var(--public-color-primary)]" : ""}>
                  <p className="public-caption text-[color:var(--public-color-primary)]">{plan.title}</p>
                  <h3 className="public-h4 mt-2">{plan.range}</h3>
                  <p className="public-body mt-3">{plan.fit}</p>
                  <p className="public-small mt-4">Commercial model: {plan.price}</p>
                </PublicCard>
              </button>
            ))}
          </div>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicPilotProgramSection() {
  const qualifications = [
    "Multi-team operating complexity",
    "Clear executive sponsor",
    "Willingness to instrument outcomes",
    "Cross-system signal access",
  ]
  const timeline = ["Week 1-2 Discovery", "Week 3-4 Integration", "Week 5-8 Operator + Workflow Activation", "Week 9-12 Outcome Review + Scale Plan"]
  const deliverables = ["Pilot architecture map", "Role-based intelligence setup", "Workflow automation blueprint", "Executive outcomes report"]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Pilot Program"
          title="Start with a structured enterprise pilot"
          body="AIOS pilots are designed for measurable business outcomes, executive alignment, and clear scale pathways."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <PublicCard variant="feature" hover>
            <p className="public-eyebrow">Who Qualifies</p>
            <div className="mt-4 space-y-3">
              {qualifications.map((item) => (
                <p key={item} className="public-body">• {item}</p>
              ))}
            </div>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <p className="public-eyebrow">Timeline</p>
            <div className="mt-4 space-y-3">
              {timeline.map((item) => (
                <p key={item} className="public-body">• {item}</p>
              ))}
            </div>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <p className="public-eyebrow">Deliverables + Success Metrics</p>
            <div className="mt-4 space-y-3">
              {deliverables.map((item) => (
                <p key={item} className="public-body">• {item}</p>
              ))}
            </div>
          </PublicCard>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <PublicButtonLink href="/contact" size="lg">Book Pilot</PublicButtonLink>
          <PublicButtonLink href="/contact" variant="secondary" size="lg">Schedule Discovery</PublicButtonLink>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicSocialProofSection() {
  const proof = [
    { title: "Pilot Customers", body: "Reusable section ready for pilot customer profiles and quantified outcomes.", icon: Handshake },
    { title: "Future Testimonials", body: "Structured quote cards designed for executive and operator voices.", icon: Users },
    { title: "Case Studies", body: "Case-study cards for operations, revenue, finance, and customer continuity narratives.", icon: Briefcase },
    { title: "Technology Partners", body: "Partner ecosystem surfaces for integrations and co-delivery narratives.", icon: Database },
    { title: "Advisory Board", body: "Advisory and strategic operator profiles to reinforce category credibility.", icon: CircleDollarSign },
    { title: "Customer Quotes", body: "High-trust quote rail designed for enterprise proof-point storytelling.", icon: Sparkles },
  ]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Social Proof"
          title="Evidence sections built for commercial conversations"
          body="AIOS now includes reusable proof modules for pilots, partner trust, testimonials, and case-study storytelling."
        />
        <div className="mt-14">
          <PublicFeatureGrid items={proof} columns={3} />
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicCompetitorComparisonSection() {
  const rows = [
    ["Core model", "AI Operating System", "Point applications", "Prompt assistance", "Task triggers", "Document retrieval", "Historical reporting"],
    ["Business memory", "Persistent and compounding", "Siloed per tool", "Session-level", "Minimal", "Limited", "None"],
    ["Governance", "Policy + human approval", "Varies", "Limited", "Rule-only", "Limited", "N/A"],
    ["Decision support", "Executive-grade with confidence", "Operational only", "Partial", "No", "No", "Descriptive only"],
    ["Role intelligence", "Native RBI", "Manual configuration", "Generic", "Generic", "Generic", "Static dashboards"],
  ]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Comparison"
          title="Why AIOS is different"
          body="AIOS unifies intelligence, memory, governance, and workflow execution in one enterprise operating layer."
        />
        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 overflow-hidden rounded-[22px] border border-[var(--public-color-border)] bg-white">
            <thead>
              <tr>
                {["Category", "AIOS", "Traditional SaaS", "Copilots", "Automation Platforms", "Knowledge Bases", "BI Tools"].map((head) => (
                  <th key={head} className="border-b border-[var(--public-color-border)] px-4 py-4 text-left text-sm font-semibold text-[color:var(--public-color-navy)]">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, idx) => (
                    <td key={`${row[0]}-${idx}`} className="border-b border-[var(--public-color-border)] px-4 py-3 text-sm text-[color:var(--public-color-text)]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicExecutiveRoleSection() {
  const roles = [
    { title: "CEO", body: "Strategic clarity, decision velocity, and company-level risk awareness." },
    { title: "COO", body: "Operational throughput, workflow reliability, and execution accountability." },
    { title: "CFO", body: "Capital efficiency, cost reduction visibility, and value realization." },
    { title: "CIO", body: "Enterprise architecture alignment and scalable intelligence governance." },
    { title: "CTO", body: "API-first integration strategy and secure runtime orchestration." },
    { title: "Operations", body: "Cross-team coordination and bottleneck elimination with confidence." },
    { title: "Sales", body: "Pipeline quality, opportunity recovery, and forecast confidence." },
    { title: "HR", body: "Capability planning, workforce insights, and decision-ready people intelligence." },
  ]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Executive Content"
          title="Role-specific value across the enterprise"
          body="AIOS translates one operating system into role-relevant intelligence for every executive and business function."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <PublicCard key={role.title} variant="feature" hover>
              <p className="public-caption text-[color:var(--public-color-primary)]">For {role.title}</p>
              <h3 className="public-h4 mt-2">{role.title} Value</h3>
              <p className="public-body mt-3">{role.body}</p>
            </PublicCard>
          ))}
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicBuyerJourneySection() {
  const steps = ["Awareness", "Understanding", "Trust", "Evaluation", "ROI", "Pilot Program", "Demo Request"]
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Buyer Journey"
          title="A clear path from first visit to pilot activation"
          body="Every page now supports one progression: understand AIOS, evaluate fit, estimate value, and start a pilot."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {steps.map((item, index) => (
            <PublicCard key={item} variant="kpi" hover>
              <p className="public-caption text-[color:var(--public-color-primary)]">Step {index + 1}</p>
              <p className="public-body mt-2 font-semibold text-[color:var(--public-color-navy)]">{item}</p>
            </PublicCard>
          ))}
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicConversionRailSection() {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicCard variant="floating" className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,249,252,0.96))]">
          <PublicSectionHeader
            eyebrow="Start Engagement"
            title="Choose your next step"
            body="Book a demo, join pilot, talk to sales, schedule discovery, download overview, or request pricing."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/contact">Book Demo</PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary">Join Pilot</PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary">Talk to Sales</PublicButtonLink>
            <PublicButtonLink href="/contact" variant="secondary">Schedule Discovery</PublicButtonLink>
            <PublicButtonLink href="/resources" variant="secondary">Download Overview</PublicButtonLink>
            <PublicButtonLink href="/products" variant="secondary">Request Pricing</PublicButtonLink>
          </div>
        </PublicCard>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicStructuredData({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  const websiteUrl = "https://aiospilot.com"
  const pageUrl = `${websiteUrl}${path}`
  const segments = path === "/" ? [] : path.split("/").filter(Boolean)

  const pageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "AIOS",
      url: websiteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AIOS",
      url: websiteUrl,
    },
  }

  const breadcrumbData = segments.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${websiteUrl}/` },
          ...segments.map((segment, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: segment.replace(/-/g, " ").replace(/\b\w/g, (value) => value.toUpperCase()),
            item: `${websiteUrl}/${segments.slice(0, index + 1).join("/")}`,
          })),
        ],
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData) }} />
      {breadcrumbData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} /> : null}
    </>
  )
}
