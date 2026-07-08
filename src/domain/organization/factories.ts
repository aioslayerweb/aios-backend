import { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE } from "@/src/domain/common/constants"
import { Status } from "@/src/domain/common/enums"
import type { Department, Organization } from "@/src/domain/organization/types"
import { createId } from "@/src/domain/utils/id"

/** Creates an organization aggregate with canonical defaults. */
export function createOrganization(partial: Partial<Organization> = {}): Organization {
  const now = new Date().toISOString()

  return {
    id: partial.id ?? createId("org"),
    name: partial.name ?? "AIOS Holdings",
    legalName: partial.legalName ?? "AIOS Holdings Inc.",
    domain: partial.domain ?? "aios.example",
    status: partial.status ?? Status.Active,
    headquarters:
      partial.headquarters ??
      ({
        line1: "100 Executive Plaza",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "US",
      } as const),
    businessHours:
      partial.businessHours ??
      ({
        timezone: DEFAULT_TIMEZONE,
        weekdays: [
          { day: "monday", open: "09:00", close: "17:00" },
          { day: "tuesday", open: "09:00", close: "17:00" },
          { day: "wednesday", open: "09:00", close: "17:00" },
          { day: "thursday", open: "09:00", close: "17:00" },
          { day: "friday", open: "09:00", close: "17:00" },
        ],
      } as const),
    primaryLanguage: partial.primaryLanguage ?? { code: DEFAULT_LANGUAGE, label: "English (US)" },
    timezone: partial.timezone ?? { id: DEFAULT_TIMEZONE, offsetMinutes: 0 },
    workspaceIds: partial.workspaceIds ?? [],
    version: partial.version ?? 1,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an organization department with defaults. */
export function createDepartment(partial: Partial<Department> = {}): Department {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("department"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    name: partial.name ?? "Operations",
    description: partial.description ?? "Operational excellence and cross-functional execution.",
    leadId: partial.leadId,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
