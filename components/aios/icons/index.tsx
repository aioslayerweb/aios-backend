import type { LucideIcon } from "lucide-react"
import { aiosTheme } from "@/components/aios/theme/tokens"

export function AIOSIcon({ icon: Icon, size = 20, className }: { icon: LucideIcon; size?: 16 | 20 | 24 | 32 | 40; className?: string }) {
  return <Icon size={aiosTheme.icons[size]} className={className} strokeWidth={1.9} />
}
