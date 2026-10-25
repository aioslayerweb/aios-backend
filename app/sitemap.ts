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
  "/pilot/discovery",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://aiospilot.com${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/contact" ? 0.8 : 0.7,
  }))
}
