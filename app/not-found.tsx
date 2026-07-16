import { PublicButtonLink, PublicCard, PublicContainer, PublicPageShell, PublicSection, PublicSectionHeader } from "@/components/aios"

export default function NotFound() {
  return (
    <PublicPageShell activeHref="/" includeFooter={false}>
      <PublicSection>
        <PublicContainer>
          <div className="mx-auto max-w-3xl">
            <PublicCard variant="floating" className="text-center">
              <PublicSectionHeader
                eyebrow="404"
                title="This AIOS page could not be found"
                body="The page may have moved, been renamed, or never existed. Use the navigation below to get back to the enterprise experience."
                align="center"
              />
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <PublicButtonLink href="/" size="lg">Return Home</PublicButtonLink>
                <PublicButtonLink href="/contact" variant="secondary" size="lg">Book Demo</PublicButtonLink>
              </div>
            </PublicCard>
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
