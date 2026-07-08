"use client"

import { usePromptOS } from "@/hooks/use-prompt-os"

export function usePromptTemplates() {
  const { templates, useTemplate } = usePromptOS()

  return {
    templates,
    useTemplate,
  }
}
