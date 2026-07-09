import type { CiPipelineDefinition, DeploymentEnvironment } from "@/src/infrastructure/types"

export type ReleaseValidationInput = {
  environment: DeploymentEnvironment
  pipeline: CiPipelineDefinition
  checks: {
    lintPassed: boolean
    typecheckPassed: boolean
    buildPassed: boolean
    testsPassed: boolean
  }
}

export type ReleaseValidationResult = {
  approved: boolean
  reasons: string[]
}

export function validateRelease(input: ReleaseValidationInput): ReleaseValidationResult {
  const reasons: string[] = []

  if (!input.checks.lintPassed) {
    reasons.push("Lint check failed")
  }
  if (!input.checks.typecheckPassed) {
    reasons.push("Typecheck failed")
  }
  if (!input.checks.buildPassed) {
    reasons.push("Build check failed")
  }
  if (!input.checks.testsPassed) {
    reasons.push("Test check failed")
  }
  if (input.environment === "production" && input.pipeline.requiredApprovals < 1) {
    reasons.push("Production pipeline requires at least one approval")
  }

  return {
    approved: reasons.length === 0,
    reasons,
  }
}
