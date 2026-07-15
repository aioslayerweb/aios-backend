import { Building2, Handshake, LifeBuoy, Megaphone, Rocket, TrendingUp } from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFooterCta,
  PublicHero,
  PublicOrbitVisual,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
} from "@/components/aios"

const contactTracks = [
  {
    title: "Book a Demo",
    body: "Experience AIOS with your own executive workflows, signals, and decision surfaces.",
    icon: Rocket,
  },
  {
    title: "Enterprise Sales",
    body: "Discuss deployment strategy, licensing, architecture requirements, and scale planning.",
    icon: Building2,
  },
  {
    title: "Partnerships",
    body: "Co-build industry intelligence workflows and strategic ecosystem integrations.",
    icon: Handshake,
  },
  {
    title: "Support",
    body: "Resolve onboarding, runtime, and policy operations with the AIOS support team.",
    icon: LifeBuoy,
  },
  {
    title: "Media",
    body: "Press resources, interviews, announcements, and thought leadership requests.",
    icon: Megaphone,
  },
  {
    title: "Investors",
    body: "Learn about category growth, product trajectory, and long-range platform strategy.",
    icon: TrendingUp,
  },
]

const orbitNodes = [
  { title: "Executive Signals", x: "13%", y: "21%" },
  { title: "Memory Graph", x: "70%", y: "16%" },
  { title: "Workflow Runtime", x: "78%", y: "52%" },
  { title: "Decision Engine", x: "18%", y: "58%" },
  { title: "Agent Network", x: "31%", y: "82%" },
  { title: "Policy Guardrails", x: "61%", y: "78%" },
]

export default function ContactPage() {
  return (
    <PublicPageShell activeHref="/contact">
      <PublicHero
        eyebrow="Contact AIOS"
        title="Let’s build the autonomous enterprise together"
        body="The contact experience now belongs to the same AIOS system: premium surfaces, restrained motion, generous spacing, and one consistent operating language."
        actions={
          <>
            <PublicButtonLink href="/products" size="lg">
              Explore Platform
            </PublicButtonLink>
            <PublicButtonLink href="/architecture" variant="secondary" size="lg">
              Review Architecture
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Response paths", value: "6", detail: "Demo, sales, support, partnerships, media, investors" },
          { label: "Primary focus", value: "Enterprise", detail: "Architecture, rollout, governance, and operating model" },
          { label: "Global reach", value: "Connected", detail: "Signals, memory, operators, and workflows in one system" },
        ]}
        visual={<PublicOrbitVisual label="AIOS" title="Global Intelligence" nodes={orbitNodes} />}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Start The Conversation"
            title="Minimal intake, high-context routing"
            body="The form and contact surfaces use the same input, card, and spacing tokens as the rest of the design system."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="public-card public-card-floating">
              <p className="public-eyebrow">Contact Form</p>
              <h2 className="public-h3 mt-4">Start the conversation</h2>
              <p className="public-body mt-3">Minimal intake for the right team to respond quickly.</p>

              <form className="mt-8 space-y-4" action="#" method="post">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-[color:var(--public-color-text)]">
                    Full name
                    <input name="name" type="text" required placeholder="Your name" className="public-input mt-2" />
                  </label>
                  <label className="block text-sm font-medium text-[color:var(--public-color-text)]">
                    Work email
                    <input name="email" type="email" required placeholder="you@company.com" className="public-input mt-2" />
                  </label>
                </div>
                <label className="block text-sm font-medium text-[color:var(--public-color-text)]">
                  Company
                  <input name="company" type="text" placeholder="Company name" className="public-input mt-2" />
                </label>
                <label className="block text-sm font-medium text-[color:var(--public-color-text)]">
                  How can AIOS help?
                  <textarea name="message" rows={6} placeholder="Tell us about your architecture, workflows, or executive use case" className="public-input mt-2 min-h-[160px] py-3" />
                </label>
                <button type="submit" className="public-button public-button-primary px-6 py-3">
                  Send inquiry
                </button>
              </form>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {contactTracks.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="public-card public-card-standard public-card-hover h-full">
                    <span className="mb-5 inline-flex rounded-2xl bg-[var(--public-color-muted)] p-3 text-[color:var(--public-color-primary)]">
                      <Icon size={18} />
                    </span>
                    <h3 className="public-h4">{item.title}</h3>
                    <p className="public-body mt-3">{item.body}</p>
                  </article>
                )
               })}
             </div>
           </div>
         </PublicContainer>
       </PublicSection>
 
       <PublicFooterCta
         eyebrow="Meet AIOS"
         title="Bring your signals, workflows, and executive questions into one system"
         body="The contact route now carries the same premium, enterprise-grade calm as the rest of the public AIOS experience."
       />
     </PublicPageShell>
   )
 }
