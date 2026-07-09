import type { AIEvaluationCase } from "@/tests/shared"

export type AIEvaluationResult = {
  caseId: string
  score: number
  passed: boolean
  notes: string
}

export function runMockAIEvaluation(cases: AIEvaluationCase[]): AIEvaluationResult[] {
  return cases.map((evaluationCase, index) => {
    const score = 90 - index
    return {
      caseId: evaluationCase.id,
      score,
      passed: score >= 80,
      notes: `Mock score for ${evaluationCase.dimension}`,
    }
  })
}
