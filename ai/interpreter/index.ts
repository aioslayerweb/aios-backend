export interface ParsedIntent {
  type: string;
  target: string;
  confidence: number;
  raw: string;
}

export function interpretIntent(raw: string): ParsedIntent {
  const normalized = raw.toLowerCase();

  if (normalized.includes("churn")) {
    return {
      type: "risk-analysis",
      target: "customers",
      confidence: 0.9,
      raw,
    };
  }

  if (normalized.includes("insight") || normalized.includes("report")) {
    return {
      type: "insight-generation",
      target: "knowledge",
      confidence: 0.78,
      raw,
    };
  }

  return {
    type: "workflow-request",
    target: "executive",
    confidence: 0.6,
    raw,
  };
}
