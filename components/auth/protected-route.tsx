"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useAuth } from "@/hooks"
import { ProtectedRouteLoading } from "@/components/auth/auth-loading"

type ProtectedRouteProps = {
  children: ReactNode
  fallback?: ReactNode
  hasAccess?: boolean
}

export function ProtectedRoute({ children, fallback, hasAccess = true }: ProtectedRouteProps) {
  const { isAuthenticated, authenticationStatus } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (authenticationStatus !== "loading" && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname || "/app")}`)
    }
  }, [authenticationStatus, isAuthenticated, pathname, router])

  useEffect(() => {
    if (authenticationStatus === "authenticated" && !hasAccess) {
      router.replace("/unauthorized")
    }
  }, [authenticationStatus, hasAccess, router])

  if (authenticationStatus === "loading") {
    return fallback ?? <ProtectedRouteLoading />
  }

  if (!isAuthenticated) {
    return fallback ?? <ProtectedRouteLoading label="Redirecting to login..." />
  }

  if (!hasAccess) {
    return fallback ?? <ProtectedRouteLoading label="Redirecting to unauthorized page..." />
  }

  return <>{children}</>
}
