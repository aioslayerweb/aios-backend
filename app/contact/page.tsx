"use client";

import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Building2, Globe2, Handshake, LifeBuoy, Megaphone, Rocket, Sparkles, TrendingUp } from "lucide-react";
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

const contactTracks = [
  {
    title: "Book a Demo",
    body: "Experience AIOS with your own executive workflows, signals, and decision surfaces.",
    cta: "Schedule Demo",
    icon: Rocket,
    accent: "from-[#1A75FF] to-[#4DA6FF]",
  },
  {
    title: "Enterprise Sales",
    body: "Discuss deployment strategy, licensing, architecture requirements, and scale planning.",
    cta: "Talk to Sales",
    icon: Building2,
    accent: "from-[#0C2E86] to-[#1A75FF]",
  },
  {
    title: "Partnerships",
    body: "Co-build industry intelligence workflows and strategic ecosystem integrations.",
    cta: "Partner with AIOS",
    icon: Handshake,
    accent: "from-[#0A579F] to-[#2F8CFF]",
  },
  {
    title: "Support",
    body: "Resolve onboarding, runtime, and policy operations with the AIOS support team.",
    cta: "Contact Support",
    icon: LifeBuoy,
    accent: "from-[#0759C9] to-[#3F9EFF]",
  },
  {
    title: "Media",
    body: "Press resources, interviews, announcements, and thought leadership requests.",
    cta: "Media Inquiries",
    icon: Megaphone,
    accent: "from-[#133A90] to-[#2E86FF]",
  },
  {
    title: "Investors",
    body: "Learn about category growth, product trajectory, and long-range platform strategy.",
    cta: "Investor Relations",
    icon: TrendingUp,
    accent: "from-[#12317B] to-[#247BFF]",
  },
] as const;

const globeNodes = [
  { title: "Executive Signals", x: "13%", y: "21%" },
  { title: "Memory Graph", x: "70%", y: "16%" },
  { title: "Workflow Runtime", x: "78%", y: "52%" },
  { title: "Decision Engine", x: "18%", y: "58%" },
  { title: "Agent Network", x: "31%", y: "82%" },
  { title: "Policy Guardrails", x: "61%", y: "78%" },
] as const;

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

function ContactGlobe() {
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
        rotateYRaw.set((px - 0.5) * 16);
        rotateXRaw.set((0.5 - py) * 14);
      }}
      onMouseLeave={() => {
        rotateXRaw.set(0);
        rotateYRaw.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 58, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CBD9F2]/80"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 72, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#B8C9ED]"
      />
      <motion.div
        animate={{ rotate: [0, 6, 0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-gradient-to-br from-[#1A75FF] via-[#2A86FF] to-[#6AB5FF] shadow-[0_24px_70px_rgba(25,118,255,0.34)]"
      >
        <div className="flex h-full flex-col items-center justify-center text-white">
          <Globe2 size={30} />
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-blue-100">AIOS</p>
          <p className="text-xl font-semibold">Global Intelligence</p>
        </div>
      </motion.div>

      {globeNodes.map((node, index) => (
        <motion.div
          key={node.title}
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: [0, index % 2 === 0 ? -8 : -6, 0], scale: 1 }}
          transition={{ delay: index * 0.08, y: { duration: 3.6 + index * 0.22, repeat: Infinity, ease: "easeInOut" } }}
          style={{ left: node.x, top: node.y }}
          className="absolute rounded-2xl border border-white/70 bg-white/88 px-3 py-2 text-xs font-semibold text-[#11235D] shadow-[0_12px_35px_rgba(8,28,92,0.12)] backdrop-blur"
        >
          {node.title}
        </motion.div>
      ))}

      {globeNodes.map((node, index) => (
        <motion.span
          key={`${node.title}-dot`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `calc(${node.x} + 20px)`, top: `calc(${node.y} + 14px)` }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#1976FF] shadow-[0_0_16px_rgba(25,118,255,0.8)]"
        />
      ))}
    </motion.div>
  );
}

export default function ContactPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -65]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#07133D]" style={{ fontFamily: "Inter, sans-serif" }}>
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ backgroundPosition: ["0% 30%", "100% 70%", "0% 30%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 -top-24 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF2B,transparent_72%)] blur-3xl"
        />
        <div className="absolute right-[-140px] top-[320px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF21,transparent_72%)] blur-3xl" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-[4] opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8,36,102,0.15) 1px, transparent 0)", backgroundSize: "18px 18px" }} />

      <PublicSiteNav activeHref="/contact" />

      <main className="px-6 lg:px-10">
        <section className="relative pb-14 pt-20 lg:pt-24">
          <motion.div style={{ y: heroY }} className="mx-auto w-full max-w-7xl">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Contact AIOS</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] tracking-tight text-[#07133D] md:text-7xl">Let&apos;s Build the Autonomous Enterprise.</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
              <div className="rounded-[30px] border border-[#DCE5F7] bg-white p-6 shadow-[0_24px_70px_rgba(7,19,61,0.08)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1976FF]">Contact Form</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#07133D]">Start the conversation</h2>
                <p className="mt-2 text-sm text-[#5A6894]">Minimal intake for the right team to respond quickly.</p>

                <form className="mt-6 space-y-4" action="#" method="post">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-[#2F4378]">
                      Full name
                      <input
                        name="name"
                        required
                        type="text"
                        placeholder="Your name"
                        className="mt-2 w-full rounded-xl border border-[#D6E1F4] bg-[#FBFCFF] px-4 py-2.5 text-sm text-[#07133D] outline-none transition focus:border-[#1976FF]/70 focus:ring-2 focus:ring-[#1976FF]/20"
                      />
                    </label>
                    <label className="block text-sm text-[#2F4378]">
                      Work email
                      <input
                        name="email"
                        required
                        type="email"
                        placeholder="you@company.com"
                        className="mt-2 w-full rounded-xl border border-[#D6E1F4] bg-[#FBFCFF] px-4 py-2.5 text-sm text-[#07133D] outline-none transition focus:border-[#1976FF]/70 focus:ring-2 focus:ring-[#1976FF]/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-[#2F4378]">
                      Company
                      <input
                        name="company"
                        required
                        type="text"
                        placeholder="Company name"
                        className="mt-2 w-full rounded-xl border border-[#D6E1F4] bg-[#FBFCFF] px-4 py-2.5 text-sm text-[#07133D] outline-none transition focus:border-[#1976FF]/70 focus:ring-2 focus:ring-[#1976FF]/20"
                      />
                    </label>
                    <label className="block text-sm text-[#2F4378]">
                      Topic
                      <select
                        name="topic"
                        defaultValue="Book a Demo"
                        className="mt-2 w-full rounded-xl border border-[#D6E1F4] bg-[#FBFCFF] px-4 py-2.5 text-sm text-[#07133D] outline-none transition focus:border-[#1976FF]/70 focus:ring-2 focus:ring-[#1976FF]/20"
                      >
                        <option>Book a Demo</option>
                        <option>Enterprise Sales</option>
                        <option>Partnerships</option>
                        <option>Support</option>
                        <option>Media</option>
                        <option>Investors</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-sm text-[#2F4378]">
                    Message
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us your goals and timeline"
                      className="mt-2 w-full resize-none rounded-xl border border-[#D6E1F4] bg-[#FBFCFF] px-4 py-2.5 text-sm text-[#07133D] outline-none transition focus:border-[#1976FF]/70 focus:ring-2 focus:ring-[#1976FF]/20"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1976FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,118,255,0.25)] transition hover:bg-[#0f68ee]"
                  >
                    Send Request
                    <ArrowRight size={15} />
                  </button>
                </form>
              </div>

              <div className="rounded-[30px] border border-[#DCE5F7] bg-[#F7FAFF] p-4 shadow-[0_24px_70px_rgba(7,19,61,0.08)] md:p-6">
                <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1976FF]">Interactive AIOS Globe</p>
                <div className="mt-2">
                  <ContactGlobe />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl pb-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {contactTracks.map((track, index) => {
              const Icon = track.icon;

              return (
                <motion.article
                  key={track.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.36 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative overflow-hidden rounded-3xl border border-[#DCE5F7] bg-white p-6 shadow-[0_16px_45px_rgba(7,19,61,0.08)]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${track.accent}`} />
                  <div className="inline-flex rounded-xl bg-[#EAF2FF] p-2.5 text-[#1976FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#07133D]">{track.title}</h3>
                  <p className="mt-2 text-sm text-[#5A6894]">{track.body}</p>

                  <Link href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F58D8] transition group-hover:translate-x-0.5">
                    {track.cta}
                    <ArrowRight size={15} />
                  </Link>
                </motion.article>
              );
            })}
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1976FF]">Request a Demo</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#07133D] md:text-6xl">Ready to operate your business?</h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href="/contact" primary>
                Request a Demo
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/products">
                Explore Platform
                <Sparkles size={15} />
              </MagneticButton>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
