import {
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Database,
  Network,
  Users,
  Workflow,
} from "lucide-react"
import {
  PublicButtonLink,
  PublicContainer,
  PublicFeatureGrid,
  PublicFooterCta,
  PublicHero,
  PublicPageShell,
  PublicSection,
  PublicSectionHeader,
  PublicTabbedPanel,
} from "@/components/aios"
import {
  PublicBenefitsOutcomesSection,
  PublicBuyerJourneySection,
  PublicConversionRailSection,
  PublicEnterpriseTrustMatrixSection,
  PublicExecutiveRoleSection,
  PublicHowItWorksSection,
  PublicIntelligenceCapacitySection,
  PublicPilotProgramSection,
  PublicProblemSolutionSection,
  PublicRoiCalculatorSection,
  PublicSocialProofSection,
  PublicStructuredData,
  PublicTrustAndProofSection,
} from "@/components/public-site/storytelling-sections"
import type { Metadata } from "next"
import { publicPageMetadata } from "@/lib/seo/public-metadata"

export const metadata: Metadata = publicPageMetadata(
  "AIOS Products",
  "Explore AIOS Pilot and the product capabilities that connect business intelligence, memory, role-based context, and workflows.",
  "/products",
)

const products = [
  {
    key: "revenue-operator",
    title: "Revenue Operator",
    icon: <ChartNoAxesCombined size={18} />,
    summary: "A product concept for connecting pipeline context, account signals, and revenue decisions.",
    useCases: ["Pipeline review", "Account context", "Opportunity prioritization"],
  },
  {
    key: "customer-intelligence",
    title: "Customer Intelligence",
    icon: <Users size={18} />,
    summary: "A product concept for bringing customer history, service context, and account ownership together.",
    useCases: ["Customer history", "Service context", "Account ownership"],
  },
  {
    key: "executive-center",
    title: "Executive Center",
    icon: <Building2 size={18} />,
    summary: "A product concept for organizing leadership priorities, decision context, and cross-functional dependencies.",
    useCases: ["Operating reviews", "Executive briefings", "Cross-functional context"],
  },
  {
    key: "business-memory",
    title: "Business Memory",
    icon: <Database size={18} />,
    summary: "A product concept for connecting business events, evidence, decisions, and outcomes over time.",
    useCases: ["Decision context", "Outcome records", "Knowledge continuity"],
  },
  {
    key: "workflow-builder",
    title: "Workflow Builder",
    icon: <Workflow size={18} />,
    summary: "A product concept for representing governed steps from an approved decision to an outcome.",
    useCases: ["Approval paths", "Operational handoffs", "Workflow governance"],
  },
  {
    key: "knowledge-center",
    title: "Knowledge Center",
    icon: <Network size={18} />,
    summary: "A product concept for linking business entities, policies, and supporting evidence.",
    useCases: ["Policy context", "Entity relationships", "Evidence navigation"],
  },
  {
    key: "advanced-intelligence-pack",
    title: "Advanced Intelligence Pack",
    icon: <BrainCircuit size={18} />,
    summary: "A product concept for exploring evidence-led reasoning and decision scenarios.",
    useCases: ["Scenario exploration", "Risk context", "Executive decision briefs"],
  },
]

const productProblemCards = [
  { title: "Point-solution pricing", body: "Organizations buy many tools but still lack operating intelligence." },
  { title: "Unclear capacity planning", body: "Leaders cannot model value across users, workflows, and data scope." },
  { title: "Weak ROI narrative", body: "AI initiatives struggle to connect outputs to financial outcomes." },
  { title: "Pilot fragmentation", body: "Pilot programs often fail to scale into enterprise operating systems." },
]

const productSolutionCards = [
  { title: "AIOS Pilot", body: "A starting point for discussing a defined business use case." },
  { title: "Role context", body: "Explore how priorities can differ by role while permissions stay separate." },
  { title: "Connected memory", body: "Relate signals, supporting evidence, decisions, and outcomes." },
  { title: "Governed workflows", body: "Consider how policy and human approval shape execution." },
]

const productHowItWorks = [
  { label: "Step 1", title: "Clarify a decision", body: "Describe the business question, owners, and intended scope." },
  { label: "Step 2", title: "Review context", body: "Identify relevant information, systems, and access boundaries." },
  { label: "Step 3", title: "Agree evaluation", body: "Choose evidence and measures appropriate to the use case." },
  { label: "Step 4", title: "Discuss next steps", body: "Set scope and timing with the people responsible for delivery." },
]

const productBenefits = [
  { title: "Decision context", body: "Frame business questions with relevant signals and supporting evidence." },
  { title: "Role perspective", body: "Explore the information that matters to different decision-makers." },
  { title: "Governed execution", body: "Keep policies and human approval in view when considering automation." },
]

export default function ProductsPage() {
  return (
    <PublicPageShell activeHref="/products">
      <PublicStructuredData
        name="AIOS Products"
        description="Explore AIOS product concepts for business intelligence, memory, role context, and governed workflows."
        path="/products"
      />
      <PublicHero
        eyebrow="AIOS Products"
        title="Explore the AIOS product model"
        body="Review product concepts for connecting business signals, memory, role context, decision support, and governed workflows."
        actions={
          <>
            <PublicButtonLink href="/contact" size="lg">
              Contact
            </PublicButtonLink>
            <PublicButtonLink href="/modules" variant="secondary" size="lg">
              Explore Modules
            </PublicButtonLink>
          </>
        }
        stats={[
          { label: "Offerings", value: `${products.length}+`, detail: "Pilot, product packs, and enterprise pathways" },
          { label: "Capacity model", value: "Role + Workflow", detail: "Plan by users, actions, and integrations" },
          { label: "ROI focus", value: "Outcome-first", detail: "Time, revenue, cost, and payback visibility" },
        ]}
      />

      <PublicProblemSolutionSection
        problemTitle="Buying AI tools does not create an operating system"
        problemBody="Most product portfolios optimize feature lists, not enterprise intelligence outcomes."
        problemItems={productProblemCards}
        solutionTitle="AIOS offerings are structured for enterprise adoption"
        solutionBody="Pilot-first, ROI-backed, and designed to scale into one governing intelligence layer."
        solutionItems={productSolutionCards}
      />

      <PublicHowItWorksSection
        title="How AIOS commercial adoption works"
        body="The product journey is designed to prove value quickly and scale with confidence."
        steps={productHowItWorks}
      />

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Product Explorer"
            title="Explore product concepts through common business questions"
            body="The descriptions below explain areas of focus. They do not claim that integrations, operators, or outcomes are active in a production environment."
          />
          <div className="mt-14">
            <PublicTabbedPanel
              items={products.map((item) => ({
                key: item.key,
                label: item.title,
                title: item.title,
                body: item.summary,
                bullets: item.useCases,
                icon: item.icon,
              }))}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection>
        <PublicContainer>
          <PublicSectionHeader
            eyebrow="Why It Compounds"
            title="Products improve because the system underneath is shared"
            body="Shared memory, role context, and governed execution make every AIOS product stronger together than apart."
          />
          <div className="mt-14">
            <PublicFeatureGrid
              items={[
                { title: "Revenue intelligence", body: "Forecast and opportunity interventions with context-rich reasoning.", icon: <ChartNoAxesCombined size={18} /> },
                { title: "Customer continuity", body: "Journey, churn, and expansion signals stay connected to enterprise context.", icon: <Users size={18} /> },
                { title: "Executive clarity", body: "Decision narratives and briefings align product surfaces with leadership needs.", icon: <Building2 size={18} /> },
                { title: "Business memory", body: "Institutional memory compounds insight quality across every product.", icon: <Database size={18} /> },
                { title: "Workflow governance", body: "Autonomous execution stays policy-aware and measurable.", icon: <Workflow size={18} /> },
                { title: "Knowledge graph", body: "Recommendations are grounded in linked context and explainability.", icon: <Network size={18} /> },
                { title: "Advanced intelligence", body: "Scenario reasoning and confidence calibration improve recommendation precision.", icon: <BrainCircuit size={18} /> },
              ]}
              columns={4}
            />
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicBenefitsOutcomesSection
        title="A decision-support model designed around context and governance"
        body="These are intended product principles, not measured customer outcomes."
        benefits={productBenefits}
      />

      <PublicRoiCalculatorSection />

      <PublicIntelligenceCapacitySection />

      <PublicPilotProgramSection />

      <PublicEnterpriseTrustMatrixSection />

      <PublicExecutiveRoleSection />

      <PublicSocialProofSection />

      <PublicBuyerJourneySection />

      <PublicTrustAndProofSection
        title="Evidence before claims"
        body="No customer endorsements, partner logos, certifications, or measured performance figures are used to substantiate this overview."
      />

      <PublicConversionRailSection />

      <PublicFooterCta
        eyebrow="Product Walkthrough"
        title="See which AIOS products fit your operating model"
        body="Explore the product stack with one consistent system that scales from revenue and customer intelligence to executive decision orchestration."
      />
    </PublicPageShell>
  )
}
