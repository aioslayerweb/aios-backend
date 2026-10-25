"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";
import { usePermissions } from "@/hooks/use-permissions";
import { useRoleContext } from "@/hooks/use-role-context";
import {
  createConnectorInstance,
  disconnectConnector,
  synchronizeConnector,
  SyntheticOpportunityAdapter,
  verifyConnectorConnection,
  type ConnectorInstance,
  type NormalizedOpportunity,
} from "@/lib/integrations/connectors";

const adapter = new SyntheticOpportunityAdapter();

export function SyntheticConnectorWorkbench() {
  const { organization } = useRoleContext();
  const { effectivePermissions, hasPermission } = usePermissions();
  const [instance, setInstance] = useState<ConnectorInstance | null>(null);
  const [records, setRecords] = useState<NormalizedOpportunity[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const granted = useMemo(() => new Set(effectivePermissions), [effectivePermissions]);
  const mayManage = hasPermission("manage_integrations");
  const mayReadData = hasPermission("view_reports");

  useEffect(() => {
    if (!organization?.id) {
      setInstance(null);
      setRecords([]);
      return;
    }
    setInstance(createConnectorInstance({
      id: `${organization.id}:synthetic-opportunity-fixture`,
      definitionId: adapter.definition.id,
      organizationId: organization.id,
      displayName: adapter.definition.name,
      scopes: adapter.definition.requiredScopes,
      metadata: adapter.definition.metadata,
      createdAt: "2026-10-25T00:00:00.000Z",
    }));
    setRecords([]);
    setStatusMessage("");
  }, [organization?.id]);

  async function connect() {
    if (!instance || !organization?.id) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const verified = await verifyConnectorConnection({
        instance,
        adapter,
        organizationId: organization.id,
        grantedPermissions: granted,
        now: new Date().toISOString(),
      });
      setInstance(verified);
      setStatusMessage(verified.status === "connected_verified"
        ? "Synthetic adapter validation passed. No external system or credentials were used."
        : `Connection not verified (${verified.lastErrorCategory ?? "not_configured"}).`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to validate this connector.");
    } finally {
      setBusy(false);
    }
  }

  async function synchronize() {
    if (!instance || !organization?.id) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const result = await synchronizeConnector({
        instance,
        adapter,
        organizationId: organization.id,
        grantedPermissions: granted,
        existingRecords: records,
        now: new Date().toISOString(),
        pageSize: 2,
      });
      setInstance(result.instance);
      setRecords(result.records);
      setStatusMessage(`Fixture sync ${result.status}: ${result.inserted} inserted, ${result.updated} updated, ${result.unchanged} unchanged, ${result.deleted} tombstoned.`);
      if (result.errorCategory) setErrorMessage(`Sync incomplete (${result.errorCategory}). Provider details were not retained.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to synchronize this connector.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!instance || !organization?.id) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const disconnected = await disconnectConnector({
        instance,
        adapter,
        organizationId: organization.id,
        grantedPermissions: granted,
        now: new Date().toISOString(),
      });
      setInstance(disconnected);
      setStatusMessage(disconnected.status === "disconnected"
        ? "Synthetic connector disconnected. Future sync requests are blocked until revalidated."
        : `Disconnect incomplete (${disconnected.lastErrorCategory ?? "unknown"}). No provider details were retained.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to disconnect this connector.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-border bg-white" aria-label="Synthetic connector test workbench">
      <CardHeader className="flex flex-wrap items-start justify-between gap-2 py-3">
        <div>
          <h2 className="text-sm font-semibold text-brand-navy">First connector path: synthetic CRM opportunity fixture</h2>
          <p className="mt-1 text-xs text-text-secondary">Tests lifecycle, bounded pagination, idempotent normalization, freshness, and organization scoping without an external API.</p>
        </div>
        <Badge tone="warning">Test adapter only · no live provider</Badge>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <Info label="Connection" value={instance?.status === "connected_verified" ? "Synthetic adapter validated" : instance?.status.replace(/_/g, " ") ?? "Resolving organization"} />
          <Info label="Sync state" value={instance?.syncStatus ?? "idle"} />
          <Info label="Mode" value={`${adapter.definition.mode} · synthetic fixture`} />
          <Info label="Required data access" value="view_reports" />
          <Info label="Last verified fixture sync" value={instance?.lastSuccessfulSyncAt ?? "Never"} />
        </div>
        <p className="break-words rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-text-secondary">
          Organization scope: {organization?.id ?? "not available"} · Scope requested: {adapter.definition.requiredScopes.join(", ")} · Credentials: none · Persistence: page memory only.
        </p>
        {statusMessage ? <p className="text-sm text-text-secondary" role="status" aria-live="polite">{statusMessage}</p> : null}
        {errorMessage ? <p className="text-sm text-red-700" role="alert">{errorMessage}</p> : null}
        {!mayManage ? <p className="text-xs text-amber-900">Your effective permissions do not include manage_integrations; connector lifecycle actions are unavailable.</p> : null}
        {mayManage && !mayReadData ? <p className="text-xs text-amber-900">Synchronization is blocked until view_reports is granted; no records are requested from the adapter.</p> : null}
        <div className="flex flex-wrap gap-2">
          {instance?.status === "connected_verified" ? (
            <>
              <Button type="button" size="sm" variant="primary" disabled={busy || !mayManage || !mayReadData} onClick={synchronize}>Run fixture sync</Button>
              <Button type="button" size="sm" variant="secondary" disabled={busy || !mayManage} onClick={disconnect}>Disconnect test adapter</Button>
            </>
          ) : (
            <Button type="button" size="sm" variant="primary" disabled={busy || !instance || !mayManage} onClick={connect}>Validate test adapter</Button>
          )}
        </div>
        {records.length ? (
          <div className="space-y-2" aria-label="Normalized synthetic connector records">
            <h3 className="text-sm font-semibold text-brand-navy">Normalized opportunity samples</h3>
            {records.map((record) => (
              <article key={record.id} className="min-w-0 rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="break-words text-sm font-medium text-brand-navy">{record.name}</p>
                  <Badge tone={record.lifecycle === "deleted" ? "warning" : record.freshness === "stale" ? "warning" : "info"}>{record.lifecycle === "deleted" ? "Deleted source · tombstone" : record.freshness}</Badge>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{record.stage.replace(/_/g, " ")} · {record.currency} {record.amount.toLocaleString()} · {record.organizationId}</p>
                <p className="mt-1 break-words text-[11px] text-text-muted">Source: {record.source.system}/{record.source.recordId} · source updated {record.source.updatedAt} · imported {record.source.importedAt}</p>
              </article>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-canvas p-3">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-brand-navy">{value}</p>
    </div>
  );
}
