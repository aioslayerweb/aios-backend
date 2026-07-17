"use client"

import { signIn, signOut } from "next-auth/react"

export async function signInWithCredentials(email: string, password: string, callbackUrl?: string) {
  return signIn("credentials", {
    email,
    password,
    redirect: true,
    callbackUrl: callbackUrl ?? "/app",
  })
}

export async function signOutSafely(callbackUrl = "/login") {
  return signOut({ callbackUrl })
}
