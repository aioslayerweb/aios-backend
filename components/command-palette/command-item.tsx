import { Pin } from "lucide-react"
import type { CommandItem as PaletteCommandItem } from "@/types"
import { cn } from "@/utils"
import { CommandShortcut } from "./command-shortcut"

type CommandItemProps = {
  item: PaletteCommandItem
  active: boolean
  onSelect: () => void
  onPin: () => void
  index: number
}

export function CommandItem({ item, active, onSelect, onPin, index }: CommandItemProps) {
  return (
    <div
      id={`command-item-${index}`}
      role="option"
      aria-selected={active}
      className={cn(
        "group flex items-center gap-3 rounded-md border px-3 py-2 transition-colors",
        active
          ? "border-brand-primary bg-brand-subtle text-brand-navy"
          : "border-transparent bg-surface-canvas text-text-primary hover:border-border hover:bg-surface-muted"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 text-left"
        aria-label={`${item.title} command`}
      >
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="truncate text-xs text-text-secondary">{item.description}</p>
      </button>

      <div className="flex items-center gap-2">
        <CommandShortcut value={item.shortcut} />
        <button
          type="button"
          onClick={onPin}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded border",
            item.pinned
              ? "border-brand-primary bg-brand-subtle text-brand-navy"
              : "border-border text-text-muted hover:bg-surface-muted"
          )}
          aria-label={item.pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
        >
          <Pin className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
