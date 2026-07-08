"use client"

import { useGovernance } from "@/hooks/use-governance"

export function usePolicies() {
  const { policies } = useGovernance()

  return {
    policies,
  }
}