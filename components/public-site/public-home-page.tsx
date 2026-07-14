"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Cpu,
  Database,
  DollarSign,
  Network,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/branding";

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

const ecosystemNodes = [
  { title: "Executive Center", x: "14%", y: "20%" },
  { title: "Command Center", x: "75%", y: "15%" },
  { title: "Memory Center", x: "8%", y: "52%" },
  { title: "Workflow Builder", x: "74%", y: "50%" },
  { title: "Knowledge Center", x: "20%", y: "76%" },
  { title: "Agent Studio", x: "62%", y: "77%" },
  { title: "Developer Center", x: "42%", y: "8%" },
  { title: "Runtime Center", x: "44%", y: "90%" },
] as const;

const trustedLogos = [
  "NOVA Systems",
  "Northline",
  "Aurelia",
  "Vector Dynamics",
  "Arcbridge",
  "HelioWorks",
  "Peak Grid",
  "Quantive",
  "Aster Core",
  "Foundry One",
];

const signalSources = ["CRM", "Email", "ERP", "Slack", "Teams", "Support", "Knowledge", "Finance", "HR"];

const comparisonRows = [
  { old: "CRM", next: "Company Intelligence" },
  { old: "Automation", next: "Autonomous Operations" },
  { old: "AI Copilot", next: "Continuous Intelligence" },
];

const modules = [
  { title: "Executive Center", icon: Building2, body: "Leadership priorities and decision confidence in one view." },
  { title: "Command Center", icon: Radar, body: "Cross-domain signal orchestration and task control." },
  { title: "Memory Center", icon: Database, body: "Persistent business memory from outcomes and evidence." },
  { title: "Knowledge Center", icon: Network, body: "Graph intelligence that explains business context." },
  { title: "Workflow Builder", icon: Workflow, body: "Autonomous workflow orchestration with approvals." },
  { title: "Agent Studio", icon: Cpu, body: "Specialized agents operating with shared memory." },
  { title: "Developer Center", icon: Briefcase, body: "SDK, extensions, and enterprise developer tools." },
  { title: "Runtime Center", icon: ShieldCheck, body: "Runtime reliability, policy controls, and governance." },
] as const;

const memoryTimeline = [
  "Signals captured",
  "Signals contextualized",
  "Context becomes knowledge",
  "Knowledge becomes intelligence",
  "Intelligence drives action",
  "Outcomes reinforce memory",
];

const roles = ["CEO", "Sales", "Marketing", "Finance", "Operations", "HR"] as const;

const rolePreview: Record<(typeof roles)[number], { title: string; points: string[] }> = {
  CEO: {
    title: "Executive macro view",
    points: ["2 critical decisions", "4 opportunities", "1 systemic risk", "Confidence 94%"],
  },
  Sales: {
    title: "Revenue execution view",
    points: ["Pipeline drift -8%", "3 deal interventions", "2 churn risks", "Forecast confidence 89%"],
  },
  Marketing: {
    title: "Demand and narrative view",
    points: ["Campaign velocity rising", "4 segment opportunities", "Attribution clarity improved", "Signal confidence 91%"],
  },
  Finance: {
    title: "Capital and variance view",
    points: ["Budget anomaly detected", "Cash runway stabilized", "Margin alert in one unit", "Confidence 93%"],
  },
  Operations: {
    title: "Execution reliability view",
    points: ["Throughput +6%", "1 policy violation", "3 bottlenecks prioritized", "Recovery confidence 88%"],
  },
  HR: {
    title: "People and capability view",
    points: ["Attrition signal moderate", "Hiring velocity on target", "2 leadership gaps flagged", "Confidence 86%"],
  },
};

const operators = [
  { title: "Revenue Operator", icon: DollarSign },
  { title: "Customer Operator", icon: Users },
  { title: "Operations Operator", icon: Workflow },
  { title: "Finance Operator", icon: Briefcase },
  { title: "HR Operator", icon: Users },
] as const;

const architecture = ["Data", "Memory", "Intelligence", "Decision Engine", "Agents", "Workflows", "Business Outcomes"];

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Modules", href: "#modules" },
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/legal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
            ? "inline-flex items-center gap-2 rounded-full bg-[#1976FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,118,255,0.25)] transition hover:scale-[1.02] hover:bg-[#0f68ee]"
            : "inline-flex items-center gap-2 rounded-full border border-[#D7DEED] bg-white px-7 py-3 text-sm font-semibold text-[#07133D] transition hover:scale-[1.02] hover:border-[#A6B6E0]"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-header border-b border-[#E6ECF7]/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10" aria-label="Top navigation">
        <Link href="/" className="flex items-center" aria-label="AIOS home">
          <BrandLogo width={144} height={34} priority />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-[#2D3A68] transition hover:text-[#1976FF]">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app" className="hidden rounded-full border border-[#D7DEED] px-4 py-2 text-sm font-semibold text-[#07133D] transition hover:border-[#1976FF]/40 md:inline-flex">
            Login
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#07133D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0B1D56]">
            Book Demo
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroEcosystem() {
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 120, damping: 18, mass: 0.5 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 120, damping: 18, mass: 0.5 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateYRaw.set((px - 0.5) * 14);
        rotateXRaw.set((0.5 - py) * 12);
      }}
      onMouseLeave={() => {
        rotateXRaw.set(0);
        rotateYRaw.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className="relative mx-auto aspect-[1.1/1] w-full max-w-[620px]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 54, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CAD6F0]/70"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 68, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#BBCBEE]"
      />
      <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/60 bg-gradient-to-br from-[#1A75FF] to-[#4DA6FF] p-5 text-white shadow-[0_24px_70px_rgba(25,118,255,0.35)]">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-100">AIOS Core</p>
        <p className="mt-4 text-2xl font-semibold leading-tight">Intelligence Layer</p>
      </div>

      {ecosystemNodes.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: [0, index % 2 === 0 ? -8 : -5, 0], scale: 1 }}
          transition={{ delay: index * 0.06, y: { duration: 4 + index * 0.25, repeat: Infinity, ease: "easeInOut" } }}
          style={{ left: item.x, top: item.y }}
          className="absolute rounded-2xl border border-white/70 bg-white/88 px-3 py-2 text-xs font-semibold text-[#11235D] shadow-[0_12px_35px_rgba(8,28,92,0.12)] backdrop-blur"
        >
          {item.title}
        </motion.div>
      ))}

      {ecosystemNodes.map((item, index) => (
        <motion.span
          key={`${item.title}-signal`}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.6 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `calc(${item.x} + 24px)`, top: `calc(${item.y} + 14px)` }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#1976FF] shadow-[0_0_16px_rgba(25,118,255,0.8)]"
        />
      ))}
    </motion.div>
  );
}

function TrustedMarquee() {
  const track = [...trustedLogos, ...trustedLogos];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#7380A8]">Trusted by modern businesses</p>
      <div className="relative">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          className="flex min-w-max items-center gap-4"
        >
          {track.map((logo, index) => (
            <div key={`${logo}-${index}`} className="rounded-full border border-[#DEE6F5] bg-[#F7F9FC] px-5 py-2.5 text-sm font-semibold text-[#50608E]">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SpatialSignalDiagram() {
  return (
    <section id="platform" className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">What is AIOS?</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">A spatial intelligence layer across the whole business</h2>

        <div className="relative mx-auto mt-16 aspect-[1.5/1] w-full max-w-5xl rounded-[34px] border border-[#DFE7F6] bg-[#F7F9FC]/70 p-6 shadow-[0_30px_80px_rgba(7,19,61,0.09)]">
          <div className="absolute left-1/2 top-1/2 z-10 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#C8D7F3] bg-white px-5 py-6 text-center shadow-[0_20px_50px_rgba(9,30,95,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1976FF]">Core</p>
            <p className="mt-2 text-xl font-semibold text-[#07133D]">AIOS Intelligence Layer</p>
          </div>

          {signalSources.map((source, index) => {
            const angle = (index / signalSources.length) * Math.PI * 2;
            const cx = 50 + Math.cos(angle) * 38;
            const cy = 50 + Math.sin(angle) * 32;

            return (
              <motion.div
                key={source}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                style={{ left: `${cx}%`, top: `${cy}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#D3DEF2] bg-white px-3 py-2 text-xs font-semibold text-[#1A2B62]"
              >
                {source}
              </motion.div>
            );
          })}

          {signalSources.map((source, index) => {
            const angle = (index / signalSources.length) * Math.PI * 2;

            return (
              <motion.span
                key={`${source}-line`}
                className="pointer-events-none absolute left-1/2 top-1/2 block h-px origin-left bg-gradient-to-r from-[#7FB1FF] to-transparent"
                style={{ width: "32%", rotate: `${(angle * 180) / Math.PI}deg` }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + index * 0.16, repeat: Infinity }}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Why AIOS</p>
        <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">From static software to continuous intelligence</h2>

        <div className="mt-14 space-y-4">
          {comparisonRows.map((row, index) => (
            <motion.article
              key={row.old}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-3xl border border-[#DDE5F5] bg-white p-5 shadow-[0_10px_25px_rgba(7,19,61,0.06)]"
            >
              <p className="text-right text-lg font-semibold text-[#6D7AA2] md:text-2xl">{row.old}</p>
              <p className="text-xl font-bold text-[#1976FF]">↓</p>
              <p className="text-lg font-semibold text-[#07133D] md:text-2xl">{row.next}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section id="modules" className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} variants={fadeUp} className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Platform Modules</p>
        <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">One operating surface, specialized intelligence modules</h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module, index) => {
            const Icon = module.icon as LucideIcon;

            return (
              <motion.article
                key={module.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                whileHover={{ y: -8, scale: 1.015, rotateX: 3, rotateY: -3 }}
                className="group relative rounded-3xl border border-[#D9E3F5] bg-white p-6 shadow-[0_18px_50px_rgba(7,19,61,0.08)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1976FF]/0 via-[#1976FF]/0 to-[#38A4FF]/0 transition group-hover:from-[#1976FF]/8 group-hover:to-[#38A4FF]/16" />
                <div className="relative">
                  <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#07133D]">{module.title}</h3>
                  <p className="mt-2 text-sm text-[#5A6894]">{module.body}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function BusinessMemorySection() {
  return (
    <section className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-5xl rounded-[34px] border border-[#DAE4F6] bg-white p-8 shadow-[0_25px_70px_rgba(8,26,84,0.08)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Business Memory</p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Memory that compounds business intelligence over time</h2>

        <div className="mt-12 space-y-6">
          {memoryTimeline.map((step, index) => (
            <motion.div key={step} className="grid grid-cols-[auto_1fr] items-center gap-4" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1976FF] text-xs font-bold text-white">{index + 1}</span>
                {index < memoryTimeline.length - 1 ? <span className="h-px w-12 bg-[#B9CCEE]" /> : null}
              </div>
              <p className="text-base font-medium text-[#1C2D62] md:text-lg">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RoleIntelligenceSection() {
  const [activeRole, setActiveRole] = useState<(typeof roles)[number]>("CEO");

  return (
    <section className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Role-Based Intelligence</p>
        <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">One system, role-specific executive context</h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_2fr]">
          <div className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_15px_35px_rgba(7,19,61,0.07)]">
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={
                    activeRole === role
                      ? "rounded-xl bg-[#1976FF] px-3 py-2 text-sm font-semibold text-white"
                      : "rounded-xl border border-[#D9E4F7] bg-[#F7F9FC] px-3 py-2 text-sm font-semibold text-[#51618D] hover:border-[#B6C7EA]"
                  }
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <motion.article
            key={activeRole}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-[#DCE5F6] bg-white p-7 shadow-[0_20px_45px_rgba(7,19,61,0.08)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">{activeRole}</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#07133D]">{rolePreview[activeRole].title}</h3>
            <ul className="mt-5 space-y-3">
              {rolePreview[activeRole].points.map((point) => (
                <li key={point} className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-4 py-3 text-sm font-medium text-[#324373]">
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </motion.div>
    </section>
  );
}

function OperatorsSection() {
  return (
    <section className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AI Operators</p>
        <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Operators collaborating as one autonomous system</h2>

        <div className="mt-14 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {operators.map((operator, index) => {
            const Icon = operator.icon as LucideIcon;

            return (
              <motion.article
                key={operator.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                animate={{ y: [0, index % 2 ? -8 : -5, 0] }}
                className="rounded-3xl border border-[#DCE6F6] bg-white p-5 text-center shadow-[0_14px_35px_rgba(7,19,61,0.07)]"
              >
                <div className="mx-auto inline-flex rounded-full bg-[#EAF2FF] p-3 text-[#1976FF]">
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#1A2C63]">{operator.title}</p>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mx-auto max-w-6xl rounded-[34px] border border-[#DCE5F7] bg-gradient-to-br from-[#07133D] to-[#0A2B7E] p-8 shadow-[0_30px_80px_rgba(7,19,61,0.28)] md:p-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Enterprise Architecture</p>
        <h2 className="mt-5 text-center text-4xl font-semibold tracking-tight text-white md:text-5xl">From data to measurable outcomes</h2>

        <div className="mt-14 flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center">
          {architecture.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <motion.div
                animate={{ boxShadow: ["0 0 0 rgba(77,166,255,0)", "0 0 22px rgba(77,166,255,0.45)", "0 0 0 rgba(77,166,255,0)"] }}
                transition={{ duration: 1.8 + index * 0.2, repeat: Infinity }}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
              >
                {step}
              </motion.div>
              {index < architecture.length - 1 ? <span className="text-blue-200">↓</span> : null}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-24 pt-12">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="mx-auto max-w-5xl rounded-[34px] border border-[#DDE7F8] bg-white px-8 py-14 text-center shadow-[0_25px_70px_rgba(8,26,84,0.08)] md:px-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Call To Action</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">One Intelligence Layer. Start operating your business.</h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton href="/contact" primary>
            Book Demo
            <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="/app">
            Launch AIOS
            <Sparkles size={15} />
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

export function PublicHomePage() {
  const [particles] = useState(() => Array.from({ length: 18 }, (_, index) => index));
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const backGlowY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const particleNodes = useMemo(
    () =>
      particles.map((id) => ({
        id,
        left: `${6 + (id * 5.1) % 90}%`,
        delay: id * 0.2,
        duration: 7 + (id % 5),
      })),
    [particles]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ y: backGlowY }} className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 30%", "100% 70%", "0% 30%"],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF33,transparent_72%)] blur-3xl"
        />
        <div className="absolute right-[-120px] top-[320px] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF2F,transparent_72%)] blur-3xl" />
        <div className="absolute left-[30%] top-[980px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,#1B64D124,transparent_72%)] blur-3xl" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-[5] opacity-25" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8,36,102,0.18) 1px, transparent 0)", backgroundSize: "18px 18px" }} />

      <div className="pointer-events-none absolute inset-0 -z-[4]">
        {particleNodes.map((particle) => (
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

      <TopNav />

      <main>
        <section className="relative px-6 pb-14 pt-20 lg:px-10 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Home v3</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">
                One Intelligence Layer.
                <br />
                One Business Memory.
                <br />
                One Operating System.
              </h1>
              <p className="mt-7 max-w-2xl text-lg text-[#465683] md:text-xl">
                AIOS continuously understands, prioritises and operates your business.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <MagneticButton href="/contact" primary>
                  Book Demo
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/products">
                  Watch Demo
                  <Play size={15} />
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
              <HeroEcosystem />
            </motion.div>
          </motion.div>
        </section>

        <div className="px-6 lg:px-10">
          <TrustedMarquee />
          <SpatialSignalDiagram />
          <ComparisonSection />
          <ModulesSection />
          <BusinessMemorySection />
          <RoleIntelligenceSection />
          <OperatorsSection />
          <ArchitectureSection />
          <FinalCta />
        </div>
      </main>

      <footer className="border-t border-[#E3EAF8] bg-white px-6 py-10 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo width={118} height={28} />
            <span className="text-sm text-[#5D6C95]">Operating system for autonomous businesses</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#4A5A88]">
            <Link href="/about" className="transition hover:text-[#1976FF]">About</Link>
            <Link href="/products" className="transition hover:text-[#1976FF]">Products</Link>
            <Link href="/contact" className="transition hover:text-[#1976FF]">Contact</Link>
            <Link href="/legal" className="transition hover:text-[#1976FF]">Legal</Link>
            <Link href="/app" className="inline-flex items-center gap-1 font-semibold text-[#1976FF]">
              Launch AIOS
              <Sparkles size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
