import type { Metadata, Viewport } from "next"
import "./globals.css"
import { brandAssets, brandTheme } from "@/components/branding"
import { AIOSMotionProvider } from "@/components/aios/motion-provider"
import { PublicAnalytics } from "@/components/public-site/public-analytics"

const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ""
const MICROSOFT_SITE_VERIFICATION = process.env.NEXT_PUBLIC_MICROSOFT_SITE_VERIFICATION ?? ""

export const metadata: Metadata = {
  metadataBase: new URL("https://aiospilot.com"),
  applicationName: brandTheme.appName,
  title: {
    default: brandTheme.defaultTitle,
    template: brandTheme.titleTemplate,
  },
  description: brandTheme.description,
  verification: {
    google: GOOGLE_SITE_VERIFICATION || undefined,
    other: MICROSOFT_SITE_VERIFICATION ? { "msvalidate.01": MICROSOFT_SITE_VERIFICATION } : undefined,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: brandAssets.favicon, type: "image/png" }],
    apple: [{ url: brandAssets.appleTouchIcon, type: "image/png" }],
    shortcut: [{ url: brandAssets.favicon, type: "image/png" }],
  },
  openGraph: {
    title: brandTheme.defaultTitle,
    description: brandTheme.description,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AIOS Pilot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: brandTheme.defaultTitle,
    description: brandTheme.description,
    images: ["/opengraph-image"],
  },
}

export const viewport: Viewport = {
  themeColor: brandTheme.themeColor,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandTheme.appName,
    url: "https://aiospilot.com",
    logo: `${"https://aiospilot.com"}${brandAssets.openGraph}`,
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandTheme.appName,
    url: "https://aiospilot.com",
    description: brandTheme.description,
    publisher: {
      "@type": "Organization",
      name: brandTheme.appName,
      url: "https://aiospilot.com",
    },
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="bg-surface-app text-text-primary antialiased">
        <AIOSMotionProvider>{children}</AIOSMotionProvider>
        <PublicAnalytics />
      </body>
    </html>
  )
}
