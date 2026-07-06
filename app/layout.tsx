import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/providers"

export const metadata: Metadata = {
  title: "AIOS - Autonomous Business Operating System",
  description: "AIOS enterprise operating system for executive intelligence and autonomous workflows.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-surface-app text-text-primary antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
