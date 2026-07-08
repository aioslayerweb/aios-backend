import type { IntegrationAuthState, IntegrationHealthState } from "../types"

export function integrationHealthLabel(state: IntegrationHealthState) {
  return state.replace(/-/g, " ")
}

export function integrationHealthTone(state: IntegrationHealthState) {
  switch (state) {
    case "healthy":
      return "success"
    case "warning":
    case "rate-limited":
      return "warning"
    case "paused":
      return "info"
    case "auth-required":
    case "offline":
      return "error"
  }
}

export function integrationAuthLabel(state: IntegrationAuthState) {
  return state === "required" ? "Authentication required" : state
}