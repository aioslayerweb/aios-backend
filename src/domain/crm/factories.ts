import { LeadStatus, OpportunityStage, Priority, Status } from "@/src/domain/common/enums"
import type { Company, Contact, Customer, Deal, Lead, Opportunity, Pipeline } from "@/src/domain/crm/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a CRM company entity. */
export function createCompany(partial: Partial<Company> = {}): Company {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("company"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    name: partial.name ?? "Northwind Manufacturing",
    domain: partial.domain ?? "northwind.example",
    industry: partial.industry ?? "Manufacturing",
    employeeCount: partial.employeeCount ?? 1200,
    annualRevenue: partial.annualRevenue ?? { amount: 250000000, currency: "USD" },
    address: partial.address,
    searchText: partial.searchText ?? "northwind manufacturing enterprise account",
    searchKeywords: partial.searchKeywords ?? ["northwind", "manufacturing", "enterprise"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a CRM contact entity. */
export function createContact(partial: Partial<Contact> = {}): Contact {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("contact"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    companyId: partial.companyId,
    firstName: partial.firstName ?? "Taylor",
    lastName: partial.lastName ?? "Reed",
    title: partial.title ?? "VP Revenue Operations",
    email: partial.email ?? { value: "taylor.reed@northwind.example", verified: true },
    phone: partial.phone,
    searchText: partial.searchText ?? "taylor reed revenue operations",
    searchKeywords: partial.searchKeywords ?? ["taylor", "reed", "revenue"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a customer aggregate. */
export function createCustomer(partial: Partial<Customer> = {}): Customer {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("customer"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    companyId: partial.companyId ?? createId("company"),
    name: partial.name ?? "Northwind Enterprise Account",
    status: partial.status ?? Status.Active,
    contactIds: partial.contactIds ?? [],
    healthScore: partial.healthScore ?? { value: 84 },
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "northwind enterprise account active",
    searchKeywords: partial.searchKeywords ?? ["northwind", "customer", "enterprise"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a lead record. */
export function createLead(partial: Partial<Lead> = {}): Lead {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("lead"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    customerId: partial.customerId,
    companyId: partial.companyId,
    contactId: partial.contactId,
    source: partial.source ?? "inbound_webinar",
    status: partial.status ?? LeadStatus.New,
    priority: partial.priority ?? Priority.Medium,
    estimatedValue: partial.estimatedValue ?? { amount: 150000, currency: "USD" },
    searchText: partial.searchText ?? "lead inbound webinar",
    searchKeywords: partial.searchKeywords ?? ["lead", "inbound", "webinar"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an opportunity entity. */
export function createOpportunity(partial: Partial<Opportunity> = {}): Opportunity {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("opportunity"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    customerId: partial.customerId ?? createId("customer"),
    leadId: partial.leadId,
    pipelineId: partial.pipelineId ?? createId("pipeline"),
    stage: partial.stage ?? OpportunityStage.Discovery,
    amount: partial.amount ?? { amount: 200000, currency: "USD" },
    probability: partial.probability ?? { value: 35 },
    expectedCloseDate: partial.expectedCloseDate,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "opportunity discovery",
    searchKeywords: partial.searchKeywords ?? ["opportunity", "pipeline", "discovery"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a deal entity. */
export function createDeal(partial: Partial<Deal> = {}): Deal {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("deal"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    opportunityId: partial.opportunityId ?? createId("opportunity"),
    amount: partial.amount ?? { amount: 250000, currency: "USD" },
    signedAt: partial.signedAt,
    closedAt: partial.closedAt,
    status: partial.status ?? Status.Draft,
    version: partial.version ?? 1,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a pipeline definition. */
export function createPipeline(partial: Partial<Pipeline> = {}): Pipeline {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("pipeline"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    name: partial.name ?? "Enterprise Sales Pipeline",
    stages:
      partial.stages ?? [
        OpportunityStage.Discovery,
        OpportunityStage.Qualification,
        OpportunityStage.Proposal,
        OpportunityStage.Negotiation,
        OpportunityStage.Won,
        OpportunityStage.Lost,
      ],
    isDefault: partial.isDefault ?? true,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
