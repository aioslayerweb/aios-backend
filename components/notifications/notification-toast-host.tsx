"use client"

import { AnimatePresence } from "framer-motion"
import { useBreakpoint, useNotificationCenter } from "@/hooks"
import { NotificationToast } from "./notification-toast"

export function NotificationToastHost() {
  const { isMobile, isTablet } = useBreakpoint()
  const { dismissToast, getVisibleToasts, pauseToast, resumeToast } = useNotificationCenter()
  const maxVisible = isMobile ? 1 : isTablet ? 2 : 3
  const toasts = getVisibleToasts(maxVisible)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      className={
        isMobile
          ? "pointer-events-none fixed bottom-3 left-3 right-3 z-[var(--z-notification)] flex flex-col gap-2"
          : "pointer-events-none fixed bottom-4 right-4 z-[var(--z-notification)] flex w-full max-w-sm flex-col gap-2"
      }
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence>
        {toasts.map((item) => (
          <NotificationToast
            key={item.id}
            item={item}
            onDismiss={dismissToast}
            onPause={pauseToast}
            onResume={resumeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
