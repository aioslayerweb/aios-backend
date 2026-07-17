import type { BusinessBlueprint, ValidationIssue, ValidationResult } from "@/src/core/business-blueprint/types"

function issue(section: string, severity: "info" | "warning" | "error", message: string, path?: string): ValidationIssue {
  return {
    id: `${section}-${severity}-${Math.random().toString(36).slice(2, 8)}`,
    section,
    severity,
    message,
    path,
  }
}

function scoreFromIssues(issues: ReadonlyArray<ValidationIssue>): number {
  const deduction = issues.reduce((total, current) => {
    if (current.severity === "error") {
      return total + 15
    }
    if (current.severity === "warning") {
      return total + 6
    }
    return total + 2
  }, 0)

  return Math.max(0, 100 - deduction)
}

export function validateBlueprint(blueprint: BusinessBlueprint): ValidationResult {
  const issues: ValidationIssue[] = []

  if (!blueprint.organization.data.name.trim()) {
    issues.push(issue("organization", "error", "Organization name is required.", "organization.data.name"))
  }

  if (!blueprint.organization.data.industry.trim()) {
    issues.push(issue("organization", "error", "Industry is required.", "organization.data.industry"))
  }

  if (blueprint.organization.data.employeeCount <= 0) {
    issues.push(issue("organization", "warning", "Employee count should be greater than zero.", "organization.data.employeeCount"))
  }

  if (!blueprint.businessModel.data.revenueStreams.length) {
    issues.push(issue("businessModel", "error", "At least one revenue stream is required.", "businessModel.data.revenueStreams"))
  }

  if (!blueprint.operations.data.processes.length) {
    issues.push(issue("operations", "warning", "No operational processes defined.", "operations.data.processes"))
  }

  if (!blueprint.finance.data.currencies.length) {
    issues.push(issue("finance", "error", "At least one currency is required.", "finance.data.currencies"))
  }

  if (!blueprint.systems.data.connectedPlatforms.length) {
    issues.push(issue("systems", "warning", "No connected systems have been mapped.", "systems.data.connectedPlatforms"))
  }

  if (!blueprint.users.data.roles.length) {
    issues.push(issue("users", "error", "At least one user role must be defined.", "users.data.roles"))
  }

  if (!blueprint.kpis.data.length) {
    issues.push(issue("kpis", "error", "At least one KPI definition is required.", "kpis.data"))
  }

  blueprint.kpis.data.forEach((kpi, index) => {
    if (!kpi.formula.trim()) {
      issues.push(issue("kpis", "warning", `KPI ${kpi.name} should include a formula.`, `kpis.data[${index}].formula`))
    }
  })

  if (!blueprint.goals.data.length) {
    issues.push(issue("goals", "warning", "No goals configured.", "goals.data"))
  }

  if (!blueprint.rbiInitialization.data.length) {
    issues.push(issue("rbiInitialization", "error", "RBI initialization must include role mappings.", "rbiInitialization.data"))
  }

  const completionScore = scoreFromIssues(issues)
  return {
    valid: !issues.some((current) => current.severity === "error"),
    completionScore,
    issues,
  }
}
