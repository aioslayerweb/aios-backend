import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { LeadStatus, OpportunityStage, Priority, Status } from "@/src/domain/common/enums"
import type { Address, EmailAddress, Money, Phone, Percentage } from "@/src/domain/common/value-objects"
import type {
  CompanyId,
  ContactId,
  CustomerId,
  DealId,
  LeadId,
  OpportunityId,
  PipelineId,
  UserId,
  WorkspaceId,
} from "@/src/domain/types/ids"

/** Company profile connected to customers and opportunities. */
export interface Company extends Entity<CompanyId>, Timestamped, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly domain?: string
  readonly industry?: string
  readonly employeeCount?: number
  readonly annualRevenue?: Money
  readonly address?: Address
}

/** Contact identity associated with a company and customer. */
export interface Contact extends Entity<ContactId>, Timestamped, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly companyId?: CompanyId
  readonly firstName: string
  readonly lastName: string
  readonly title?: string
  readonly email: EmailAddress
  readonly phone?: Phone
}

/** Customer aggregate owning contacts and lifecycle state. */
export interface Customer extends Entity<CustomerId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly companyId: CompanyId
  readonly name: string
  readonly status: Status
  readonly contactIds: ReadonlyArray<ContactId>
  readonly healthScore?: Percentage
}

/** Lead object representing pre-qualified demand in CRM. */
export interface Lead extends Entity<LeadId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly customerId?: CustomerId
  readonly companyId?: CompanyId
  readonly contactId?: ContactId
  readonly source: string
  readonly status: LeadStatus
  readonly priority: Priority
  readonly estimatedValue?: Money
}

/** Opportunity tracks potential revenue progression. */
export interface Opportunity extends Entity<OpportunityId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly customerId: CustomerId
  readonly leadId?: LeadId
  readonly pipelineId: PipelineId
  readonly stage: OpportunityStage
  readonly amount: Money
  readonly probability: Percentage
  readonly expectedCloseDate?: string
}

/** Deal object representing contractual commitment stages. */
export interface Deal extends Entity<DealId>, Timestamped, OwnedEntity<UserId>, VersionedEntity {
  readonly workspaceId: WorkspaceId
  readonly opportunityId: OpportunityId
  readonly amount: Money
  readonly signedAt?: string
  readonly closedAt?: string
  readonly status: Status
}

/** Pipeline configuration and stage model for opportunities. */
export interface Pipeline extends Entity<PipelineId>, Timestamped {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly stages: ReadonlyArray<OpportunityStage>
  readonly isDefault: boolean
}
