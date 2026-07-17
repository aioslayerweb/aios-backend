import type { BusinessBlueprint, IndustryTemplateId, ValidationResult } from "@/src/core/business-blueprint"

export type DiscoveryStage = "welcome" | "interview" | "review" | "approved"

export interface DiscoveryQuestion {
  readonly id: string
  readonly topic: string
  readonly prompt: string
  readonly hint?: string
  readonly placeholder?: string
  readonly options?: ReadonlyArray<string>
  readonly required: boolean
  readonly condition?: (answers: DiscoveryAnswers) => boolean
}

export type DiscoveryAnswers = Record<string, string>

export interface DetectedIndustry {
  readonly industry: string
  readonly subIndustry: string
  readonly businessModel: string
  readonly confidence: number
  readonly templateId: IndustryTemplateId
  readonly suggestedKpis: ReadonlyArray<string>
  readonly suggestedIntegrations: ReadonlyArray<string>
  readonly suggestedDashboards: ReadonlyArray<string>
  readonly suggestedWorkflows: ReadonlyArray<string>
}

export interface DiscoveryRecommendations {
  readonly dashboards: ReadonlyArray<string>
  readonly reports: ReadonlyArray<string>
  readonly aiOperators: ReadonlyArray<string>
  readonly integrations: ReadonlyArray<string>
  readonly businessMemoryStructure: ReadonlyArray<string>
  readonly roleBasedIntelligence: ReadonlyArray<string>
  readonly automationOpportunities: ReadonlyArray<string>
}

export interface DiscoveryAnalysis {
  readonly detectedIndustry: DetectedIndustry
  readonly missingInformation: ReadonlyArray<string>
  readonly conflicts: ReadonlyArray<string>
  readonly suggestions: ReadonlyArray<string>
  readonly businessSummary: string
  readonly completionPercent: number
  readonly blueprint: BusinessBlueprint
  readonly validation: ValidationResult
  readonly recommendations: DiscoveryRecommendations
}

export interface DiscoverySessionDraft {
  readonly stage: DiscoveryStage
  readonly answers: DiscoveryAnswers
  readonly questionHistory: ReadonlyArray<string>
  readonly currentQuestionId?: string
  readonly savedAt: string
}
