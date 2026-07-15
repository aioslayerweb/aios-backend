import type { ReactNode } from "react"
import { cx } from "@/components/aios/layout/utils"

type AIOSCardProps = {
  children: ReactNode
  className?: string
  variant?: "standard" | "feature" | "module" | "product" | "glass" | "floating" | "stat" | "insight" | "article" | "pricing" | "team" | "comparison" | "kpi"
  hover?: boolean
}

export function AIOSCard({ children, className, variant = "standard", hover = false }: AIOSCardProps) {
  const normalizedVariant = variant === "stat" ? "kpi" : variant === "insight" ? "feature" : variant
  return <div className={cx("public-card", `public-card-${normalizedVariant}`, hover && "public-card-hover", className)}>{children}</div>
}

export const AIOSFeatureCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="feature" hover={props.hover ?? true} />
export const AIOSModuleCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="module" hover={props.hover ?? true} />
export const AIOSProductCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="product" hover={props.hover ?? true} />
export const AIOSGlassCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="glass" hover={props.hover} />
export const AIOSFloatingCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="floating" hover={props.hover ?? true} />
export const AIOSStatCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="stat" hover={props.hover ?? true} />
export const AIOSInsightCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="insight" hover={props.hover ?? true} />
export const AIOSArticleCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="article" hover={props.hover ?? true} />
export const AIOSPricingCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="pricing" hover={props.hover ?? true} />
export const AIOSTeamCard = (props: Omit<AIOSCardProps, "variant">) => <AIOSCard {...props} variant="team" hover={props.hover ?? true} />
