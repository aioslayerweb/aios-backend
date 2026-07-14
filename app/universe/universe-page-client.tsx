"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  Cable,
  Database,
  Globe,
  Layers,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicSiteFooter } from "@/components/public-site/public-site-footer";
import { PublicSiteNav } from "@/components/public-site/public-site-nav";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

type District = {
  title: string;
  href: string;
  icon: LucideIcon;
  x: number;
  y: number;
};

const districts: District[] = [
  { title: "Executive Center", href: "/app/executive", icon: Building2, x: 18, y: 14 },
  { title: "Command Center", href: "/app/commands", icon: Radar, x: 76, y: 12 },
  { title: "Memory Center", href: "/app/memory", icon: Database, x: 9, y: 46 },
  { title: "Knowledge Center", href: "/app/knowledge", icon: Network, x: 81, y: 45 },
  { title: "Workflow Builder", href: "/app/workflows", icon: Workflow, x: 17, y: 76 },
  { title: "Agent Studio", href: "/app/agents", icon: Bot, x: 73, y: 76 },
  { title: "Organization Center", href: "/app/organization", icon: Briefcase, x: 34, y: 90 },
  { title: "Developer Center", href: "/app/developer-center", icon: Wrench, x: 54, y: 8 },
  { title: "Runtime Center", href: "/app/runtime-center", icon: Layers, x: 48, y: 94 },
  { title: "Security Center", href: "/app/security", icon: ShieldCheck, x: 62, y: 90 },
  { title: "Integrations", href: "/app/integrations", icon: Cable, x: 4, y: 66 },
];

const signalFlow = [
  "Signals",
  "Business Memory",
  "Role-Based Intelligence",
  "Intelligence Engine",
  "Decision Engine",
  "AI Operators",
  "Workflow Runtime",
  "Business Outcomes",
];

const memoryFlow = ["Signals", "Knowledge", "Context", "Memory", "Predictions", "Actions"];

const roles = ["CEO", "Sales", "Marketing", "Finance", "Operations", "HR", "Customer Success"] as const;

const rolePanels: Record<(typeof roles)[number], { heading: string; points: string[] }> = {
  CEO: {
    heading: "Strategic command narrative",
    points: ["2 high-impact decisions", "4 expansion windows", "1 systemic risk", "Confidence 94%"],
  },
  Sales: {
    heading: "Pipeline and revenue orchestration",
    points: ["Forecast variance -7%", "3 deal interventions", "2 churn flags", "Confidence 89%"],
  },
  Marketing: {
    heading: "Demand and narrative intelligence",
    points: ["Campaign lift +11%", "4 segment opportunities", "Attribution confidence +9 pts", "Confidence 91%"],
  },
  Finance: {
    heading: "Capital and risk intelligence",
    points: ["Margin drift isolated", "Cash runway stable", "Budget anomaly isolated", "Confidence 93%"],
  },
  Operations: {
    heading: "Execution throughput control",
    points: ["Throughput +6%", "1 policy exception", "3 bottlenecks queued", "Confidence 88%"],
  },
  HR: {
    heading: "People and capability readiness",
    points: ["Retention trend stable", "2 leadership gaps", "Hiring velocity on plan", "Confidence 87%"],
  },
  "Customer Success": {
    heading: "Customer continuity intelligence",
    points: ["Renewal risk heatmap", "Escalation backlog down", "Knowledge hit-rate +14%", "Confidence 90%"],
  },
};

const operators = ["Revenue Operator", "Customer Intelligence", "Operations Operator", "Finance Operator", "HR Operator"];

const integrations = ["CRM", "ERP", "Email", "Slack", "Teams", "HubSpot", "Salesforce", "Stripe", "Knowledge Base", "Databases", "MCP", "Workflow Engine"];

function MagneticButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        mx.set(x * 0.14);
        my.set(y * 0.14);
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
            ? "inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1976FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,118,255,0.26)] transition hover:scale-[1.02] hover:bg-[#0f68ee]"
            : "inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D7DEED] bg-white px-7 py-3 text-sm font-semibold text-[#07133D] transition hover:scale-[1.02] hover:border-[#A6B6E0]"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

function IntelligenceHub() {
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 120, damping: 18, mass: 0.6 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 120, damping: 18, mass: 0.6 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateYRaw.set((px - 0.5) * 15);
        rotateXRaw.set((0.5 - py) * 14);
      }}
      onMouseLeave={() => {
        rotateXRaw.set(0);
        rotateYRaw.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative mx-auto aspect-[1.05/1] w-full max-w-6xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CBD8F2]/75"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#B8C9ED]"
      />

      <motion.div
        animate={{ boxShadow: ["0 24px 70px rgba(25,118,255,0.24)", "0 36px 90px rgba(25,118,255,0.4)", "0 24px 70px rgba(25,118,255,0.24)"] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 z-20 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-white/70 bg-gradient-to-br from-[#1976FF] via-[#2D8BFF] to-[#67B7FF] p-6 text-white sm:h-[250px] sm:w-[250px] sm:p-7"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Core</p>
        <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">AIOS Intelligence Layer</h3>
      </motion.div>

      {districts.map((district, index) => {
        const Icon = district.icon;

        return (
          <motion.div
            key={district.title}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: [0, index % 2 === 0 ? -8 : -5, 0], scale: 1 }}
            transition={{ delay: index * 0.04, y: { duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" } }}
            style={{ left: `${district.x}%`, top: `${district.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <Link
              href={district.href}
              className="group block rounded-2xl border border-white/70 bg-white/90 px-2.5 py-2 text-[11px] font-semibold text-[#11235D] shadow-[0_12px_35px_rgba(8,28,92,0.12)] backdrop-blur transition hover:scale-[1.03] sm:px-3 sm:text-xs"
            >
              <span className="mb-1 inline-flex rounded-lg bg-[#EAF2FF] p-1.5 text-[#1976FF]">
                <Icon size={14} />
              </span>
              <span className="block whitespace-nowrap">{district.title}</span>
            </Link>
          </motion.div>
        );
      })}

      {districts.map((district, index) => {
        const angle = Math.atan2(district.y - 50, district.x - 50);
        const length = Math.hypot(district.x - 50, district.y - 50);

        return (
          <motion.span
            key={`${district.title}-line`}
            className="pointer-events-none absolute left-1/2 top-1/2 block h-px origin-left bg-gradient-to-r from-[#7FB1FF] to-transparent"
            style={{ width: `${length * 0.7}%`, rotate: `${(angle * 180) / Math.PI}deg` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + index * 0.16, repeat: Infinity }}
          />
        );
      })}
    </motion.div>
  );
}

export default function UniversePageClient() {
  const [activeRole, setActiveRole] = useState<(typeof roles)[number]>("CEO");
  const memoryRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const { scrollYProgress: memoryProgress } = useScroll({
    target: memoryRef,
    offset: ["start end", "end start"],
  });
  const timelineFill = useTransform(memoryProgress, [0, 1], ["0%", "100%"]);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, id) => ({
        id,
        left: `${6 + (id * 5.2) % 90}%`,
        delay: id * 0.2,
        duration: 7 + (id % 5),
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ backgroundPosition: ["0% 30%", "100% 70%", "0% 30%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-28 -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF33,transparent_72%)] blur-3xl"
        />
        <div className="absolute right-[-120px] top-[360px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF24,transparent_72%)] blur-3xl" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-[5] opacity-25" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8,36,102,0.18) 1px, transparent 0)", backgroundSize: "18px 18px" }} />

      <div className="pointer-events-none absolute inset-0 -z-[4]">
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

      <PublicSiteNav activeHref="/universe" />

      <main className="px-4 sm:px-6 lg:px-10">
        <section className="relative pb-16 pt-16 sm:pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Universe</p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.03] tracking-tight text-[#07133D] sm:text-6xl lg:text-7xl">
                One Intelligence Layer.
                <br />
                One Business Memory.
                <br />
                One Operating System.
              </h1>
              <p className="mt-7 max-w-3xl text-base text-[#465683] sm:text-xl">AIOS continuously understands, prioritises and operates your business.</p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <MagneticButton href="/contact" primary>
                  Book Demo
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/products">
                  Explore the Platform
                  <Sparkles size={15} />
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <IntelligenceHub />
            </motion.div>
          </motion.div>
        </section>

        <section className="pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_28px_80px_rgba(7,19,61,0.08)] md:p-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Business Signal Journey</p>
            <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center">
              {signalFlow.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <motion.div
                    animate={{ boxShadow: ["0 0 0 rgba(77,166,255,0)", "0 0 20px rgba(77,166,255,0.42)", "0 0 0 rgba(77,166,255,0)"] }}
                    transition={{ duration: 1.8 + index * 0.18, repeat: Infinity }}
                    className="rounded-full border border-[#C9D8F4] bg-white px-4 py-2 text-sm font-semibold text-[#1D3171]"
                  >
                    {step}
                  </motion.div>
                  {index < signalFlow.length - 1 ? <span className="text-[#8FA1CB]">↓</span> : null}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Role-Based Intelligence</p>
            <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Context transforms by executive role</h2>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_2fr]">
              <div className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_15px_35px_rgba(7,19,61,0.07)]">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setActiveRole(role)}
                      className={
                        activeRole === role
                          ? "min-h-11 rounded-xl bg-[#1976FF] px-3 py-2 text-sm font-semibold text-white"
                          : "min-h-11 rounded-xl border border-[#D9E4F7] bg-[#F7F9FC] px-3 py-2 text-sm font-semibold text-[#51618D] hover:border-[#B6C7EA]"
                      }
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.article
                  key={activeRole}
                  initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-[#DCE5F6] bg-white p-7 shadow-[0_20px_45px_rgba(7,19,61,0.08)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">{activeRole}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#07133D]">{rolePanels[activeRole].heading}</h3>
                  <ul className="mt-5 space-y-3">
                    {rolePanels[activeRole].points.map((point) => (
                      <li key={point} className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-4 py-3 text-sm font-medium text-[#324373]">
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        <section ref={memoryRef} className="pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl rounded-[34px] border border-[#DCE5F7] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Business Memory</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Memory compounds while you scroll</h2>

            <div className="relative mt-8">
              <div className="absolute left-4 top-0 h-full w-px bg-[#D6E2F8]" />
              <motion.div style={{ height: timelineFill }} className="absolute left-4 top-0 w-px bg-[#1976FF]" />

              <div className="space-y-5">
                {memoryFlow.map((item, index) => (
                  <motion.article
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.06, duration: 0.34 }}
                    className="ml-10 rounded-2xl border border-[#E0E9F8] bg-[#F7F9FC] px-4 py-3"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1976FF] text-xs font-semibold text-white">{index + 1}</span>
                    <p className="mt-2 text-sm font-semibold text-[#1B2F6B]">{item}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AI Operators</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Operators orbiting the Intelligence Layer</h2>

            <div className="relative mt-10 flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-[#D6E2F8] bg-white">
              <div className="absolute h-40 w-40 rounded-full border border-[#C7D8F6] bg-gradient-to-br from-[#1A75FF] to-[#63B4FF] text-white shadow-[0_20px_55px_rgba(25,118,255,0.28)]">
                <div className="flex h-full flex-col items-center justify-center">
                  <Globe size={24} />
                  <p className="mt-2 text-sm font-semibold">Intelligence Layer</p>
                </div>
              </div>

              {operators.map((operator, index) => {
                const angle = (index / operators.length) * Math.PI * 2;
                const x = Math.cos(angle) * 145;
                const y = Math.sin(angle) * 110;

                return (
                  <motion.div
                    key={operator}
                    animate={{ x: [x, x * 1.03, x], y: [y, y * 1.03, y] }}
                    transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute rounded-xl border border-[#D6E2F8] bg-white px-3 py-2 text-xs font-semibold text-[#1C2F68] shadow-[0_10px_28px_rgba(7,19,61,0.08)]"
                  >
                    {operator}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="pb-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl rounded-[34px] border border-[#DCE5F7] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Enterprise Ecosystem</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Every enterprise system connected into AIOS</h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="rounded-2xl border border-[#DFE8F8] bg-[#F7F9FC] px-4 py-3 text-sm font-semibold text-[#2D4278]"
                >
                  {integration}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="pb-24">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="mx-auto max-w-5xl rounded-[34px] border border-[#DDE7F8] bg-white px-8 py-14 text-center shadow-[0_24px_70px_rgba(8,26,84,0.08)] md:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Request a Demo</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">Ready to operate your business?</h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href="/contact" primary>
                Book Demo
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/products">
                Explore the Platform
                <Sparkles size={15} />
              </MagneticButton>
            </div>
          </motion.div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
