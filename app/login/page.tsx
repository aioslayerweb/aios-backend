import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PublicButtonLink, PublicContainer, PublicPageShell, PublicSection } from "@/components/aios"
import { BrandLogo } from "@/components/branding"
import { LoginCard } from "@/components/auth/login-card"

export const metadata: Metadata = {
  title: "Login | AIOS",
  description: "Secure login for AIOS enterprise platform.",
  robots: { index: false, follow: false },
}

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string | string[]
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth()
  const callbackUrl = Array.isArray(searchParams?.callbackUrl) ? searchParams?.callbackUrl[0] : searchParams?.callbackUrl
  if (session?.user) {
    redirect(callbackUrl || "/app")
  }

  return (
    <PublicPageShell activeHref="/login" includeFooter={false} includeNewsletter={false}>
      <PublicSection>
        <PublicContainer>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-5 rounded-3xl border border-[var(--public-color-border)] bg-[linear-gradient(145deg,#eff6ff_0%,#ffffff_45%,#f1f5f9_100%)] p-6 sm:p-10">
              <BrandLogo width={158} height={38} priority />
              <h1 className="public-h2">Enterprise authentication foundation for AIOS</h1>
              <p className="public-body max-w-xl text-[color:var(--public-color-text-soft)]">
                Production-grade session security with JWT strategy, protected route middleware, and modular architecture ready for enterprise OAuth expansion.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">Security Defaults</p>
                  <p className="mt-2 text-sm">HTTP-only cookies, SameSite protection, CSRF handling, and environment-based secure cookie strategy.</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">Future Ready</p>
                  <p className="mt-2 text-sm">Prepared for Google OAuth, Microsoft Entra ID, email login, magic links, organizations, and RBAC.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <PublicButtonLink href="/demo-platform" variant="secondary" size="lg">Open Demo Platform</PublicButtonLink>
              </div>
            </section>
            <LoginCard />
          </div>
        </PublicContainer>
      </PublicSection>
    </PublicPageShell>
  )
}
