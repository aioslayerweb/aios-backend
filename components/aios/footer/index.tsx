"use client"

import Link from "next/link"
import { useState } from "react"
import { BrandLogo } from "@/components/branding"
import { AIOSPrimaryButton, AIOSSecondaryButton } from "@/components/aios/buttons"
import { AIOSFloatingCard } from "@/components/aios/cards"
import { AIOSContainer, AIOSSection } from "@/components/aios/layout"
import { aiosFooterGroups } from "@/components/aios/theme/tokens"

export function AIOSFooter({ includeNewsletter = true }: { includeNewsletter?: boolean }) {
  const [email, setEmail] = useState("")

  return (
    <footer className="border-t border-[color:var(--public-color-border)] bg-[rgba(255,255,255,0.78)] py-16 backdrop-blur-lg">
      <AIOSContainer size="wide">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <BrandLogo width={132} height={31} />
            <p className="public-body max-w-xl">AIOS is the public face of one connected AI Operating System. Intelligence, memory, and automation stay visually and structurally consistent across every page.</p>
            {includeNewsletter ? (
              <div className="public-card public-card-glass p-4 sm:p-5">
                <p className="public-eyebrow">Newsletter</p>
                <h3 className="public-h4 mt-3">Get AIOS product and architecture updates</h3>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="aios-newsletter-email" className="sr-only">Work email</label>
                  <input id="aios-newsletter-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Work email" className="public-input" aria-label="Work email" autoComplete="email" />
                  <button type="button" className="public-button public-button-primary px-5" aria-label="Subscribe to newsletter">Subscribe</button>
                </div>
              </div>
            ) : null}
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
      </AIOSContainer>
    </footer>
  )
}

export function AIOSCTASection({ eyebrow, title, body, primaryHref = "/contact", primaryLabel = "Book Demo", secondaryHref = "/products", secondaryLabel = "Explore Platform" }: { eyebrow: string; title: string; body: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string }) {
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
