export type ExecutiveOverviewMetric = {
  id: string
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
}

export type StrategicKPIItem = {
  id: string
  label: string
  value: string
  target?: string
  delta: string
  trend: "up" | "down" | "flat"
  confidence: number
}

export type ExecutiveDepartmentPerformance = {
  id: string
  department: string
  goals: number
  kpis: number
  velocity: string
  efficiency: number
  agentUtilization: number
  workload: string
  trend: "up" | "down" | "flat"
}

export type ExecutiveRecommendation = {
  id: string
  title: string
  description: string
  businessImpact: string
  confidence: number
  risk: string
  estimatedROI: string
  nextStep: string
}

export type ExecutiveRiskCategory = {
  id: string
  label: string
  score: number
  trend: "up" | "down" | "flat"
  detail: string
}

export type ExecutiveTrendPoint = {
  label: string
  value: number
}

export type ExecutiveTrendSeries = {
  id: string
  title: string
  horizon: "30d" | "90d" | "12m"
  status: "growth" | "decline" | "anomaly" | "prediction"
  points: ExecutiveTrendPoint[]
  summary: string
}

export type ExecutiveBoardReportTemplate = {
  id: string
  name: string
  cadence: "weekly" | "monthly" | "quarterly" | "annual"
  summary: string
  sections: string[]
  status: "ready" | "draft"
}

export type ExecutiveOperationalSummary = {
  runtime: string
  memory: string
  replay: string
  workflows: string
  integrations: string
}

export type ExecutiveReportsState = {
  overview: ExecutiveOverviewMetric[]
  strategicKPIs: StrategicKPIItem[]
  operationalSummary: ExecutiveOperationalSummary
  recommendations: ExecutiveRecommendation[]
  riskCategories: ExecutiveRiskCategory[]
  departmentPerformance: ExecutiveDepartmentPerformance[]
  trendSeries: ExecutiveTrendSeries[]
  timeline: Array<{ id: string; time: string; title: string; detail: string; kind: string }>
  boardReports: ExecutiveBoardReportTemplate[]
  selectedTrendId: string
  selectedReportId: string
  liveMode: boolean
}