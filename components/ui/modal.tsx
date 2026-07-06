"use client"

import { type ReactNode, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { modalVariants } from "@/theme/motion"
import { cn } from "@/utils"

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn("w-full max-w-2xl rounded-lg border border-border bg-surface-canvas p-5 shadow-lg", className)}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Dialog"}
          >
            {title ? <h2 className="mb-4 text-lg font-semibold text-brand-navy">{title}</h2> : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
