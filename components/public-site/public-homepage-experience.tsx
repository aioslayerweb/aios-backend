import Link from "next/link"
import {
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react"
import { PublicPageShell } from "@/components/aios"
import {
  HomeCockpitIsland,
  HomeFlowIsland,
  HomeRoleIsland,
  HomeScenarioIsland,
} from "@/components/public-site/homepage-interactive-islands"
import { PublicStructuredData } from "@/components/public-site/public-structured-data-server"
import { SpatialNeuralCore } from "@/components/public-site/spatial-neural-core"

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
  { title: "Sales City", body: "Bring pipeline signals, account context, and next steps together." },
  { title: "Marketing City", body: "Connect campaign activity with customer and market context." },
  { title: "Customer Success", body: "Relate service history, customer signals, and ownership." },
  { title: "Finance City", body: "Review financial signals alongside decisions and assumptions." },
  { title: "Operations City", body: "Surface process dependencies and cross-team handoffs." },
  { title: "Product City", body: "Connect usage signals, customer intent, and roadmap context." },
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
  return (
    <PublicPageShell activeHref="/">
      <div className="public-home-spatial">
        <PublicStructuredData
          name="AIOS"
          description="AIOS is a business intelligence operating layer that connects signals, business memory, role-based intelligence, recommendations, and governed workflows."
          path="/"
        />

      <section className="public-home-hero public-home-spatial-hero">
        <div className="public-home-neural-scene" aria-hidden="true">
          <SpatialNeuralCore />
        </div>
        <div className="public-container-wide public-home-hero-content">
          <div className="public-home-hero-copy">
            <div className="public-home-eyebrow">
              <span aria-hidden="true" />
              Spatial Intelligence · Autonomous Business Core
            </div>
            <h1 className="public-home-title">
              The Autonomous Operating System for
              <br className="hidden sm:block" />{" "}
              <span>Modern Enterprise.</span>
            </h1>
            <p className="public-home-lede">
              Connect business signals, institutional memory, and AI operators in one explainable, governed surface.
            </p>
            <div className="public-home-actions">
              <Link href="#cockpit" className="public-button public-button-primary public-home-primary">
                <BrainCircuit aria-hidden="true" size={17} /> Launch Spatial Cockpit
              </Link>
              <Link href="/demo-platform/executive" prefetch={false} data-analytics-event="demo_click" className="public-button public-button-secondary public-home-platform-link">
                <ArrowRight aria-hidden="true" size={17} /> Experience Interactive Demo
              </Link>
            </div>
          </div>

          <div className="public-home-capabilities" aria-label="AIOS operating concepts">
            <div><span>01 · Signals</span><strong>Bring meaningful change into view</strong></div>
            <div><span>02 · Memory</span><strong>Connect decisions with context</strong></div>
            <div><span>03 · Intelligence</span><strong>Make evidence and reasoning visible</strong></div>
            <div><span>04 · Governance</span><strong>Keep people and policy in control</strong></div>
          </div>

        </div>
      </section>

      <nav className="public-home-spatial-nav" aria-label="Homepage sections">
        <a href="#cockpit">Executive cockpit</a>
        <a href="#matrix">How it works</a>
        <a href="#agents">Business functions</a>
        <a href="#roi-engine">Scenario planner</a>
        <a href="#trust">Governance</a>
      </nav>

      <HomeCockpitIsland />

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

      <HomeFlowIsland />

      <HomeRoleIsland />

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

      <section id="agents" className="public-home-section public-home-operators-section" aria-labelledby="public-home-operators-title">
        <div className="public-container-wide">
          <div className="public-home-section-heading">
            <div>
              <p className="public-eyebrow">Specialized intelligence</p>
              <h2 id="public-home-operators-title" className="public-h2">Six specialized hubs. Shared business context.</h2>
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

      <HomeScenarioIsland />

      <section id="trust" className="public-home-section public-home-trust-section" aria-labelledby="public-home-trust-title">
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

      <section id="activation" className="public-home-cta">
        <div className="public-container-wide public-home-cta-inner">
          <div>
            <p className="public-eyebrow">Start with understanding</p>
            <h2>See how the pieces connect.</h2>
            <p>Explore the public demo or review the platform architecture—without connecting live business data.</p>
          </div>
          <div className="public-home-actions">
            <Link href="/demo-platform/executive" prefetch={false} data-analytics-event="demo_click" className="public-button public-button-primary">Explore the demo <ArrowRight aria-hidden="true" size={17} /></Link>
            <Link href="/architecture" className="public-home-secondary">Read the architecture <ArrowRight aria-hidden="true" size={15} /></Link>
          </div>
        </div>
      </section>
      </div>
    </PublicPageShell>
  )
}
