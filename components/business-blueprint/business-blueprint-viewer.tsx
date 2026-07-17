import type { BusinessBlueprint, ValidationIssue } from "@/src/core/business-blueprint"
import { BlueprintSectionCard } from "@/components/business-blueprint/blueprint-section-card"
import { CompletionProgress } from "@/components/business-blueprint/completion-progress"
import { ConfidenceIndicator } from "@/components/business-blueprint/confidence-indicator"
import { MissingInformationList } from "@/components/business-blueprint/missing-information-list"
import { RelationshipGraph } from "@/components/business-blueprint/relationship-graph"
import { ValidationStatus } from "@/components/business-blueprint/validation-status"

type BusinessBlueprintViewerProps = {
  blueprint: BusinessBlueprint
  completionScore: number
  validationIssues: ReadonlyArray<ValidationIssue>
}

export function BusinessBlueprintViewer({ blueprint, completionScore, validationIssues }: BusinessBlueprintViewerProps) {
  const graphNodes = [
    { id: "org", label: "Organization", group: "organization" as const },
    { id: "ops", label: "Operations", group: "operations" as const },
    { id: "fin", label: "Finance", group: "finance" as const },
    { id: "sys", label: "Systems", group: "systems" as const },
    { id: "usr", label: "Users", group: "users" as const },
  ]

  const graphEdges = [
    { from: "org", to: "ops" },
    { from: "org", to: "fin" },
    { from: "org", to: "sys" },
    { from: "org", to: "usr" },
    { from: "ops", to: "fin" },
    { from: "sys", to: "ops" },
    { from: "usr", to: "ops" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <CompletionProgress score={completionScore} />
        <ValidationStatus issues={validationIssues} />
        <ConfidenceIndicator
          score={blueprint.organization.confidence.score}
          source={blueprint.organization.confidence.source}
          lastUpdated={blueprint.organization.confidence.lastUpdated}
          verifiedBy={blueprint.organization.confidence.verifiedBy}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BlueprintSectionCard
          title="Organization"
          subtitle={`${blueprint.organization.data.industry} · ${blueprint.organization.data.country}`}
          status={blueprint.organization.status}
        >
          <dl className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Name</dt>
              <dd>{blueprint.organization.data.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Employees</dt>
              <dd>{blueprint.organization.data.employeeCount}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Departments</dt>
              <dd>{blueprint.organization.data.departments.length}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Teams</dt>
              <dd>{blueprint.organization.data.teams.length}</dd>
            </div>
          </dl>
        </BlueprintSectionCard>

        <BlueprintSectionCard title="Business Model" status={blueprint.businessModel.status}>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Revenue Streams: {blueprint.businessModel.data.revenueStreams.length}</li>
            <li>Products: {blueprint.businessModel.data.products.length}</li>
            <li>Services: {blueprint.businessModel.data.services.length}</li>
            <li>Markets: {blueprint.businessModel.data.markets.join(", ") || "Not specified"}</li>
          </ul>
        </BlueprintSectionCard>

        <BlueprintSectionCard title="Operations" status={blueprint.operations.status}>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Processes: {blueprint.operations.data.processes.length}</li>
            <li>Workflows: {blueprint.operations.data.workflows.length}</li>
            <li>Approvals: {blueprint.operations.data.approvals.length}</li>
            <li>Policies: {blueprint.operations.data.policies.length}</li>
          </ul>
        </BlueprintSectionCard>

        <BlueprintSectionCard title="Finance" status={blueprint.finance.status}>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Currencies: {blueprint.finance.data.currencies.join(", ")}</li>
            <li>Budgets: {blueprint.finance.data.budgets.length}</li>
            <li>Forecasts: {blueprint.finance.data.forecasts.length}</li>
            <li>Financial KPI links: {blueprint.finance.data.financialKpiIds.length}</li>
          </ul>
        </BlueprintSectionCard>

        <BlueprintSectionCard title="Systems" status={blueprint.systems.status}>
          <ul className="space-y-2 text-sm text-slate-700">
            {blueprint.systems.data.connectedPlatforms.slice(0, 6).map((system) => (
              <li key={system.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>{system.name}</span>
                <span className="text-xs font-semibold uppercase text-slate-500">{system.status}</span>
              </li>
            ))}
          </ul>
        </BlueprintSectionCard>

        <BlueprintSectionCard title="Users and RBI" status={blueprint.users.status}>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Roles: {blueprint.users.data.roles.length}</li>
            <li>Decision Makers: {blueprint.users.data.decisionMakerRoleIds.length}</li>
            <li>RBI Profiles: {blueprint.rbiInitialization.data.length}</li>
            <li>KPI Definitions: {blueprint.kpis.data.length}</li>
          </ul>
        </BlueprintSectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <RelationshipGraph nodes={graphNodes} edges={graphEdges} />
        <MissingInformationList
          items={[
            ...blueprint.organization.confidence.missingInformation,
            ...blueprint.businessModel.confidence.missingInformation,
            ...blueprint.finance.confidence.missingInformation,
            ...blueprint.systems.confidence.missingInformation,
          ]}
        />
      </div>
    </div>
  )
}
