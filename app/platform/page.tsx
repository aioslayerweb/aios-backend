import {
  Bot,
  BrainCircuit,
  Building2,
  Database,
  GitBranch,
  Network,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicComparison,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import {
  PublicBenefitsOutcomesSection,
  PublicBuyerJourneySection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicHowItWorksSection,
  PublicProblemSolutionSection,
  PublicStructuredData,
} from "@/components/public-site/storytelling-sections"
import type { Metadata } from "next"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Platform",
  "See how AIOS connects business systems, signals, memory, role-based intelligence, people, and governed workflows.",
  "/platform",
)

const orbitNodes = [
  { title: "Signals", x: "14%", y: "18%", icon: <Database size={15} /> },
  { title: "Memory", x: "76%", y: "18%", icon: <Database size={15} /> },
  { title: "Reasoning", x: "84%", y: "52%", icon: <BrainCircuit size={15} /> },
  { title: "Decisions", x: "16%", y: "52%", icon: <GitBranch size={15} /> },
  { title: "Operators", x: "28%", y: "84%", icon: <Bot size={15} /> },
  { title: "Workflows", x: "72%", y: "84%", icon: <Workflow size={15} /> },
]

const pillars = [
  { title: "Business Signals", body: "Represent meaningful business events as signals that can be connected with relevant context.", icon: <Database size={18} /> },
  { title: "Business Memory", body: "Relate events, decisions, evidence, and recorded outcomes over time.", icon: <Database size={18} /> },
  { title: "Role Intelligence", body: "Prioritize information for a role without changing its access permissions.", icon: <Building2 size={18} /> },
  { title: "Reasoning", body: "Make observations, evidence, reasoning, and uncertainty explicit in decision support.", icon: <BrainCircuit size={18} /> },
  { title: "Decision Governance", body: "Keep permissions, ownership, and approval requirements visible around recommendations.", icon: <GitBranch size={18} /> },
  { title: "AI Agents", body: "Use specialized AI capabilities with shared business context and defined responsibilities.", icon: <Bot size={18} /> },
  { title: "Workflows", body: "Connect decisions to workflows where the required permissions and approvals are configured.", icon: <Workflow size={18} /> },
  { title: "Governance", body: "Define the controls and oversight required for the intended use and deployment.", icon: <ShieldCheck size={18} /> },
  { title: "Knowledge", body: "Connect business entities and evidence to make relationships easier to inspect.", icon: <Network size={18} /> },
]

const platformRows = [
  { label: "Architecture", left: "Business context spread across tools", right: "A connected intelligence layer" },
  { label: "Intelligence", left: "Information presented without role context", right: "Prioritized context with evidence" },
  { label: "Execution", left: "Recommendations separated from ownership", right: "Governed workflows with human oversight" },
  { label: "Learning", left: "Outcomes difficult to reconnect to decisions", right: "Business memory linked to recorded outcomes" },
]

const platformProblems = [
  { title: "Tool-first operations", body: "Teams manage software categories instead of one business intelligence system." },
  { title: "Low explainability", body: "AI output is often detached from evidence and governance context." },
  { title: "Weak human control", body: "Automation can outpace policy and ownership requirements." },
  { title: "Broken learning loop", body: "Outcomes rarely improve future decision quality in a structured way." },
]

const platformSolutions = [
  { title: "Connected operating layer", body: "AIOS is designed to connect signals, memory, decision support, and workflows." },
  { title: "Explainable reasoning", body: "A recommendation should make its observation, evidence, reasoning, and confidence clear." },
  { title: "Human oversight", body: "People and configured policies remain responsible for consequential actions." },
  { title: "Learning from outcomes", body: "Recorded outcomes can provide context for future business reasoning." },
]

const platformSteps = [
  { label: "Flow 1", title: "Business activity becomes context", body: "Configured sources can provide events that are represented as business signals." },
  { label: "Flow 2", title: "Relevant history is connected", body: "Memory and knowledge help relate a signal to available evidence and context." },
  { label: "Flow 3", title: "A decision is prepared", body: "Decision support can present role-relevant priorities and explain its reasoning." },
  { label: "Flow 4", title: "Next steps stay governed", body: "Permissions and approval requirements determine whether a workflow can proceed." },
]

const platformBenefits = [
  { title: "Operational clarity", body: "Everyone sees what changed, why it matters, and what to do next." },
  { title: "Decision speed", body: "Leaders move from periodic reporting to continuous assisted decisions." },
  { title: "Governed automation", body: "Execution stays safe, traceable, and aligned with enterprise policy." },
]

export default function PlatformPage() {
  return (
    <PublicPageShell activeHref="/platform">
      <PublicStructuredData
        name="AIOS Platform"
        description="Understand how AIOS connects business signals, memory, role-based intelligence, decision support, and governed workflows."
        path="/platform"
      />
      <PublicHero
        eyebrow="AIOS Platform"
        title="One intelligence layer for signals, memory, decisions, and workflows"
        body="AIOS is an AI-powered operating layer designed to connect business information and processes so leaders can understand what changed, why it matters, and what to consider next."
        actions={
          <>
            <PublicButtonLink href="/demo-platform/executive" size="lg">
              Explore synthetic demo
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review architecture
            </PublicButtonLink>
          </>
        }
        visual={<PublicOrbitVisual label="Platform" title="Connected Intelligence" nodes={orbitNodes} />}
      />

      <PublicProblemSolutionSection
        problemTitle="Business context can be spread across disconnected systems"
        problemBody="Teams may need to reconstruct the relationship between events, customer context, operating decisions, and follow-through."
        problemItems={platformProblems}
        solutionTitle="AIOS operates as the intelligence layer above the business"
        solutionBody="The operating model connects context to decision support, while permissions and approval policies remain separate from intelligence prioritization."
        solutionItems={platformSolutions}
      />

      <PublicHowItWorksSection
        title="How AIOS platform operations actually flow"
        body="From ingestion to governed execution, each step is designed to be explainable and policy-aware."
        steps={platformSteps}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="System Pillars"
            title="How the AIOS capabilities relate"
            body="Signals, memory, role context, reasoning, and workflows work together to support explainable business decisions."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={pillars} columns={3} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Operating model"
            title="Connect context before recommending action"
            body="AIOS is intended to help teams move from business activity to understandable priorities, with people and policy in control of execution."
          />
          <div className="mt-14">
            <PublicComparison rows={platformRows} leftLabel="Disconnected context" rightLabel="AIOS operating model" />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicBenefitsOutcomesSection
        title="Platform benefits that scale across every module"
        body="Because platform capabilities are shared, value compounds as new teams and workflows come online."
        benefits={platformBenefits}
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicBuyerJourneySection />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Adopt The Platform"
        title="Explore the AIOS operating model"
        body="Review how the platform connects business context, role-based intelligence, decision support, and governed workflows."
        primaryHref="/demo-platform/executive"
        primaryLabel="Explore synthetic demo"
        secondaryHref="/architecture"
        secondaryLabel="Review architecture"
      />
    </PublicPageShell>
  )
}