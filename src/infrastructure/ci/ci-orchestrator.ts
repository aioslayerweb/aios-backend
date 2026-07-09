import type { CiPipelineDefinition, CiPipelineStage, DeploymentEnvironment } from "@/src/infrastructure/types"

export class CiOrchestrator {
  private readonly pipelines = new Map<string, CiPipelineDefinition>()

  registerPipeline(pipeline: CiPipelineDefinition): void {
    this.pipelines.set(pipeline.id, pipeline)
  }

  listPipelines(environment?: DeploymentEnvironment): CiPipelineDefinition[] {
    const all = Array.from(this.pipelines.values())
    return environment ? all.filter((pipeline) => pipeline.environment === environment) : all
  }

  hasStage(pipelineId: string, stage: CiPipelineStage): boolean {
    const pipeline = this.pipelines.get(pipelineId)
    if (!pipeline) {
      return false
    }
    return pipeline.stages.includes(stage)
  }
}
