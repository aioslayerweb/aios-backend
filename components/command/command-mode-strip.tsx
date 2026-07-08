import type { CommandPaletteGroup } from "@/types"

type CommandModeStripProps = {
  groups: CommandPaletteGroup[]
  activeGroup?: CommandPaletteGroup
  onPickGroup: (group: CommandPaletteGroup) => void
}

export function CommandModeStrip({ groups, activeGroup, onPickGroup }: CommandModeStripProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-1" aria-label="Search modes">
      {groups.slice(0, 12).map((group) => {
        const active = activeGroup === group
        return (
          <button
            key={group}
            type="button"
            className={active ? "rounded-full border border-brand-primary bg-brand-subtle px-2 py-0.5 text-[11px] capitalize text-brand-navy" : "rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] capitalize text-text-secondary"}
            onClick={() => onPickGroup(group)}
            aria-pressed={active}
          >
            {group.replace("-", " ")}
          </button>
        )
      })}
    </div>
  )
}
