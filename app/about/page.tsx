"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  CalendarClock,
  Database,
  Flag,
  Landmark,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicSiteNav } from "@/components/public-site/public-site-nav";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

const storyCards: Array<{ title: string; body: string; icon: LucideIcon }> = [
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
];

const pillars: Array<{ title: string; body: string; icon: LucideIcon }> = [
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
];

const timeline = [
  { milestone: "Category Thesis", date: "2024", detail: "Defined the AI Operating System category and signal-memory architecture model." },
  { milestone: "Core Intelligence Layer", date: "2025", detail: "Shipped unified signal ingestion, business memory, and executive insight pipelines." },
  { milestone: "Operator Runtime", date: "2026", detail: "Introduced policy-governed AI operators and autonomous workflow runtime orchestration." },
  { milestone: "Enterprise Scale", date: "2027", detail: "Expanding enterprise architecture, integrations, and global intelligence operations." },
];

const roadmap = [
  "Cross-enterprise multi-agent collaboration",
  "Adaptive confidence learning loops",
  "Autonomous planning across business units",
  "Policy-native global runtime governance",
  "Role intelligence expansion by industry",
];

function MagneticButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="inline-flex">
      <Link
        href={href}
        className={
          primary
            ? "inline-flex items-center gap-2 rounded-full bg-[#1976FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,118,255,0.24)] transition hover:bg-[#0f68ee]"
            : "inline-flex items-center gap-2 rounded-full border border-[#D7DEED] bg-white px-7 py-3 text-sm font-semibold text-[#07133D] transition hover:border-[#A6B6E0]"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -72]);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, id) => ({
        id,
        left: `${8 + (id * 6.1) % 84}%`,
        delay: id * 0.2,
        duration: 7 + (id % 4),
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ backgroundPosition: ["0% 30%", "100% 70%", "0% 30%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF2E,transparent_72%)] blur-3xl"
        />
        <div className="absolute right-[-120px] top-[320px] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF24,transparent_72%)] blur-3xl" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-[4] opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8,36,102,0.15) 1px, transparent 0)", backgroundSize: "18px 18px" }} />

      <div className="pointer-events-none absolute inset-0 -z-[3]">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            style={{ left: particle.left }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.8, 0] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "linear" }}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#5AA8FF] shadow-[0_0_14px_rgba(85,167,255,0.65)]"
          />
        ))}
      </div>

      <PublicSiteNav activeHref="/about" />

      <main className="px-6 lg:px-10">
        <section className="relative pb-14 pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto w-full max-w-7xl">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-5xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">About AIOS</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">A new software category for autonomous businesses</h1>
              <p className="mt-7 max-w-3xl text-lg text-[#465683] md:text-xl">
                AIOS is not an add-on tool. It is a category shift: one intelligence layer coordinating memory, decisions, and execution for the whole business.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="/products" primary>
                Explore Platform
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/architecture">
                Explore Architecture
                <Route size={15} />
              </MagneticButton>
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_28px_80px_rgba(7,19,61,0.08)] md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {storyCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05, duration: 0.32 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="rounded-2xl border border-[#DCE5F6] bg-white p-5 shadow-[0_12px_30px_rgba(7,19,61,0.06)]"
                  >
                    <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                      <Icon size={18} />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-[#07133D]">{card.title}</h2>
                    <p className="mt-2 text-sm text-[#5A6894]">{card.body}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <motion.article
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.34 }}
                  className="rounded-3xl border border-[#DCE5F6] bg-white p-6 shadow-[0_16px_40px_rgba(7,19,61,0.07)]"
                >
                  <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-[#07133D]">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-[#5A6894]">{pillar.body}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="rounded-[34px] border border-[#DCE5F7] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Roadmap</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Building the operating system for autonomous enterprises</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {roadmap.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="rounded-2xl border border-[#DFE8F8] bg-[#F7F9FC] px-4 py-3 text-sm font-semibold text-[#2F4378]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-8"
          >
            <div className="flex items-center gap-2">
              <CalendarClock size={15} className="text-[#1976FF]" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Timeline</p>
            </div>

            <div className="mt-6 space-y-3">
              {timeline.map((item, index) => (
                <motion.article
                  key={item.milestone}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.34 }}
                  className="grid gap-2 rounded-2xl border border-[#DCE5F6] bg-white p-4 md:grid-cols-[120px_1fr_2fr] md:items-center"
                >
                  <p className="text-sm font-semibold text-[#1976FF]">{item.date}</p>
                  <p className="text-base font-semibold text-[#07133D]">{item.milestone}</p>
                  <p className="text-sm text-[#5A6894]">{item.detail}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="rounded-[34px] border border-[#DDE7F8] bg-white p-6 shadow-[0_24px_65px_rgba(8,26,84,0.07)] md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Founder</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Built by operators who believe intelligence should run with the business</h2>
            <p className="mt-3 max-w-4xl text-sm text-[#5A6894]">
              The founder story is intentionally simple: AIOS exists because modern businesses need one coherent intelligence system, not another disconnected tool. The focus stays on category creation and enterprise impact.
            </p>
          </motion.div>
        </section>

        <section className="pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="mx-auto w-full max-w-5xl rounded-[34px] border border-[#DDE7F8] bg-white px-8 py-14 text-center shadow-[0_24px_70px_rgba(8,26,84,0.08)] md:px-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Story</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">The future of business is autonomous.</h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href="/products" primary>
                Explore Platform
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/contact">
                Talk to Sales
                <Sparkles size={15} />
              </MagneticButton>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
