import type { EventReplayFilter, RuntimeEventEnvelope } from "@/src/runtime/types"

type EventHandler<T = RuntimeEventEnvelope> = (event: T) => void

type Subscription = {
  id: string
  eventType?: string
  tenantId?: string
  handler: EventHandler
}

export class EventBus {
  private readonly events: RuntimeEventEnvelope[] = []
  private readonly subscriptions = new Map<string, Subscription>()

  publish<T extends RuntimeEventEnvelope>(event: T): void {
    this.events.push(event)
    for (const subscription of Array.from(this.subscriptions.values())) {
      if (subscription.eventType && subscription.eventType !== event.type) {
        continue
      }
      if (subscription.tenantId && subscription.tenantId !== event.tenantId) {
        continue
      }
      subscription.handler(event)
    }
  }

  subscribe(subscription: Subscription): () => void {
    this.subscriptions.set(subscription.id, subscription)
    return () => {
      this.subscriptions.delete(subscription.id)
    }
  }

  replay(filter: EventReplayFilter = {}): RuntimeEventEnvelope[] {
    return this.events.filter((event) => {
      if (filter.tenantId && filter.tenantId !== event.tenantId) {
        return false
      }
      if (filter.domain && filter.domain !== event.domain) {
        return false
      }
      if (filter.correlationId && filter.correlationId !== event.correlationId) {
        return false
      }
      if (filter.fromTimestamp && event.timestamp < filter.fromTimestamp) {
        return false
      }
      if (filter.toTimestamp && event.timestamp > filter.toTimestamp) {
        return false
      }
      return true
    })
  }

  listRecent(limit = 100): RuntimeEventEnvelope[] {
    return this.events.slice(-Math.max(1, limit))
  }
}
