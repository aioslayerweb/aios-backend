"use client"

import { useActivityFeedContext } from "@/contexts/activity-feed-context"

export function useActivityFeed() {
  return useActivityFeedContext()
}
