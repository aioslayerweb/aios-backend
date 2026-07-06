"use client"

import { type ReactNode, useState } from "react"
import { cn } from "@/utils"

type TabItem = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  items: TabItem[]
  defaultTabId?: string
}

export function Tabs({ items, defaultTabId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id)

  return (
    <div>
      <div className="flex border-b border-border">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeId === item.id
                ? "border-brand-primary text-brand-navy"
                : "border-transparent text-text-muted hover:text-text-secondary"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {items.find((item) => item.id === activeId)?.content}
      </div>
    </div>
  )
}
