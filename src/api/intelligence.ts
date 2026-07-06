import express, { Request, Response } from "express"
import { processEvent, setKernelEventSink } from "../kernel/eventProcessor"
import {
  AIOSSystemEvent,
  type AIOSLifecycleStage,
  type AIOSErrorSeverity,
  type AIOSExecutionSource,
  type AIOSExecutionStepStatus,
} from "../kernel/eventContract"
import { eventStore } from "../memory/eventStore"

const router = express.Router()

// Kernel controls persistence through sink contract; route stays transport-only.
setKernelEventSink({
  add(event: AIOSSystemEvent): void {
    void eventStore.add(event)
  },
})

type ErrorResponse = {
  success: false
  error: string
}

type SuccessResponse = {
  success: true
  eventType: AIOSSystemEvent["type"]
  timestamp: number
  contextId: string
  lifecycle: AIOSLifecycleStage[]
}

type EventEnvelope = {
  type: unknown
  timestamp: unknown
  contextId: unknown
  payload: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isExecutionSource(value: unknown): value is AIOSExecutionSource {
  return value === "user" || value === "system" || value === "orchestrator"
}

function isStepStatus(value: unknown): value is AIOSExecutionStepStatus {
  return (
    value === "pending" ||
    value === "running" ||
    value === "complete" ||
    value === "failed"
  )
}

function isSeverity(value: unknown): value is AIOSErrorSeverity {
  return value === "low" || value === "medium" || value === "critical"
}

function parseEventBody(body: unknown):
  | { ok: true; event: AIOSSystemEvent }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Invalid request body" }
  }

  const envelope = body as EventEnvelope

  if (typeof envelope.type !== "string") {
    return { ok: false, error: "Field 'type' must be a string" }
  }

  if (!Number.isFinite(envelope.timestamp) || (envelope.timestamp as number) <= 0) {
    return { ok: false, error: "Field 'timestamp' must be a positive number" }
  }

  if (typeof envelope.contextId !== "string" || envelope.contextId.trim() === "") {
    return { ok: false, error: "Field 'contextId' must be a non-empty string" }
  }

  if (!isRecord(envelope.payload)) {
    return { ok: false, error: "Field 'payload' must be an object" }
  }

  const timestamp = envelope.timestamp as number
  const contextId = envelope.contextId
  const payload = envelope.payload

  switch (envelope.type) {
    case "EXECUTION_START":
      if (
        typeof payload.module === "string" &&
        payload.module.trim() !== "" &&
        isExecutionSource(payload.source)
      ) {
        return {
          ok: true,
          event: {
            type: "EXECUTION_START",
            timestamp,
            contextId,
            payload: {
              module: payload.module,
              source: payload.source,
            },
          },
        }
      }
      return {
        ok: false,
        error: "Invalid payload for EXECUTION_START",
      }

    case "EXECUTION_STEP":
      if (
        typeof payload.stepId === "string" &&
        payload.stepId.trim() !== "" &&
        typeof payload.label === "string" &&
        payload.label.trim() !== "" &&
        isStepStatus(payload.status)
      ) {
        return {
          ok: true,
          event: {
            type: "EXECUTION_STEP",
            timestamp,
            contextId,
            payload: {
              stepId: payload.stepId,
              label: payload.label,
              status: payload.status,
            },
          },
        }
      }
      return {
        ok: false,
        error: "Invalid payload for EXECUTION_STEP",
      }

    case "EXECUTION_COMPLETE":
      if (
        typeof payload.resultSummary === "string" &&
        payload.resultSummary.trim() !== "" &&
        typeof payload.success === "boolean"
      ) {
        return {
          ok: true,
          event: {
            type: "EXECUTION_COMPLETE",
            timestamp,
            contextId,
            payload: {
              resultSummary: payload.resultSummary,
              success: payload.success,
            },
          },
        }
      }
      return {
        ok: false,
        error: "Invalid payload for EXECUTION_COMPLETE",
      }

    case "EXECUTION_ERROR":
      if (
        typeof payload.errorMessage === "string" &&
        payload.errorMessage.trim() !== "" &&
        (typeof payload.errorCode === "undefined" ||
          typeof payload.errorCode === "string") &&
        isSeverity(payload.severity)
      ) {
        return {
          ok: true,
          event: {
            type: "EXECUTION_ERROR",
            timestamp,
            contextId,
            payload: {
              errorMessage: payload.errorMessage,
              errorCode: payload.errorCode,
              severity: payload.severity,
            },
          },
        }
      }
      return {
        ok: false,
        error: "Invalid payload for EXECUTION_ERROR",
      }

    case "STATE_TRANSITION":
      if (
        typeof payload.from === "string" &&
        payload.from.trim() !== "" &&
        typeof payload.to === "string" &&
        payload.to.trim() !== "" &&
        (typeof payload.reason === "undefined" || typeof payload.reason === "string")
      ) {
        return {
          ok: true,
          event: {
            type: "STATE_TRANSITION",
            timestamp,
            contextId,
            payload: {
              from: payload.from,
              to: payload.to,
              reason: payload.reason,
            },
          },
        }
      }
      return {
        ok: false,
        error: "Invalid payload for STATE_TRANSITION",
      }

    default:
      return {
        ok: false,
        error: "Unsupported event type",
      }
  }
}

router.post(
  "/event",
  (req: Request<Record<string, never>, SuccessResponse | ErrorResponse, unknown>, res: Response<SuccessResponse | ErrorResponse>) => {
    const parsed = parseEventBody(req.body)
    if (!parsed.ok) {
      return res.status(400).json({
        success: false,
        error: parsed.error,
      })
    }

    try {
      const result = processEvent(parsed.event)

      return res.status(200).json({
        success: true,
        eventType: result.eventType,
        timestamp: result.timestamp,
        contextId: result.contextId,
        lifecycle: result.lifecycle,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process event"
      return res.status(400).json({
        success: false,
        error: message,
      })
    }
  }
)

export default router