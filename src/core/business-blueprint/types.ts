export type BlueprintId = string
export type BlueprintVersionId = string
export type BlueprintAuditId = string
export type BlueprintActorId = string

export type BlueprintSectionStatus = "draft" | "in-progress" | "complete" | "needs-review"

export type IndustryTemplateId =
  | "saas"
  | "ecommerce"
  | "manufacturing"
  | "healthcare"
  | "construction"
  | "consulting"
  | "agencies"
  | "retail"
  | "hospitality"
  | "education"
  | "non-profit"

export type BlueprintRoleProfileId =
  | "ceo"
  | "coo"
  | "cfo"
  | "cto"
  | "sales"
  | "marketing"
  | "hr"
  | "operations"
  | "support"
  | "developers"

export interface BlueprintThreshold {
  readonly warning: number
  readonly critical: number
  readonly target?: number
}

export interface BlueprintConfidence {
  readonly score: number
  readonly source: string
  readonly lastUpdated: string
  readonly verifiedBy?: string
  readonly pendingQuestions: ReadonlyArray<string>
  readonly missingInformation: ReadonlyArray<string>
}

export interface BlueprintSection<T> {
  readonly status: BlueprintSectionStatus
  readonly confidence: BlueprintConfidence
  readonly data: T
}

export interface BlueprintLocation {
  readonly id: string
  readonly label: string
  readonly country: string
  readonly city?: string
  readonly timezone?: string
  readonly isHeadquarters?: boolean
}

export interface BlueprintDepartment {
  readonly id: string
  readonly name: string
  readonly headRole?: string
  readonly teamIds: ReadonlyArray<string>
}

export interface BlueprintTeam {
  readonly id: string
  readonly name: string
  readonly departmentId?: string
  readonly responsibilities: ReadonlyArray<string>
}

export interface BlueprintBusinessUnit {
  readonly id: string
  readonly name: string
  readonly ownerRole?: string
  readonly markets: ReadonlyArray<string>
}

export interface OrganizationBlueprintData {
  readonly name: string
  readonly industry: string
  readonly subIndustry?: string
  readonly country: string
  readonly legalStructure: string
  readonly employeeCount: number
  readonly locations: ReadonlyArray<BlueprintLocation>
  readonly departments: ReadonlyArray<BlueprintDepartment>
  readonly teams: ReadonlyArray<BlueprintTeam>
  readonly businessUnits: ReadonlyArray<BlueprintBusinessUnit>
}

export interface BlueprintRevenueStream {
  readonly id: string
  readonly name: string
  readonly type: "product" | "service" | "subscription" | "project" | "other"
  readonly primaryMarkets: ReadonlyArray<string>
}

export interface BlueprintOffer {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly lifecycleStage?: string
}

export interface BlueprintRelationship {
  readonly id: string
  readonly name: string
  readonly type: "customer" | "partner" | "vendor" | "channel"
  readonly segment?: string
}

export interface BusinessModelBlueprintData {
  readonly revenueStreams: ReadonlyArray<BlueprintRevenueStream>
  readonly products: ReadonlyArray<BlueprintOffer>
  readonly services: ReadonlyArray<BlueprintOffer>
  readonly subscriptions: ReadonlyArray<BlueprintOffer>
  readonly projects: ReadonlyArray<BlueprintOffer>
  readonly relationships: ReadonlyArray<BlueprintRelationship>
  readonly markets: ReadonlyArray<string>
}

export interface BlueprintProcess {
  readonly id: string
  readonly name: string
  readonly ownerRole: string
  readonly criticality: "low" | "medium" | "high" | "critical"
}

export interface BlueprintWorkflow {
  readonly id: string
  readonly name: string
  readonly trigger: string
  readonly approvalRequired: boolean
}

export interface BlueprintApprovalRule {
  readonly id: string
  readonly name: string
  readonly approverRoles: ReadonlyArray<string>
  readonly condition: string
}

export interface BlueprintPolicy {
  readonly id: string
  readonly name: string
  readonly scope: string
  readonly ownerRole: string
}

export interface BlueprintAsset {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly ownerRole?: string
}

export interface OperationsBlueprintData {
  readonly processes: ReadonlyArray<BlueprintProcess>
  readonly workflows: ReadonlyArray<BlueprintWorkflow>
  readonly approvals: ReadonlyArray<BlueprintApprovalRule>
  readonly policies: ReadonlyArray<BlueprintPolicy>
  readonly assets: ReadonlyArray<BlueprintAsset>
  readonly inventoryModel?: string
  readonly productionModel?: string
  readonly serviceDeliveryModel?: string
}

export interface BlueprintBudget {
  readonly id: string
  readonly name: string
  readonly amount: number
  readonly currency: string
  readonly period: string
}

export interface BlueprintForecast {
  readonly id: string
  readonly name: string
  readonly period: string
  readonly value: number
  readonly confidence: number
}

export interface FinanceBlueprintData {
  readonly currencies: ReadonlyArray<string>
  readonly revenueModel: string
  readonly costModel: string
  readonly profitCenters: ReadonlyArray<string>
  readonly budgets: ReadonlyArray<BlueprintBudget>
  readonly forecasts: ReadonlyArray<BlueprintForecast>
  readonly financialKpiIds: ReadonlyArray<string>
}

export interface BlueprintSystemConnection {
  readonly id: string
  readonly name: string
  readonly category:
    | "crm"
    | "erp"
    | "accounting"
    | "hr"
    | "support"
    | "marketing"
    | "communication"
    | "storage"
    | "development"
    | "identity"
    | "other"
  readonly vendor?: string
  readonly status: "planned" | "connected" | "disconnected"
}

export interface SystemsBlueprintData {
  readonly connectedPlatforms: ReadonlyArray<BlueprintSystemConnection>
}

export interface BlueprintUserRole {
  readonly id: string
  readonly name: string
  readonly permissions: ReadonlyArray<string>
  readonly responsibilities: ReadonlyArray<string>
  readonly reportsToRoleId?: string
  readonly decisionScope: ReadonlyArray<string>
}

export interface UsersBlueprintData {
  readonly roles: ReadonlyArray<BlueprintUserRole>
  readonly decisionMakerRoleIds: ReadonlyArray<string>
}

export interface DynamicKpiDefinition {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly formula: string
  readonly department: string
  readonly priority: "low" | "medium" | "high" | "critical"
  readonly frequency: "realtime" | "hourly" | "daily" | "weekly" | "monthly" | "quarterly"
  readonly ownerRole: string
  readonly thresholds: BlueprintThreshold
  readonly industryTags: ReadonlyArray<string>
}

export interface GoalDefinition {
  readonly id: string
  readonly title: string
  readonly type: "strategic" | "operational" | "department" | "okr"
  readonly ownerRole: string
  readonly successMetrics: ReadonlyArray<string>
  readonly horizon: "quarter" | "half" | "year" | "multi-year"
}

export interface BusinessMemorySeed {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly sourceSection: string
  readonly tags: ReadonlyArray<string>
}

export interface RbiRoleInitialization {
  readonly role: BlueprintRoleProfileId
  readonly intelligencePriorities: ReadonlyArray<string>
  readonly keyKpiIds: ReadonlyArray<string>
  readonly recommendedViews: ReadonlyArray<string>
}

export interface BlueprintAuditEntry {
  readonly id: BlueprintAuditId
  readonly action:
    | "created"
    | "updated"
    | "validated"
    | "merged"
    | "versioned"
    | "approved"
    | "rolled-back"
  readonly actorId: BlueprintActorId
  readonly at: string
  readonly notes?: string
  readonly metadata?: Record<string, string>
}

export interface BlueprintSnapshot {
  readonly id: BlueprintId
  readonly templateId?: IndustryTemplateId
  readonly createdAt: string
  readonly updatedAt: string
  readonly approvedAt?: string
  readonly approvedBy?: BlueprintActorId
  readonly organization: BlueprintSection<OrganizationBlueprintData>
  readonly businessModel: BlueprintSection<BusinessModelBlueprintData>
  readonly operations: BlueprintSection<OperationsBlueprintData>
  readonly finance: BlueprintSection<FinanceBlueprintData>
  readonly systems: BlueprintSection<SystemsBlueprintData>
  readonly users: BlueprintSection<UsersBlueprintData>
  readonly kpis: BlueprintSection<ReadonlyArray<DynamicKpiDefinition>>
  readonly goals: BlueprintSection<ReadonlyArray<GoalDefinition>>
  readonly businessMemory: BlueprintSection<ReadonlyArray<BusinessMemorySeed>>
  readonly rbiInitialization: BlueprintSection<ReadonlyArray<RbiRoleInitialization>>
}

export interface BlueprintVersion {
  readonly id: BlueprintVersionId
  readonly sequence: number
  readonly createdAt: string
  readonly createdBy: BlueprintActorId
  readonly approvedAt?: string
  readonly approvedBy?: BlueprintActorId
  readonly changeSummary: string
  readonly snapshot: BlueprintSnapshot
}

export interface BusinessBlueprint extends BlueprintSnapshot {
  readonly version: number
  readonly versionHistory: ReadonlyArray<BlueprintVersion>
  readonly auditTrail: ReadonlyArray<BlueprintAuditEntry>
}

export interface CreateBlueprintInput {
  readonly actorId: BlueprintActorId
  readonly templateId?: IndustryTemplateId
  readonly organizationName: string
  readonly industry: string
  readonly country: string
  readonly legalStructure: string
}

export interface UpdateBlueprintInput {
  readonly actorId: BlueprintActorId
  readonly changeSummary: string
  readonly patch: Partial<BusinessBlueprint>
}

export interface ValidationIssue {
  readonly id: string
  readonly section: string
  readonly severity: "info" | "warning" | "error"
  readonly message: string
  readonly path?: string
}

export interface ValidationResult {
  readonly valid: boolean
  readonly completionScore: number
  readonly issues: ReadonlyArray<ValidationIssue>
}

export interface SearchBlueprintQuery {
  readonly text: string
  readonly industry?: string
  readonly country?: string
  readonly approvedOnly?: boolean
}

export interface BlueprintSearchHit {
  readonly blueprintId: BlueprintId
  readonly organizationName: string
  readonly industry: string
  readonly score: number
  readonly matchedSections: ReadonlyArray<string>
}

export interface CompareSectionChange {
  readonly section: string
  readonly field: string
  readonly before: string
  readonly after: string
}

export interface CompareVersionsResult {
  readonly leftVersionId: string
  readonly rightVersionId: string
  readonly changes: ReadonlyArray<CompareSectionChange>
}

export interface MergeBlueprintInput {
  readonly actorId: BlueprintActorId
  readonly changeSummary: string
  readonly incoming: Partial<BusinessBlueprint>
  readonly mode: "preserve-existing" | "prefer-incoming"
}