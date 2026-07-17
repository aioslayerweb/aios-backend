import type { Metadata } from "next"
import { ShieldAlert } from "lucide-react"
import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"

export const metadata: Metadata = {
  title: "Unauthorized | AIOS",
  description: "Access denied for the requested AIOS resource.",
  robots: { index: false, follow: false },
}

export default function UnauthorizedPage() {
  return (
    <PublicPageShell activeHref="/unauthorized" includeFooter={false} includeNewsletter={false}>
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating" className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <ShieldAlert size={14} aria-hidden="true" /> Access denied
            </div>
            <PublicSectionHeader
              eyebrow="Unauthorized"
              title="You do not have access to this resource"
              body="Your session is valid, but this destination requires additional authorization."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink href="/login" size="lg">Go to login</PublicButtonLink>
              <PublicButtonLink href="/" variant="secondary" size="lg">Back to website</PublicButtonLink>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
