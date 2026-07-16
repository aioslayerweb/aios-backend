"use client"

import { useMemo, useState } from "react"
import { BookOpen, FileText, PlayCircle, Search, Wrench } from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFooterCta,
  PublicHero,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import {
  PublicBenefitsOutcomesSection,
  PublicBuyerJourneySection,
  PublicConversionRailSection,
  PublicHowItWorksSection,
  PublicPilotProgramSection,
  PublicProblemSolutionSection,
  PublicStructuredData,
} from "@/components/public-site/storytelling-sections"

type ResourceCategory =
  | "Blog"
  | "Case Studies"
  | "White Papers"
  | "Product Updates"
  | "Architecture"
  | "Documentation"
  | "Videos"

type ResourceItem = {
  id: string
  title: string
  excerpt: string
  category: ResourceCategory
  readTime: string
  featured?: boolean
  published: string
}

const categories: Array<ResourceCategory | "All"> = [
  "All",
  "Blog",
  "Case Studies",
  "White Papers",
  "Product Updates",
  "Architecture",
  "Documentation",
  "Videos",
]

const resources: ResourceItem[] = [
  {
    id: "r-001",
    title: "How AIOS reduced enterprise decision latency by 41%",
    excerpt: "An operations case study on executive routing, confidence scoring, and decision governance.",
    category: "Case Studies",
    readTime: "8 min read",
    featured: true,
    published: "Jul 2026",
  },
  {
    id: "r-002",
    title: "Business Memory design patterns for autonomous systems",
    excerpt: "Core memory object strategies and architecture guidance for enterprise AI operating models.",
    category: "White Papers",
    readTime: "14 min read",
    featured: true,
    published: "Jul 2026",
  },
  {
    id: "r-003",
    title: "AIOS Runtime v6.3: governance and execution hardening",
    excerpt: "Release updates for workflow runtime safety, resiliency, and policy checks.",
    category: "Product Updates",
    readTime: "6 min read",
    published: "Jul 2026",
  },
  {
    id: "r-004",
    title: "Architecture poster: from signals to business outcomes",
    excerpt: "A technical architecture overview for CTOs and enterprise architects.",
    category: "Architecture",
    readTime: "10 min read",
    published: "Jun 2026",
  },
  {
    id: "r-005",
    title: "Integrating AIOS with CRM, ERP, and support systems",
    excerpt: "Implementation guidance for cross-system intelligence and memory synchronization.",
    category: "Documentation",
    readTime: "12 min read",
    published: "Jun 2026",
  },
  {
    id: "r-006",
    title: "Executive briefing: autonomous planning in volatile markets",
    excerpt: "A strategic blog for leaders operating under uncertainty with AI-assisted planning.",
    category: "Blog",
    readTime: "7 min read",
    published: "Jun 2026",
  },
  {
    id: "r-007",
    title: "Video: AIOS modules walkthrough",
    excerpt: "A guided walkthrough of the platform modules and connected intelligence layer.",
    category: "Videos",
    readTime: "9 min watch",
    published: "May 2026",
  },
  {
    id: "r-008",
    title: "Case file: customer churn risk early detection",
    excerpt: "How Customer Intelligence and Revenue Operator coordinate interventions.",
    category: "Case Studies",
    readTime: "9 min read",
    published: "May 2026",
  },
]

const resourcesProblems = [
  { title: "Scattered knowledge", body: "Architecture, product updates, and thought leadership are split across channels." },
  { title: "Weak decision context", body: "Content rarely maps to enterprise operating decisions and outcomes." },
  { title: "Low discoverability", body: "Teams struggle to find the right format for the right moment." },
  { title: "No narrative continuity", body: "Learning journeys stop between docs, blogs, and release notes." },
]

const resourcesSolutions = [
  { title: "Unified resource hub", body: "White papers, documentation, blog, notes, and security content in one layer." },
  { title: "Narrative structure", body: "Resources map from problem and architecture to adoption and outcomes." },
  { title: "Role-relevant filtering", body: "Search and categories quickly route users to decision-ready content." },
  { title: "Reusable section model", body: "The same content framework scales across all public routes." },
]

const resourcesSteps = [
  { label: "Step 1", title: "Discover", body: "Find the right format using role-oriented search and category filters." },
  { label: "Step 2", title: "Understand", body: "Move from concept to architecture with connected learning content." },
  { label: "Step 3", title: "Validate", body: "Review cases, updates, and implementation references to de-risk adoption." },
  { label: "Step 4", title: "Act", body: "Use resources to support demo requests, pilot design, and rollout planning." },
]

const resourcesBenefits = [
  { title: "Faster education", body: "Visitors understand AIOS category and value in minutes." },
  { title: "Higher trust", body: "Consistent documentation and architecture depth build enterprise confidence." },
  { title: "Better conversion", body: "Clear learning journeys naturally guide toward demos and pilot interest." },
]

const resourcesOutcomes = [
  { label: "Time to understanding", value: "-46%", detail: "Reduced time for first-time visitors to grasp AIOS." },
  { label: "Resource engagement", value: "+33%", detail: "Higher multi-page exploration across content categories." },
  { label: "Demo intent", value: "+24%", detail: "More visitors transition from learning to contact actions." },
]

function categoryIcon(category: ResourceCategory) {
  if (category === "Videos") {
    return <PlayCircle size={16} />
  }

  if (category === "Architecture") {
    return <Wrench size={16} />
  }

  if (category === "White Papers" || category === "Documentation") {
    return <FileText size={16} />
  }

  return <BookOpen size={16} />
}

export default function ResourcesPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "All">("All")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return resources.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) {
        return false
      }

      if (!normalized) {
        return true
      }

      return `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(normalized)
    })
  }, [activeCategory, query])

  return (
    <PublicPageShell activeHref="/resources">
      <PublicStructuredData
        name="AIOS Resources"
        description="Access AIOS white papers, documentation, blog, release notes, API and security resources in one narrative knowledge hub."
        path="/resources"
      />
      <PublicHero
        eyebrow="AIOS Resources"
        title="One knowledge system for architecture, product, and operating insight"
        body="Resources now inherit the same card, spacing, motion, and filtering language as the rest of the AIOS public system."
        actions={
          <>
            <PublicButtonLink href="/contact" size="lg">
              Book Demo
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review Architecture
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Resource types", value: "7", detail: "Case studies, docs, architecture, updates, and video" },
          { label: "Knowledge hub", value: "Unified", detail: "One system for discovery and learning" },
          { label: "Featured briefs", value: "2", detail: "High-signal reading for leaders and builders" },
        ]}
      />

      <PublicProblemSolutionSection
        problemTitle="Enterprise learning is often fragmented"
        problemBody="Visitors need one coherent path from category understanding to architecture confidence and pilot action."
        problemItems={resourcesProblems}
        solutionTitle="AIOS resources are now one storytelling system"
        solutionBody="Every format contributes to a single product narrative aligned with enterprise decision-making."
        solutionItems={resourcesSolutions}
      />

      <PublicHowItWorksSection
        title="How the AIOS resource experience guides decisions"
        body="The resource journey is designed to educate quickly and move qualified visitors toward action."
        steps={resourcesSteps}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Library"
            title="Search and filter the AIOS knowledge library"
            body="The resources page uses the same reusable chips, cards, and input styling as the broader public system."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="public-card public-card-floating h-fit">
              <p className="public-eyebrow">Search</p>
              <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[var(--public-color-border)] bg-[rgba(255,255,255,0.72)] px-4 py-3">
                <Search size={16} className="text-[color:var(--public-color-text-soft)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources"
                  className="w-full bg-transparent text-sm text-[color:var(--public-color-navy)] outline-none"
                  aria-label="Search resources"
                />
              </div>

              <p className="public-eyebrow mt-6">Categories</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className="public-chip"
                    data-active={activeCategory === category}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article key={item.id} className="public-card public-card-article public-card-hover h-full">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                      {categoryIcon(item.category)}
                    </span>
                    {item.featured ? <span className="public-chip" data-active="true">Featured</span> : null}
                  </div>
                  <p className="public-caption mt-5 text-[color:var(--public-color-primary)]">{item.category}</p>
                  <h3 className="public-h4 mt-3">{item.title}</h3>
                  <p className="public-body mt-3">{item.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="public-small">{item.readTime}</p>
                    <p className="public-small">{item.published}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicBenefitsOutcomesSection
        title="Knowledge experience outcomes"
        body="A structured resource layer increases comprehension, trust, and conversion readiness."
        benefits={resourcesBenefits}
        outcomes={resourcesOutcomes}
      />

      <PublicPilotProgramSection />

      <PublicBuyerJourneySection />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Keep Learning"
        title="Use one knowledge layer across product, architecture, and executive storytelling"
        body="The resources experience now belongs to the same AIOS ecosystem as every other public route."
      />
    </PublicPageShell>
  )
}
