"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Database,
  GitBranch,
  Network,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react"
import { PublicPageShell } from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

const roles = [
  {
    id: "ceo",
    label: "CEO",
    focus: "Company direction",
    signal: "Two business priorities are moving in opposite directions.",
    context: "Compare the revenue opportunity with its delivery and customer impact.",
    recommendation: "Review the trade-off with the leaders responsible for both outcomes.",
  },
  {
    id: "cfo",
    label: "CFO",
    focus: "Financial exposure",
    signal: "A forecast assumption differs from the latest operating context.",
    context: "Trace the change to its source and compare it with approved planning assumptions.",
    recommendation: "Validate the variance before changing the forecast or reallocating spend.",
  },
  {
    id: "coo",
    label: "COO",
    focus: "Execution reliability",
    signal: "A recurring handoff is slowing a cross-team process.",
    context: "Review ownership, workflow dependencies, and the downstream customer impact.",
    recommendation: "Ask the process owner to assess a governed improvement.",
  },
  {
    id: "sales",
    label: "Sales",
    focus: "Revenue movement",
    signal: "An opportunity has not advanced after its last recorded milestone.",
    context: "Bring together account history, next steps, and related customer signals.",
    recommendation: "Confirm the next action with the account owner before updating the forecast.",
  },
] as const

const flow = [
  {
    label: "Signal",
    title: "Notice what changed",
    body: "A meaningful business event becomes a signal, rather than another item in an unprioritized feed.",
    icon: <Network size={18} />,
  },
  {
    label: "Context",
    title: "Connect it to what is known",
    body: "Relevant business memory and linked knowledge provide context for interpreting the signal.",
    icon: <Database size={18} />,
  },
  {
    label: "Reasoning",
    title: "Explain why it matters",
    body: "AIOS can frame the evidence, business impact, and uncertainty for the people involved.",
    icon: <BrainCircuit size={18} />,
  },
  {
    label: "Recommendation",
    title: "Prepare a decision",
    body: "A recommendation makes the observation, evidence, reasoning, confidence, and next step explicit.",
    icon: <GitBranch size={18} />,
  },
  {
    label: "Governance",
    title: "Keep the right control",
    body: "Access permissions remain separate from role-based prioritization. Policies determine whether an action needs approval.",
    icon: <ShieldCheck size={18} />,
  },
  {
    label: "Learning",
    title: "Record the outcome",
    body: "When an outcome is recorded, it can become part of business memory for future decisions.",
    icon: <Workflow size={18} />,
  },
] as const

const layers = [
  { number: "01", name: "Business systems", detail: "The tools where business events and records originate." },
  { number: "02", name: "Signals & memory", detail: "Events connected with relevant history, evidence, and knowledge." },
  { number: "03", name: "Intelligence", detail: "Context interpreted and prioritized for a role and decision." },
  { number: "04", name: "People & operators", detail: "Humans and specialized AI capabilities collaborate around the work." },
  { number: "05", name: "Governed execution", detail: "Approved workflows act within defined permissions and policies." },
  { number: "06", name: "Learning", detail: "Outcomes feed business memory and inform later reasoning." },
] as const

const modules = [
  { name: "Executive Center", description: "Priorities, decision context, and leadership views." },
  { name: "Command Center", description: "Cross-functional signals, tasks, and coordination." },
  { name: "Memory Center", description: "Business context, evidence, and outcomes over time." },
  { name: "Knowledge Center", description: "Relationships between entities, policies, and evidence." },
  { name: "Workflow Builder", description: "Governed paths from approved decisions to execution." },
  { name: "Agent Studio", description: "Specialized AI capabilities working with shared context." },
  { name: "Organization Center", description: "Roles, ownership, and organizational structure." },
  { name: "Runtime Center", description: "Execution controls, policy, and operational oversight." },
] as const

const memoryStages = [
  "Capture business signals",
  "Connect relevant context",
  "Build reusable knowledge",
  "Prepare explainable insight",
  "Support governed decisions",
  "Learn from recorded outcomes",
] as const

const operatorExamples = [
  { title: "Revenue", body: "Bring pipeline, account context, and next steps together." },
  { title: "Customer", body: "Connect service history, customer signals, and ownership." },
  { title: "Operations", body: "Surface process dependencies and handoff context." },
  { title: "Finance", body: "Relate financial signals to decisions and assumptions." },
  { title: "People", body: "Connect capability, workforce planning, and team context." },
] as const

const trustPrinciples = [
  { title: "Access control", body: "RBAC defines what a person is permitted to access." },
  { title: "Role context", body: "RBI prioritizes information without granting new permissions." },
  { title: "Human review", body: "A recommendation is not an action; approval depends on policy." },
  { title: "Explainability", body: "Observations, evidence, reasoning, and uncertainty should be clear." },
  { title: "Traceability", body: "Decisions and outcomes should remain connected to their context." },
  { title: "Learning loop", body: "Recorded outcomes can inform future business memory." },
] as const

const executiveRoles = [
  { title: "CEO", body: "Company direction, priorities, and cross-functional trade-offs." },
  { title: "COO", body: "Operational dependencies, handoffs, and execution context." },
  { title: "CFO", body: "Financial assumptions, resource decisions, and variance context." },
  { title: "CIO / CTO", body: "Architecture, system relationships, and governance requirements." },
] as const

export function PublicHomepageExperience() {
  const [activeRole, setActiveRole] = useState<(typeof roles)[number]["id"]>("ceo")
  const [activeStep, setActiveStep] = useState(0)
  const selectedRole = roles.find((role) => role.id === activeRole) ?? roles[0]
  const selectedStep = flow[activeStep]

  return (
    <PublicPageShell activeHref="/">
      <PublicStructuredData
        name="AIOS"
        description="AIOS is a business intelligence operating layer that connects signals, business memory, role-based intelligence, recommendations, and governed workflows."
        path="/"
      />

      <section className="public-home-hero">
        <div className="public-container-wide public-home-hero-content">
          <div className="public-home-eyebrow">
            <span aria-hidden="true" />
            AIOS Core · Business Intelligence Operating Layer
          </div>
          <h1 className="public-home-title">
            One intelligence layer.<br className="hidden sm:block" />
            One business memory.<br className="hidden sm:block" />
            <span>One operating system.</span>
          </h1>
          <p className="public-home-lede">
            AIOS is designed to connect business signals, memory, and decisions in one operating layer—helping teams understand what changed, why it matters, and what deserves review.
          </p>
          <div className="public-home-actions">
            <Link href="/demo-platform/executive" className="public-button public-button-primary public-home-primary">
              Explore the demo <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="/platform" className="public-button public-button-secondary public-home-platform-link">
              Explore platform <Network aria-hidden="true" size={17} />
            </Link>
          </div>

          <div className="public-home-capabilities" aria-label="AIOS operating concepts">
            <div><span>Business signals</span><strong>Information from across the business</strong></div>
            <div><span>Role context</span><strong>Priorities shaped around the decision-maker</strong></div>
            <div><span>Governed workflows</span><strong>People and policies remain in control</strong></div>
          </div>

          <div className="public-home-cockpit">
            <div className="public-home-cockpit-bar">
              <div className="public-home-cockpit-brand"><span aria-hidden="true" /><span>AIOS · OPERATING MODEL</span></div>
              <span className="public-home-cockpit-note">Illustrative product view · synthetic example</span>
            </div>
            <div className="public-home-cockpit-grid">
              <div className="public-home-cockpit-column">
                <span className="public-home-cockpit-label">Business context</span>
                <div className="public-home-cockpit-row"><Database aria-hidden="true" size={16} /><span>Business systems</span><small>Signals</small></div>
                <div className="public-home-cockpit-row"><Network aria-hidden="true" size={16} /><span>Knowledge & memory</span><small>Context</small></div>
                <div className="public-home-cockpit-row"><Users aria-hidden="true" size={16} /><span>People & roles</span><small>Access</small></div>
              </div>
              <div className="public-home-cockpit-core">
                <span className="public-home-cockpit-label">Intelligence layer</span>
                <div className="public-home-core-mark"><BrainCircuit aria-hidden="true" size={28} /></div>
                <strong>AIOS</strong>
                <p>Signals → context → decision support</p>
                <div className="public-home-cockpit-pills"><span>Evidence</span><span>Reasoning</span><span>Confidence</span></div>
              </div>
              <div className="public-home-cockpit-column">
                <span className="public-home-cockpit-label">Decision pathway</span>
                <div className="public-home-cockpit-row"><GitBranch aria-hidden="true" size={16} /><span>Suggested review</span><small>Human</small></div>
                <div className="public-home-cockpit-row"><ShieldCheck aria-hidden="true" size={16} /><span>Approval policy</span><small>Governance</small></div>
                <div className="public-home-cockpit-row"><Workflow aria-hidden="true" size={16} /><span>Outcome learning</span><small>Memory</small></div>
              </div>
            </div>
            <p className="public-home-cockpit-disclaimer">This illustration explains the AIOS product model. It is not a live connection, activity feed, or performance dashboard.</p>
          </div>
        </div>
      </section>

      <section id="why-aios" className="public-home-section public-home-problem">
        <div className="public-container-wide public-home-problem-grid">
          <div>
            <p className="public-eyebrow">Why another layer?</p>
            <h2 className="public-h2">The information exists. <span>The connected understanding often doesn’t.</span></h2>
          </div>
          <div className="public-home-problem-copy">
            <p>Important context is distributed across systems, teams, and time. People reconstruct the story by hand, then decide with only part of it in view.</p>
            <div className="public-home-fragment-list" aria-label="Common sources of business fragmentation">
              <span>Customer records</span><span>Financial plans</span><span>Team activity</span><span>Operational events</span>
            </div>
            <p className="public-home-emphasis">AIOS is designed to connect those signals with memory and decision context—before proposing what to do.</p>
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-flow-section" aria-labelledby="public-home-flow-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">From signal to learning</p>
              <h2 id="public-home-flow-title" className="public-h2">Make the reasoning visible.</h2>
            </div>
            <p>Business intelligence should explain its path from observation to recommendation. Explore the stages; this is an illustrative product model, not a live operation.</p>
          </div>
          <div className="public-home-flow">
            <div className="public-home-flow-list" role="tablist" aria-label="AIOS intelligence stages">
              {flow.map((step, index) => {
                return (
                  <button
                    key={step.label}
                    id={`home-flow-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={activeStep === index}
                    aria-controls="home-flow-panel"
                    tabIndex={activeStep === index ? 0 : -1}
                    onClick={() => setActiveStep(index)}
                    onKeyDown={(event) => {
                      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return
                      event.preventDefault()
                      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
                      const next = (activeStep + direction + flow.length) % flow.length
                      setActiveStep(next)
                      document.getElementById(`home-flow-tab-${next}`)?.focus()
                    }}
                    className="public-home-flow-button"
                  >
                    <span className="public-home-flow-index">{String(index + 1).padStart(2, "0")}</span>
                    {step.icon}
                    <span>{step.label}</span>
                    <ArrowRight aria-hidden="true" className="public-home-flow-arrow" size={14} />
                  </button>
                )
              })}
            </div>
            <div id="home-flow-panel" role="tabpanel" aria-labelledby={`home-flow-tab-${activeStep}`} className="public-home-flow-panel">
              <p className="public-eyebrow">{selectedStep.label}</p>
              <h3>{selectedStep.title}</h3>
              <p>{selectedStep.body}</p>
              <div className="public-home-flow-example">
                <span className="public-home-flow-example-label">Illustrative example</span>
                <span>{activeStep === 0 ? "A business event changes." : activeStep === 1 ? "Related history is brought into view." : activeStep === 2 ? "Evidence and uncertainty are made explicit." : activeStep === 3 ? "A person receives a reasoned next step." : activeStep === 4 ? "Permission and approval policy remain in control." : "The outcome can inform future context."}</span>
              </div>
              <p className="public-home-flow-disclaimer"><ShieldCheck aria-hidden="true" size={14} /> Recommendations are not actions. Execution depends on configured permission and approval policies.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-rbi-section" aria-labelledby="public-home-rbi-title">
        <div className="public-container-wide public-home-rbi-grid">
          <div className="public-home-rbi-intro">
            <p className="public-eyebrow">Role-Based Intelligence</p>
            <h2 id="public-home-rbi-title" className="public-h2">Same business. Different decisions to make.</h2>
            <p>RBAC defines what a person is permitted to access. RBI helps prioritize which accessible information matters to their role. Intelligence prioritization never grants access or changes permissions.</p>
            <div className="public-home-role-selector" role="group" aria-label="Choose a sample role">
              {roles.map((role) => (
                <button key={role.id} type="button" aria-pressed={activeRole === role.id} onClick={() => setActiveRole(role.id)}>{role.label}</button>
              ))}
            </div>
            <p className="public-home-note">All role scenarios below are synthetic examples.</p>
          </div>
          <div className="public-home-role-view" aria-live="polite">
            <div className="public-home-role-topline"><span>PRIORITY VIEW · SAMPLE</span><span>{selectedRole.label}</span></div>
            <h3>{selectedRole.focus}</h3>
            <div className="public-home-role-signal">
              <span className="public-home-role-step"><Network aria-hidden="true" size={15} /> Signal</span>
              <p>{selectedRole.signal}</p>
            </div>
            <div className="public-home-role-context">
              <span className="public-home-role-step"><Database aria-hidden="true" size={15} /> Evidence & context</span>
              <p>{selectedRole.context}</p>
            </div>
            <div className="public-home-role-recommendation">
              <span className="public-home-role-step"><BrainCircuit aria-hidden="true" size={15} /> Suggested review</span>
              <p>{selectedRole.recommendation}</p>
            </div>
            <p className="public-home-role-footnote"><Check aria-hidden="true" size={14} /> A recommendation for human review—not a completed action.</p>
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-layers-section" aria-labelledby="public-home-layers-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">One intelligence layer</p>
              <h2 id="public-home-layers-title" className="public-h2">A connected operating model, not another system of record.</h2>
            </div>
            <Link href="/platform" className="public-home-inline-link">Explore the platform <ArrowRight aria-hidden="true" size={15} /></Link>
          </div>
          <ol className="public-home-layer-list">
            {layers.map((layer) => (
              <li key={layer.number}>
                <span className="public-home-layer-number">{layer.number}</span>
                <strong>{layer.name}</strong>
                <span>{layer.detail}</span>
              </li>
            ))}
          </ol>
          <div className="public-home-definitions">
            <p><strong>Business memory</strong> connects events, decisions, evidence, and outcomes over time.</p>
            <p><strong>Role-Based Intelligence</strong> prioritizes relevant information within each person’s permitted access.</p>
            <p><strong>Governed workflows</strong> distinguish recommendations from actions and keep policy in control.</p>
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-benefits-section" aria-labelledby="public-home-benefits-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Why a connected layer</p>
              <h2 id="public-home-benefits-title" className="public-h2">Less reconstruction. More useful context.</h2>
            </div>
            <p>AIOS is designed to help teams move from fragmented information toward evidence-led decisions and governed follow-through.</p>
          </div>
          <div className="public-home-benefit-grid">
            <article><span>01 · SEE</span><h3>Bring the business into view</h3><p>Connect signals and relevant history so teams can understand what changed.</p></article>
            <article><span>02 · UNDERSTAND</span><h3>Explain why it matters</h3><p>Make evidence, business context, and uncertainty part of the recommendation.</p></article>
            <article><span>03 · ACT WITH CONTROL</span><h3>Keep decisions governed</h3><p>Separate decision support from execution, with people and policy in control.</p></article>
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-modules-section" aria-labelledby="public-home-modules-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Connected modules</p>
              <h2 id="public-home-modules-title" className="public-h2">Specialized views. One operating model.</h2>
            </div>
            <Link href="/modules" className="public-home-inline-link">Explore all modules <ArrowRight aria-hidden="true" size={15} /></Link>
          </div>
          <div className="public-home-module-grid">
            {modules.map((module, index) => (
              <article key={module.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{module.name}</h3>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-memory-section" aria-labelledby="public-home-memory-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Business memory</p>
              <h2 id="public-home-memory-title" className="public-h2">A learning loop that connects decisions to outcomes.</h2>
            </div>
            <p>Memory is useful when it preserves context and evidence—not just a record of activity.</p>
          </div>
          <ol className="public-home-memory-list">
            {memoryStages.map((stage, index) => (
              <li key={stage}>
                <span>{index + 1}</span>
                <strong>{stage}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="public-home-section public-home-operators-section" aria-labelledby="public-home-operators-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Specialized intelligence</p>
              <h2 id="public-home-operators-title" className="public-h2">Shared context across business functions.</h2>
            </div>
            <p>Illustrative areas of focus, not a claim that live operators or business integrations are active.</p>
          </div>
          <div className="public-home-operator-grid">
            {operatorExamples.map((operator) => (
              <article key={operator.title}>
                <span aria-hidden="true"><BrainCircuit size={18} /></span>
                <h3>{operator.title}</h3>
                <p>{operator.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-trust-section" aria-labelledby="public-home-trust-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Human control & trust</p>
              <h2 id="public-home-trust-title" className="public-h2">Intelligence should be useful, explainable, and governed.</h2>
            </div>
            <p>These are product principles, not claims of certification or proof of a particular deployment configuration.</p>
          </div>
          <div className="public-home-trust-grid">
            {trustPrinciples.map((principle) => (
              <article key={principle.title}>
                <ShieldCheck aria-hidden="true" size={19} />
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-home-section public-home-value-section" aria-labelledby="public-home-value-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Role-based perspective</p>
              <h2 id="public-home-value-title" className="public-h2">One business. Different questions to answer.</h2>
            </div>
            <p>Role-based intelligence can prioritize relevant context while RBAC continues to define access.</p>
          </div>
          <div className="public-home-value-grid">
            {executiveRoles.map((role) => (
              <article key={role.title}>
                <span>FOR {role.title}</span>
                <p>{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-home-cta">
        <div className="public-container-wide public-home-cta-inner">
          <div>
            <p className="public-eyebrow">Start with understanding</p>
            <h2>See how the pieces connect.</h2>
            <p>Explore the public demo or review the platform architecture—without connecting live business data.</p>
          </div>
          <div className="public-home-actions">
            <Link href="/demo-platform/executive" className="public-button public-button-primary">Explore the demo <ArrowRight aria-hidden="true" size={17} /></Link>
            <Link href="/architecture" className="public-home-secondary">Read the architecture <ArrowRight aria-hidden="true" size={15} /></Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
