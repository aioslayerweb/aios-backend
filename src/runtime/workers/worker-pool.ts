import type { RuntimeJob } from "@/src/runtime/types"

export type WorkerExecutionResult = {
  jobId: string
  success: boolean
  detail: string
}

export class WorkerPool {
  private readonly activeWorkers = new Map<string, RuntimeJob>()

  constructor(private readonly maxWorkers: number) {}

  canAcceptWork(): boolean {
    return this.activeWorkers.size < this.maxWorkers
  }

  start(job: RuntimeJob): boolean {
    if (!this.canAcceptWork()) {
      return false
    }
    this.activeWorkers.set(job.id, {
      ...job,
      status: "running",
      startedAt: new Date().toISOString(),
    })
    return true
  }

  complete(jobId: string, success = true): WorkerExecutionResult | undefined {
    const job = this.activeWorkers.get(jobId)
    if (!job) {
      return undefined
    }
    this.activeWorkers.delete(jobId)
    return {
      jobId,
      success,
      detail: success ? "Job completed" : "Job failed",
    }
  }

  listActiveByTenant(tenantId: string): RuntimeJob[] {
    return Array.from(this.activeWorkers.values()).filter((job) => job.tenantId === tenantId)
  }

  usage(): { active: number; max: number } {
    return {
      active: this.activeWorkers.size,
      max: this.maxWorkers,
    }
  }
}
