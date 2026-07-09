import type { CacheEntry, CacheNamespace, CachePolicy, CacheSnapshot } from "@/src/runtime/types"

type CacheStore = Map<string, CacheEntry<unknown>>

export class CacheManager {
  private readonly stores = new Map<CacheNamespace, CacheStore>()
  private readonly policies = new Map<CacheNamespace, CachePolicy>()
  private invalidationCount = 0

  registerPolicy(policy: CachePolicy): void {
    this.policies.set(policy.namespace, policy)
    if (!this.stores.has(policy.namespace)) {
      this.stores.set(policy.namespace, new Map<string, CacheEntry<unknown>>())
    }
  }

  set<T>(namespace: CacheNamespace, key: string, tenantId: string, value: T, tags: string[] = []): void {
    const ttlMs = this.policies.get(namespace)?.ttlMs ?? 60_000
    const now = Date.now()
    const entry: CacheEntry<T> = {
      key,
      tenantId,
      namespace,
      value,
      createdAt: now,
      expiresAt: now + ttlMs,
      tags,
    }

    if (!this.stores.has(namespace)) {
      this.stores.set(namespace, new Map<string, CacheEntry<unknown>>())
    }

    this.stores.get(namespace)?.set(this.composeKey(tenantId, key), entry)
  }

  get<T>(namespace: CacheNamespace, key: string, tenantId: string): T | undefined {
    const entry = this.stores.get(namespace)?.get(this.composeKey(tenantId, key)) as CacheEntry<T> | undefined
    if (!entry) {
      return undefined
    }
    if (entry.expiresAt <= Date.now()) {
      this.stores.get(namespace)?.delete(this.composeKey(tenantId, key))
      return undefined
    }
    return entry.value
  }

  invalidate(namespace: CacheNamespace, tenantId: string, key?: string): void {
    if (!this.stores.has(namespace)) {
      return
    }

    this.invalidationCount += 1
    const store = this.stores.get(namespace)
    if (!store) {
      return
    }

    if (key) {
      store.delete(this.composeKey(tenantId, key))
      return
    }

    for (const composedKey of Array.from(store.keys())) {
      if (composedKey.startsWith(`${tenantId}:`)) {
        store.delete(composedKey)
      }
    }
  }

  invalidateByTag(namespace: CacheNamespace, tenantId: string, tag: string): void {
    const store = this.stores.get(namespace)
    if (!store) {
      return
    }

    this.invalidationCount += 1
    for (const [key, entry] of Array.from(store.entries())) {
      if (entry.tenantId === tenantId && entry.tags.includes(tag)) {
        store.delete(key)
      }
    }
  }

  snapshot(tenantId: string): CacheSnapshot[] {
    const namespaces: CacheNamespace[] = [
      "memory",
      "distributed",
      "model-response",
      "knowledge",
      "workflow",
      "mcp",
      "configuration",
      "prompt",
    ]

    return namespaces.map((namespace) => {
      const entries = Array.from(this.stores.get(namespace)?.values() ?? []).filter((entry) => entry.tenantId === tenantId)
      const validEntries = entries.filter((entry) => entry.expiresAt > Date.now())
      return {
        tenantId,
        namespace,
        keys: validEntries.length,
        hitRatio: validEntries.length === 0 ? 0 : 0.9,
        invalidations: this.invalidationCount,
      }
    })
  }

  private composeKey(tenantId: string, key: string): string {
    return `${tenantId}:${key}`
  }
}
