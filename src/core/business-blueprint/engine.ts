import { compareSnapshots, formatCompareResult } from "@/src/core/business-blueprint/compare"
import { mergeBlueprintPatch } from "@/src/core/business-blueprint/merge"
import { createTemplateBlueprint } from "@/src/core/business-blueprint/templates"
import type {
  BlueprintActorId,
  BlueprintAuditEntry,
  BlueprintSearchHit,
  BlueprintSnapshot,
  BlueprintVersion,
  BusinessBlueprint,
  CompareVersionsResult,
  CreateBlueprintInput,
  MergeBlueprintInput,
  SearchBlueprintQuery,
  UpdateBlueprintInput,
  ValidationResult,
} from "@/src/core/business-blueprint/types"
import { validateBlueprint } from "@/src/core/business-blueprint/validators"

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function toSnapshot(blueprint: BusinessBlueprint): BlueprintSnapshot {
  return {
    id: blueprint.id,
    templateId: blueprint.templateId,
    createdAt: blueprint.createdAt,
    updatedAt: blueprint.updatedAt,
    approvedAt: blueprint.approvedAt,
    approvedBy: blueprint.approvedBy,
    organization: blueprint.organization,
    businessModel: blueprint.businessModel,
    operations: blueprint.operations,
    finance: blueprint.finance,
    systems: blueprint.systems,
    users: blueprint.users,
    kpis: blueprint.kpis,
    goals: blueprint.goals,
    businessMemory: blueprint.businessMemory,
    rbiInitialization: blueprint.rbiInitialization,
  }
}

function audit(action: BlueprintAuditEntry["action"], actorId: BlueprintActorId, notes?: string): BlueprintAuditEntry {
  return {
    id: createId("audit"),
    action,
    actorId,
    at: nowIso(),
    notes,
  }
}

function createVersion(blueprint: BusinessBlueprint, actorId: BlueprintActorId, changeSummary: string): BlueprintVersion {
  return {
    id: createId("version"),
    sequence: blueprint.version,
    createdAt: nowIso(),
    createdBy: actorId,
    changeSummary,
    snapshot: toSnapshot(blueprint),
  }
}

function applyPatch(base: BusinessBlueprint, patch: Partial<BusinessBlueprint>): BusinessBlueprint {
  return {
    ...base,
    ...patch,
    organization: patch.organization ?? base.organization,
    businessModel: patch.businessModel ?? base.businessModel,
    operations: patch.operations ?? base.operations,
    finance: patch.finance ?? base.finance,
    systems: patch.systems ?? base.systems,
    users: patch.users ?? base.users,
    kpis: patch.kpis ?? base.kpis,
    goals: patch.goals ?? base.goals,
    businessMemory: patch.businessMemory ?? base.businessMemory,
    rbiInitialization: patch.rbiInitialization ?? base.rbiInitialization,
  }
}

export class BusinessBlueprintEngine {
  private readonly store = new Map<string, BusinessBlueprint>()

  create(input: CreateBlueprintInput): BusinessBlueprint {
    const timestamp = nowIso()
    const template = input.templateId ? createTemplateBlueprint(input.templateId) : createTemplateBlueprint("saas")

    const blueprint: BusinessBlueprint = {
      id: createId("blueprint"),
      templateId: input.templateId,
      createdAt: timestamp,
      updatedAt: timestamp,
      organization: {
        ...template.organization,
        data: {
          ...template.organization.data,
          name: input.organizationName,
          industry: input.industry,
          country: input.country,
          legalStructure: input.legalStructure,
        },
      },
      businessModel: template.businessModel,
      operations: template.operations,
      finance: template.finance,
      systems: template.systems,
      users: template.users,
      kpis: template.kpis,
      goals: template.goals,
      businessMemory: template.businessMemory,
      rbiInitialization: template.rbiInitialization,
      version: 1,
      versionHistory: [],
      auditTrail: [audit("created", input.actorId, "Blueprint created")],
    }

    const initialVersion = createVersion(blueprint, input.actorId, "Initial blueprint")
    const created: BusinessBlueprint = {
      ...blueprint,
      versionHistory: [initialVersion],
    }

    this.store.set(created.id, created)
    return created
  }

  read(blueprintId: string): BusinessBlueprint | undefined {
    return this.store.get(blueprintId)
  }

  update(blueprintId: string, input: UpdateBlueprintInput): BusinessBlueprint {
    const current = this.requireBlueprint(blueprintId)
    const next = applyPatch(current, input.patch)
    const updated: BusinessBlueprint = {
      ...next,
      version: current.version + 1,
      updatedAt: nowIso(),
      versionHistory: [...current.versionHistory, createVersion({ ...next, version: current.version + 1 }, input.actorId, input.changeSummary)],
      auditTrail: [...current.auditTrail, audit("updated", input.actorId, input.changeSummary)],
    }
    this.store.set(blueprintId, updated)
    return updated
  }

  validate(blueprintId: string): ValidationResult {
    const blueprint = this.requireBlueprint(blueprintId)
    const result = validateBlueprint(blueprint)
    const updated: BusinessBlueprint = {
      ...blueprint,
      auditTrail: [...blueprint.auditTrail, audit("validated", "system", `Validation complete: ${result.completionScore}%`)],
    }
    this.store.set(blueprintId, updated)
    return result
  }

  merge(blueprintId: string, input: MergeBlueprintInput): BusinessBlueprint {
    const current = this.requireBlueprint(blueprintId)
    const merged = mergeBlueprintPatch(current, input.incoming, input.mode)
    const nextVersion = current.version + 1
    const updated: BusinessBlueprint = {
      ...merged,
      version: nextVersion,
      updatedAt: nowIso(),
      versionHistory: [
        ...current.versionHistory,
        createVersion({ ...merged, version: nextVersion }, input.actorId, input.changeSummary),
      ],
      auditTrail: [...current.auditTrail, audit("merged", input.actorId, input.changeSummary)],
    }
    this.store.set(blueprintId, updated)
    return updated
  }

  version(blueprintId: string, actorId: BlueprintActorId, changeSummary: string): BlueprintVersion {
    const blueprint = this.requireBlueprint(blueprintId)
    const version = createVersion(blueprint, actorId, changeSummary)
    const updated: BusinessBlueprint = {
      ...blueprint,
      versionHistory: [...blueprint.versionHistory, version],
      auditTrail: [...blueprint.auditTrail, audit("versioned", actorId, changeSummary)],
    }
    this.store.set(blueprintId, updated)
    return version
  }

  approve(blueprintId: string, actorId: BlueprintActorId, notes: string): BusinessBlueprint {
    const current = this.requireBlueprint(blueprintId)
    const timestamp = nowIso()

    const latestVersion = current.versionHistory[current.versionHistory.length - 1]
    const approvedVersion = latestVersion
      ? {
          ...latestVersion,
          approvedAt: timestamp,
          approvedBy: actorId,
        }
      : undefined

    const updated: BusinessBlueprint = {
      ...current,
      approvedAt: timestamp,
      approvedBy: actorId,
      versionHistory: approvedVersion
        ? [...current.versionHistory.slice(0, -1), approvedVersion]
        : current.versionHistory,
      auditTrail: [...current.auditTrail, audit("approved", actorId, notes)],
    }

    this.store.set(blueprintId, updated)
    return updated
  }

  search(query: SearchBlueprintQuery): ReadonlyArray<BlueprintSearchHit> {
    const text = query.text.trim().toLowerCase()
    const rows = Array.from(this.store.values())
      .filter((blueprint) => {
        if (query.industry && blueprint.organization.data.industry.toLowerCase() !== query.industry.toLowerCase()) {
          return false
        }
        if (query.country && blueprint.organization.data.country.toLowerCase() !== query.country.toLowerCase()) {
          return false
        }
        if (query.approvedOnly && !blueprint.approvedAt) {
          return false
        }

        if (!text) {
          return true
        }

        return [
          blueprint.organization.data.name,
          blueprint.organization.data.industry,
          blueprint.businessModel.data.markets.join(" "),
          blueprint.goals.data.map((goal) => goal.title).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(text)
      })
      .map((blueprint) => {
        const matchedSections: string[] = []
        if (blueprint.organization.data.name.toLowerCase().includes(text) || blueprint.organization.data.industry.toLowerCase().includes(text)) {
          matchedSections.push("organization")
        }
        if (blueprint.goals.data.some((goal) => goal.title.toLowerCase().includes(text))) {
          matchedSections.push("goals")
        }
        if (blueprint.kpis.data.some((kpi) => kpi.name.toLowerCase().includes(text))) {
          matchedSections.push("kpis")
        }

        const score = Math.min(100, 40 + matchedSections.length * 20)
        return {
          blueprintId: blueprint.id,
          organizationName: blueprint.organization.data.name,
          industry: blueprint.organization.data.industry,
          score,
          matchedSections,
        }
      })
      .sort((a, b) => b.score - a.score)

    return rows
  }

  compare(blueprintId: string, leftVersionId: string, rightVersionId: string): CompareVersionsResult {
    const blueprint = this.requireBlueprint(blueprintId)
    const left = blueprint.versionHistory.find((version) => version.id === leftVersionId)
    const right = blueprint.versionHistory.find((version) => version.id === rightVersionId)

    if (!left || !right) {
      throw new Error("Unable to compare: one or both versions were not found")
    }

    const changes = compareSnapshots(left.snapshot, right.snapshot)
    return formatCompareResult(leftVersionId, rightVersionId, changes)
  }

  rollback(blueprintId: string, versionId: string, actorId: BlueprintActorId): BusinessBlueprint {
    const blueprint = this.requireBlueprint(blueprintId)
    const version = blueprint.versionHistory.find((candidate) => candidate.id === versionId)
    if (!version) {
      throw new Error(`Version ${versionId} was not found`)
    }

    const restored: BusinessBlueprint = {
      ...version.snapshot,
      version: blueprint.version + 1,
      versionHistory: [
        ...blueprint.versionHistory,
        createVersion({ ...version.snapshot, version: blueprint.version + 1, versionHistory: [], auditTrail: [] }, actorId, `Rollback to ${versionId}`),
      ],
      auditTrail: [...blueprint.auditTrail, audit("rolled-back", actorId, `Rolled back to ${versionId}`)],
    }
    this.store.set(blueprintId, restored)
    return restored
  }

  private requireBlueprint(blueprintId: string): BusinessBlueprint {
    const blueprint = this.store.get(blueprintId)
    if (!blueprint) {
      throw new Error(`Blueprint ${blueprintId} was not found`)
    }
    return blueprint
  }
}
