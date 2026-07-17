"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthSession } from "@/hooks/use-auth-session"

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname || "/app")}`)
    }
  }, [isAuthenticated, isLoading, pathname, router])

  return {
    isAuthenticated,
    isLoading,
  }
}
