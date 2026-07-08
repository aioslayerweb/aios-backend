import type { Brand } from "@/src/domain/types/ids"

/** Generates deterministic-feeling prefixed identifiers for domain entities. */
export function createId<T extends string>(prefix: string): Brand<string, T> {
  const entropy = Math.random().toString(36).slice(2, 10)
  const timestamp = Date.now().toString(36)
  return `${prefix}_${timestamp}_${entropy}` as Brand<string, T>
}
