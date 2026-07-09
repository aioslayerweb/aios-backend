import type { RuntimeJob } from "@/src/runtime/types"

export class RuntimeScheduler {
  private readonly scheduledJobs = new Map<string, RuntimeJob>()

  schedule(job: RuntimeJob): RuntimeJob {
    const scheduled = {
      ...job,
      status: "scheduled" as const,
    }
    this.scheduledJobs.set(job.id, scheduled)
    return scheduled
  }

  releaseReady(nowIso = new Date().toISOString()): RuntimeJob[] {
    const ready: RuntimeJob[] = []
    for (const job of Array.from(this.scheduledJobs.values())) {
      if (!job.scheduledFor || job.scheduledFor <= nowIso) {
        ready.push({
          ...job,
          status: "queued",
        })
        this.scheduledJobs.delete(job.id)
      }
    }
    return ready
  }

  cancel(jobId: string): boolean {
    return this.scheduledJobs.delete(jobId)
  }

  listByTenant(tenantId: string): RuntimeJob[] {
    return Array.from(this.scheduledJobs.values()).filter((job) => job.tenantId === tenantId)
  }
}
