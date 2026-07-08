import { Status } from "@/src/domain/common/enums"
import type { Workspace } from "@/src/domain/workspace/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a workspace aggregate with enterprise defaults. */
export function createWorkspace(partial: Partial<Workspace> = {}): Workspace {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("workspace"),
    organizationId: partial.organizationId ?? createId("org"),
    name: partial.name ?? "Executive Workspace",
    slug: partial.slug ?? "executive-workspace",
    status: partial.status ?? Status.Active,
    description: partial.description ?? "Primary workspace for executive intelligence and operations.",
    version: partial.version ?? 1,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
