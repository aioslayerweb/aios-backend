import type { Company, Contact, Customer, Deal, Lead, Opportunity, Pipeline } from "@/src/domain/crm/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Company entities. */
export function isCompany(value: unknown): value is Company {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string"
}

/** Type guard for Contact entities. */
export function isContact(value: unknown): value is Contact {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.email)
}

/** Type guard for Customer entities. */
export function isCustomer(value: unknown): value is Customer {
  return isRecord(value) && typeof value.id === "string" && typeof value.companyId === "string"
}

/** Type guard for Lead entities. */
export function isLead(value: unknown): value is Lead {
  return isRecord(value) && typeof value.id === "string" && typeof value.source === "string"
}

/** Type guard for Opportunity entities. */
export function isOpportunity(value: unknown): value is Opportunity {
  return isRecord(value) && typeof value.id === "string" && typeof value.pipelineId === "string"
}

/** Type guard for Deal entities. */
export function isDeal(value: unknown): value is Deal {
  return isRecord(value) && typeof value.id === "string" && typeof value.opportunityId === "string"
}

/** Type guard for Pipeline entities. */
export function isPipeline(value: unknown): value is Pipeline {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.stages)
}
