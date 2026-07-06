import { cn } from "@/utils"

type CommandShortcutProps = {
  value?: string
  className?: string
}

export function CommandShortcut({ value, className }: CommandShortcutProps) {
  if (!value) {
    return null
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium text-text-muted", className)} aria-hidden>
      {value.split(" ").map((part) => (
        <kbd key={part} className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px]">
          {part}
        </kbd>
      ))}
    </span>
  )
}
