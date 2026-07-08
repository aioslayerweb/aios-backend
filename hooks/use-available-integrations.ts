"use client"

import { useIntegrations } from "@/hooks/use-integrations"

export function useAvailableIntegrations() {
  const { availableIntegrations, filteredAvailableIntegrations, selectedCategory, setSelectedCategory } = useIntegrations()

  return {
    availableIntegrations,
    filteredAvailableIntegrations,
    selectedCategory,
    setSelectedCategory,
  }
}