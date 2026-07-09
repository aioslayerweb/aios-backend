import type { AIEvaluationCase } from "@/tests/shared"

export const aiEvaluationMatrix: AIEvaluationCase[] = [
  {
    id: "ai-prompt-regression-01",
    title: "Executive summary prompt regression",
    dimension: "prompt-regression",
    objective: "Detect changes in quality for board-level summary prompts.",
    threshold: "Score delta <= 5%",
  },
  {
    id: "ai-consistency-01",
    title: "Recommendation consistency",
    dimension: "response-consistency",
    objective: "Ensure consistent recommendations for identical business context.",
    threshold: "Consistency >= 90%",
  },
  {
    id: "ai-schema-01",
    title: "Decision payload schema",
    dimension: "json-schema-validation",
    objective: "Validate decision payloads match expected JSON schema.",
    expectedSchema: {
      type: "object",
      required: ["observation", "reasoning", "confidence", "recommendation"],
    },
    threshold: "100% schema compliance",
  },
  {
    id: "ai-tool-routing-01",
    title: "MCP tool routing accuracy",
    dimension: "tool-selection-accuracy",
    objective: "Ensure selected tools match capability intent.",
    threshold: "Top-1 routing accuracy >= 92%",
  },
  {
    id: "ai-reasoning-01",
    title: "Reasoning completeness",
    dimension: "reasoning-evaluation",
    objective: "Validate recommendation chain includes evidence and expected outcome.",
    threshold: "Completeness >= 95%",
  },
  {
    id: "ai-hallucination-01",
    title: "Grounded response validation",
    dimension: "hallucination-detection",
    objective: "Detect unsupported claims outside available signal set.",
    threshold: "Hallucination rate <= 1%",
  },
  {
    id: "ai-grounding-01",
    title: "Citation grounding check",
    dimension: "grounding-check",
    objective: "Ensure responses can be traced to known memory/knowledge sources.",
    threshold: "Grounding >= 98%",
  },
  {
    id: "ai-latency-01",
    title: "Response latency envelope",
    dimension: "response-latency",
    objective: "Track p95 latency for executive assistant responses.",
    threshold: "p95 <= 2.5s",
  },
  {
    id: "ai-prompt-version-01",
    title: "Prompt version comparison",
    dimension: "prompt-version-comparison",
    objective: "Compare baseline prompt package against candidate package.",
    threshold: "Candidate win-rate >= 55%",
  },
  {
    id: "ai-model-compare-01",
    title: "Model quality comparison",
    dimension: "model-comparison",
    objective: "Compare approved model variants by quality and latency.",
    threshold: "No regression in critical dimensions",
  },
]
