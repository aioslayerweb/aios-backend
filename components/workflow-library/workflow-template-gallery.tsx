"use client"

import { useState } from "react"
import { Copy, Search } from "lucide-react"
import { useWorkflowTemplates } from "@/hooks"

export function WorkflowTemplateGallery() {
  const [query, setQuery] = useState("")
  const { templates, duplicateTemplate } = useWorkflowTemplates(query)

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Workflow library">
      <p className="text-sm font-semibold text-brand-navy">Workflow Library</p>
      <label className="mt-2 flex items-center gap-2 rounded border border-border bg-surface-canvas px-2 py-1">
        <Search className="h-3.5 w-3.5 text-text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search templates"
          className="w-full bg-transparent text-xs outline-none"
          aria-label="Search workflow templates"
        />
      </label>

      <div className="mt-2 space-y-1.5">
        {templates.map((template) => (
          <article key={template.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-text-primary">{template.name}</p>
                <p className="mt-1 text-[11px] text-text-secondary">{template.description}</p>
              </div>
              <button
                type="button"
                className="rounded border border-border px-1.5 py-1 text-[11px] text-text-secondary"
                onClick={() => duplicateTemplate(template.id)}
                aria-label={`Duplicate ${template.name}`}
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-text-muted">
              <span className="rounded border border-border px-1 py-0.5 capitalize">{template.department}</span>
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded border border-border px-1 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
