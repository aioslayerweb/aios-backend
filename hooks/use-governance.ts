"use client"

import { useGovernanceContext } from "@/contexts/governance-context"

export function useGovernance() {
  return useGovernanceContext()
}