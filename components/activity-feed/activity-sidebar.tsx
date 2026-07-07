"use client"

import { Sparkles } from "lucide-react"
import { useConnectionStatus, useRecentActivity, useSystemHealth } from "@/hooks"
import { Card, CardContent, CardHeader } from "@/components/ui"

type ActivitySidebarProps = {
  total: number
  filtered: number
  pinnedCount: number
  unreadCount: number
}

export function ActivitySidebar({ total, filtered, pinnedCount, unreadCount }: ActivitySidebarProps) {
  const { overallHealth } = useSystemHealth()
  const { supabase, api } = useConnectionStatus()
  const { items } = useRecentActivity(4)

  const connectionStatuses = [supabase, api].filter((value): value is NonNullable<typeof value> => Boolean(value))

  return (
    <aside className="space-y-3" aria-label="Activity feed sidebar">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-brand-navy">Operational Summary</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p>Total events: {total}</p>
          <p>Visible events: {filtered}</p>
          <p>Pinned: {pinnedCount}</p>
          <p>Unread: {unreadCount}</p>
          <p className="rounded-md bg-brand-subtle px-2 py-1 text-brand-navy">Runtime health: {overallHealth}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-brand-navy">Connected Systems</p>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-text-secondary">
          {connectionStatuses.map((moduleStatus) => (
            <p key={moduleStatus.key} className="rounded border border-border px-2 py-1">
              {moduleStatus.name}: {moduleStatus.label}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
            <Sparkles className="h-4 w-4" />
            AI Assistant Context
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-text-secondary">
          {items.map((item) => (
            <p key={item.id} className="rounded border border-border px-2 py-1">
              {item.title}
            </p>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
