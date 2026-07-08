"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { RoleDashboard } from "@/components/role-dashboard/role-dashboard"

interface KpiMetric {
  id: string;
  metric_name: string;
  value: number;
  change_percent: number;
  period: string;
}

interface AiInsight {
  id: string;
  title: string;
  body: string;
  action_label: string;
  action_type: string;
  priority: string;
}

export default function DashboardContent() {
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoadingKpis(false);
        setLoadingInsights(false);
        return;
      }

      const { data: kpiData } = await supabase
        .from("kpi_metrics")
        .select("*")
        .order("created_at", { ascending: true });

      if (kpiData) setKpis(kpiData);
      setLoadingKpis(false);

      const { data: insightData } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (insightData) setInsights(insightData);
      setLoadingInsights(false);
    }

    fetchData();
  }, []);

  function handleAction(insight: AiInsight) {
    setActionFeedback(`Action triggered: "${insight.action_label}"`)
    setTimeout(() => setActionFeedback(null), 3000)
  }

  return (
    <RoleDashboard
      platformKpis={kpis}
      platformInsights={insights}
      loadingKpis={loadingKpis}
      loadingInsights={loadingInsights}
      actionFeedback={actionFeedback}
      onInsightAction={handleAction}
    />
  )
}
