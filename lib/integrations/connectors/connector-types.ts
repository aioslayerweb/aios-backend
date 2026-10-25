import type { PermissionKey } from "@/src/domain/security";

export type ConnectorLifecycleStatus =
  | "not_connected"
  | "connection_initiated"
  | "awaiting_authorization"
  | "connected_verified"
  | "synchronizing"
  | "temporarily_degraded"
  | "reauthorization_required"
  | "disconnected"
  | "failed";

export type ConnectorSyncStatus = "idle" | "running" | "complete" | "partial" | "failed";
export type ConnectorDataCategory = "customers" | "opportunities" | "invoices" | "documents" | "operational_events";
export type ConnectorAuthMethod = "none" | "oauth" | "api_key" | "service_account";
export type ConnectorErrorCategory = "not_configured" | "authorization_required" | "forbidden" | "rate_limited" | "provider_unavailable" | "invalid_data" | "disconnected" | "unknown";

export type ConnectorDefinition = {
  id: string;
  name: string;
  category: "test" | "crm" | "finance" | "knowledge" | "operations";
  mode: "test" | "external";
  authenticationMethod: ConnectorAuthMethod;
  requiredScopes: string[];
  dataCategories: ConnectorDataCategory[];
  dataPermission: PermissionKey;
  metadata: Record<string, string>;
};

export type ConnectorInstance = {
  id: string;
  definitionId: string;
  organizationId: string;
  displayName: string;
  status: ConnectorLifecycleStatus;
  syncStatus: ConnectorSyncStatus;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
  lastAttemptedSyncAt?: string;
  lastSuccessfulSyncAt?: string;
  lastErrorCategory?: ConnectorErrorCategory;
  metadata: Record<string, string>;
};

export type NormalizedOpportunity = {
  id: string;
  organizationId: string;
  kind: "opportunity";
  name: string;
  stage: "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  amount: number;
  currency: string;
  source: {
    system: string;
    recordId: string;
    updatedAt: string;
    importedAt: string;
  };
  freshness: "current" | "stale";
  lifecycle: "active" | "deleted";
};

export type ConnectorRawRecord = {
  sourceRecordId: string;
  name: string;
  stage: NormalizedOpportunity["stage"];
  amount: number;
  currency: string;
  sourceUpdatedAt: string;
  deleted?: boolean;
};

export type ConnectorPage = {
  records: ConnectorRawRecord[];
  nextCursor?: string;
  complete: boolean;
};

export interface BusinessConnectorAdapter {
  readonly definition: ConnectorDefinition;
  validateConnection(instance: ConnectorInstance): Promise<{ valid: boolean; errorCategory?: ConnectorErrorCategory }>;
  discoverResources(): Promise<ConnectorDataCategory[]>;
  fetchPage(input: {
    instance: ConnectorInstance;
    category: ConnectorDataCategory;
    cursor?: string;
    limit: number;
  }): Promise<ConnectorPage>;
  disconnect?(instance: ConnectorInstance): Promise<void>;
}

export type ConnectorSyncResult = {
  instance: ConnectorInstance;
  records: NormalizedOpportunity[];
  inserted: number;
  updated: number;
  unchanged: number;
  deleted: number;
  status: "complete" | "partial" | "failed";
  errorCategory?: ConnectorErrorCategory;
};
