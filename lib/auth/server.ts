import { redirect } from "next/navigation"
import { auth } from "@/auth"

export async function getCurrentSession() {
  return auth()
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth(callbackUrl?: string) {
  const session = await auth()

  if (!session?.user) {
    const target = callbackUrl ?? "/app"
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`)
  }

  return session
}
