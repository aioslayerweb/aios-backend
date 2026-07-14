"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { CommandItem, CommandPaletteGroup } from "@/types"
import { useActivityFeed, useCommandGlobalSearch, useCommandPalette, useMemory, useNotifications, useRuntimeStatus } from "@/hooks"
import { modalVariants, pageVariants } from "@/theme"
import { Badge } from "@/components/ui"
import { CommandModeStrip } from "@/components/command"
import { RecentSearches } from "@/components/search"
import { CommandFooter } from "./command-footer"
import { CommandInput } from "./command-input"
import { CommandResults } from "./command-results"

function placeholderMessageForType(type: CommandItem["type"]): string {
  switch (type) {
    case "agent":
      return "Agent action queued (placeholder)."
    case "memory":
      return "Memory query prepared (placeholder)."
    case "ai":
      return "AI prompt intent captured (placeholder)."
    default:
      return "Command executed (placeholder)."
  }
}

export function CommandPalette() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [modeFilter, setModeFilter] = useState<"all" | CommandPaletteGroup>("all")
  const {
    isOpen,
    query,
    setQuery,
    close,
    activeIndex,
    setActiveIndex,
    markCommandUsed,
    commitSearch,
    togglePinned,
    recentSearches,
  } = useCommandPalette()
  const { grouped } = useCommandGlobalSearch(query)
  const { setExpanded: setRuntimeExpanded, updateModuleStatus, refreshTimestamp } = useRuntimeStatus()
  const { bridge } = useActivityFeed()
  const { addEntry } = useMemory()
  const { push } = useNotifications()

  const visibleGrouped = useMemo(() => {
    if (modeFilter === "all") {
      return grouped
    }

    return grouped.filter((section) => section.group === modeFilter)
  }, [grouped, modeFilter])

  const visibleFlatItems = useMemo(
    () => visibleGrouped.flatMap((section) => section.items),
    [visibleGrouped]
  )

  const sectionStartIndexes = useMemo(() => {
    let cursor = 0
    return visibleGrouped.map((section) => {
      const start = cursor
      cursor += section.items.length
      return { group: section.group, startIndex: start, endIndex: cursor - 1 }
    })
  }, [visibleGrouped])

  const activeItem = useMemo(
    () => visibleFlatItems[activeIndex] ?? null,
    [activeIndex, visibleFlatItems]
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setModeFilter("all")
    setActiveIndex(0)
    inputRef.current?.focus()
  }, [isOpen, setActiveIndex])

  useEffect(() => {
    if (activeIndex > visibleFlatItems.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, setActiveIndex, visibleFlatItems.length])

  const publishActivity = (title: string, summary: string, category: CommandItem["group"]) => {
    bridge.publishRuntimeEvent({
      title,
      summary,
      category: category === "ai" ? "ai-runtime" : category === "activity" ? "system-events" : "tasks",
      priority: "medium",
      unread: true,
      pinned: false,
    })
  }

  const executeBehavior = (item: CommandItem) => {
    const exec = item.execute
    if (!exec && item.href) {
      router.push(item.href)
      return
    }

    if (!exec) {
      push({ tone: "info", title: item.title, description: placeholderMessageForType(item.type) })
      return
    }

    switch (exec.kind) {
      case "navigate":
        router.push(exec.target)
        break
      case "runtime":
        setRuntimeExpanded(true)
        updateModuleStatus("ai-runtime", {
          status: exec.target === "pause" ? "warning" : "active",
          label: exec.target === "pause" ? "Paused" : "Active",
          description: `Runtime command ${exec.target} executed from Command Palette.`,
        })
        refreshTimestamp()
        publishActivity(item.title, item.description, "runtime")
        push({ tone: "info", title: item.title, description: "Runtime action simulated successfully." })
        break
      case "agent":
        router.push("/app/agents")
        publishActivity(item.title, item.description, "agents")
        push({ tone: "info", title: item.title, description: "Agent command simulated successfully." })
        break
      case "execution":
        if (exec.target === "open-orchestrator") {
          router.push("/app/orchestrator")
          publishActivity(item.title, item.description, "executions")
          push({ tone: "info", title: item.title, description: "Orchestrator opened successfully." })
          break
        }
        setRuntimeExpanded(true)
        router.push("/app/activity")
        publishActivity(item.title, item.description, "executions")
        break
      case "memory":
        addEntry({
          id: `cmd-${Date.now()}`,
          contextId: "command-palette",
          summary: `Memory command executed: ${item.title}`,
          createdAt: Date.now(),
        })
        router.push("/app/memory")
        publishActivity(item.title, item.description, "memory")
        break
      case "knowledge":
        router.push("/app/knowledge")
        publishActivity(item.title, item.description, "knowledge")
        break
      case "activity":
        router.push("/app/activity")
        publishActivity(item.title, item.description, "activity")
        break
      case "action":
        if (exec.target === "run-workflow" || exec.target === "create-workflow") {
          setRuntimeExpanded(true)
          updateModuleStatus("automation", {
            status: "active",
            label: "Workflow Builder",
            description: `Workflow command ${exec.target} executed from Command Palette.`,
          })
          router.push("/app/workflows")
          publishActivity(item.title, item.description, "actions")
          push({ tone: "info", title: item.title, description: "Workflow Builder opened." })
          break
        }
        publishActivity(item.title, item.description, item.group)
        push({ tone: "info", title: item.title, description: placeholderMessageForType(item.type) })
        break
      case "system":
      case "ai":
      case "modal":
      default:
        publishActivity(item.title, item.description, item.group)
        push({ tone: "info", title: item.title, description: placeholderMessageForType(item.type) })
        break
    }
  }

  const executeItem = (item: CommandItem) => {
    commitSearch(query)
    markCommandUsed(item.id)
    close()
    executeBehavior(item)
  }

  const moveSection = (direction: 1 | -1) => {
    if (sectionStartIndexes.length === 0) {
      return
    }

    const currentSectionIndex = sectionStartIndexes.findIndex(
      (section) => activeIndex >= section.startIndex && activeIndex <= section.endIndex
    )
    const resolvedCurrent = currentSectionIndex === -1 ? 0 : currentSectionIndex
    const nextSectionIndex =
      (resolvedCurrent + direction + sectionStartIndexes.length) % sectionStartIndexes.length
    setActiveIndex(sectionStartIndexes[nextSectionIndex].startIndex)
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (visibleFlatItems.length === 0) {
        return
      }
      setActiveIndex((current) => (current + 1) % visibleFlatItems.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (visibleFlatItems.length === 0) {
        return
      }
      setActiveIndex((current) => (current - 1 + visibleFlatItems.length) % visibleFlatItems.length)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      if (activeItem) {
        executeItem(activeItem)
      }
      return
    }

    if (event.key === "Tab") {
      event.preventDefault()
      moveSection(event.shiftKey ? -1 : 1)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      close()
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[var(--z-command)] flex items-start justify-center bg-slate-900/50 p-3 pt-16 backdrop-blur-sm md:p-6 md:pt-20"
          onClick={close}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault()
              inputRef.current?.focus()
            }
          }}
          role="presentation"
        >
          <motion.section
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-canvas shadow-lg will-change-transform"
            role="dialog"
            aria-modal="true"
            aria-label="AIOS command palette"
          >
            <header className="border-b border-border px-4 py-3 md:px-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">AIOS Universal Command</p>
                  <p className="text-xs text-text-muted">Operating system command center for navigation, runtime, agents, memory, and AI actions</p>
                </div>
                <Badge tone="info">Ctrl+K / ⌘K</Badge>
              </div>
              <div className="mt-3">
                <CommandInput ref={inputRef} value={query} onChange={setQuery} onKeyDown={onInputKeyDown} />
                <RecentSearches searches={recentSearches} onSelect={(value) => setQuery(value)} />
                <CommandModeStrip
                  groups={grouped.map((section) => section.group)}
                  activeGroup={modeFilter === "all" ? undefined : modeFilter}
                  onPickGroup={(group) => {
                    setModeFilter(group)
                    setActiveIndex(0)
                  }}
                />
              </div>
            </header>

            <div className="max-h-[62vh] overflow-y-auto p-4 md:max-h-[66vh] md:p-5">
              <CommandResults
                query={query}
                grouped={visibleGrouped}
                flatItems={visibleFlatItems}
                activeIndex={activeIndex}
                onSelect={executeItem}
                onPin={(item) => togglePinned(item.id)}
              />
            </div>

            <CommandFooter total={visibleFlatItems.length} />
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
