import type { HTMLAttributes, ReactNode } from "react"

export type Size = "xs" | "sm" | "md" | "lg" | "xl"
export type Tone = "default" | "success" | "warning" | "error" | "info"

export type BaseComponentProps = HTMLAttributes<HTMLElement> & {
  className?: string
  children?: ReactNode
  "data-testid"?: string
}
