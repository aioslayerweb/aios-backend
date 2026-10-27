export function createPublicStructuredData({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  const websiteUrl = "https://aiospilot.com"
  const pageUrl = `${websiteUrl}${path}`
  const segments = path === "/" ? [] : path.split("/").filter(Boolean)

  const pageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "AIOS",
      url: websiteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AIOS",
      url: websiteUrl,
    },
  }

  const breadcrumbData = segments.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${websiteUrl}/` },
          ...segments.map((segment, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: segment.replace(/-/g, " ").replace(/\b\w/g, (value) => value.toUpperCase()),
            item: `${websiteUrl}/${segments.slice(0, index + 1).join("/")}`,
          })),
        ],
      }
    : null

  return { pageData, breadcrumbData }
}
