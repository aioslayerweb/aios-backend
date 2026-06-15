import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Event types coming from the system:
 * - email_received
 * - email_replied
 * - deal_created
 * - deal_updated
 * - support_ticket_created
 * - support_ticket_resolved
 */

export type EventType =
  | "email_received"
  | "email_replied"
  | "deal_created"
  | "deal_updated"
  | "support_ticket_created"
  | "support_ticket_resolved";

export interface IncomingEvent {
  user_id: string;
  organization_id: string;
  type: EventType;
  payload: any;
  timestamp?: string;
}

/**
 * STEP 1: Normalize event
 */
function normalizeEvent(event: IncomingEvent) {
  return {
    user_id: event.user_id,
    organization_id: event.organization_id,
    type: event.type,
    payload: event.payload,
    created_at: event.timestamp || new Date().toISOString(),
  };
}

/**
 * STEP 2: Store raw event
 */
async function storeEvent(event: ReturnType<typeof normalizeEvent>) {
  const { error } = await supabase.from("events").insert(event);

  if (error) {
    console.error("Event insert error:", error);
    throw error;
  }
}

/**
 * STEP 3: Generate intelligence signals (first version)
 */
function generateSignals(event: IncomingEvent) {
  const signals: any[] = [];

  // 🚨 churn risk signal (early heuristic)
  if (event.type === "support_ticket_created") {
    signals.push({
      type: "churn_risk_signal",
      severity: "medium",
      reason: "Support ticket created indicates friction",
    });
  }

  // 💰 revenue signal
  if (event.type === "deal_created") {
    signals.push({
      type: "revenue_signal",
      severity: "high",
      reason: "New deal created in pipeline",
    });
  }

  // ⚡ urgency signal
  if (event.type === "email_received") {
    signals.push({
      type: "attention_required",
      severity: "medium",
      reason: "New inbound communication",
    });
  }

  return signals;
}

/**
 * STEP 4: Store insights
 */
async function storeInsights(
  user_id: string,
  organization_id: string,
  signals: any[]
) {
  if (!signals.length) return;

  const inserts = signals.map((s) => ({
    user_id,
    organization_id,
    type: s.type,
    severity: s.severity,
    content: s.reason,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("user_insights").insert(inserts);

  if (error) {
    console.error("Insight insert error:", error);
    throw error;
  }
}

/**
 * MAIN PIPELINE
 */
export async function processEvent(event: IncomingEvent) {
  const normalized = normalizeEvent(event);

  await storeEvent(normalized);

  const signals = generateSignals(event);

  await storeInsights(
    event.user_id,
    event.organization_id,
    signals
  );

  return {
    success: true,
    signals_generated: signals.length,
  };
}
