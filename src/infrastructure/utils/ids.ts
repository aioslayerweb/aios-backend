let infraCounter = 0

export function createInfrastructureId(prefix: string): string {
  infraCounter += 1
  return `${prefix}-${Date.now()}-${infraCounter}`
}

export function isoNow(): string {
  return new Date().toISOString()
}
