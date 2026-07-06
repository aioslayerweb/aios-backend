import { forwardRef, type KeyboardEvent } from "react"
import { Search } from "lucide-react"

type CommandInputProps = {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { value, onChange, onKeyDown },
  ref
) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-border bg-surface-canvas px-3 py-2 shadow-sm">
      <Search className="h-4 w-4 text-text-muted" />
      <input
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        placeholder="Search navigation, entities, memory, agents, and commands"
        role="combobox"
        aria-expanded="true"
        aria-controls="command-results"
        aria-autocomplete="list"
        aria-label="Command palette input"
      />
    </label>
  )
})
