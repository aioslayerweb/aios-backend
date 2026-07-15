import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import { AppProviders } from "@/providers"
import { brandAssets, brandTheme } from "@/components/branding"

const GOOGLE_ANALYTICS_ID = "G-49X8NYHD13"

export const metadata: Metadata = {
  metadataBase: new URL("https://aios.layer"),
  applicationName: brandTheme.appName,
  title: {
    default: brandTheme.defaultTitle,
    template: brandTheme.titleTemplate,
  },
  description: brandTheme.description,
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
  return (
    <html lang="en">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body className="bg-surface-app text-text-primary antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
