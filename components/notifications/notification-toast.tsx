"use client"

import { X } from "lucide-react"
import { motion } from "framer-motion"
import type { NotificationItem } from "@/types"
import { levelToTone } from "@/utils/notifications"
import { Badge } from "@/components/ui"

type NotificationToastProps = {
  item: NotificationItem
  onDismiss: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
}

export function NotificationToast({
  item,
  onDismiss,
  onPause,
  onResume,
}: NotificationToastProps) {
  const tone = levelToTone(item.level)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 290, damping: 28, mass: 0.82 }}
      onMouseEnter={() => onPause(item.id)}
      onMouseLeave={() => onResume(item.id)}
      className="pointer-events-auto rounded-lg border border-border bg-surface-canvas p-3 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-text-primary">{item.title}</p>
            <Badge tone={tone}>{item.level}</Badge>
          </div>
          {item.description ? <p className="text-xs text-text-secondary">{item.description}</p> : null}
          <p className="text-[11px] text-text-muted">
            {item.category} · {item.priority}
          </p>
          <p className="text-[11px] text-text-muted">
            Impact {item.impact}% · Confidence {item.confidence}%
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-text-muted hover:bg-surface-muted"
          aria-label={`Dismiss ${item.title} toast`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  )
}
