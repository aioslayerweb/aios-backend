import { useMemo } from "react"
import type { CommandItem as PaletteCommandItem, CommandPaletteGroup } from "@/types"
import { CommandGroup } from "@/components/command-palette/command-group"
import { CommandItem } from "@/components/command-palette/command-item"

type VirtualCommandResultsProps = {
  grouped: Array<{ group: CommandPaletteGroup; items: PaletteCommandItem[] }>
  activeIndex: number
  onSelect: (item: PaletteCommandItem) => void
  onPin: (item: PaletteCommandItem) => void
  query: string
}

export function VirtualCommandResults({ grouped, activeIndex, onSelect, onPin, query }: VirtualCommandResultsProps) {
  const windowed = useMemo(() => {
    const allItems = grouped.flatMap((section) => section.items)
    if (allItems.length <= 140) {
      return grouped
    }

    const start = Math.max(0, activeIndex - 45)
    const end = Math.min(allItems.length, activeIndex + 95)
    const subset = allItems.slice(start, end)

    const index = new Map(subset.map((item) => [item.id, item]))

    return grouped
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => index.has(item.id)),
      }))
      .filter((section) => section.items.length > 0)
  }, [activeIndex, grouped])

  let runningIndex = -1

  return (
    <div id="command-results" role="listbox" className="space-y-4" aria-label={`Command results for ${query || "default"}`}>
      {windowed.map((section) => (
        <CommandGroup key={section.group} group={section.group}>
          {section.items.map((item) => {
            runningIndex += 1
            return (
              <CommandItem
                key={item.id}
                item={item}
                active={runningIndex === activeIndex}
                index={runningIndex}
                query={query}
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
