"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Cpu,
  Database,
  GitBranch,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/branding";

const navItems: Array<{ label: string; href: string; placeholder?: boolean }> = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#how-aios-works" },
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/legal" },
  { label: "Pricing", href: "#", placeholder: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const problemCards: Array<{ title: string; body: string }> = [
  {
    title: "Fragmented Intelligence",
    body: "Critical context is scattered across dashboards, reports, inboxes, and meetings. Leaders see data, but not the full business story.",
  },
  {
    title: "Reactive Decision Cycles",
    body: "By the time teams detect a problem, revenue, delivery quality, or customer trust is already impacted.",
  },
  {
    title: "Automation Without Understanding",
    body: "Most systems execute tasks without strategic reasoning, confidence scoring, or explainable recommendations.",
  },
];

const platformPillars: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Radar,
    title: "Signal Observation",
    body: "AIOS captures enterprise events and normalizes them into business signals.",
  },
  {
    icon: Database,
    title: "Business Memory",
    body: "Signals are retained as memory objects so the system continuously improves context quality.",
  },
  {
    icon: BrainCircuit,
    title: "Executive Reasoning",
    body: "AI agents interpret what changed, why it matters, and what action has the highest expected outcome.",
  },
  {
    icon: Cpu,
    title: "Autonomous Execution",
    body: "Approved decisions are turned into orchestrated workflows with policy and governance controls.",
  },
];

const workSteps: Array<{ step: string; title: string; body: string }> = [
  {
    step: "01",
    title: "Observe",
    body: "Continuously ingest cross-functional business events.",
  },
  {
    step: "02",
    title: "Understand",
    body: "Convert events into explainable signals and insight narratives.",
  },
  {
    step: "03",
    title: "Recommend",
    body: "Generate action paths with evidence, confidence, and expected outcomes.",
  },
  {
    step: "04",
    title: "Automate",
    body: "Execute approved workflows and feed outcomes back into memory.",
  },
];

const modules: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Building2,
    title: "Corporate Command",
    body: "Executive visibility across strategy, risk, and operating cadence.",
  },
  {
    icon: Network,
    title: "Agent Orchestration",
    body: "Specialized agents collaborate with shared memory and role alignment.",
  },
  {
    icon: GitBranch,
    title: "Decision Engine",
    body: "Recommendation flow from observation to accountable execution.",
  },
  {
    icon: ShieldCheck,
    title: "Governance & Trust",
    body: "Policy controls, evidence trails, and enterprise-grade explainability.",
  },
];

const autonomyPoints: Array<{ title: string; body: string }> = [
  {
    title: "Reasoning Before Action",
    body: "Every recommendation includes observation, evidence, confidence, and expected impact.",
  },
  {
    title: "Human Approval Controls",
    body: "AIOS automates only approved pathways based on governance and risk posture.",
  },
  {
    title: "Continuous Learning Loop",
    body: "Outcomes update memory models to improve future recommendations.",
  },
];

const whyCards: Array<{ title: string; body: string }> = [
  {
    title: "Built for Executives",
    body: "Designed to reduce cognitive load and decision latency at leadership level.",
  },
  {
    title: "Business-Native AI",
    body: "Focuses on business signals and decisions, not generic chat interactions.",
  },
  {
    title: "Enterprise-Ready Foundation",
    body: "Security, governance, explainability, and architecture built from day one.",
  },
];

const journey: Array<{ stage: string; outcome: string }> = [
  { stage: "Signal Detection", outcome: "Risk or opportunity identified" },
  { stage: "Insight Generation", outcome: "Context and causes explained" },
  { stage: "Recommendation", outcome: "Action paths ranked by confidence" },
  { stage: "Decision", outcome: "Leadership approval and ownership assignment" },
  { stage: "Automation", outcome: "Workflows executed with governance" },
  { stage: "Learning", outcome: "Memory updated from real outcomes" },
];

const sectionMotion = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

function revealDelay(index: number): number {
  return index * 0.08;
}

function TopNav() {
  return (
    <header className="sticky top-0 z-header border-b border-border/70 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Top navigation">
        <Link href="/" className="flex items-center" aria-label="AIOS home">
          <BrandLogo width={142} height={34} priority />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-disabled={item.placeholder}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-navy"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-primary/40 hover:text-brand-primary md:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
          >
            Launch AIOS
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">{title}</h2>
      <p className="text-base text-text-secondary md:text-lg">{body}</p>
    </div>
  );
}

export function PublicHomePage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <TopNav />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-24 lg:px-8">
          <div className="pointer-events-none absolute -top-28 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-brand-subtle blur-3xl" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={sectionMotion}
            className="relative mx-auto max-w-6xl"
          >
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">AIOS Public Website v1.0</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
                The Autonomous Operating System for Modern Business
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg text-text-secondary">
                AIOS continuously observes the enterprise, explains what matters, recommends next actions, and automates approved workflows.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover"
                >
                  Launch AIOS
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#platform"
                  className="inline-flex rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-brand-navy transition hover:border-brand-primary/40 hover:text-brand-primary"
                >
                  Explore Platform
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="problem" className="px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="Problem"
              title="Most businesses have data everywhere, intelligence nowhere"
              body="AIOS addresses the executive reality of fragmented context, delayed response cycles, and automation without strategic understanding."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {problemCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-brand-navy">{card.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary">{card.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="platform" className="bg-white px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="Platform"
              title="AIOS transforms events into decision intelligence"
              body="A unified architecture connecting signals, memory, knowledge, executive insight, recommendation, and autonomous execution."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platformPillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <motion.article
                    key={pillar.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                    className="group rounded-2xl border border-border bg-surface-app p-5 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="inline-flex rounded-lg bg-brand-subtle p-2 text-brand-primary">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-brand-navy">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{pillar.body}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section id="how-aios-works" className="px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="How AIOS Works"
              title="A continuous signal-to-decision operating loop"
              body="From observation to learning, AIOS keeps decision quality high while reducing manual coordination overhead."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workSteps.map((item, index) => (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <p className="text-xs font-semibold tracking-[0.22em] text-brand-primary">{item.step}</p>
                  <h3 className="mt-3 text-lg font-semibold text-brand-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{item.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="enterprise-modules" className="bg-white px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="Enterprise Modules"
              title="Specialized capabilities, one shared intelligence layer"
              body="AIOS modules align teams around common signals, common memory, and common execution standards."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.article
                    key={module.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                    className="rounded-2xl border border-border bg-surface-app p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-brand-subtle p-2 text-brand-primary">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-navy">{module.title}</h3>
                        <p className="mt-2 text-sm text-text-secondary">{module.body}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section id="autonomous-intelligence" className="px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl rounded-3xl border border-border bg-gradient-to-br from-brand-navy to-[#0A2F86] p-8 md:p-12"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-soft">Autonomous Intelligence</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Automation that understands business context
              </h2>
              <p className="mt-4 text-base text-blue-100">
                AIOS executes approved tasks with explainability, governance, and continuous learning built into every loop.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {autonomyPoints.map((point, index) => (
                <motion.article
                  key={point.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                  className="rounded-2xl border border-blue-200/25 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <h3 className="text-base font-semibold text-white">{point.title}</h3>
                  <p className="mt-2 text-sm text-blue-100">{point.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="solutions" className="bg-white px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="Why AIOS"
              title="Designed for clarity, speed, and accountable action"
              body="AIOS helps leadership teams focus on what matters now, why it matters, and what to do next."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {whyCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                  className="rounded-2xl border border-border bg-surface-app p-6"
                >
                  <h3 className="text-lg font-semibold text-brand-navy">{card.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary">{card.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="customer-journey" className="px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-6xl"
          >
            <SectionHeader
              eyebrow="Customer Journey"
              title="From first signal to measurable business outcome"
              body="A practical progression for customer and operational intelligence, coordinated by AIOS."
            />
            <div className="mt-10 grid gap-3">
              {journey.map((entry, index) => (
                <motion.article
                  key={entry.stage}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: revealDelay(index), ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <p className="text-sm font-semibold text-brand-navy">{entry.stage}</p>
                  <p className="text-sm text-text-secondary">{entry.outcome}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="final-cta" className="bg-white px-6 pb-20 pt-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionMotion}
            className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-app px-8 py-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">Final CTA</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
              Build an intelligent, explainable, autonomous business with AIOS
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
              Move from fragmented dashboards to an operating system that helps leaders understand, decide, and execute with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover"
              >
                Launch AIOS
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-brand-navy transition hover:border-brand-primary/40 hover:text-brand-primary"
              >
                Contact Team
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border bg-white px-6 py-10 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo width={118} height={28} />
            <span className="text-sm text-text-muted">Autonomous Business Operating System</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <Link href="/about" className="transition hover:text-brand-primary">About</Link>
            <Link href="/products" className="transition hover:text-brand-primary">Products</Link>
            <Link href="/contact" className="transition hover:text-brand-primary">Contact</Link>
            <Link href="/legal" className="transition hover:text-brand-primary">Legal</Link>
            <Link href="/app" className="inline-flex items-center gap-1 font-semibold text-brand-primary">
              Launch AIOS
              <Sparkles size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
