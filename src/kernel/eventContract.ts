export type AIOSExecutionSource = "user" | "system" | "orchestrator"
export type AIOSExecutionStepStatus =
  | "pending"
  | "running"
  | "complete"
  | "failed"
export type AIOSErrorSeverity = "low" | "medium" | "critical"

export type AIOSEventType =
  | "EXECUTION_START"
  | "EXECUTION_STEP"
  | "EXECUTION_COMPLETE"
  | "EXECUTION_ERROR"
  | "STATE_TRANSITION"

export type AIOSBaseEvent<TType extends AIOSEventType, TPayload> = {
  type: TType
  timestamp: number
  contextId: string
  payload: TPayload
}

export type ExecutionStartEvent = AIOSBaseEvent<
  "EXECUTION_START",
  {
    module: string
    source: AIOSExecutionSource
  }
>

export type ExecutionStepEvent = AIOSBaseEvent<
  "EXECUTION_STEP",
  {
    stepId: string
    label: string
    status: AIOSExecutionStepStatus
  }
>

export type ExecutionCompleteEvent = AIOSBaseEvent<
  "EXECUTION_COMPLETE",
  {
    resultSummary: string
    success: boolean
  }
>

export type ExecutionErrorEvent = AIOSBaseEvent<
  "EXECUTION_ERROR",
  {
    errorMessage: string
    errorCode?: string
    severity: AIOSErrorSeverity
  }
>

export type StateTransitionEvent = AIOSBaseEvent<
  "STATE_TRANSITION",
  {
    from: string
    to: string
    reason?: string
  }
>

export type AIOSSystemEvent =
  | ExecutionStartEvent
  | ExecutionStepEvent
  | ExecutionCompleteEvent
  | ExecutionErrorEvent
  | StateTransitionEvent

export type AIOSLifecycleStage =
  | "validated"
  | "routed"
  | "executed"
  | "finalized"
