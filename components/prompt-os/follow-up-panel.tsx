"use client"

import type { PromptSuggestion } from "@/types"

type FollowUpPanelProps = {
  suggestions: PromptSuggestion[]
  onApply: (suggestion: PromptSuggestion) => void
}

export function FollowUpPanel({ suggestions, onApply }: FollowUpPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Follow-up prompts">
      <p className="text-sm font-semibold text-brand-navy">Follow-up Prompts</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onApply(suggestion)}
            className="rounded-full border border-border bg-surface-muted px-2 py-1 text-[11px] text-text-secondary"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </section>
  )
}
