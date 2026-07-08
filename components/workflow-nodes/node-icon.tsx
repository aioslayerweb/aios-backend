"use client"

import {
  Bot,
  Braces,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  Diamond,
  GitBranch,
  GitMerge,
  Mail,
  MessageSquare,
  Milestone,
  PlayCircle,
  Search,
  ShieldCheck,
  Split,
  SquareStack,
  Timer,
  UserRoundSearch,
  Webhook,
  Workflow,
} from "lucide-react"
import type { WorkflowNodeType } from "@/types"

const iconByType: Record<WorkflowNodeType, typeof PlayCircle> = {
  start: PlayCircle,
  end: CheckCircle2,
  "ai-prompt": Bot,
  decision: Diamond,
  condition: GitBranch,
  "memory-read": Database,
  "memory-write": SquareStack,
  "knowledge-search": Search,
  "customer-lookup": UserRoundSearch,
  "crm-update": Milestone,
  email: Mail,
  slack: MessageSquare,
  calendar: Calendar,
  approval: ShieldCheck,
  delay: Clock3,
  loop: Timer,
  "parallel-branch": Split,
  merge: GitMerge,
  webhook: Webhook,
  "api-call": Braces,
  "custom-action": Workflow,
}

export function NodeIcon({ type }: { type: WorkflowNodeType }) {
  const Icon = iconByType[type]
  return <Icon className="h-4 w-4" aria-hidden />
}
