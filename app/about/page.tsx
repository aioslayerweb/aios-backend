import {
  BrainCircuit,
  Briefcase,
  Database,
  Flag,
  Landmark,
  Sparkles,
  Target,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
  PublicTimeline,
} from "@/components/aios"
import {
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicExecutiveRoleSection,
  PublicHowItWorksSection,
  PublicProblemSolutionSection,
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"
import type { Metadata } from "next"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "About AIOS",
  "Learn why AIOS is designed to connect business signals, memory, decisions, and governed workflows in one intelligence layer.",
  "/about",
)

const storyCards = [
  {
    title: "Mission",
    body: "Reduce executive cognitive load by making business context and decision pathways easier to understand.",
    icon: <Target size={18} />,
  },
  {
    title: "The Problem",
    body: "Businesses run on disconnected tools, delayed reporting cycles, and automation without strategic understanding.",
    icon: <Landmark size={18} />,
  },
  {
    title: "Why AIOS Exists",
    body: "To explore a software model where intelligence, memory, and governed execution can work together.",
    icon: <Flag size={18} />,
  },
  {
    title: "Our Vision",
    body: "A world where companies run with autonomous coordination, explainable decision systems, and continuous business learning.",
    icon: <Sparkles size={18} />,
  },
]

const pillars = [
  {
    title: "AI-Native Company",
    body: "AIOS is designed from first principles as an AI-native operating model, not an AI layer on top of legacy software.",
    icon: <BrainCircuit size={18} />,
  },
  {
    title: "Business Memory",
    body: "The product model considers how signals, decisions, and outcomes could inform future reasoning.",
    icon: <Database size={18} />,
  },
  {
    title: "Role-Based Intelligence",
    body: "The design considers how different roles may need relevant context while access permissions stay independent.",
    icon: <Briefcase size={18} />,
  },
]

const timeline = [
  { label: "01", title: "Understand", body: "Connect business activity with relevant context before drawing a conclusion." },
  { label: "02", title: "Explain", body: "Make the evidence and reasoning behind an insight visible." },
  { label: "03", title: "Prioritize", body: "Help each role focus on information within its permitted access." },
  { label: "04", title: "Govern", body: "Keep people, permissions, and approval policies in control of consequential actions." },
]

const aboutProblems = [
  { title: "Dashboard fatigue", body: "Executives are overloaded with data but under-supported on decisions." },
  { title: "Category confusion", body: "AI tools solve tasks, not whole-business intelligence coordination." },
  { title: "Weak memory", body: "Organizations lose context between teams, systems, and time horizons." },
  { title: "Unclear control", body: "Automation without governance undermines trust and adoption." },
]

const aboutSolutions = [
  { title: "AI Operating System thesis", body: "AIOS was created to connect intelligence, memory, and execution as one layer." },
  { title: "Executive-first design", body: "Every product decision aims to reduce cognitive load for leaders." },
  { title: "Business memory concept", body: "The product model explores how outcomes could inform future recommendations." },
  { title: "Governed autonomy", body: "The design keeps explainability, human review, and policy-aware workflows in view." },
]

const aboutHowItWorks = [
  { label: "Principle 1", title: "Observe", body: "The model starts with meaningful business signals from relevant sources." },
  { label: "Principle 2", title: "Understand", body: "Memory and knowledge concepts provide context for interpretation." },
  { label: "Principle 3", title: "Recommend", body: "Decision support should make evidence, reasoning, and uncertainty visible." },
  { label: "Principle 4", title: "Learn", body: "Where outcome data is available, it can be used to evaluate future recommendations." },
]

export default function AboutPage() {
  return (
    <PublicPageShell activeHref="/about">
      <PublicStructuredData
        name="About AIOS"
        description="Learn why AIOS is designed to connect business context, decision support, and governed workflows."
        path="/about"
      />
      <PublicHero
        eyebrow="About AIOS"
        title="Business intelligence before automation"
        body="AIOS is a proposed intelligence layer above business systems. This overview describes the product vision, not a claim that every capability is deployed."
        actions={
          <>
            <PublicButtonLink href="/products" size="lg">
              Explore Platform
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review Architecture
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Category", value: "AIOS", detail: "One operating system above fragmented software" },
          { label: "Core thesis", value: "Memory + Intelligence", detail: "Understanding before automation" },
          { label: "Audience", value: "Executives", detail: "Lower cognitive load and faster decisions" },
        ]}
      />

      <PublicProblemSolutionSection
        problemTitle="Why AIOS exists"
        problemBody="The AIOS thesis is that businesses need more than task assistance: they need connected context for intelligence, decisions, and governed execution."
        problemItems={aboutProblems}
        solutionTitle="The AIOS vision"
        solutionBody="AIOS explores an intelligence operating model intended to help leaders understand business context before considering action."
        solutionItems={aboutSolutions}
      />

      <PublicHowItWorksSection
        title="The operating principles behind AIOS"
        body="The company mission maps directly to how the product works and how value is created."
        steps={aboutHowItWorks}
      />

      <PublicEnterpriseTrustMatrixSection />

      <PublicExecutiveRoleSection />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Story"
            title="Why AIOS exists"
            body="AIOS starts from a business question: what changed, why does it matter, and what should a person consider next?"
          />
          <div className="mt-14">
            <PublicFeatureGrid items={storyCards} columns={2} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Principles"
            title="The principles behind the AIOS operating model"
            body="Clarity, explainability, role-aware prioritization, and human oversight guide how the product is intended to support business decisions."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={pillars} columns={3} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Principles"
            title="A sequence from context to governed action"
            body="These principles describe the intended decision-support model, not a company history or a claim about deployment status."
          />
          <div className="mt-14">
            <PublicTimeline items={timeline} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicTrustAndProofSection
        title="A mission built for enterprise trust"
        body="AIOS is designed to make business context and decision reasoning clearer while keeping access control and human oversight explicit."
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Talk To AIOS"
        title="Discuss the category, architecture, and operating model behind AIOS"
        body="Explore the platform and architecture to understand the intended AIOS operating model."
        primaryHref="/demo-platform/executive"
        primaryLabel="Explore synthetic demo"
        secondaryHref="/platform"
        secondaryLabel="Review platform"
      />
    </PublicPageShell>
  )
}
