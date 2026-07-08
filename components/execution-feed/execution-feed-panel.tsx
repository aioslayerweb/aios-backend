"use client"

import { motion } from "framer-motion"
import type { OrchestratorCommunicationMessage } from "@/types"

type ExecutionFeedPanelProps = {
  messages: OrchestratorCommunicationMessage[]
}

export function ExecutionFeedPanel({ messages }: ExecutionFeedPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Agent communication feed">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Agent Communication</p>
        <span className="text-[11px] text-text-muted">Real-time messages</span>
      </div>
      <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <motion.article
            key={message.id}
            className="rounded-xl border border-border bg-surface-muted p-3"
            initial={{ opacity: 0.8, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-center justify-between gap-2 text-[11px] text-text-muted">
              <span>{message.from}</span>
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="mt-1 text-xs font-medium text-text-primary">→ {message.to}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{message.message}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
