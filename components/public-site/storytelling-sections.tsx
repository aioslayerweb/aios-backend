"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  Briefcase,
  Calculator,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Factory,
  Gauge,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicCard,
  PublicContainer,
  PublicFeatureGrid,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import { createPublicStructuredData } from "@/components/public-site/public-structured-data"

export type StoryCardItem = {
  title: string
  body: string
  icon?: ReactNode
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
}: {
  title: string
  body: string
  benefits: StoryCardItem[]
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader eyebrow="Benefits" title={title} body={body} />
        <div className="mt-14">
          <PublicFeatureGrid items={benefits} columns={3} />
          <p className="mt-6 max-w-3xl border-l-2 border-[color:var(--public-color-primary)] pl-4 text-sm leading-6 text-[color:var(--public-color-text-muted)]">
            These are intended product outcomes, not measured customer results. AIOS does not publish verified performance figures in this section.
          </p>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicTrustAndProofSection({
  title,
  body,
}: {
  title: string
  body: string
  quote?: string
  person?: string
  role?: string
  logos?: string[]
}) {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader eyebrow="Enterprise Trust" title={title} body={body} />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <ShieldCheck size={18} />
            </span>
            <h3 className="public-h4">Security and governance</h3>
            <p className="public-body mt-3">Access permissions and approval policies should remain explicit in any AI-assisted operating model.</p>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <TrendingUp size={18} />
            </span>
            <h3 className="public-h4">Measurable outcomes</h3>
            <p className="public-body mt-3">Business impact should be evaluated with evidence and measured outcomes, not assumed from a recommendation.</p>
          </PublicCard>
          <PublicCard variant="feature" hover>
            <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
              <Sparkles size={18} />
            </span>
            <h3 className="public-h4">Executive-ready clarity</h3>
            <p className="public-body mt-3">The AIOS product model is designed to make observations, evidence, reasoning, and suggested next steps legible.</p>
          </PublicCard>
        </div>
        <p className="mt-8 border-t border-[color:var(--public-color-border)] pt-5 text-sm text-[color:var(--public-color-text-muted)]">
          No customer logos, endorsements, certifications, or independently verified performance results are presented here.
        </p>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicRoiCalculatorSection() {
  const [employees, setEmployees] = useState(50)
  const [hoursPerEmployee, setHoursPerEmployee] = useState(8)
  const [recoverableShare, setRecoverableShare] = useState(10)
  const [hourlyCost, setHourlyCost] = useState(62)

  const scenario = useMemo(() => {
    const hoursPerMonth = Math.round(employees * hoursPerEmployee * recoverableShare / 100)
    const annualCapacityValue = hoursPerMonth * hourlyCost * 12
    return { hoursPerMonth, annualCapacityValue }
  }, [employees, hoursPerEmployee, hourlyCost, recoverableShare])

  const euroFormatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Illustrative scenario"
          title="Explore the value of time reclaimed"
          body="Adjust the inputs to see a simple scenario based only on your assumptions. This is not an AIOS performance forecast or a promise of savings."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <PublicCard variant="floating" className="space-y-5">
            <RoiInput label="People in scope" value={employees} setValue={setEmployees} min={1} max={5000} step={1} />
            <RoiInput label="Hours of repeatable work per person / month" value={hoursPerEmployee} setValue={setHoursPerEmployee} min={1} max={80} step={1} />
            <RoiInput label="Assumed share of time reclaimed (%)" value={recoverableShare} setValue={setRecoverableShare} min={0} max={50} step={1} />
            <RoiInput label="Illustrative hourly cost (EUR)" value={hourlyCost} setValue={setHourlyCost} min={10} max={500} step={1} />
          </PublicCard>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <RoiStat title="Potential time capacity / month" value={`${scenario.hoursPerMonth.toLocaleString()} hours`} detail={`${employees.toLocaleString()} people × ${hoursPerEmployee} hours × ${recoverableShare}% assumed share.`} />
            <RoiStat title="Equivalent annual capacity value" value={euroFormatter.format(scenario.annualCapacityValue)} detail={`Calculated as monthly hours × ${euroFormatter.format(hourlyCost)} hourly cost × 12. This is not a cost-saving estimate.`} />
            <p className="public-small sm:col-span-2 lg:col-span-1">
              No inputs are sent to AIOS by this calculator. Actual outcomes depend on the business process, implementation, and measured results.
            </p>
          </div>
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
    </PublicCard>
  )
}

const trustControls = [
  { title: "Security", body: "Review the controls required for the intended data, model, and runtime boundaries.", icon: <ShieldCheck size={18} /> },
  { title: "RBAC", body: "Role-based access control determines which resources a person may access.", icon: <UserCheck size={18} /> },
  { title: "Role-Based Intelligence", body: "Role context can prioritize information without changing access permissions.", icon: <Briefcase size={18} /> },
  { title: "Data privacy", body: "Data use and retention requirements should be defined for each deployment.", icon: <Lock size={18} /> },
  { title: "Human approval", body: "Approval steps should be configured for actions that require human review.", icon: <ClipboardCheck size={18} /> },
  { title: "Traceability", body: "Keep recommendations, decisions, and outcomes linked where the system supports it.", icon: <Scale size={18} /> },
  { title: "Governance", body: "Define ownership, policies, and accountability before enabling execution.", icon: <Layers size={18} /> },
  { title: "Compliance alignment", body: "Assess applicable obligations with the organization's compliance owners.", icon: <CheckCircle2 size={18} /> },
  { title: "Business APIs", body: "Connect product capabilities through documented interfaces where available.", icon: <Workflow size={18} /> },
  { title: "Scalability", body: "Assess signal volumes and organizational complexity during implementation planning.", icon: <Factory size={18} /> },
  { title: "AI oversight", body: "Review reasoning, confidence, and escalation requirements for each use case.", icon: <Cpu size={18} /> },
  { title: "Decision support", body: "Recommendations should connect observations, evidence, and proposed next steps.", icon: <Gauge size={18} /> },
]

export function PublicEnterpriseTrustMatrixSection() {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Trust principles"
          title="Keep access, decisions, and execution governed"
          body="These principles describe the intended operating model. They are not a claim of certification or a statement that every control is enabled in every deployment."
        />
        <div className="mt-14">
          <PublicFeatureGrid items={trustControls} columns={4} />
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicIntelligenceCapacitySection() {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Commercial fit"
          title="Scope depends on your operating context"
          body="AIOS does not publish standard capacity estimates or pricing here. A conversation should establish the use case, systems in scope, governance requirements, and deployment needs."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Business context", "Clarify which decisions or processes are in scope."],
            ["Systems and data", "Identify relevant sources and access requirements."],
            ["Governance", "Agree permissions, approvals, and success measures."],
          ].map(([title, body]) => (
            <PublicCard key={title} variant="feature">
              <h3 className="public-h4">{title}</h3>
              <p className="public-body mt-3">{body}</p>
            </PublicCard>
          ))}
        </div>
        <div className="mt-8">
          <PublicButtonLink href="/pilot">Review pilot approach</PublicButtonLink>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicPilotProgramSection() {
  const planningTopics = [
    ["Use case", "Clarify the business question and decision owners."],
    ["Context and controls", "Review relevant sources, access boundaries, and approval needs."],
    ["Evidence of value", "Agree what should be measured and how outcomes will be assessed."],
  ]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Pilot Program"
          title="Plan a pilot around a real business decision"
          body="Pilot scope, timing, and deliverables should be agreed during discovery; no fixed schedule or result is promised here."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {planningTopics.map(([title, body]) => (
            <PublicCard key={title} variant="feature">
              <h3 className="public-h4">{title}</h3>
              <p className="public-body mt-3">{body}</p>
            </PublicCard>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <PublicButtonLink href="/pilot/discovery" size="lg">Explore business discovery</PublicButtonLink>
          <PublicButtonLink href="/pilot" variant="secondary" size="lg">Review pilot overview</PublicButtonLink>
        </div>
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicSocialProofSection() {
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Evidence"
          title="Claims should be supported by evidence"
          body="No customer testimonials, partner endorsements, certifications, or measured outcome claims are presented here without verification."
        />
      </PublicContainer>
    </PublicSection>
  )
}

export function PublicCompetitorComparisonSection() {
  const rows = [
    ["Information traceability", "Can observations be linked to evidence and sources?"],
    ["Access boundaries", "Are identity, membership, and permissions enforced server-side?"],
    ["Human oversight", "Which actions require review or approval?"],
    ["Memory and retention", "How is business context stored, scoped, updated, and deleted?"],
    ["Outcome measurement", "What result should be measured, and how will it be verified?"],
    ["Runtime availability", "Which capabilities are live, staged, or illustrative?"],
  ]

  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Evaluation guide"
          title="Questions for evaluating an AI operating model"
          body="Use these questions to assess a proposed system. They are not a comparison of independently verified products or evidence that a capability is deployed."
        />
        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-0 overflow-hidden rounded-[22px] border border-[var(--public-color-border)] bg-white">
            <thead>
              <tr>
                {["Evaluation area", "Question to verify"].map((head) => (
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
  const steps = [
    { label: "Platform", href: "/platform" },
    { label: "Architecture", href: "/architecture" },
    { label: "Modules", href: "/modules" },
    { label: "Security", href: "/security" },
    { label: "Pilot", href: "/pilot" },
    { label: "Business Discovery", href: "/pilot/discovery" },
  ]
  return (
    <PublicSection>
      <PublicContainer>
        <PublicSectionHeader
          eyebrow="Explore AIOS"
          title="A practical path through the product"
          body="Review the operating model, technical architecture, modules, and governance before discussing fit."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <Link key={item.href} href={item.href} className="public-card public-card-standard p-5 font-semibold text-[color:var(--public-color-navy)] transition hover:border-[color:var(--public-color-primary)]">
              <span>{item.label}</span>
              <ArrowRight aria-hidden="true" className="ml-2 inline" size={15} />
            </Link>
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
            eyebrow="Continue exploring"
            title="Choose a useful next step"
            body="Explore a synthetic product walkthrough, review the architecture, or use the local business-discovery preview."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo-platform/executive">Explore the demo</PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary">Review architecture</PublicButtonLink>
            <PublicButtonLink href="/pilot/discovery" variant="secondary">Explore business discovery</PublicButtonLink>
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
  const { pageData, breadcrumbData } = createPublicStructuredData({ name, description, path })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData) }} />
      {breadcrumbData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} /> : null}
    </>
  )
}
