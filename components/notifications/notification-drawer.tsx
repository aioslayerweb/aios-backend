"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { drawerVariants } from "@/theme"
import { useBreakpoint } from "@/hooks"
import { Button } from "@/components/ui"
import { NotificationCenterPanel } from "./notification-center-panel"

type NotificationDrawerProps = {
  open: boolean
  onClose: () => void
}

function focusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return []
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled"))
}

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const reduceMotion = useReducedMotion()
  const { isDesktop } = useBreakpoint()
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const nodes = focusableElements(panelRef.current)
    nodes[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const focusables = focusableElements(panelRef.current)
      if (focusables.length === 0) {
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose, open])

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open ? (
          <motion.aside
            variants={reduceMotion ? undefined : drawerVariants}
            initial={reduceMotion ? false : "initial"}
            animate={reduceMotion ? undefined : "animate"}
            exit={reduceMotion ? undefined : "exit"}
            transition={reduceMotion ? undefined : { type: "spring", stiffness: 280, damping: 30, mass: 0.8 }}
            className="fixed inset-y-0 right-0 z-[var(--z-drawer)] flex h-full w-full max-w-[360px] flex-col border-l border-border bg-surface-canvas shadow-lg"
            aria-label="Notification center drawer"
            role="dialog"
            aria-modal="false"
            id="aios-notification-drawer"
            ref={panelRef}
          >
            <div className="flex items-center justify-end border-b border-border px-3 py-2">
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close notification center">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <NotificationCenterPanel />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/45" onClick={onClose}>
          <motion.aside
            variants={reduceMotion ? undefined : drawerVariants}
            initial={reduceMotion ? false : "initial"}
            animate={reduceMotion ? undefined : "animate"}
            exit={reduceMotion ? undefined : "exit"}
            transition={reduceMotion ? undefined : { type: "spring", stiffness: 280, damping: 30, mass: 0.8 }}
            className="ml-auto flex h-full w-full max-w-[100vw] flex-col border-l border-border bg-surface-canvas shadow-lg sm:max-w-[360px]"
            onClick={(event) => event.stopPropagation()}
            aria-label="Notification center drawer"
            role="dialog"
            aria-modal="true"
            id="aios-notification-drawer"
            ref={panelRef}
          >
            <div className="flex items-center justify-end border-b border-border px-3 py-2">
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close notification center">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <NotificationCenterPanel />
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
