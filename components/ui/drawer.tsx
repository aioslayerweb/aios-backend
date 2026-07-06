"use client"

import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { drawerVariants } from "@/theme/motion"
import { cn } from "@/utils"

type DrawerProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

export function Drawer({ open, onClose, children, title, className }: DrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/30" onClick={onClose}>
          <motion.aside
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn("ml-auto h-full w-full max-w-md border-l border-border bg-surface-canvas p-5 shadow-lg", className)}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Drawer"}
          >
            {title ? <h2 className="mb-4 text-base font-semibold text-brand-navy">{title}</h2> : null}
            {children}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
