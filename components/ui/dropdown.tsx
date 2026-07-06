"use client"

import { type ReactNode, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils"
import { Button } from "./button"

type DropdownItem = {
  id: string
  label: string
  onSelect: () => void
}

type DropdownProps = {
  label: string
  items: DropdownItem[]
  className?: string
  icon?: ReactNode
}

export function Dropdown({ label, items, className, icon }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <Button variant="secondary" onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
        {icon}
        {label}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[var(--z-command)] min-w-48 rounded-md border border-border bg-surface-canvas p-1 shadow-md">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onSelect()
                setOpen(false)
              }}
              className="flex w-full items-center rounded px-2 py-2 text-left text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
