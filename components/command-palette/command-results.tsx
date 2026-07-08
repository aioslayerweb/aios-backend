import type { CommandItem as PaletteCommandItem, CommandPaletteGroup } from "@/types"
import { VirtualCommandResults } from "@/components/search-results"
import { CommandEmpty } from "./command-empty"

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

  return (
    <VirtualCommandResults
      query={query}
      grouped={grouped}
      activeIndex={activeIndex}
      onSelect={onSelect}
      onPin={onPin}
    />
  )
}
