import type { AIQuickAction } from "@/types"
import { Button } from "@/components/ui"

type QuickActionsProps = {
  actions: AIQuickAction[]
  onRun: (action: AIQuickAction) => void
}

export function QuickActions({ actions, onRun }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="secondary"
          size="sm"
          onClick={() => onRun(action)}
          className="justify-start"
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
