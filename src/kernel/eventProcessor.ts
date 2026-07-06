import {
  AIOSLifecycleStage,
  AIOSSystemEvent,
  AIOSExecutionSource,
  AIOSExecutionStepStatus,
  AIOSErrorSeverity,
  ExecutionCompleteEvent,
  ExecutionErrorEvent,
  ExecutionStartEvent,
  ExecutionStepEvent,
  StateTransitionEvent,
} from "./eventContract"

export type ProcessEventResult = {
  success: boolean
  eventType: AIOSSystemEvent["type"]
  timestamp: number
  contextId: string
  lifecycle: AIOSLifecycleStage[]
}

export type MiddlewareContext = {
  event: AIOSSystemEvent
  result?: ProcessEventResult
}

export type Middleware = (
  ctx: MiddlewareContext,
  next: () => Promise<void> | void
) => Promise<void> | void

export type KernelEventSink = {
  add(event: AIOSSystemEvent): void | Promise<void>
}

type RoutedEvent = {
  channel:
    | "execution.start"
    | "execution.step"
    | "execution.complete"
    | "execution.error"
    | "state.transition"
  event: AIOSSystemEvent
}

type ExecutionResult = {
  accepted: boolean
}

export class EventProcessor {
  private readonly eventLog: AIOSSystemEvent[] = []
  private readonly middlewares: Middleware[] = []
  private sink: KernelEventSink | null

  constructor(sink?: KernelEventSink) {
    this.sink = sink ?? null
  }

  public setSink(sink: KernelEventSink | null): void {
    this.sink = sink
  }

  public use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }

  public process(event: AIOSSystemEvent): ProcessEventResult {
    const lifecycle: AIOSLifecycleStage[] = []

    this.validate(event)
    lifecycle.push("validated")

    const routed = this.route(event)
    lifecycle.push("routed")

    this.runMiddlewares({ event })

    const execution = this.execute(routed)
    lifecycle.push("executed")

    const result = this.finalize(event, execution)
    lifecycle.push("finalized")

    return {
      ...result,
      lifecycle,
    }
  }

  public validate(event: AIOSSystemEvent): void {
    if (!event.type) {
      throw new Error("AIOS Kernel Validation Error: missing event type")
    }

    if (!Number.isFinite(event.timestamp) || event.timestamp <= 0) {
      throw new Error("AIOS Kernel Validation Error: invalid timestamp")
    }

    if (typeof event.contextId !== "string" || event.contextId.trim().length === 0) {
      throw new Error("AIOS Kernel Validation Error: invalid contextId")
    }

    switch (event.type) {
      case "EXECUTION_START":
        this.validateExecutionStart(event)
        return
      case "EXECUTION_STEP":
        this.validateExecutionStep(event)
        return
      case "EXECUTION_COMPLETE":
        this.validateExecutionComplete(event)
        return
      case "EXECUTION_ERROR":
        this.validateExecutionError(event)
        return
      case "STATE_TRANSITION":
        this.validateStateTransition(event)
        return
      default:
        this.assertNever(event)
    }
  }

  public route(event: AIOSSystemEvent): RoutedEvent {
    switch (event.type) {
      case "EXECUTION_START":
        return { channel: "execution.start", event }
      case "EXECUTION_STEP":
        return { channel: "execution.step", event }
      case "EXECUTION_COMPLETE":
        return { channel: "execution.complete", event }
      case "EXECUTION_ERROR":
        return { channel: "execution.error", event }
      case "STATE_TRANSITION":
        return { channel: "state.transition", event }
      default:
        this.assertNever(event)
    }
  }

  public execute(routed: RoutedEvent): ExecutionResult {
    switch (routed.channel) {
      case "execution.start":
      case "execution.step":
      case "execution.complete":
      case "execution.error":
      case "state.transition": {
        this.record(routed.event)
        return { accepted: true }
      }
      default:
        this.assertNever(routed.channel)
    }
  }

  public finalize(
    event: AIOSSystemEvent,
    execution: ExecutionResult
  ): ProcessEventResult {
    const result: ProcessEventResult = {
      success: execution.accepted,
      eventType: event.type,
      timestamp: event.timestamp,
      contextId: event.contextId,
      lifecycle: [],
    }

    if (this.sink) {
      try {
        const maybePromise = this.sink.add(event)
        if (this.isPromise(maybePromise)) {
          void maybePromise.catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : "unknown sink error"
            console.warn(`AIOS Kernel finalize sink failure: ${message}`)
          })
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown sink error"
        console.warn(`AIOS Kernel finalize sink exception: ${message}`)
      }
    }

    return result
  }

  public getEventLog(): AIOSSystemEvent[] {
    return [...this.eventLog]
  }

  private runMiddlewares(ctx: MiddlewareContext): void {
    const stack = this.middlewares

    const executeMiddleware = (index: number): void => {
      if (index >= stack.length) {
        return
      }

      const middleware = stack[index]
      const next = (): void => executeMiddleware(index + 1)
      const output = middleware(ctx, next)

      if (this.isPromise(output)) {
        console.warn(
          "AIOS Kernel middleware returned Promise; async middleware is not awaited in sync process path"
        )
      }
    }

    executeMiddleware(0)
  }

  private record(event: AIOSSystemEvent): void {
    this.eventLog.push(event)
  }

  private validateExecutionStart(event: ExecutionStartEvent): void {
    if (typeof event.payload.module !== "string" || event.payload.module.trim() === "") {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_START.module required")
    }

    if (!this.isExecutionSource(event.payload.source)) {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_START.source invalid")
    }
  }

  private validateExecutionStep(event: ExecutionStepEvent): void {
    if (typeof event.payload.stepId !== "string" || event.payload.stepId.trim() === "") {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_STEP.stepId required")
    }

    if (typeof event.payload.label !== "string" || event.payload.label.trim() === "") {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_STEP.label required")
    }

    if (!this.isExecutionStepStatus(event.payload.status)) {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_STEP.status invalid")
    }
  }

  private validateExecutionComplete(event: ExecutionCompleteEvent): void {
    if (
      typeof event.payload.resultSummary !== "string" ||
      event.payload.resultSummary.trim() === ""
    ) {
      throw new Error(
        "AIOS Kernel Validation Error: EXECUTION_COMPLETE.resultSummary required"
      )
    }

    if (typeof event.payload.success !== "boolean") {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_COMPLETE.success invalid")
    }
  }

  private validateExecutionError(event: ExecutionErrorEvent): void {
    if (
      typeof event.payload.errorMessage !== "string" ||
      event.payload.errorMessage.trim() === ""
    ) {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_ERROR.errorMessage required")
    }

    if (
      typeof event.payload.errorCode !== "undefined" &&
      typeof event.payload.errorCode !== "string"
    ) {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_ERROR.errorCode invalid")
    }

    if (!this.isErrorSeverity(event.payload.severity)) {
      throw new Error("AIOS Kernel Validation Error: EXECUTION_ERROR.severity invalid")
    }
  }

  private validateStateTransition(event: StateTransitionEvent): void {
    if (typeof event.payload.from !== "string" || event.payload.from.trim() === "") {
      throw new Error("AIOS Kernel Validation Error: STATE_TRANSITION.from required")
    }

    if (typeof event.payload.to !== "string" || event.payload.to.trim() === "") {
      throw new Error("AIOS Kernel Validation Error: STATE_TRANSITION.to required")
    }

    if (
      typeof event.payload.reason !== "undefined" &&
      typeof event.payload.reason !== "string"
    ) {
      throw new Error("AIOS Kernel Validation Error: STATE_TRANSITION.reason invalid")
    }
  }

  private isPromise(value: unknown): value is Promise<unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      "then" in value &&
      typeof (value as { then?: unknown }).then === "function"
    )
  }

  private isExecutionSource(value: string): value is AIOSExecutionSource {
    return value === "user" || value === "system" || value === "orchestrator"
  }

  private isExecutionStepStatus(value: string): value is AIOSExecutionStepStatus {
    return (
      value === "pending" ||
      value === "running" ||
      value === "complete" ||
      value === "failed"
    )
  }

  private isErrorSeverity(value: string): value is AIOSErrorSeverity {
    return value === "low" || value === "medium" || value === "critical"
  }

  private assertNever(value: never): never {
    throw new Error(`AIOS Kernel Exhaustiveness Error: ${String(value)}`)
  }
}

const eventProcessor = new EventProcessor()

export function processEvent(event: AIOSSystemEvent): ProcessEventResult {
  return eventProcessor.process(event)
}

export function useMiddleware(middleware: Middleware): void {
  eventProcessor.use(middleware)
}

export function setKernelEventSink(sink: KernelEventSink | null): void {
  eventProcessor.setSink(sink)
}

export function getEventLog(): AIOSSystemEvent[] {
  return eventProcessor.getEventLog()
}

export { eventProcessor }
