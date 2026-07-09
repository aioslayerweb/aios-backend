let runtimeCounter = 0

export function createRuntimeId(prefix: string): string {
  runtimeCounter += 1
  return `${prefix}-${Date.now()}-${runtimeCounter}`
}

export function nowIso(): string {
  return new Date().toISOString()
}
