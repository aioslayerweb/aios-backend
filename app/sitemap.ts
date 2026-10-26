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
  "/privacy",
  "/terms",
  "/security",
  "/pilot",
  "/legal",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://aiospilot.com${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
