"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Database,
  GitCompare,
  Network,
  Sparkles,
  Users,
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

type Product = {
  key: string;
  title: string;
  icon: LucideIcon;
  benefits: string[];
  outcomes: string[];
  useCases: string[];
  roi: string;
  pricingTeaser: string;
};

const products: Product[] = [
  {
    key: "revenue-operator",
    title: "Revenue Operator",
    icon: ChartNoAxesCombined,
    benefits: ["Forecast variance alerts", "Pipeline risk detection", "Opportunity prioritization"],
    outcomes: ["Faster deal recovery", "Improved forecast confidence", "Higher win-rate consistency"],
    useCases: ["Quarterly pipeline stabilization", "Churn risk prevention", "Territory performance optimization"],
    roi: "Up to 12% forecast improvement",
    pricingTeaser: "Growth plan add-on",
  },
  {
    key: "customer-intelligence",
    title: "Customer Intelligence",
    icon: Users,
    benefits: ["Customer health scoring", "Journey anomaly detection", "Engagement signal synthesis"],
    outcomes: ["Reduced churn", "Higher retention", "Better account expansion timing"],
    useCases: ["At-risk account intervention", "Enterprise renewal strategy", "Support-to-success handoff"],
    roi: "Up to 18% churn reduction",
    pricingTeaser: "Included in Professional",
  },
  {
    key: "executive-center",
    title: "Executive Center",
    icon: Building2,
    benefits: ["Priority dashboards", "Decision context narratives", "Board-ready summaries"],
    outcomes: ["Lower decision latency", "Higher strategic clarity", "Improved leadership alignment"],
    useCases: ["Weekly operating reviews", "Executive briefings", "Cross-functional alignment"],
    roi: "40% faster strategic decisions",
    pricingTeaser: "Professional and Enterprise",
  },
  {
    key: "business-memory",
    title: "Business Memory",
    icon: Database,
    benefits: ["Persistent institutional memory", "Outcome-linked context", "Evidence indexing"],
    outcomes: ["Compounding intelligence", "Fewer repeated mistakes", "Higher recommendation quality"],
    useCases: ["Post-mortem learning loops", "Decision traceability", "Policy evolution"],
    roi: "3x faster context recall",
    pricingTeaser: "Core platform foundation",
  },
  {
    key: "workflow-builder",
    title: "Workflow Builder",
    icon: Workflow,
    benefits: ["Policy-governed automation", "Approval checkpoints", "Adaptive execution chains"],
    outcomes: ["Reduced manual operations", "More reliable execution", "Safer automation rollout"],
    useCases: ["Finance approval chains", "Ops escalation workflows", "Cross-team orchestration"],
    roi: "35% operations efficiency gain",
    pricingTeaser: "Professional and Enterprise",
  },
  {
    key: "knowledge-center",
    title: "Knowledge Center",
    icon: Network,
    benefits: ["Knowledge graph unification", "Signal-to-knowledge linkage", "Context-aware search"],
    outcomes: ["Faster investigation", "Stronger traceability", "More explainable recommendations"],
    useCases: ["Policy intelligence", "Entity relationship insights", "Regulatory evidence navigation"],
    roi: "50% faster root-cause analysis",
    pricingTeaser: "Included in Professional",
  },
  {
    key: "advanced-intelligence-pack",
    title: "Advanced Intelligence Pack",
    icon: BrainCircuit,
    benefits: ["Deep reasoning models", "Confidence calibration", "Predictive scenario testing"],
    outcomes: ["Higher precision recommendations", "Earlier risk detection", "More reliable automation outcomes"],
    useCases: ["Strategic what-if analysis", "Multi-factor risk forecasting", "Executive simulation briefs"],
    roi: "Up to 2.4x insight accuracy lift",
    pricingTeaser: "Enterprise premium package",
  },
];

const comparisonRows = [
  {
    label: "Decision speed",
    standard: "Weekly review cadence",
    aios: "Continuous intelligence updates",
  },
  {
    label: "Signal coverage",
    standard: "Siloed system snapshots",
    aios: "Cross-system unified intelligence",
  },
  {
    label: "Automation reliability",
    standard: "Rule-based execution",
    aios: "Policy-governed adaptive workflows",
  },
  {
    label: "Executive visibility",
    standard: "Manual dashboards",
    aios: "Live decision narratives",
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

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState(products[0].key);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -72]);

  const active = products.find((item) => item.key === activeProduct) ?? products[0];

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

      <PublicSiteNav activeHref="/products" />

      <main className="px-6 lg:px-10">
        <section className="relative pb-14 pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">AIOS Products</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">Premium product catalogue for autonomous business intelligence</h1>
              <p className="mt-7 max-w-2xl text-lg text-[#465683] md:text-xl">
                AIOS products combine into one operating system for executive decisioning, autonomous operations, and continuous business learning.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <MagneticButton href="/contact" primary>
                  Request Demo
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/contact">
                  Talk to Sales
                  <Sparkles size={15} />
                </MagneticButton>
              </div>
            </motion.div>

            <motion.article
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-[#DCE5F6] bg-white p-6 shadow-[0_22px_60px_rgba(7,19,61,0.08)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1976FF]">Featured Product</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#07133D]">Revenue Operator</h2>
              <p className="mt-3 text-sm text-[#526289]">Predictive pipeline intelligence with confidence-driven intervention guidance.</p>
              <div className="mt-5 space-y-2">
                {["Forecast variance alerts", "At-risk account surfacing", "Opportunity sequencing"].map((item, index) => (
                  <motion.div
                    key={item}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.6 + index * 0.2, repeat: Infinity }}
                    className="rounded-xl border border-[#E0E8F8] bg-[#F7F9FC] px-3 py-2 text-sm font-medium text-[#2B3F79]"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.article>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_28px_80px_rgba(7,19,61,0.08)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Product Catalogue</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-5xl">Interactive product explorer</h2>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product, index) => {
                  const Icon = product.icon;
                  const isActive = product.key === activeProduct;

                  return (
                    <motion.button
                      key={product.key}
                      type="button"
                      onClick={() => setActiveProduct(product.key)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.04, duration: 0.32 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className={
                        isActive
                          ? "rounded-2xl border border-[#9CBDF5] bg-white p-5 text-left shadow-[0_16px_38px_rgba(7,19,61,0.08)]"
                          : "rounded-2xl border border-[#DCE5F6] bg-white p-5 text-left shadow-[0_10px_24px_rgba(7,19,61,0.05)]"
                      }
                    >
                      <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                        <Icon size={18} />
                      </div>
                      <p className="mt-3 text-base font-semibold text-[#07133D]">{product.title}</p>
                      <p className="mt-2 text-sm text-[#5A6894]">{product.pricingTeaser}</p>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.article
                  key={active.key}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.34 }}
                  className="rounded-3xl border border-[#DCE5F6] bg-white p-5 shadow-[0_18px_45px_rgba(7,19,61,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1976FF]">Interactive preview</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#07133D]">{active.title}</h3>

                  <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#DCE6F8] bg-[#F7F9FC] p-4">
                    <motion.div
                      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(25,118,255,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(77,166,255,0.16),transparent_45%)]"
                    />

                    <div className="relative space-y-3">
                      <div className="rounded-xl border border-[#D3E1F9] bg-white px-3 py-2 text-xs font-semibold text-[#29437A]">ROI: {active.roi}</div>
                      <div className="grid gap-2">
                        {active.outcomes.map((row, index) => (
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

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {active.benefits.map((benefit) => (
                      <div key={benefit} className="rounded-xl border border-[#E0E9F8] bg-[#F7F9FC] px-3 py-2 text-xs font-semibold text-[#344778]">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Enterprise Use Cases</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Where AIOS products create measurable business outcomes</h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => {
                const Icon = product.icon;

                return (
                  <motion.article
                    key={`${product.key}-use-cases`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.04, duration: 0.32 }}
                    className="rounded-2xl border border-[#E0E8F7] bg-[#F7F9FC] p-4"
                  >
                    <div className="inline-flex rounded-xl bg-white p-2.5 text-[#1976FF]">
                      <Icon size={17} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[#07133D]">{product.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-[#55648F]">
                      {product.useCases.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-white p-6 shadow-[0_20px_55px_rgba(7,19,61,0.07)] md:p-8">
            <div className="flex items-center gap-2">
              <GitCompare size={16} className="text-[#1976FF]" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Interactive Comparison</p>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Standard software stack vs AIOS product system</h2>

            <div className="mt-7 overflow-hidden rounded-2xl border border-[#DFE8F8]">
              <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#F7F9FC] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#4B5B87]">
                <span>Capability</span>
                <span>Standard Stack</span>
                <span>AIOS Products</span>
              </div>

              {comparisonRows.map((row, index) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.05, duration: 0.28 }}
                  className="grid grid-cols-[1fr_1fr_1fr] items-center border-t border-[#E3EBFA] px-4 py-4 text-sm"
                >
                  <p className="font-semibold text-[#1F3168]">{row.label}</p>
                  <p className="text-[#60709A]">{row.standard}</p>
                  <motion.p
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.2 + index * 0.2, repeat: Infinity }}
                    className="font-semibold text-[#1976FF]"
                  >
                    {row.aios}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="rounded-[34px] border border-[#DCE5F7] bg-[#F7F9FC] p-6 shadow-[0_22px_60px_rgba(7,19,61,0.07)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Pricing Teaser</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#07133D] md:text-4xl">Flexible product packaging for enterprise scale</h2>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                { tier: "Professional", detail: "Core operating modules", teaser: "Starts with platform essentials" },
                { tier: "Growth", detail: "Operators + advanced automation", teaser: "For scaling cross-functional teams" },
                { tier: "Enterprise", detail: "Advanced Intelligence Pack + governance", teaser: "Custom architecture and SLAs" },
              ].map((item, index) => (
                <motion.article
                  key={item.tier}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="rounded-2xl border border-[#DCE5F6] bg-white p-5"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1976FF]">{item.tier}</p>
                  <p className="mt-2 text-lg font-semibold text-[#07133D]">{item.detail}</p>
                  <p className="mt-2 text-sm text-[#5A6894]">{item.teaser}</p>
                </motion.article>
              ))}
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Products CTA</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">Design your AIOS product stack for enterprise outcomes</h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href="/contact" primary>
                Request Demo
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
