import Link from "next/link"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-text-secondary" : undefined}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
