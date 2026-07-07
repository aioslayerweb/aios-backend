import {
  Bell,
  Bot,
  Brain,
  Building2,
  CheckCheck,
  Database,
  FileBarChart2,
  FolderKanban,
  Mail,
  ShieldAlert,
  Sparkles,
  UserCircle2,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import type { ActivityCategory, ActivityMetadata } from "@/types"
import { cn } from "@/utils"

type ActivityIconProps = {
  category: ActivityCategory
  metadata: ActivityMetadata
  className?: string
}

const iconByCategory: Record<ActivityCategory, LucideIcon> = {
  "ai-runtime": Sparkles,
  agents: Bot,
  memory: Database,
  knowledge: Brain,
  crm: Building2,
  customers: Users,
  projects: FolderKanban,
  tasks: CheckCheck,
  communications: Mail,
  reports: FileBarChart2,
  notifications: Bell,
  automations: Wrench,
  "system-events": ShieldAlert,
  plugins: UserCircle2,
}

export function ActivityIcon({ category, metadata, className }: ActivityIconProps) {
  const Icon = iconByCategory[category]

  const toneClass =
    metadata.status === "error"
      ? "bg-rose-100 text-rose-700"
      : metadata.status === "warning"
        ? "bg-amber-100 text-amber-700"
        : metadata.status === "success" || metadata.status === "completed"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-sky-100 text-sky-700"

  return (
    <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", toneClass, className)}>
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  )
}
