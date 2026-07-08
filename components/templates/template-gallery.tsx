"use client"

import type { PromptTemplate } from "@/types"

type TemplateGalleryProps = {
  templates: PromptTemplate[]
  onUseTemplate: (id: string) => void
}

export function TemplateGallery({ templates, onUseTemplate }: TemplateGalleryProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Prompt templates">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Prompt Templates</p>
        <span className="text-xs text-text-muted">{templates.length} templates</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className="rounded-lg border border-border bg-surface-muted p-2 text-left hover:border-brand-primary"
            onClick={() => onUseTemplate(template.id)}
            aria-label={`Use ${template.name} template`}
          >
            <p className="text-xs font-semibold text-text-primary">{template.name}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{template.description}</p>
            <p className="mt-1 text-[11px] capitalize text-text-muted">{template.domain}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
