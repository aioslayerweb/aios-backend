"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Badge, Avatar } from "@/components/ui"
import { cn } from "@/utils"
import type { AgentCardItem } from "@/types"

type AgentListCardProps = {
  agent: AgentCardItem
  selected: boolean
  onSelect: () => void
}

function toneByStatus(status: AgentCardItem["status"]): "info" | "warning" | "error" | "success" {
  if (status === "running") {
    return "warning"
  }

  if (status === "failed") {
    return "error"
  }

  if (status === "completed") {
    return "success"
  }

  return "info"
}

function AgentListCardComponent({ agent, selected, onSelect }: AgentListCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.995 }}
      layout
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-white p-3 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        selected ? "border-brand-primary bg-brand-subtle/40" : "border-border hover:bg-surface-muted"
      )}
      aria-pressed={selected}
      aria-label={`Select ${agent.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={agent.name} className="h-8 w-8" />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{agent.name}</p>
            <p className="text-[11px] text-text-muted">{agent.currentTask}</p>
          </div>
        </div>
        <Badge tone={toneByStatus(agent.status)} className="capitalize">
          {agent.status}
        </Badge>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] text-text-secondary">
        <span className="rounded border border-border px-1.5 py-1">Conf {agent.confidence}%</span>
        <span className="rounded border border-border px-1.5 py-1">Health {agent.health}%</span>
        <span className="rounded border border-border px-1.5 py-1">Unread {agent.unreadNotifications}</span>
      </div>

      <p className="mt-2 text-[11px] text-text-muted">{agent.recentActivity}</p>
    </motion.button>
  )
}

export const AgentListCard = memo(AgentListCardComponent)
