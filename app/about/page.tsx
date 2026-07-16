"use client"

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

const storyCards = [
  {
    title: "Mission",
    body: "Reduce executive cognitive load by transforming fragmented operations into one continuously intelligent system.",
    icon: Target,
  },
  {
    title: "The Problem",
    body: "Businesses run on disconnected tools, delayed reporting cycles, and automation without strategic understanding.",
    icon: Landmark,
  },
  {
    title: "Why AIOS Exists",
    body: "To create a new software category where intelligence, memory, and execution operate as one business operating surface.",
    icon: Flag,
  },
  {
    title: "Our Vision",
    body: "A world where companies run with autonomous coordination, explainable decision systems, and continuous business learning.",
    icon: Sparkles,
  },
]

const pillars = [
  {
    title: "AI-Native Company",
    body: "AIOS is designed from first principles as an AI-native operating model, not an AI layer on top of legacy software.",
    icon: BrainCircuit,
  },
  {
    title: "Business Memory",
    body: "Every signal, decision, and outcome contributes to persistent memory that improves future reasoning quality.",
    icon: Database,
  },
  {
    title: "Role-Based Intelligence",
    body: "Intelligence adapts by role so CEOs, Finance, Operations, and Revenue teams each see decision-relevant context.",
    icon: Briefcase,
  },
]

const timeline = [
  { label: "2024", title: "Category Thesis", body: "Defined the AI Operating System category and signal-memory architecture model." },
  { label: "2025", title: "Core Intelligence Layer", body: "Shipped unified signal ingestion, business memory, and executive insight pipelines." },
  { label: "2026", title: "Operator Runtime", body: "Introduced policy-governed AI operators and autonomous workflow runtime orchestration." },
  { label: "2027", title: "Enterprise Scale", body: "Expanding enterprise architecture, integrations, and global intelligence operations." },
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
  { title: "Compounding business memory", body: "The platform learns from outcomes and continuously improves recommendations." },
  { title: "Governed autonomy", body: "Humans remain in control through explainability and policy-aware workflows." },
]

const aboutHowItWorks = [
  { label: "Principle 1", title: "Observe", body: "AIOS observes meaningful business signals across systems and teams." },
  { label: "Principle 2", title: "Understand", body: "Memory and knowledge layers translate data into decision context." },
  { label: "Principle 3", title: "Recommend", body: "AI reasoning surfaces explainable recommendations with confidence." },
  { label: "Principle 4", title: "Learn", body: "Execution outcomes reinforce memory and improve future intelligence." },
]

export default function AboutPage() {
  return (
    <PublicPageShell activeHref="/about">
      <PublicStructuredData
        name="About AIOS"
        description="Learn why AIOS exists, the mission behind the AI Operating System category, and the roadmap for enterprise intelligence."
        path="/about"
      />
      <PublicHero
        eyebrow="About AIOS"
        title="A new software category for autonomous businesses"
        body="AIOS is not an add-on tool. It is a category shift: one intelligence layer coordinating memory, decisions, and execution for the whole business."
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
        problemBody="Businesses need more than another AI assistant. They need an operating system for intelligence, decisions, and execution."
        problemItems={aboutProblems}
        solutionTitle="The AIOS vision"
        solutionBody="AIOS is designed as the intelligence operating layer that helps leaders understand faster and act with confidence."
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
            body="The About page now uses the same premium cards, spacing, and hierarchy as every other public route."
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
            title="The product philosophy behind the design system"
            body="The same ideas that shape AIOS architecture also shape the public experience: clarity, explainability, reuse, and compositional depth."
          />
          <div className="mt-14">
            <PublicFeatureGrid items={pillars} columns={3} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Timeline"
            title="From category thesis to enterprise operating system"
            body="The company story is presented as a reusable timeline section that future narrative pages can inherit."
          />
          <div className="mt-14">
            <PublicTimeline items={timeline} />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicTrustAndProofSection
        title="A mission built for enterprise trust"
        body="AIOS combines deep architecture discipline with executive-grade clarity and responsible autonomy."
        quote="AIOS provides the first coherent answer to the gap between analytics, decision support, and autonomous execution."
        person="Enterprise Advisor"
        role="AIOS Strategy Council"
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Talk To AIOS"
        title="Discuss the category, architecture, and operating model behind AIOS"
        body="The public site now carries the same system-level confidence as the platform itself."
      />
    </PublicPageShell>
  )
}
