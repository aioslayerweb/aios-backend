"use client"

import { useMemo } from "react"
import { useWorkflowBuilder } from "@/hooks/use-workflow-builder"

export function useWorkflowTemplates(query = "") {
  const { templates, duplicateTemplate } = useWorkflowBuilder()

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return templates
    }

    return templates.filter((template) => {
      const blob = `${template.name} ${template.description} ${template.department} ${template.tags.join(" ")}`.toLowerCase()
      return blob.includes(normalized)
    })
  }, [query, templates])

  return {
    templates: filtered,
    duplicateTemplate,
  }
}
