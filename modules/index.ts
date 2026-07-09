export interface ModuleDefinition {
  name: string;
  path: string;
  mode: "Analytical" | "Operational" | "Strategic";
}

export const moduleCatalog: ModuleDefinition[] = [
  { name: "Corporate", path: "/app/corporate", mode: "Strategic" },
  { name: "Actions", path: "/app/actions", mode: "Operational" },
  { name: "Customers", path: "/app/customers", mode: "Analytical" },
  { name: "Reports", path: "/app/reports", mode: "Strategic" },
  { name: "Security", path: "/app/security", mode: "Strategic" },
  { name: "MCP Platform", path: "/app/mcp", mode: "Strategic" },
  { name: "Knowledge", path: "/app/knowledge", mode: "Analytical" },
  { name: "Memory", path: "/app/memory", mode: "Operational" },
];
