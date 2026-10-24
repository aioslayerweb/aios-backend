import { createServerClient, type CookieMethodsServer } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"
import type { SupabaseAuthClient } from "@/lib/auth/supabase-bff"

export function validateSupabaseConfiguration(
  supabaseUrl: string | undefined,
  supabaseAnonKey: string | undefined,
  nodeEnvironment = process.env.NODE_ENV,
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase Auth is not configured")
  }

  const parsedUrl = new URL(supabaseUrl)
  const isLocalDevelopment =
    nodeEnvironment !== "production" &&
    parsedUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname)

  if (parsedUrl.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error("Supabase Auth URL must use HTTPS")
  }

  if (parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
    throw new Error("Supabase Auth URL is invalid")
  }

  return { supabaseUrl: parsedUrl.toString().replace(/\/$/, ""), supabaseAnonKey }
}

function getSupabaseConfiguration() {
  return validateSupabaseConfiguration(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export function createSupabaseCookieMethods(
  request: NextRequest,
  response: NextResponse,
): CookieMethodsServer {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet, headersToSet) {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, {
          ...options,
          httpOnly: true,
          sameSite: "lax",
          secure: isProduction,
          path: "/",
        })
      }
      for (const [name, value] of Object.entries(headersToSet)) {
        response.headers.set(name, value)
      }
    },
  }
}

export function createSupabaseSessionClient(
  request: NextRequest,
  response: NextResponse,
): SupabaseAuthClient {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfiguration()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: createSupabaseCookieMethods(request, response),
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  })
}
