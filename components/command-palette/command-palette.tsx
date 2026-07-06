"use client"

import { useEffect, useMemo, useRef, type KeyboardEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { CommandItem } from "@/types"
import { useCommandPalette, useCommandSearch, useNotifications } from "@/hooks"
import { modalVariants, pageVariants } from "@/theme"
import { Badge } from "@/components/ui"
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
  const {
    isOpen,
    query,
    setQuery,
    close,
    activeIndex,
    setActiveIndex,
    markCommandUsed,
    togglePinned,
  } = useCommandPalette()
  const { grouped, flatItems } = useCommandSearch()
  const { push } = useNotifications()

  const activeItem = useMemo(() => flatItems[activeIndex] ?? null, [activeIndex, flatItems])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setActiveIndex(0)
    inputRef.current?.focus()
  }, [isOpen, setActiveIndex])

  const executeItem = (item: CommandItem) => {
    markCommandUsed(item.id)
    close()

    if (item.href) {
      router.push(item.href)
      return
    }

    push({
      tone: "info",
      title: item.title,
      description: placeholderMessageForType(item.type),
    })
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (flatItems.length === 0) {
        return
      }
      setActiveIndex((current) => (current + 1) % flatItems.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (flatItems.length === 0) {
        return
      }
      setActiveIndex((current) => (current - 1 + flatItems.length) % flatItems.length)
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
      if (activeItem) {
        event.preventDefault()
        setQuery(activeItem.title)
      }
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
                  <p className="text-sm font-semibold text-brand-navy">AIOS Command Palette</p>
                  <p className="text-xs text-text-muted">Universal navigation, commands, entities, and AI actions</p>
                </div>
                <Badge tone="info">Ctrl+K / ⌘K</Badge>
              </div>
              <div className="mt-3">
                <CommandInput ref={inputRef} value={query} onChange={setQuery} onKeyDown={onInputKeyDown} />
              </div>
            </header>

            <div className="max-h-[62vh] overflow-y-auto p-4 md:max-h-[66vh] md:p-5">
              <CommandResults
                query={query}
                grouped={grouped}
                flatItems={flatItems}
                activeIndex={activeIndex}
                onSelect={executeItem}
                onPin={(item) => togglePinned(item.id)}
              />
            </div>

            <CommandFooter total={flatItems.length} />
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
