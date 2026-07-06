import { type KeyboardEvent } from "react"
import { cn } from "@/utils"

type ResizableHandleProps = {
  onResizeBy: (delta: number) => void
  className?: string
}

export function ResizableHandle({ onResizeBy, className }: ResizableHandleProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      onResizeBy(16)
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      onResizeBy(-16)
    }
  }

  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault()
        const startX = event.clientX

        const onMove = (moveEvent: MouseEvent) => {
          const delta = startX - moveEvent.clientX
          onResizeBy(delta)
        }

        const onUp = () => {
          window.removeEventListener("mousemove", onMove)
          window.removeEventListener("mouseup", onUp)
        }

        window.addEventListener("mousemove", onMove)
        window.addEventListener("mouseup", onUp)
      }}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute left-0 top-0 h-full w-1.5 -translate-x-1/2 cursor-col-resize rounded bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className
      )}
      aria-label="Resize AI assistant panel"
    />
  )
}
