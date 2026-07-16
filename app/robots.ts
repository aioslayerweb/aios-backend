import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://aiospilot.com/sitemap.xml",
    host: "https://aiospilot.com",
  }
}
