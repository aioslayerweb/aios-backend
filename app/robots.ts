import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/app",
          "/api/",
          "/activity",
          "/agents",
          "/insights",
          "/login",
          "/sales",
          "/settings",
          "/unauthorized",
          "/offline",
        ],
      },
    ],
    sitemap: "https://aiospilot.com/sitemap.xml",
    host: "https://aiospilot.com",
  }
}
