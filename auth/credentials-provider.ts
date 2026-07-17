import Credentials from "next-auth/providers/credentials"
import { createTemporaryAuthUser } from "@/auth/user-model"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function readConfiguredCredential() {
  const email = process.env.AUTH_DEMO_EMAIL
  const password = process.env.AUTH_DEMO_PASSWORD

  if (email && password) {
    return { email, password }
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      email: "admin@aios.local",
      password: "AiosDemoPass123!",
    }
  }

  return null
}

export const credentialsProvider = Credentials({
  name: "AIOS Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  authorize(rawCredentials) {
    const email = typeof rawCredentials?.email === "string" ? rawCredentials.email.trim() : ""
    const password = typeof rawCredentials?.password === "string" ? rawCredentials.password : ""

    if (!isValidEmail(email) || password.length < 8) {
      return null
    }

    const configured = readConfiguredCredential()
    if (!configured) {
      return null
    }

    if (
      email.toLowerCase() !== configured.email.toLowerCase() ||
      password !== configured.password
    ) {
      return null
    }

    return createTemporaryAuthUser({ email: configured.email, name: "AIOS Admin" })
  },
})
