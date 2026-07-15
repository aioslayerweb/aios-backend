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

export default function AboutPage() {
  return (
    <PublicPageShell activeHref="/about">
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

      <PublicFooterCta
        eyebrow="Talk To AIOS"
        title="Discuss the category, architecture, and operating model behind AIOS"
        body="The public site now carries the same system-level confidence as the platform itself."
      />
    </PublicPageShell>
  )
}
