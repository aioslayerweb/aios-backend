import { useRuntimeStatus } from "@/hooks"
import { RuntimeModuleCard } from "./runtime-module-card"

export function MemoryRuntimeStatus() {
  const { modules } = useRuntimeStatus()
  const memory = modules.find((item) => item.key === "memory")

  if (!memory) {
    return null
  }

  return <RuntimeModuleCard module={memory} />
}
