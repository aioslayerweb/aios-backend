import type { JobQueueName, QueueSnapshot, RuntimeJob } from "@/src/runtime/types"

export class QueueOrchestrator {
  private readonly jobs = new Map<string, RuntimeJob>()

  enqueue(job: RuntimeJob): RuntimeJob {
    this.jobs.set(job.id, job)
    return job
  }

  cancel(jobId: string): RuntimeJob | undefined {
    const job = this.jobs.get(jobId)
    if (!job || !job.cancellable) {
      return job
    }
    const cancelled = {
      ...job,
      status: "cancelled" as const,
      completedAt: new Date().toISOString(),
    }
    this.jobs.set(jobId, cancelled)
    return cancelled
  }

  markProgress(jobId: string, progressPercent: number): RuntimeJob | undefined {
    const job = this.jobs.get(jobId)
    if (!job) {
      return undefined
    }
    const next = {
      ...job,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      status: progressPercent >= 100 ? ("completed" as const) : job.status,
      completedAt: progressPercent >= 100 ? new Date().toISOString() : job.completedAt,
    }
    this.jobs.set(jobId, next)
    return next
  }

  fail(jobId: string): RuntimeJob | undefined {
    const job = this.jobs.get(jobId)
    if (!job) {
      return undefined
    }

    const attempts = job.attempts + 1
    const status = attempts >= job.maxAttempts ? ("dead-letter" as const) : ("retrying" as const)
    const nextQueue: JobQueueName = status === "dead-letter" ? "dead-letter" : "retry"

    const next = {
      ...job,
      attempts,
      status,
      queue: nextQueue,
    }

    this.jobs.set(jobId, next)
    return next
  }

  listByTenant(tenantId: string): RuntimeJob[] {
    return Array.from(this.jobs.values()).filter((job) => job.tenantId === tenantId)
  }

  snapshot(tenantId: string): QueueSnapshot[] {
    const tenantJobs = this.listByTenant(tenantId)
    const queues: JobQueueName[] = ["default", "priority", "retry", "dead-letter", "workflow", "delayed"]

    return queues.map((queue) => {
      const filtered = tenantJobs.filter((job) => job.queue === queue)
      return {
        tenantId,
        queue,
        depth: filtered.length,
        running: filtered.filter((job) => job.status === "running").length,
        failed: filtered.filter((job) => job.status === "failed" || job.status === "dead-letter").length,
        delayed: filtered.filter((job) => job.queue === "delayed" || job.status === "scheduled").length,
      }
    })
  }
}
