import { motion } from "framer-motion"
import type { BusinessHealthItem } from "@/types"

type BusinessScoreCardProps = {
  item: BusinessHealthItem
}

export function BusinessScoreCard({ item }: BusinessScoreCardProps) {
  const tone = item.score >= 85 ? "text-emerald-600" : item.score >= 75 ? "text-amber-600" : "text-rose-600"

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-border bg-white p-4 shadow-sm"
      aria-label={`${item.title} score`}
    >
      <p className="text-xs uppercase tracking-wide text-text-muted">{item.title}</p>
      <p className={`mt-2 text-3xl font-semibold ${tone}`}>{item.score}</p>
      <p className="mt-1 text-sm text-text-secondary">{item.subtitle}</p>
      <p className="mt-2 text-xs text-text-muted">Trend {item.delta}</p>
    </motion.article>
  )
}
