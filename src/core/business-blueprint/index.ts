export * from "@/src/core/business-blueprint/types"
export * from "@/src/core/business-blueprint/templates"
export * from "@/src/core/business-blueprint/validators"
export * from "@/src/core/business-blueprint/compare"
export * from "@/src/core/business-blueprint/merge"
export * from "@/src/core/business-blueprint/engine"

import { BusinessBlueprintEngine } from "@/src/core/business-blueprint/engine"

export function createBusinessBlueprintEngine(): BusinessBlueprintEngine {
  return new BusinessBlueprintEngine()
}
