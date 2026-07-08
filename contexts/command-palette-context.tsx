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
import type { CommandHistoryEntry, CommandItem } from "@/types"
import { defaultCommandItems } from "@/utils/command-palette"

const RECENT_STORAGE_KEY = "aios.commandPalette.recent"
const PINNED_STORAGE_KEY = "aios.commandPalette.pinned"
const HISTORY_STORAGE_KEY = "aios.commandPalette.history"
const SEARCH_STORAGE_KEY = "aios.commandPalette.recentSearches"

type CommandPaletteContextValue = {
  isOpen: boolean
  query: string
  activeIndex: number
  commands: CommandItem[]
  recentCommandIds: string[]
  pinnedCommandIds: string[]
  history: CommandHistoryEntry[]
  recentSearches: string[]
  favoriteCommandIds: string[]
  open: () => void
  close: () => void
  setQuery: (value: string) => void
  setActiveIndex: Dispatch<SetStateAction<number>>
  markCommandUsed: (commandId: string) => void
  commitSearch: (value: string) => void
  togglePinned: (commandId: string) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([])
  const [pinnedCommandIds, setPinnedCommandIds] = useState<string[]>([])
  const [history, setHistory] = useState<CommandHistoryEntry[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    try {
      const rawRecent = window.localStorage.getItem(RECENT_STORAGE_KEY)
      const rawPinned = window.localStorage.getItem(PINNED_STORAGE_KEY)
      const rawHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY)
      const rawSearches = window.localStorage.getItem(SEARCH_STORAGE_KEY)

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

      if (rawHistory) {
        const parsed = JSON.parse(rawHistory)
        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .filter(
                (item): item is CommandHistoryEntry =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof item.commandId === "string" &&
                  typeof item.usedAt === "number" &&
                  typeof item.query === "string"
              )
              .slice(0, 40)
          )
        }
      }

      if (rawSearches) {
        const parsed = JSON.parse(rawSearches)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item): item is string => typeof item === "string").slice(0, 10))
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

  useEffect(() => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    window.localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(recentSearches))
  }, [recentSearches])

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

    setHistory((previous) =>
      [{ commandId, usedAt: Date.now(), query: query.trim() }, ...previous].slice(0, 40)
    )

    if (query.trim()) {
      setRecentSearches((previous) => {
        const deduped = previous.filter((value) => value.toLowerCase() !== query.trim().toLowerCase())
        return [query.trim(), ...deduped].slice(0, 10)
      })
    }
  }

  const commitSearch = (value: string) => {
    const normalized = value.trim()
    if (!normalized) {
      return
    }

    setRecentSearches((previous) => {
      const deduped = previous.filter((item) => item.toLowerCase() !== normalized.toLowerCase())
      return [normalized, ...deduped].slice(0, 10)
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
      history,
      recentSearches,
      favoriteCommandIds: pinnedCommandIds,
      open: () => setIsOpen(true),
      close,
      setQuery,
      setActiveIndex,
      markCommandUsed,
      commitSearch,
      togglePinned,
    }),
    [activeIndex, commands, history, isOpen, pinnedCommandIds, query, recentCommandIds, recentSearches]
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
