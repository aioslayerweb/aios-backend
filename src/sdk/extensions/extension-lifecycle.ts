import type { ExtensionContribution } from "@/src/sdk/types"

export type ExtensionLifecycleState = "registered" | "loaded" | "started" | "stopped" | "failed"

export type ExtensionLifecycleRecord = {
  extensionId: string
  pluginId: string
  state: ExtensionLifecycleState
  updatedAt: string
  message: string
}

export class ExtensionLifecycleManager {
  private readonly records = new Map<string, ExtensionLifecycleRecord>()

  transition(extension: ExtensionContribution, state: ExtensionLifecycleState, message: string): ExtensionLifecycleRecord {
    const record: ExtensionLifecycleRecord = {
      extensionId: extension.id,
      pluginId: extension.pluginId,
      state,
      updatedAt: new Date().toISOString(),
      message,
    }
    this.records.set(extension.id, record)
    return record
  }

  list(pluginId?: string): ExtensionLifecycleRecord[] {
    const all = Array.from(this.records.values())
    return pluginId ? all.filter((record) => record.pluginId === pluginId) : all
  }
}
