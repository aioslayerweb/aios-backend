export type OrganizationFixture = {
  id: string
  name: string
  workspaceId: string
  departmentId: string
  role: string
}

export const organizationFixtures: OrganizationFixture[] = [
  { id: "org-1", name: "Northwind Health", workspaceId: "ws-1", departmentId: "dep-1", role: "Owner" },
  { id: "org-2", name: "Helios Commerce", workspaceId: "ws-5", departmentId: "dep-5", role: "Manager" },
]
