"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BrainCircuit, Database, GitBranch, Search, ShieldCheck, Workflow } from "lucide-react"
import {
  PublicContainer,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"
import { PublicStructuredData } from "@/components/public-site/storytelling-sections"

type ResourceCategory = "Operating Model" | "Architecture" | "Governance" | "Decision Support" | "Product"

type ResourceItem = {
  id: string
  title: string
  excerpt: string
  category: ResourceCategory
  href: string
}

const categories: Array<ResourceCategory | "All"> = [
  "All",
  "Operating Model",
  "Architecture",
  "Governance",
  "Decision Support",
  "Product",
]

const resources: ResourceItem[] = [
  {
    id: "operating-model",
    title: "AIOS as a business intelligence operating layer",
    excerpt: "See how business signals, memory, role context, and workflows fit into one operating model.",
    category: "Operating Model",
    href: "/platform",
  },
  {
    id: "signals-memory",
    title: "From business signals to memory",
    excerpt: "Explore how events, evidence, and outcomes can be connected to preserve useful context over time.",
    category: "Architecture",
    href: "/architecture",
  },
  {
    id: "rbac-rbi",
    title: "RBAC and RBI: access versus priority",
    excerpt: "Understand how access permissions stay separate from role-based information prioritization.",
    category: "Governance",
    href: "/security",
  },
  {
    id: "decision-support",
    title: "How AIOS frames decision support",
    excerpt: "Follow the relationship between an observation, supporting evidence, reasoning, and a suggested review.",
    category: "Decision Support",
    href: "/architecture",
  },
  {
    id: "governed-workflows",
    title: "Recommendations, approvals, and workflows",
    excerpt: "Review why a recommendation is not the same as an action and where human approval belongs.",
    category: "Governance",
    href: "/security",
  },
  {
    id: "modules",
    title: "Explore AIOS product modules",
    excerpt: "See how executive, memory, knowledge, workflow, and runtime areas relate to the broader platform.",
    category: "Product",
    href: "/modules",
  },
]

function categoryIcon(category: ResourceCategory) {
  if (category === "Operating Model") {
    return <BrainCircuit size={16} aria-hidden="true" />
  }

  if (category === "Architecture") {
    return <Database size={16} aria-hidden="true" />
  }

  if (category === "Governance") {
    return <ShieldCheck size={16} aria-hidden="true" />
  }

  if (category === "Decision Support") {
    return <GitBranch size={16} aria-hidden="true" />
  }

  return <Workflow size={16} aria-hidden="true" />
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

      return !normalized || `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(normalized)
    })
  }, [activeCategory, query])

  return (
    <PublicPageShell activeHref="/resources">
      <PublicStructuredData
        name="AIOS Resources"
        description="Explore plain-language guides to the AIOS operating model, architecture, governance, decision support, and product modules."
        path="/resources"
      />
      <PublicHero
        eyebrow="AIOS Resources"
        title="Understand the ideas behind AIOS"
        body="Start with a business concept, then explore how it connects to the platform, architecture, and governance model."
        actions={
          <>
            <Link href="/platform" className="public-button public-button-primary">
              Explore platform <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link href="/architecture" className="public-button public-button-secondary">
              Review architecture
            </Link>
          </>
        }
        visual={
          <PublicOrbitVisual
            label="Explore"
            title="Connected context"
            nodes={[
              { title: "Signals", x: "16%", y: "20%", icon: <Database size={15} />, href: "/architecture" },
              { title: "Memory", x: "82%", y: "22%", icon: <BrainCircuit size={15} />, href: "/platform" },
              { title: "Governance", x: "18%", y: "78%", icon: <ShieldCheck size={15} />, href: "/security" },
              { title: "Workflows", x: "80%", y: "76%", icon: <Workflow size={15} />, href: "/modules" },
            ]}
          />
        }
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Explore topics"
            title="Choose a concept to follow"
            body="These short topic summaries link to existing AIOS pages. They are not a catalog of unpublished reports, case studies, or release notes."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="public-card public-card-floating h-fit">
              <label className="public-eyebrow" htmlFor="resource-search">Search topics</label>
              <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[var(--public-color-border)] bg-[rgba(255,255,255,0.72)] px-4 py-3">
                <Search size={16} aria-hidden="true" className="text-[color:var(--public-color-text-soft)]" />
                <input
                  id="resource-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search AIOS topics"
                  className="w-full bg-transparent text-sm text-[color:var(--public-color-navy)] outline-none"
                />
              </div>

              <p className="public-eyebrow mt-6">Filter by topic</p>
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

            <div>
              <p className="public-small mb-4" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
              </p>
              {filtered.length ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((item) => (
                    <article key={item.id} className="public-card public-card-article public-card-hover h-full">
                      <Link href={item.href} className="block h-full">
                        <span className="inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                          {categoryIcon(item.category)}
                        </span>
                        <p className="public-caption mt-5 text-[color:var(--public-color-primary)]">{item.category}</p>
                        <h3 className="public-h4 mt-3">{item.title}</h3>
                        <p className="public-body mt-3">{item.excerpt}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--public-color-primary)]">
                          Explore topic <ArrowRight aria-hidden="true" size={15} />
                        </span>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="public-card public-card-standard" role="status">
                  No topics match this search. Try another phrase or choose “All”.
                </p>
              )}
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicFooterCta
        eyebrow="Continue exploring"
        title="See how the AIOS model comes together"
        body="Review the platform overview or explore the synthetic demo. The demo uses sample data and local-only interactions."
        primaryHref="/demo-platform/executive"
        primaryLabel="Explore synthetic demo"
        secondaryHref="/platform"
        secondaryLabel="Review the platform"
      />
    </PublicPageShell>
  )
}
