"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Binary,
  Blocks,
  Bot,
  BrainCircuit,
  Briefcase,
  Database,
  GitBranch,
  Layers,
  Network,
  Sparkles,
  Workflow,
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

const architectureLayers: Array<{ title: string; subtitle: string; icon: LucideIcon }> = [
  { title: "Data Layer", subtitle: "Signals from CRM, ERP, support, collaboration, and finance systems.", icon: Database },
  { title: "Business Memory", subtitle: "Persistent memory objects indexing evidence, timelines, and outcomes.", icon: Blocks },
  { title: "Role-Based Intelligence", subtitle: "Context windows per executive role, function, and decision scope.", icon: Briefcase },
  { title: "Intelligence Engine", subtitle: "Reasoning, confidence scoring, narrative synthesis, and prioritization.", icon: BrainCircuit },
  { title: "Decision Engine", subtitle: "Governed recommendation pathways with approval and ownership control.", icon: GitBranch },
  { title: "AI Operators", subtitle: "Specialized autonomous operators for revenue, customer, finance, and operations.", icon: Bot },
  { title: "Workflow Runtime", subtitle: "Runtime orchestration of approved policies, tasks, and automation sequences.", icon: Workflow },
  { title: "External Integrations", subtitle: "Bidirectional sync with enterprise APIs, SDKs, and messaging systems.", icon: Network },
  { title: "Execution Layer", subtitle: "Measured actions, business outcomes, and feedback loops into memory.", icon: Layers },
];

const posterSteps = [
  "Business Signals",
  "Contextualization",
  "Memory Formation",
  "Intelligence Synthesis",
  "Decision Coordination",
  "Operator Routing",
  "Workflow Execution",
  "Business Outcomes",
  "Learning Feedback",
];

const roleBlocks = ["CTO", "Enterprise Architect", "Finance Leadership", "Operations", "Revenue", "Customer Success"];

const integrationBlocks = ["CRM", "ERP", "Email", "Slack", "Teams", "Support", "Finance", "HRIS", "Warehouse", "Custom APIs"];

function MagneticButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        mx.set(x * 0.13);
        my.set(y * 0.13);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ x: mx, y: my }}
      className="inline-flex"
    >
      <Link
        href={href}
        className={
          primary
            ? "inline-flex items-center gap-2 rounded-full bg-[#1976FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,118,255,0.24)] transition hover:scale-[1.02] hover:bg-[#0f68ee]"
            : "inline-flex items-center gap-2 rounded-full border border-[#D7DEED] bg-white px-7 py-3 text-sm font-semibold text-[#07133D] transition hover:scale-[1.02] hover:border-[#A6B6E0]"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

function SignalPoster() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-8 shadow-[0_28px_80px_rgba(7,19,61,0.08)] md:p-12"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Platform Architecture</p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">AIOS architecture as a continuous intelligence flow</h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="relative rounded-3xl border border-[#DAE4F6] bg-white p-5 shadow-[0_16px_40px_rgba(7,19,61,0.06)]">
          <div className="space-y-3">
            {posterSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.04, duration: 0.32 }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1976FF] text-xs font-semibold text-white">{index + 1}</span>
                <p className="rounded-xl border border-[#E1E8F8] bg-[#F7F9FC] px-4 py-3 text-sm font-semibold text-[#1B2E65]">{step}</p>
                {index < posterSteps.length - 1 ? <span className="text-[#7D8EB8]">↓</span> : null}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#DAE4F6] bg-white p-5 shadow-[0_16px_40px_rgba(7,19,61,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">Signal flow legend</p>
          <div className="mt-5 space-y-3">
            {[
              "Blue pulses represent signal acquisition.",
              "Connections represent contextual dependency.",
              "Decision edges indicate policy-gated execution.",
              "Feedback loop closes through memory reinforcement.",
            ].map((line, index) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-3 py-2 text-sm text-[#526289]"
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="mt-5 rounded-xl border border-[#C7D8F6] bg-gradient-to-r from-[#1976FF]/10 to-[#4DA6FF]/15 px-3 py-3 text-sm font-semibold text-[#24417F]"
          >
            AIOS Intelligence Layer orchestrates every stage continuously.
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default function ArchitecturePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const backGlowY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const backGlowYSpring = useSpring(backGlowY, { stiffness: 70, damping: 20 });

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, id) => ({
        id,
        left: `${8 + (id * 6.4) % 84}%`,
        delay: id * 0.2,
        duration: 7 + (id % 4),
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ y: backGlowYSpring }} className="pointer-events-none absolute inset-0 -z-10">
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

      <PublicSiteNav activeHref="/architecture" />

      <main className="px-6 lg:px-10">
        <section className="relative pb-16 pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Architecture</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">Enterprise architecture for autonomous business operations</h1>
              <p className="mt-7 max-w-2xl text-lg text-[#465683] md:text-xl">
                Designed for CTOs and enterprise architects to evaluate platform depth, signal flow, and execution governance across the full AIOS stack.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <MagneticButton href="/products" primary>
                  Explore Platform
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/contact">
                  Book Technical Demo
                  <Sparkles size={15} />
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="relative">
              <div className="rounded-[30px] border border-[#D9E4F6] bg-white p-6 shadow-[0_22px_60px_rgba(7,19,61,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1976FF]">Architecture Pulse</p>
                <div className="mt-4 space-y-3">
                  {["Data ingress", "Memory graph sync", "Role context update", "Decision policy check", "Operator dispatch", "Workflow execution"].map((item, index) => (
                    <motion.div
                      key={item}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.8 + index * 0.18, repeat: Infinity }}
                      className="rounded-xl border border-[#E0E8F8] bg-[#F7F9FC] px-3 py-2 text-sm font-medium text-[#2B3F79]"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-5 flex items-center gap-2 rounded-xl border border-[#D4E2F9] bg-gradient-to-r from-[#1976FF]/10 to-[#52ABFF]/14 px-3 py-3 text-sm font-semibold text-[#24417F]"
                >
                  <Binary size={16} />
                  Signal flow active across all architecture layers
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div className="mx-auto w-full max-w-7xl space-y-20 pb-24">
          <SignalPoster />

          <section>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Architecture Layers</p>
              <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Technical stack from data to governed execution</h2>

              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {architectureLayers.map((layer, index) => {
                  const Icon = layer.icon;

                  return (
                    <motion.article
                      key={layer.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      whileHover={{ y: -7, scale: 1.012, rotateX: 2.5, rotateY: -2.5 }}
                      className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_16px_40px_rgba(7,19,61,0.07)]"
                    >
                      <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                        <Icon size={18} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-[#07133D]">{layer.title}</h3>
                      <p className="mt-2 text-sm text-[#5A6894]">{layer.subtitle}</p>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </section>

          <section>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-3xl border border-[#DCE5F6] bg-white p-6 shadow-[0_16px_40px_rgba(7,19,61,0.07)]">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">Role-Based Intelligence</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#07133D]">Technical context by stakeholder domain</h3>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {roleBlocks.map((role, index) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-3 py-2 text-sm font-semibold text-[#324373]"
                    >
                      {role}
                    </motion.div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-[#DCE5F6] bg-white p-6 shadow-[0_16px_40px_rgba(7,19,61,0.07)]">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">External Integrations</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#07133D]">Bidirectional integration surface</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {integrationBlocks.map((item, index) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="rounded-full border border-[#D7E3F8] bg-[#F7F9FC] px-3 py-1.5 text-xs font-semibold text-[#40527F]"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </article>
            </motion.div>
          </section>

          <section>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="mx-auto max-w-5xl rounded-[34px] border border-[#DDE7F8] bg-white px-8 py-14 text-center shadow-[0_24px_70px_rgba(8,26,84,0.08)] md:px-14">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Next Step</p>
              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">Evaluate AIOS architecture in your enterprise context</h2>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MagneticButton href="/products" primary>
                  Explore Platform
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/contact">
                  Book a Demo
                  <Sparkles size={15} />
                </MagneticButton>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
