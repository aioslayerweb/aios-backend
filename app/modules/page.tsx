"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Binary,
  Bot,
  Briefcase,
  Building2,
  Code2,
  Cpu,
  Database,
  Network,
  Radar,
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

type ModuleItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  highlights: string[];
  previewTitle: string;
};

const modules: ModuleItem[] = [
  {
    key: "executive",
    title: "Executive Center",
    icon: Building2,
    summary: "Strategic priorities, decision confidence, and board-level context in one operating view.",
    highlights: ["Critical decisions", "Executive briefings", "Priority shifts"],
    previewTitle: "Executive signal board",
  },
  {
    key: "command",
    title: "Command Center",
    icon: Radar,
    summary: "Cross-system command surface for orchestrating signals, tasks, and automated pathways.",
    highlights: ["Live orchestration", "Cross-team routing", "Escalation control"],
    previewTitle: "Operational command matrix",
  },
  {
    key: "memory",
    title: "Memory Center",
    icon: Database,
    summary: "Persistent business memory objects preserving outcomes, context, and evidence trails.",
    highlights: ["Memory timelines", "Outcome retention", "Context continuity"],
    previewTitle: "Business memory timeline",
  },
  {
    key: "knowledge",
    title: "Knowledge Center",
    icon: Network,
    summary: "Knowledge graph intelligence connecting policies, entities, and enterprise reasoning.",
    highlights: ["Graph insights", "Context linking", "Evidence indexing"],
    previewTitle: "Knowledge graph cluster",
  },
  {
    key: "workflow",
    title: "Workflow Builder",
    icon: Workflow,
    summary: "Governed autonomous workflows from approved decisions to measurable execution.",
    highlights: ["Policy gates", "Automation chains", "Runtime telemetry"],
    previewTitle: "Workflow orchestration canvas",
  },
  {
    key: "agent",
    title: "Agent Studio",
    icon: Bot,
    summary: "Specialized AI operators collaborating with shared memory and role-aware intelligence.",
    highlights: ["Operator network", "Capability packs", "Confidence routing"],
    previewTitle: "Agent collaboration map",
  },
  {
    key: "organization",
    title: "Organization Center",
    icon: Briefcase,
    summary: "Organizational structures, accountability context, and decision ownership intelligence.",
    highlights: ["Ownership mapping", "Entity intelligence", "Org alignment"],
    previewTitle: "Organization intelligence panel",
  },
  {
    key: "runtime",
    title: "Runtime Center",
    icon: Cpu,
    summary: "Runtime controls for safe execution, resilience, and enterprise policy enforcement.",
    highlights: ["Runtime health", "Policy enforcement", "Execution recovery"],
    previewTitle: "Runtime reliability cockpit",
  },
  {
    key: "developer",
    title: "Developer Center",
    icon: Code2,
    summary: "SDKs, extensions, and integration tooling for enterprise platform customization.",
    highlights: ["SDK surfaces", "Extension lifecycle", "Developer telemetry"],
    previewTitle: "Developer extension workspace",
  },
  {
    key: "role",
    title: "Role-Based Intelligence",
    icon: Binary,
    summary: "Adaptive intelligence views for each role, function, and decision horizon.",
    highlights: ["Role context", "Adaptive priorities", "Decision narratives"],
    previewTitle: "Role intelligence dashboard",
  },
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

export default function ModulesPage() {
  const [expanded, setExpanded] = useState<string>(modules[0].key);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -95]);
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
          className="absolute -left-32 -top-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF31,transparent_72%)] blur-3xl"
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

      <PublicSiteNav activeHref="/modules" />

      <main className="px-6 lg:px-10">
        <section className="relative pb-14 pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto w-full max-w-7xl">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Modules</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">An immersive explorer for one operating system</h1>
              <p className="mt-7 max-w-2xl text-lg text-[#465683] md:text-xl">
                Every module runs on the same intelligence layer, shared memory, and execution runtime.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="/products" primary>
                Explore Platform
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/contact">
                Book Demo
                <Sparkles size={15} />
              </MagneticButton>
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_28px_80px_rgba(7,19,61,0.08)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Modules Explorer</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Progressively reveal the AIOS platform as one connected system</h2>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const Icon = module.icon;
                  const isExpanded = expanded === module.key;

                  return (
                    <motion.article
                      key={module.key}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.04, duration: 0.35 }}
                      whileHover={{ y: -3, scale: 1.005 }}
                      className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_16px_40px_rgba(7,19,61,0.07)]"
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(module.key)}
                        className="w-full text-left"
                        aria-expanded={isExpanded}
                        aria-controls={`module-panel-${module.key}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-lg font-semibold text-[#07133D]">{module.title}</h3>
                              <span className="rounded-full border border-[#DBE6F8] bg-[#F7F9FC] px-2.5 py-1 text-[11px] font-semibold text-[#526289]">
                                {isExpanded ? "Expanded" : "Open"}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[#5A6894]">{module.summary}</p>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div
                            id={`module-panel-${module.key}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                              {module.highlights.map((item) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-3 py-2 text-xs font-semibold text-[#344778]"
                                >
                                  {item}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </div>

              <div className="lg:sticky lg:top-24 lg:h-fit">
                <AnimatePresence mode="wait">
                  {modules
                    .filter((module) => module.key === expanded)
                    .map((module) => (
                      <motion.article
                        key={module.key}
                        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                        transition={{ duration: 0.34 }}
                        className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_18px_45px_rgba(7,19,61,0.08)]"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1976FF]">Interactive preview</p>
                        <h3 className="mt-3 text-xl font-semibold text-[#07133D]">{module.previewTitle}</h3>

                        <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#DCE6F8] bg-[#F7F9FC] p-4">
                          <motion.div
                            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(25,118,255,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(77,166,255,0.16),transparent_45%)]"
                          />

                          <div className="relative space-y-3">
                            <div className="rounded-xl border border-[#D3E1F9] bg-white px-3 py-2 text-xs font-semibold text-[#29437A]">
                              Active module: {module.title}
                            </div>
                            <div className="grid gap-2">
                              {["Signal intake", "Memory sync", "Decision context", "Execution status"].map((row, index) => (
                                <motion.div
                                  key={row}
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1.4 + index * 0.25, repeat: Infinity }}
                                  className="rounded-lg border border-[#DCE5F8] bg-white/90 px-3 py-2 text-xs font-medium text-[#40527F]"
                                >
                                  {row}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                </AnimatePresence>
              </div>
            </div>
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Modules</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">
              Everything works together.
              <br />
              One platform.
              <br />
              One intelligence layer.
            </h2>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
