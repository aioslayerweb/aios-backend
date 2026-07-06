import type { ReactNode } from "react"
import { toGroupLabel } from "@/utils/command-palette"
import type { CommandPaletteGroup } from "@/types"

type CommandGroupProps = {
  group: CommandPaletteGroup
  children: ReactNode
}

export function CommandGroup({ group, children }: CommandGroupProps) {
  return (
    <section className="space-y-2" aria-label={toGroupLabel(group)}>
      <h3 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">{toGroupLabel(group)}</h3>
      <div className="space-y-1">{children}</div>
    </section>
  )
}
