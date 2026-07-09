"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useWorkflowSDK() {
  const platform = useSDKPlatform()

  return {
    workflows: platform.workflows.list(),
    registerWorkflow: platform.workflows.register.bind(platform.workflows),
  }
}
