import type { MetadataRoute } from "next"

const routes = [
  "",
  "/universe",
  "/platform",
  "/architecture",
  "/modules",
  "/products",
  "/resources",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/security",
  "/pilot",
  "/legal",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map((route) => ({
    url: `https://aiospilot.com${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }))
}
