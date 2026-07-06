"use client"

import { type ReactNode, useState } from "react"

type TooltipProps = {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible ? (
        <span role="tooltip" className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface-canvas px-2 py-1 text-xs text-text-secondary shadow-sm">
          {content}
        </span>
      ) : null}
    </span>
  )
}
