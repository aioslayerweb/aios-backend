import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import { AppProviders } from "@/providers"
import { brandAssets, brandTheme } from "@/components/branding"
import { PublicAnalytics } from "@/components/public-site/public-analytics"

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA4_ID ?? ""
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? ""
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ""
const MICROSOFT_SITE_VERIFICATION = process.env.NEXT_PUBLIC_MICROSOFT_SITE_VERIFICATION ?? ""

export const metadata: Metadata = {
  metadataBase: new URL("https://aios.layer"),
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
    images: [{ url: brandAssets.openGraph, width: 1200, height: 1200, alt: "AIOS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: brandTheme.defaultTitle,
    description: brandTheme.description,
    images: [brandAssets.openGraph],
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
    url: "https://aios.layer",
    logo: `${"https://aios.layer"}${brandAssets.openGraph}`,
    sameAs: ["https://aios.layer"],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandTheme.appName,
    url: "https://aios.layer",
    description: brandTheme.description,
    publisher: {
      "@type": "Organization",
      name: brandTheme.appName,
      url: "https://aios.layer",
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {CLARITY_ID ? <link rel="preconnect" href="https://www.clarity.ms" /> : null}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY ? <link rel="preconnect" href={process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com"} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {GOOGLE_ANALYTICS_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        {CLARITY_ID ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        ) : null}
      </head>
      <body className="bg-surface-app text-text-primary antialiased">
        <AppProviders>{children}</AppProviders>
        <PublicAnalytics />
      </body>
    </html>
  )
}
