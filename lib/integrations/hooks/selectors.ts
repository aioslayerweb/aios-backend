import type { IntegrationHealthSummaryItem, IntegrationState } from "../types"

export function selectFilteredAvailableIntegrations(state: IntegrationState) {
  if (state.selectedCategory === "all") {
    return state.availableIntegrations
  }

  return state.availableIntegrations.filter((integration) => integration.category === state.selectedCategory)
}

export function selectHealthSummary(state: IntegrationState): IntegrationHealthSummaryItem[] {
  const counts = new Map<IntegrationHealthSummaryItem["state"], number>()

  for (const system of state.connectedSystems) {
    counts.set(system.health, (counts.get(system.health) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([stateKey, count]) => ({ state: stateKey, count }))
}

export function selectSyncSummary(state: IntegrationState) {
  return state.syncJobs.reduce(
    (summary, job) => ({
      queued: summary.queued + job.queued,
      running: summary.running + job.running,
      completed: summary.completed + job.completed,
      failed: summary.failed + job.failed,
    }),
    { queued: 0, running: 0, completed: 0, failed: 0 }
  )
}