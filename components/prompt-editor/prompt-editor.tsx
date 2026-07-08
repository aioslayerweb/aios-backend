"use client"

import type { KeyboardEvent } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui"

type PromptEditorProps = {
  value: string
  onChange: (value: string) => void
  onRun: () => void
}

export function PromptEditor({ value, onChange, onRun }: PromptEditorProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      onRun()
    }
  }

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Prompt editor">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Prompt Editor</p>
        <Button variant="primary" size="sm" onClick={onRun}>
          <Play className="h-3.5 w-3.5" /> Execute
        </Button>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="mt-3 min-h-40 w-full rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
        placeholder="What would you like AIOS to accomplish?\n\nExamples\nSummarize today's operations\nFind urgent opportunities\nPrepare board report\nReview customer activity"
        aria-label="Prompt objective editor"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
        <span className="rounded border border-border px-1.5 py-0.5">⌘ Enter</span>
        <span className="rounded border border-border px-1.5 py-0.5">Ctrl Enter</span>
        <span>to execute objective</span>
      </div>
    </section>
  )
}
