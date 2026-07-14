"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CaseSensitive,
  FileText,
  Filter,
  PlayCircle,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PublicSiteNav } from "@/components/public-site/public-site-nav";

type ResourceCategory =
  | "Blog"
  | "Case Studies"
  | "White Papers"
  | "Product Updates"
  | "Architecture"
  | "Documentation"
  | "Videos";

type ResourceItem = {
  id: string;
  title: string;
  excerpt: string;
  category: ResourceCategory;
  readTime: string;
  featured?: boolean;
  published: string;
};

const categories: ResourceCategory[] = [
  "Blog",
  "Case Studies",
  "White Papers",
  "Product Updates",
  "Architecture",
  "Documentation",
  "Videos",
];

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
  {
    id: "r-009",
    title: "Documentation: role-based intelligence configuration",
    excerpt: "Configure role context windows for executives, finance, sales, and operations.",
    category: "Documentation",
    readTime: "11 min read",
    published: "Apr 2026",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

function categoryIcon(category: ResourceCategory) {
  if (category === "Case Studies") {
    return <CaseSensitive size={14} />;
  }

  if (category === "White Papers" || category === "Documentation") {
    return <FileText size={14} />;
  }

  if (category === "Videos") {
    return <PlayCircle size={14} />;
  }

  if (category === "Architecture") {
    return <Wrench size={14} />;
  }

  return <BookOpen size={14} />;
}

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "All">("All");

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const featured = useMemo(() => resources.filter((item) => item.featured), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const text = `${item.title} ${item.excerpt} ${item.category}`.toLowerCase();
      return text.includes(normalized);
    });
  }, [activeCategory, query]);

  return (
    <div className="relative min-h-screen bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ width: progressWidth }} className="fixed left-0 top-0 z-[100] h-1 bg-[#1976FF]" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF2A,transparent_72%)] blur-3xl" />
        <div className="absolute right-[-120px] top-[300px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF1E,transparent_72%)] blur-3xl" />
      </div>

      <PublicSiteNav activeHref="/resources" />

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-20 pt-14 lg:grid-cols-[300px_1fr] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_18px_45px_rgba(7,19,61,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1976FF]">Resources Hub</p>
            <h1 className="mt-3 text-2xl font-semibold text-[#07133D]">AIOS Knowledge Center</h1>
            <p className="mt-2 text-sm text-[#56668F]">Search and filter the latest technical resources, architecture notes, and enterprise updates.</p>

            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-xl border border-[#DCE5F6] bg-[#F7F9FC] px-3 py-2">
                <Search size={15} className="text-[#6E7FA9]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources"
                  className="w-full bg-transparent text-sm text-[#1F3168] outline-none placeholder:text-[#7E8FB7]"
                  aria-label="Search resources"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1976FF]">
                <Filter size={13} />
                Filters
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory("All")}
                  className={
                    activeCategory === "All"
                      ? "rounded-full bg-[#1976FF] px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-full border border-[#DCE5F6] bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-[#4A5B87]"
                  }
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={
                      activeCategory === category
                        ? "rounded-full bg-[#1976FF] px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-full border border-[#DCE5F6] bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-[#4A5B87]"
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#DCE5F6] bg-[#F7F9FC] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1976FF]">Reading Progress</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#DCE5F6]">
                <motion.div style={{ width: progressWidth }} className="h-full rounded-full bg-[#1976FF]" />
              </div>
              <p className="mt-2 text-xs text-[#5D6C95]">Page progress updates as you explore resources.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-7">
          <section>
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="rounded-[32px] border border-[#DCE5F6] bg-[#F7F9FC] p-6 shadow-[0_20px_55px_rgba(7,19,61,0.06)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Featured Articles</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Enterprise intelligence insights and architecture briefings</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {featured.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group rounded-2xl border border-[#DCE5F6] bg-white p-5 shadow-[0_12px_32px_rgba(7,19,61,0.06)]"
                  >
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D6E3FA] bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#2D4E90]">
                      {categoryIcon(item.category)}
                      {item.category}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#07133D]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#5A6894]">{item.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#6A7AA3]">
                      <span>{item.readTime}</span>
                      <span>{item.published}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </section>

          <section>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="rounded-[32px] border border-[#DCE5F6] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.06)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">All Resources</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#07133D]">Filtered knowledge results</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {filtered.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.04, duration: 0.32 }}
                    whileHover={{ y: -4, scale: 1.008 }}
                    className="rounded-2xl border border-[#DCE5F6] bg-[#F7F9FC] p-5 shadow-[0_10px_25px_rgba(7,19,61,0.05)]"
                  >
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D6E3FA] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#2D4E90]">
                      {categoryIcon(item.category)}
                      {item.category}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#07133D]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#5A6894]">{item.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#6A7AA3]">
                      <span>{item.readTime}</span>
                      <span>{item.published}</span>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-[#CBD9F2] bg-[#F7F9FC] p-6 text-center">
                  <p className="text-sm font-semibold text-[#344778]">No matching resources found</p>
                  <p className="mt-1 text-sm text-[#6A7AA3]">Try another category or clear your search query.</p>
                </div>
              ) : null}
            </motion.div>
          </section>

          <section>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="rounded-[32px] border border-[#DDE7F8] bg-white px-8 py-12 text-center shadow-[0_24px_65px_rgba(8,26,84,0.07)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Knowledge Hub</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Enterprise resources for every stage of AIOS adoption</h2>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#1976FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(25,118,255,0.24)]">
                  Request Demo
                  <ArrowRight size={15} />
                </Link>
                <Link href="/modules" className="inline-flex items-center gap-2 rounded-full border border-[#D7DEED] bg-white px-6 py-3 text-sm font-semibold text-[#07133D]">
                  Explore Modules
                  <Sparkles size={14} />
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
