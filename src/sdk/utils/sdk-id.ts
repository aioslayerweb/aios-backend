let sdkCounter = 0

export function createSdkId(prefix: string): string {
  sdkCounter += 1
  return `${prefix}-${Date.now()}-${sdkCounter}`
}

export function sdkNow(): string {
  return new Date().toISOString()
}
