export interface ModuleContract {
  module: string;
  owner: string;
  allowedActions: Array<"read" | "write" | "summarize">;
}

export const moduleContracts: Record<string, ModuleContract> = {
  customers: {
    module: "customers",
    owner: "customers",
    allowedActions: ["read", "summarize"],
  },
  actions: {
    module: "actions",
    owner: "actions",
    allowedActions: ["write", "summarize"],
  },
  executive: {
    module: "executive",
    owner: "executive",
    allowedActions: ["write", "summarize"],
  },
  knowledge: {
    module: "knowledge",
    owner: "knowledge",
    allowedActions: ["read", "summarize"],
  },
};
