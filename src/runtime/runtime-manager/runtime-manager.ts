import type {
  RuntimeComponent,
  RuntimeLifecycleState,
  RuntimeManagerState,
  RuntimeRecoveryPlan,
} from "@/src/runtime/types"

export class RuntimeManager {
  private state: RuntimeManagerState = {
    lifecycle: "booting",
    components: [],
    recoveryPlans: [],
    gracefulShutdownInProgress: false,
  }

  start(): RuntimeManagerState {
    this.state = {
      ...this.state,
      lifecycle: "running",
      gracefulShutdownInProgress: false,
    }
    return this.state
  }

  setLifecycle(lifecycle: RuntimeLifecycleState): RuntimeManagerState {
    this.state = {
      ...this.state,
      lifecycle,
    }
    return this.state
  }

  registerComponent(component: RuntimeComponent): RuntimeComponent {
    const next: RuntimeComponent = {
      ...component,
      startedAt: component.startedAt ?? new Date().toISOString(),
    }

    this.state = {
      ...this.state,
      components: [...this.state.components.filter((entry) => entry.id !== component.id), next],
    }

    return next
  }

  updateComponentStatus(componentId: string, status: RuntimeComponent["status"]): RuntimeComponent | undefined {
    const component = this.state.components.find((entry) => entry.id === componentId)
    if (!component) {
      return undefined
    }

    const updated: RuntimeComponent = {
      ...component,
      status,
    }

    this.state = {
      ...this.state,
      components: this.state.components.map((entry) => (entry.id === componentId ? updated : entry)),
    }

    return updated
  }

  addRecoveryPlan(plan: RuntimeRecoveryPlan): RuntimeRecoveryPlan {
    this.state = {
      ...this.state,
      lifecycle: "recovering",
      recoveryPlans: [...this.state.recoveryPlans, plan],
    }

    return plan
  }

  completeRecoveryPlan(planId: string): RuntimeRecoveryPlan | undefined {
    const plan = this.state.recoveryPlans.find((entry) => entry.id === planId)
    if (!plan) {
      return undefined
    }

    const completed: RuntimeRecoveryPlan = {
      ...plan,
      steps: plan.steps.map((step) => ({
        ...step,
        completed: true,
      })),
    }

    this.state = {
      ...this.state,
      lifecycle: "running",
      recoveryPlans: this.state.recoveryPlans.map((entry) => (entry.id === planId ? completed : entry)),
    }

    return completed
  }

  beginGracefulShutdown(): RuntimeManagerState {
    this.state = {
      ...this.state,
      lifecycle: "shutting-down",
      gracefulShutdownInProgress: true,
    }

    return this.state
  }

  completeShutdown(): RuntimeManagerState {
    this.state = {
      ...this.state,
      lifecycle: "stopped",
      gracefulShutdownInProgress: false,
    }

    return this.state
  }

  listComponents(tenantId?: string): RuntimeComponent[] {
    return tenantId
      ? this.state.components.filter((component) => component.tenantId === tenantId)
      : this.state.components
  }

  getState(): RuntimeManagerState {
    return this.state
  }
}
