import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIOS Layer - Dashboard",
  description: "AI-Powered Operations Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
