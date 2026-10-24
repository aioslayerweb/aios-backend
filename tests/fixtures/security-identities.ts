export const securityIdentities = [
  {
    id: "user-northwind-owner",
    organizationId: "org-northwind",
    role: "owner",
  },
  {
    id: "user-helios-viewer",
    organizationId: "org-helios",
    role: "viewer",
  },
] as const

export const securityRecords = [
  {
    id: "record-northwind",
    organizationId: "org-northwind",
  },
  {
    id: "record-helios",
    organizationId: "org-helios",
  },
  {
    id: "record-unmapped",
    organizationId: null,
  },
] as const
