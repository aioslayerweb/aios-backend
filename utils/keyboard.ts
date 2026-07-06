import { useEffect } from "react"

type ShortcutHandlers = Record<string, () => void>

function normalizeKey(event: KeyboardEvent): string {
  const parts: string[] = []

  if (event.metaKey || event.ctrlKey) {
    parts.push("mod")
  }
  if (event.shiftKey) {
    parts.push("shift")
  }
  if (event.altKey) {
    parts.push("alt")
  }

  parts.push(event.key.toLowerCase())

  return parts.join("+")
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandlers): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const normalized = normalizeKey(event)
      const action = shortcuts[normalized]

      if (!action) {
        return
      }

      event.preventDefault()
      action()
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [shortcuts])
}
