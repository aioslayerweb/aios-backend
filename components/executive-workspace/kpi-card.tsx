import { motion } from "framer-motion"
import type { ExecutiveKPI } from "@/types"

type KPICardProps = {
  item: ExecutiveKPI
}

export function KPICard({ item }: KPICardProps) {
  const tone = item.trend === "up" ? "text-emerald-600" : item.trend === "down" ? "text-rose-600" : "text-text-secondary"

  return (
    <motion.article whileHover={{ y: -2 }} className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-text-muted">{item.label}</p>
      <p className="mt-2 text-2xl font-semibold text-brand-navy">{item.value}</p>
      <p className={`mt-1 text-xs ${tone}`}>{item.delta}</p>
      {item.target ? <p className="mt-1 text-xs text-text-muted">Target {item.target}</p> : null}
    </motion.article>
  )
}
