import { Bot, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui"

type PanelHeaderProps = {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function PanelHeader({ collapsed, onToggleCollapsed }: PanelHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border px-3">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-brand-primary" />
        <span className={collapsed ? "sr-only" : "text-sm font-semibold text-brand-navy"}>AI Assistant</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand AI assistant panel" : "Collapse AI assistant panel"}
      >
        {collapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
      </Button>
    </div>
  )
}
