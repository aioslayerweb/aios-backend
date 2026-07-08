"use client"

import { Bot, MemoryStick, PlusCircle, Search, Workflow, ClipboardCheck } from "lucide-react"
import { useCommandPalette, useNotifications } from "@/hooks"
import { useExecutiveWorkspace } from "@/hooks/use-executive-workspace"

const iconByIntent = {
  "new-customer": PlusCircle,
  "create-task": ClipboardCheck,
  "launch-agent": Bot,
  "run-workflow": Workflow,
  "open-memory": MemoryStick,
  "search-company": Search,
} as const

export function QuickActions() {
  const { quickActions } = useExecutiveWorkspace()
  const { open } = useCommandPalette()
  const { push } = useNotifications()

  return (
    <section className="space-y-3" aria-label="Quick actions">
      <p className="text-lg font-semibold text-brand-navy">Quick Actions</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = iconByIntent[action.intent]
          return (
            <button
              type="button"
              key={action.id}
              onClick={() => {
                open()
                push({
                  tone: "info",
                  title: action.title,
                  description: `${action.description} Command prepared in global search.`,
                })
              }}
              className="group rounded-xl border border-border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-subtle text-brand-navy">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm font-semibold text-brand-navy">{action.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{action.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
