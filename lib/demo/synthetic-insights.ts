export type SyntheticDemoInsight = {
  id: string
  type: "Risk" | "Opportunity" | "Alert"
  title: string
  description: string
  impact_score: number
  confidence_score: number
  status: string
  created_at: string
}

export const syntheticDemoInsights: SyntheticDemoInsight[] = [
  {
    id: "demo-insight-risk-01",
    type: "Risk",
    title: "Renewal timing needs review",
    description: "A simulated renewal signal suggests reviewing the next customer-success touchpoint.",
    impact_score: 78,
    confidence_score: 86,
    status: "Example",
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "demo-insight-opportunity-01",
    type: "Opportunity",
    title: "Expansion scenario available",
    description: "A synthetic growth scenario indicates a potential cross-team expansion opportunity.",
    impact_score: 64,
    confidence_score: 81,
    status: "Example",
    created_at: "2026-01-14T09:00:00.000Z",
  },
  {
    id: "demo-insight-alert-01",
    type: "Alert",
    title: "Forecast variance crossed a sample threshold",
    description: "This demo alert illustrates how a forecast variance could be surfaced for review.",
    impact_score: 52,
    confidence_score: 90,
    status: "Example",
    created_at: "2026-01-13T09:00:00.000Z",
  },
]
