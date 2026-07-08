import {
  createAgent,
  createAgentCapability,
  createKnowledgeArticle,
  createKnowledgeCollection,
  createMemory,
  createMemoryEntry,
  createOrganization,
  createProject,
  createReport,
  createCustomer,
  createTask,
  createWorkspace,
} from "@/src/domain"

/** Canonical mock organization dataset for local development and tests. */
export const mockOrganizations = [
  createOrganization({ name: "AIOS Enterprise Group", domain: "enterprise.aios.example" }),
]

/** Canonical mock workspace dataset linked to organizations. */
export const mockWorkspaces = [
  createWorkspace({
    organizationId: mockOrganizations[0].id,
    name: "Executive Workspace",
    slug: "executive",
  }),
]

/** Canonical mock customer dataset for CRM flows. */
export const mockCustomers = [
  createCustomer({ workspaceId: mockWorkspaces[0].id, name: "Northwind Strategic" }),
  createCustomer({ workspaceId: mockWorkspaces[0].id, name: "Helios Industrial" }),
]

/** Canonical mock project dataset for execution planning. */
export const mockProjects = [
  createProject({ workspaceId: mockWorkspaces[0].id, name: "Renewal Uplift Program" }),
]

/** Canonical mock task dataset associated with projects. */
export const mockTasks = [
  createTask({ workspaceId: mockWorkspaces[0].id, projectId: mockProjects[0].id, title: "Prepare decision brief" }),
  createTask({ workspaceId: mockWorkspaces[0].id, projectId: mockProjects[0].id, title: "Review account expansion signals" }),
]

/** Canonical mock agent and capability dataset. */
const revenueCapability = createAgentCapability({ name: "Revenue Forecasting" })
export const mockAgents = [
  createAgent({
    workspaceId: mockWorkspaces[0].id,
    capabilityIds: [revenueCapability.id],
    name: "Executive Revenue Agent",
  }),
]

/** Canonical mock knowledge datasets. */
const collection = createKnowledgeCollection({ workspaceId: mockWorkspaces[0].id, name: "Executive Research" })
export const mockKnowledge = {
  collections: [collection],
  articles: [
    createKnowledgeArticle({
      workspaceId: mockWorkspaces[0].id,
      collectionId: collection.id,
      title: "Enterprise Buying Signal Playbook",
    }),
  ],
}

/** Canonical mock report dataset for reporting and executive modules. */
export const mockReports = [
  createReport({ workspaceId: mockWorkspaces[0].id, title: "Weekly Executive Performance" }),
]

/** Canonical mock memory datasets. */
const memory = createMemory({ workspaceId: mockWorkspaces[0].id })
export const mockMemory = {
  memories: [memory],
  entries: [
    createMemoryEntry({
      workspaceId: mockWorkspaces[0].id,
      memoryId: memory.id,
      title: "Customer procurement dependency",
    }),
  ],
}
