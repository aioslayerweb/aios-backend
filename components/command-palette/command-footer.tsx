import { CommandShortcut } from "./command-shortcut"

type CommandFooterProps = {
  total: number
}

export function CommandFooter({ total }: CommandFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-text-muted">
      <div className="flex items-center gap-2">
        <span>{total} results</span>
        <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
        <span>Keyboard first</span>
      </div>
      <div className="flex items-center gap-2">
        <CommandShortcut value="↑ ↓" />
        <span>Navigate</span>
        <CommandShortcut value="Enter" />
        <span>Run</span>
        <CommandShortcut value="Tab" />
        <span>Autocomplete</span>
        <CommandShortcut value="Esc" />
        <span>Close</span>
      </div>
    </footer>
  )
}
