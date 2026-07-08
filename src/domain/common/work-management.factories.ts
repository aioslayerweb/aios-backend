import { Priority, TaskStatus } from "@/src/domain/common/enums"
import type { Project, Task } from "@/src/domain/common/work-management"
import { createId } from "@/src/domain/utils/id"

/** Creates a task entity. */
export function createTask(partial: Partial<Task> = {}): Task {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("task"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    projectId: partial.projectId,
    title: partial.title ?? "Review enterprise expansion proposal",
    description: partial.description ?? "Validate assumptions and update recommendation deck.",
    status: partial.status ?? TaskStatus.Todo,
    priority: partial.priority ?? Priority.High,
    assigneeId: partial.assigneeId,
    dueAt: partial.dueAt,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "review enterprise expansion proposal",
    searchKeywords: partial.searchKeywords ?? ["task", "review", "expansion"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a project aggregate. */
export function createProject(partial: Partial<Project> = {}): Project {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("project"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Enterprise Expansion Program",
    description: partial.description ?? "Cross-functional program for enterprise growth execution.",
    taskIds: partial.taskIds ?? [],
    period: partial.period,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "enterprise expansion program",
    searchKeywords: partial.searchKeywords ?? ["project", "enterprise", "expansion"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
