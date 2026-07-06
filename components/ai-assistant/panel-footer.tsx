import { Badge } from "@/components/ui"

type PanelFooterProps = {
  runningAgents: number
}

export function PanelFooter({ runningAgents }: PanelFooterProps) {
  return (
    <footer className="border-t border-border px-3 py-2">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>AI Prompt OS interface ready</span>
        <Badge tone={runningAgents > 0 ? "warning" : "info"}>
          {runningAgents} running
        </Badge>
      </div>
    </footer>
  )
}
