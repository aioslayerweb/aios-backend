import type { ReactNode } from "react"

export function AIOSModalSurface({ children }: { children: ReactNode }) {
  return <div className="public-card public-card-glass rounded-[28px] p-6 shadow-[0_32px_90px_rgba(7,19,61,0.18)]">{children}</div>
}

export function AIOSDrawerSurface({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col bg-[rgba(255,255,255,0.94)] p-6">{children}</div>
}
