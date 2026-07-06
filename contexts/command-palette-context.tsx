"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import type { CommandItem } from "@/types"
import { defaultCommandItems } from "@/utils/command-palette"

const RECENT_STORAGE_KEY = "aios.commandPalette.recent"
const PINNED_STORAGE_KEY = "aios.commandPalette.pinned"

type CommandPaletteContextValue = {
  isOpen: boolean
  query: string
  activeIndex: number
  commands: CommandItem[]
  recentCommandIds: string[]
  pinnedCommandIds: string[]
  open: () => void
  close: () => void
  setQuery: (value: string) => void
  setActiveIndex: Dispatch<SetStateAction<number>>
  markCommandUsed: (commandId: string) => void
  togglePinned: (commandId: string) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([])
  const [pinnedCommandIds, setPinnedCommandIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const rawRecent = window.localStorage.getItem(RECENT_STORAGE_KEY)
      const rawPinned = window.localStorage.getItem(PINNED_STORAGE_KEY)

      if (rawRecent) {
        const parsed = JSON.parse(rawRecent)
        if (Array.isArray(parsed)) {
          setRecentCommandIds(parsed.filter((item): item is string => typeof item === "string").slice(0, 8))
        }
      }

      if (rawPinned) {
        const parsed = JSON.parse(rawPinned)
        if (Array.isArray(parsed)) {
          setPinnedCommandIds(parsed.filter((item): item is string => typeof item === "string"))
        }
      }
    } catch {
      // Ignore storage parsing failures and keep safe defaults.
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentCommandIds))
  }, [recentCommandIds])

  useEffect(() => {
    window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedCommandIds))
  }, [pinnedCommandIds])

  const commands = useMemo(
    () =>
      defaultCommandItems.map((item) => ({
        ...item,
        pinned: item.pinned || pinnedCommandIds.includes(item.id),
      })),
    [pinnedCommandIds]
  )

  const close = () => {
    setIsOpen(false)
    setQuery("")
    setActiveIndex(0)
  }

  const markCommandUsed = (commandId: string) => {
    setRecentCommandIds((previous) => {
      const deduped = previous.filter((value) => value !== commandId)
      return [commandId, ...deduped].slice(0, 8)
    })
  }

  const togglePinned = (commandId: string) => {
    setPinnedCommandIds((previous) =>
      previous.includes(commandId)
        ? previous.filter((value) => value !== commandId)
        : [commandId, ...previous]
    )
  }

  const value = useMemo(
    () => ({
      isOpen,
      query,
      activeIndex,
      commands,
      recentCommandIds,
      pinnedCommandIds,
      open: () => setIsOpen(true),
      close,
      setQuery,
      setActiveIndex,
      markCommandUsed,
      togglePinned,
    }),
    [activeIndex, commands, isOpen, pinnedCommandIds, query, recentCommandIds]
  )

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPaletteContext(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error("useCommandPaletteContext must be used within CommandPaletteProvider")
  }

  return context
}
