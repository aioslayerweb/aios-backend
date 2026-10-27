"use client"

import { useState } from "react"
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

const cockpitModes = [
  {
    label: "Causal intelligence",
    summary: "Trace a meaningful change to the evidence and context around it.",
    concepts: ["Signals", "Evidence", "Reasoning"],
  },
  {
    label: "Role-based memory",
    summary: "Bring relevant history into view without changing access permissions.",
    concepts: ["History", "Knowledge", "Relevance"],
  },
  {
    label: "Specialized operators",
    summary: "Coordinate focused AI capabilities around shared business context.",
    concepts: ["Functions", "Context", "Coordination"],
  },
  {
    label: "Governed execution",
    summary: "Keep recommendations distinct from actions and approval decisions.",
    concepts: ["Policy", "Approval", "Learning"],
  },
] as const

export function HomeCockpitIsland() {
  const [activeMode, setActiveMode] = useState(0)
  const selectedMode = cockpitModes[activeMode]

  return (
    <section id="cockpit" className="public-home-section public-home-cockpit-section" aria-label="Illustrative executive cockpit">
      <div className="public-container-wide">
        <div className="public-home-cockpit">
          <div className="public-home-cockpit-bar">
            <div className="public-home-cockpit-brand"><span aria-hidden="true" /><span>AIOS · EXECUTIVE COCKPIT</span></div>
            <span className="public-home-cockpit-note">Illustrative product model · synthetic example</span>
          </div>
          <div className="public-home-cockpit-tabs" role="group" aria-label="Illustrative cockpit capabilities">
            {cockpitModes.map((mode, index) => (
              <button
                key={mode.label}
                type="button"
                aria-pressed={activeMode === index}
                onClick={() => setActiveMode(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {mode.label}
              </button>
            ))}
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
              <p aria-live="polite">{selectedMode.summary}</p>
              <div className="public-home-cockpit-pills">
                {selectedMode.concepts.map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div className="public-home-cockpit-column">
              <span className="public-home-cockpit-label">Decision pathway</span>
              <div className="public-home-cockpit-row"><GitBranch aria-hidden="true" size={16} /><span>Suggested review</span><small>Human</small></div>
              <div className="public-home-cockpit-row"><ShieldCheck aria-hidden="true" size={16} /><span>Approval policy</span><small>Governance</small></div>
              <div className="public-home-cockpit-row"><Workflow aria-hidden="true" size={16} /><span>Outcome learning</span><small>Memory</small></div>
            </div>
          </div>
          <p className="public-home-cockpit-disclaimer">Illustrative only. This is not a live connection, customer activity feed, or performance dashboard.</p>
        </div>
      </div>
    </section>
  )
}

export function HomeFlowIsland() {
  const [activeStep, setActiveStep] = useState(0)
  const selectedStep = flow[activeStep]
  const example = [
    "A business event changes.",
    "Related history is brought into view.",
    "Evidence and uncertainty are made explicit.",
    "A person receives a reasoned next step.",
    "Permission and approval policy remain in control.",
    "The outcome can inform future context.",
  ][activeStep]

  return (
    <section id="matrix" className="public-home-section public-home-flow-section" aria-labelledby="public-home-flow-title">
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
            {flow.map((step, index) => (
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
            ))}
          </div>
          <div id="home-flow-panel" role="tabpanel" aria-labelledby={`home-flow-tab-${activeStep}`} className="public-home-flow-panel">
            <p className="public-eyebrow">{selectedStep.label}</p>
            <h3>{selectedStep.title}</h3>
            <p>{selectedStep.body}</p>
            <div className="public-home-flow-example">
              <span className="public-home-flow-example-label">Illustrative example</span>
              <span>{example}</span>
            </div>
            <p className="public-home-flow-disclaimer"><ShieldCheck aria-hidden="true" size={14} /> Recommendations are not actions. Execution depends on configured permission and approval policies.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeRoleIsland() {
  const [activeRole, setActiveRole] = useState<(typeof roles)[number]["id"]>("ceo")
  const selectedRole = roles.find((role) => role.id === activeRole) ?? roles[0]

  return (
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
  )
}

export function HomeScenarioIsland() {
  const [teamSize, setTeamSize] = useState(450)
  const [hoursPerWeek, setHoursPerWeek] = useState(1.5)
  const [hourlyCost, setHourlyCost] = useState(50)
  const annualHours = Math.round(teamSize * hoursPerWeek * 48)
  const annualValue = annualHours * hourlyCost
  const formattedValue = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(annualValue)

  return (
    <section id="roi-engine" className="public-home-section public-home-scenario-section" aria-labelledby="public-home-scenario-title">
      <div className="public-container-wide">
        <div className="public-home-section-heading">
          <div>
            <p className="public-eyebrow">Scenario planner · illustrative only</p>
            <h2 id="public-home-scenario-title" className="public-h2">Model the value of time differently.</h2>
          </div>
          <p>Explore a simple capacity scenario using assumptions you control. This is not an AIOS savings forecast, ROI promise, or verified customer result.</p>
        </div>
        <div className="public-home-scenario">
          <div className="public-home-scenario-inputs">
            <label>
              <span>People in the scenario</span>
              <output>{teamSize.toLocaleString("en-IE")}</output>
              <input type="range" min="25" max="2000" step="25" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} aria-label="People included in the scenario" />
              <span className="public-home-scenario-range"><span>25</span><span>2,000</span></span>
            </label>
            <label>
              <span>Hours potentially redirected per person each week</span>
              <output>{hoursPerWeek.toLocaleString("en-IE")} hrs</output>
              <input type="range" min="0" max="8" step="0.25" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(Number(event.target.value))} aria-label="Potentially redirected hours per person each week" />
              <span className="public-home-scenario-range"><span>0 hrs</span><span>8 hrs</span></span>
            </label>
            <label>
              <span>Blended hourly cost assumption</span>
              <output>{new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(hourlyCost)}</output>
              <input type="range" min="15" max="250" step="5" value={hourlyCost} onChange={(event) => setHourlyCost(Number(event.target.value))} aria-label="Blended hourly cost assumption in euros" />
              <span className="public-home-scenario-range"><span>€15</span><span>€250</span></span>
            </label>
          </div>
          <div className="public-home-scenario-result" aria-live="polite">
            <span className="public-home-scenario-result-label">Illustrative annual capacity value</span>
            <strong>{formattedValue}</strong>
            <span>{annualHours.toLocaleString("en-IE")} modeled hours per year</span>
            <p>Calculation: people × hours per week × 48 weeks × hourly cost. Your inputs are used only in this page state and are not submitted.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
