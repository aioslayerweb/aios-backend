"use client"

import Link from "next/link"
import { BrandLogo } from "@/components/branding"
import { AIOSPrimaryButton, AIOSSecondaryButton } from "@/components/aios/buttons"
import { AIOSFloatingCard } from "@/components/aios/cards"
import { AIOSContainer, AIOSSection } from "@/components/aios/layout"
import { aiosFooterGroups } from "@/components/aios/theme/tokens"

export function AIOSFooter() {
  return (
    <footer className="public-footer border-t border-[color:var(--public-color-border)] bg-[rgba(255,255,255,0.9)] py-12 backdrop-blur-lg sm:py-16">
      <AIOSContainer size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-sm">
            <BrandLogo width={112} height={56} />
            <p className="public-body mt-5">AIOS connects business signals, memory, and decision-making in one intelligence layer.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AIOSPrimaryButton href="/platform" size="sm">Explore platform</AIOSPrimaryButton>
              <AIOSSecondaryButton href="/demo-platform/executive" size="sm">Explore demo</AIOSSecondaryButton>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {aiosFooterGroups.map((group) => (
              <div key={group.title}>
                <p className="public-eyebrow">{group.title}</p>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="public-link public-small text-[color:var(--public-color-text)] transition-colors hover:text-[color:var(--public-color-primary)]">{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="public-footer-bottom mt-12 flex flex-col gap-3 border-t border-[color:var(--public-color-border)] pt-5 text-xs text-[color:var(--public-color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>AIOS Pilot · Business intelligence before automation.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="public-link">Privacy</Link>
            <Link href="/terms" className="public-link">Terms</Link>
            <Link href="/security" className="public-link">Security</Link>
          </div>
        </div>
      </AIOSContainer>
    </footer>
  )
}

export function AIOSCTASection({ eyebrow, title, body, primaryHref = "/contact", primaryLabel = "Contact", secondaryHref = "/products", secondaryLabel = "Explore Platform" }: { eyebrow: string; title: string; body: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string }) {
  return (
    <AIOSSection>
      <AIOSContainer>
        <AIOSFloatingCard className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,249,252,0.96))]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="public-eyebrow">{eyebrow}</p>
              <h2 className="public-h2 mt-5 max-w-3xl">{title}</h2>
              <p className="public-body-lg mt-5 max-w-2xl">{body}</p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <AIOSPrimaryButton href={primaryHref} size="lg">{primaryLabel}</AIOSPrimaryButton>
              <AIOSSecondaryButton href={secondaryHref} size="lg">{secondaryLabel}</AIOSSecondaryButton>
            </div>
          </div>
        </AIOSFloatingCard>
      </AIOSContainer>
    </AIOSSection>
  )
}
