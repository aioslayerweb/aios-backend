import type { CommandItem as PaletteCommandItem, CommandPaletteGroup } from "@/types"
import { CommandEmpty } from "./command-empty"
import { CommandGroup } from "./command-group"
import { CommandItem } from "./command-item"

type CommandResultsProps = {
  query: string
  grouped: Array<{ group: CommandPaletteGroup; items: PaletteCommandItem[] }>
  flatItems: PaletteCommandItem[]
  activeIndex: number
  onSelect: (item: PaletteCommandItem) => void
  onPin: (item: PaletteCommandItem) => void
}

export function CommandResults({
  query,
  grouped,
  flatItems,
  activeIndex,
  onSelect,
  onPin,
}: CommandResultsProps) {
  if (flatItems.length === 0) {
    return <CommandEmpty query={query} />
  }

  let runningIndex = -1

  return (
    <div id="command-results" role="listbox" className="space-y-4">
      {grouped.map((section) => (
        <CommandGroup key={section.group} group={section.group}>
          {section.items.map((item) => {
            runningIndex += 1
            return (
              <CommandItem
                key={item.id}
                item={item}
                active={runningIndex === activeIndex}
                index={runningIndex}
                onSelect={() => onSelect(item)}
                onPin={() => onPin(item)}
              />
            )
          })}
        </CommandGroup>
      ))}
    </div>
  )
}
