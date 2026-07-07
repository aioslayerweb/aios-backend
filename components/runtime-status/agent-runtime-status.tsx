import { useRuntimeStatus } from "@/hooks"
import { RuntimeModuleCard } from "./runtime-module-card"

export function AgentRuntimeStatus() {
  const { modules } = useRuntimeStatus()
  const agents = modules.find((item) => item.key === "agents")

  if (!agents) {
    return null
  }

  return <RuntimeModuleCard module={agents} />
}
