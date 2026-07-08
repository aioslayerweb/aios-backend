import type {
  ExecutiveBoardReportTemplate,
  ExecutiveDepartmentPerformance,
  ExecutiveOperationalSummary,
  ExecutiveOverviewMetric,
  ExecutiveRecommendation,
  ExecutiveReportsState,
  ExecutiveRiskCategory,
  ExecutiveTrendSeries,
  StrategicKPIItem,
} from "@/types"

export function createExecutiveReportsDefaults(): ExecutiveReportsState {
  const overview: ExecutiveOverviewMetric[] = [
    { id: "ov1", label: "Company Health", value: "86", delta: "+4 pts", trend: "up" },
    { id: "ov2", label: "AI Confidence", value: "89%", delta: "+3 pts", trend: "up" },
    { id: "ov3", label: "Operational Efficiency", value: "92%", delta: "+1.8%", trend: "up" },
    { id: "ov4", label: "Revenue Trend", value: "+8.2%", delta: "+1.1%", trend: "up" },
    { id: "ov5", label: "Customer Satisfaction", value: "78", delta: "-2 pts", trend: "down" },
    { id: "ov6", label: "Execution Score", value: "91", delta: "+5 pts", trend: "up" },
    { id: "ov7", label: "Strategic Progress", value: "74%", delta: "+6%", trend: "up" },
  ]

  const strategicKPIs: StrategicKPIItem[] = [
    { id: "k1", label: "Revenue Growth", value: "$4.8M", target: "$5.0M", delta: "+8.2%", trend: "up", confidence: 91 },
    { id: "k2", label: "Pipeline Health", value: "$12.6M", target: "$11.8M", delta: "+6.4%", trend: "up", confidence: 87 },
    { id: "k3", label: "Customer Retention", value: "96.1%", target: "96.5%", delta: "-0.2 pts", trend: "down", confidence: 78 },
    { id: "k4", label: "Task Completion", value: "126", target: "120", delta: "+4", trend: "up", confidence: 83 },
    { id: "k5", label: "Workflow Automation", value: "99.1%", target: "98%", delta: "+1.1 pts", trend: "up", confidence: 94 },
    { id: "k6", label: "Knowledge Coverage", value: "84%", target: "90%", delta: "+5 pts", trend: "up", confidence: 76 },
    { id: "k7", label: "Agent Productivity", value: "88%", target: "85%", delta: "+3 pts", trend: "up", confidence: 88 },
    { id: "k8", label: "AI Decision Accuracy", value: "87%", target: "90%", delta: "+2 pts", trend: "up", confidence: 85 },
  ]

  const operationalSummary: ExecutiveOperationalSummary = {
    runtime: "Runtime Engine completed 1,284 business events overnight with stable queue depth and healthy execution throughput.",
    memory: "Persistent memory absorbed 42 new knowledge updates and synchronized governance actions into durable business context.",
    replay: "Replay Engine resolved one workflow anomaly and preserved auditability for two decision revisions.",
    workflows: "Workflow Builder executed revenue, support, and finance automations with 99.1% completion success.",
    integrations: "Enterprise integrations remained broadly healthy, with one rate-limited CRM source and one compliance-related pause.",
  }

  const recommendations: ExecutiveRecommendation[] = [
    { id: "r1", title: "Increase customer success staffing", description: "Strategic account load is compressing response times for top-tier customers.", businessImpact: "Protects $420k ARR at immediate risk.", confidence: 88, risk: "Customer risk", estimatedROI: "12.4x retention leverage", nextStep: "Approve temporary staffing reallocation." },
    { id: "r2", title: "Prioritize enterprise healthcare segment", description: "Pipeline and usage patterns show stronger close propensity in one vertical cluster.", businessImpact: "Accelerates near-term expansion revenue.", confidence: 84, risk: "Strategic timing risk", estimatedROI: "8.1x pipeline efficiency", nextStep: "Re-rank opportunity sequence in revenue workflow." },
    { id: "r3", title: "Reduce finance approval bottleneck", description: "A workflow approval branch is introducing repeat operational drag.", businessImpact: "Improves throughput and executive review speed.", confidence: 76, risk: "Operational risk", estimatedROI: "4.2x process efficiency", nextStep: "Route finance approval workflow for controlled optimization review." },
    { id: "r4", title: "Launch scoped knowledge refresh", description: "Stale references are weakening explainability coverage and decision accuracy.", businessImpact: "Improves board-report trust and AI narrative quality.", confidence: 73, risk: "Compliance documentation drift", estimatedROI: "3.7x reasoning reliability", nextStep: "Run governance-approved document refresh." },
  ]

  const riskCategories: ExecutiveRiskCategory[] = [
    { id: "risk1", label: "Operational Risk", score: 72, trend: "up", detail: "Workflow approval delays and execution queue pressure require attention." },
    { id: "risk2", label: "Financial Risk", score: 54, trend: "flat", detail: "Finance controls are stable, though approval latency is rising." },
    { id: "risk3", label: "Customer Risk", score: 81, trend: "up", detail: "Two strategic accounts require immediate follow-up." },
    { id: "risk4", label: "Compliance Risk", score: 48, trend: "flat", detail: "Governance coverage is strong but knowledge reference drift remains visible." },
    { id: "risk5", label: "Technical Risk", score: 39, trend: "down", detail: "Runtime and integration architecture remain broadly healthy." },
    { id: "risk6", label: "Strategic Risk", score: 61, trend: "flat", detail: "Investment timing and hiring decisions need board-level prioritization." },
  ]

  const departmentPerformance: ExecutiveDepartmentPerformance[] = [
    { id: "d1", department: "Sales", goals: 6, kpis: 8, velocity: "+11%", efficiency: 88, agentUtilization: 83, workload: "High", trend: "up" },
    { id: "d2", department: "Marketing", goals: 4, kpis: 6, velocity: "+5%", efficiency: 79, agentUtilization: 71, workload: "Medium", trend: "flat" },
    { id: "d3", department: "Support", goals: 5, kpis: 7, velocity: "-3%", efficiency: 74, agentUtilization: 91, workload: "High", trend: "down" },
    { id: "d4", department: "Finance", goals: 4, kpis: 5, velocity: "+2%", efficiency: 77, agentUtilization: 68, workload: "Medium", trend: "flat" },
    { id: "d5", department: "Operations", goals: 5, kpis: 7, velocity: "+8%", efficiency: 85, agentUtilization: 79, workload: "Medium", trend: "up" },
    { id: "d6", department: "Engineering", goals: 7, kpis: 8, velocity: "+6%", efficiency: 82, agentUtilization: 75, workload: "Medium", trend: "up" },
    { id: "d7", department: "HR", goals: 3, kpis: 4, velocity: "+1%", efficiency: 73, agentUtilization: 52, workload: "Low", trend: "flat" },
    { id: "d8", department: "Legal", goals: 2, kpis: 3, velocity: "0%", efficiency: 69, agentUtilization: 48, workload: "Low", trend: "flat" },
  ]

  const trendSeries: ExecutiveTrendSeries[] = [
    {
      id: "trend-30d",
      title: "30-day trend",
      horizon: "30d",
      status: "growth",
      summary: "Revenue, automation success, and knowledge coverage all improved over the last 30 days.",
      points: [
        { label: "W1", value: 68 },
        { label: "W2", value: 72 },
        { label: "W3", value: 79 },
        { label: "W4", value: 86 },
      ],
    },
    {
      id: "trend-90d",
      title: "90-day trend",
      horizon: "90d",
      status: "anomaly",
      summary: "Customer risk spiked mid-quarter before AIOS stabilized support operations.",
      points: [
        { label: "M1", value: 71 },
        { label: "M2", value: 63 },
        { label: "M3", value: 83 },
      ],
    },
    {
      id: "trend-12m",
      title: "12-month trend",
      horizon: "12m",
      status: "prediction",
      summary: "Current signals support a stronger year-end outcome if customer risk is mitigated now.",
      points: [
        { label: "Q1", value: 58 },
        { label: "Q2", value: 67 },
        { label: "Q3", value: 78 },
        { label: "Q4", value: 89 },
      ],
    },
  ]

  const timeline = [
    { id: "tl1", time: "08:42", title: "Strategic decision approved", detail: "Decision Engine approved customer escalation recovery path.", kind: "decision" },
    { id: "tl2", time: "09:15", title: "Critical incident contained", detail: "Replay Engine resolved finance approval workflow anomaly.", kind: "incident" },
    { id: "tl3", time: "10:05", title: "Revenue milestone detected", detail: "Knowledge Graph connected expansion opportunity with executive outreach path.", kind: "revenue" },
    { id: "tl4", time: "11:30", title: "Large workflow executed", detail: "Workflow Builder launched support recovery automation at board-priority level.", kind: "workflow" },
    { id: "tl5", time: "13:10", title: "Executive approval recorded", detail: "Governance Center captured board-level approval action for revenue threshold decision.", kind: "approval" },
    { id: "tl6", time: "15:20", title: "Strategic event synthesized", detail: "Executive Intelligence Center refreshed company-wide narrative summary.", kind: "strategy" },
  ]

  const boardReports: ExecutiveBoardReportTemplate[] = [
    { id: "report-weekly", name: "Weekly Executive Report", cadence: "weekly", summary: "Board-ready weekly operating summary for the executive team.", sections: ["Executive summary", "Strategic KPIs", "Risks", "Recommendations", "Action items"], status: "ready" },
    { id: "report-monthly", name: "Monthly Operating Review", cadence: "monthly", summary: "Month-end business health and performance review.", sections: ["Executive summary", "Department performance", "Trend analysis", "Risks", "Board notes"], status: "ready" },
    { id: "report-quarterly", name: "Quarterly Board Pack", cadence: "quarterly", summary: "Presentation-ready board intelligence pack with KPI and governance context.", sections: ["Narrative summary", "KPIs", "Charts", "Risks", "Recommendations", "Action items"], status: "draft" },
    { id: "report-annual", name: "Annual Summary", cadence: "annual", summary: "Year-end executive performance and investor reporting architecture.", sections: ["Annual summary", "KPI performance", "Strategic risks", "Opportunities", "Board actions"], status: "draft" },
  ]

  return {
    overview,
    strategicKPIs,
    operationalSummary,
    recommendations,
    riskCategories,
    departmentPerformance,
    trendSeries,
    timeline,
    boardReports,
    selectedTrendId: trendSeries[0]?.id ?? "",
    selectedReportId: boardReports[0]?.id ?? "",
    liveMode: true,
  }
}

export function selectExecutiveTrend(series: ExecutiveTrendSeries[], trendId: string) {
  return series.find((item) => item.id === trendId) ?? series[0] ?? null
}

export function selectBoardReport(reports: ExecutiveBoardReportTemplate[], reportId: string) {
  return reports.find((item) => item.id === reportId) ?? reports[0] ?? null
}