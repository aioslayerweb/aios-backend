import { createPublicStructuredData } from "@/components/public-site/public-structured-data"

export function PublicStructuredData({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  const { pageData, breadcrumbData } = createPublicStructuredData({ name, description, path })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData) }} />
      {breadcrumbData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} /> : null}
    </>
  )
}
