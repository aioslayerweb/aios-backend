import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseSessionClient } from "@/lib/auth/supabase-server"

type SupabaseSession = {
  access_token?: unknown
  expires_at?: unknown
  refresh_token?: unknown
}

export type SupabaseAuthClient = {
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{
      data: { session: SupabaseSession | null; user: { id: string } | null }
      error: unknown
    }>
    getSession: () => Promise<{
      data: { session: SupabaseSession | null }
      error: unknown
    }>
    refreshSession: (currentSession: { refresh_token: string }) => Promise<{
      data: { session: SupabaseSession | null }
      error: unknown
    }>
    signOut: (options: { scope: "local" }) => Promise<{ error: unknown }>
  }
}

type SupabaseBffDependencies = {
  createClient: (request: NextRequest, response: NextResponse) => SupabaseAuthClient
  backendUrl?: string
  fetch: typeof fetch
  logError: (message: string) => void
  timeoutMs: number
}

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" }
const identityPath = "/api/v1/security/identity"
const organizationsPath = "/api/v1/me/organizations"
const organizationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const membershipRoles = new Set(["org_admin", "member"])

function readSetCookies(source: NextResponse): string[] {
  const headersWithSetCookie = source.headers as Headers & { getSetCookie?: () => string[] }
  if (!headersWithSetCookie.getSetCookie) {
    throw new Error("The runtime cannot safely forward session cookies")
  }
  return headersWithSetCookie.getSetCookie()
}

function copySetCookies(source: NextResponse, target: NextResponse): number {
  const cookies = readSetCookies(source)
  for (const cookie of cookies) {
    target.headers.append("Set-Cookie", cookie)
  }
  return cookies.length
}

function jsonError(
  message: string,
  status: number,
  cookieResponse?: NextResponse,
): NextResponse {
  const response = NextResponse.json(
    { error: message },
    { status, headers: noStoreHeaders },
  )
  if (cookieResponse) {
    copySetCookies(cookieResponse, response)
  }
  return response
}

function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) {
    return false
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function isSameOriginFetch(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite !== null && fetchSite !== "same-origin") {
    return false
  }

  if (request.headers.has("origin")) {
    return hasSameOrigin(request)
  }

  return fetchSite === "same-origin"
}

function readBackendUrl(baseUrl: string | undefined, path: string): URL | null {
  if (!baseUrl) {
    return null
  }

  try {
    const url = new URL(baseUrl)
    const localDevelopment =
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname)

    if (
      (url.protocol !== "https:" && !localDevelopment) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null
    }

    return new URL(path, url)
  } catch {
    return null
  }
}

async function readBoundedJson(
  source: { body: ReadableStream<Uint8Array> | null },
  maxBytes = 8192,
): Promise<unknown> {
  if (!source.body) {
    return null
  }

  const reader = source.body.getReader()
  const chunks: Uint8Array[] = []
  let totalLength = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    totalLength += value.byteLength
    if (totalLength > maxBytes) {
      await reader.cancel()
      throw new Error("Request body is too large")
    }
    chunks.push(value)
  }

  const body = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)) as unknown
}

function parseCredentials(value: unknown): { email: string; password: string } | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const credentials = value as Record<string, unknown>
  if (
    typeof credentials.email === "string" &&
    credentials.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim()) &&
    typeof credentials.password === "string" &&
    credentials.password.length >= 8 &&
    credentials.password.length <= 1024
  ) {
    return { email: credentials.email.trim(), password: credentials.password }
  }
  return null
}

type AccessTokenResult =
  | { accessToken: string; failure?: never }
  | { accessToken?: never; failure: NextResponse }

async function getSupabaseAccessToken(
  request: NextRequest,
  cookieResponse: NextResponse,
  dependencies: SupabaseBffDependencies,
): Promise<AccessTokenResult> {
  let client: SupabaseAuthClient
  try {
    client = dependencies.createClient(request, cookieResponse)
  } catch {
    dependencies.logError("Supabase Auth configuration is unavailable")
    return { failure: jsonError("Authentication is unavailable", 503) }
  }

  try {
    const { data, error } = await client.auth.getSession()
    if (
      error ||
      typeof data.session?.access_token !== "string" ||
      !data.session.access_token ||
      typeof data.session.expires_at !== "number" ||
      !Number.isFinite(data.session.expires_at)
    ) {
      return { failure: jsonError("Authentication required", 401, cookieResponse) }
    }

    let session = data.session
    let expiresAt = session.expires_at
    if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
      return { failure: jsonError("Authentication required", 401, cookieResponse) }
    }
    const refreshThreshold = Math.floor(Date.now() / 1000) + 60
    if (expiresAt <= refreshThreshold) {
      if (typeof session.refresh_token !== "string" || !session.refresh_token) {
        return { failure: jsonError("Authentication required", 401, cookieResponse) }
      }

      const refreshed = await client.auth.refreshSession({
        refresh_token: session.refresh_token,
      })
      if (
        refreshed.error ||
        typeof refreshed.data.session?.access_token !== "string" ||
        !refreshed.data.session.access_token ||
        typeof refreshed.data.session.expires_at !== "number" ||
        !Number.isFinite(refreshed.data.session.expires_at) ||
        refreshed.data.session.expires_at <= Math.floor(Date.now() / 1000)
      ) {
        return { failure: jsonError("Authentication required", 401, cookieResponse) }
      }
      if (readSetCookies(cookieResponse).length === 0) {
        dependencies.logError("Supabase Auth did not persist the refreshed session")
        return { failure: jsonError("Authentication is unavailable", 503) }
      }
      session = refreshed.data.session
      expiresAt = session.expires_at
    }

    if (
      typeof session.access_token !== "string" ||
      !session.access_token ||
      typeof expiresAt !== "number" ||
      expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return { failure: jsonError("Authentication required", 401, cookieResponse) }
    }
    return { accessToken: session.access_token }
  } catch {
    dependencies.logError("Supabase Auth session could not be read")
    return {
      failure: jsonError("Authentication is unavailable", 503, cookieResponse),
    }
  }
}

function validateOrganizationsResponse(
  value: unknown,
): {
  memberships: Array<{ organization_id: string; organization_name: string; role: string }>
  selected_organization_id: string | null
  selection_required: boolean
} | null {
  if (!value || typeof value !== "object") {
    return null
  }
  const payload = value as Record<string, unknown>
  if (
    !Array.isArray(payload.memberships) ||
    !(payload.selected_organization_id === null ||
      (typeof payload.selected_organization_id === "string" &&
        organizationIdPattern.test(payload.selected_organization_id))) ||
    typeof payload.selection_required !== "boolean"
  ) {
    return null
  }

  const memberships: Array<{
    organization_id: string
    organization_name: string
    role: string
  }> = []
  const organizationIds = new Set<string>()
  for (const entry of payload.memberships) {
    if (!entry || typeof entry !== "object") {
      return null
    }
    const membership = entry as Record<string, unknown>
    if (
      typeof membership.organization_id !== "string" ||
      !organizationIdPattern.test(membership.organization_id) ||
      typeof membership.organization_name !== "string" ||
      !membership.organization_name.trim() ||
      membership.organization_name.length > 500 ||
      typeof membership.role !== "string" ||
      !membershipRoles.has(membership.role) ||
      organizationIds.has(membership.organization_id)
    ) {
      return null
    }
    organizationIds.add(membership.organization_id)
    memberships.push({
      organization_id: membership.organization_id,
      organization_name: membership.organization_name,
      role: membership.role,
    })
  }

  const selectedOrganizationId = payload.selected_organization_id as string | null
  if (
    (selectedOrganizationId !== null && !organizationIds.has(selectedOrganizationId)) ||
    (payload.selection_required &&
      (selectedOrganizationId !== null || memberships.length < 2)) ||
    (!payload.selection_required &&
      memberships.length > 1 &&
      selectedOrganizationId === null) ||
    (memberships.length === 1 &&
      selectedOrganizationId !== memberships[0].organization_id) ||
    (memberships.length === 0 && selectedOrganizationId !== null)
  ) {
    return null
  }

  return {
    memberships,
    selected_organization_id: selectedOrganizationId,
    selection_required: payload.selection_required,
  }
}

async function readBoundedBackendJson(response: Response): Promise<unknown> {
  const contentLength = response.headers.get("content-length")
  if (contentLength && Number(contentLength) > 4096) {
    throw new Error("Backend response exceeded the size limit")
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  if (!contentType.startsWith("application/json")) {
    throw new Error("Backend returned an unsupported response type")
  }

  return readBoundedJson(response, 4096)
}

export function createSupabaseBffHandlers(
  overrides: Partial<SupabaseBffDependencies> = {},
) {
  const dependencies: SupabaseBffDependencies = {
    createClient: createSupabaseSessionClient,
    backendUrl: process.env.AIOS_BACKEND_URL,
    fetch: globalThis.fetch,
    logError: (message) => console.error(message),
    timeoutMs: 5000,
    ...overrides,
  }

  return {
    async login(request: NextRequest): Promise<NextResponse> {
      if (!hasSameOrigin(request)) {
        return jsonError("Request denied", 403)
      }

      if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
        return jsonError("Invalid request", 400)
      }

      const contentLength = request.headers.get("content-length")
      if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > 8192)) {
        return jsonError("Invalid request", 400)
      }

      let body: unknown
      try {
        body = await readBoundedJson(request)
      } catch {
        return jsonError("Invalid request", 400)
      }

      const credentials = parseCredentials(body)
      if (!credentials) {
        return jsonError("Invalid request", 400)
      }

      const cookieResponse = new NextResponse(null, { headers: noStoreHeaders })
      let client: SupabaseAuthClient
      try {
        client = dependencies.createClient(request, cookieResponse)
      } catch {
        dependencies.logError("Supabase Auth configuration is unavailable")
        return jsonError("Authentication is unavailable", 503)
      }

      try {
        const { data, error } = await client.auth.signInWithPassword(credentials)
        if (error || typeof data.session?.access_token !== "string" || !data.session.access_token) {
          return jsonError("Authentication failed", 401, cookieResponse)
        }

        const response = NextResponse.json(
          { authenticated: true },
          { headers: noStoreHeaders },
        )
        if (copySetCookies(cookieResponse, response) === 0) {
          dependencies.logError("Supabase Auth did not persist the login session")
          return jsonError("Authentication is unavailable", 503)
        }
        return response
      } catch {
        dependencies.logError("Supabase Auth sign-in request failed")
        return jsonError("Authentication is unavailable", 503, cookieResponse)
      }
    },

    async logout(request: NextRequest): Promise<NextResponse> {
      if (!hasSameOrigin(request)) {
        return jsonError("Request denied", 403)
      }

      const cookieResponse = new NextResponse(null, { headers: noStoreHeaders })
      let client: SupabaseAuthClient
      try {
        client = dependencies.createClient(request, cookieResponse)
      } catch {
        dependencies.logError("Supabase Auth configuration is unavailable")
        return jsonError("Authentication is unavailable", 503)
      }

      try {
        const { error } = await client.auth.signOut({ scope: "local" })
        if (error) {
          dependencies.logError("Supabase Auth local sign-out failed")
          return jsonError("Sign-out is unavailable", 503, cookieResponse)
        }

        const response = new NextResponse(null, {
          status: 204,
          headers: noStoreHeaders,
        })
        copySetCookies(cookieResponse, response)
        return response
      } catch {
        dependencies.logError("Supabase Auth local sign-out failed")
        return jsonError("Sign-out is unavailable", 503, cookieResponse)
      }
    },

    async identity(request: NextRequest): Promise<NextResponse> {
      if (!isSameOriginFetch(request)) {
        return jsonError("Request denied", 403)
      }

      const cookieResponse = new NextResponse(null, { headers: noStoreHeaders })
      const session = await getSupabaseAccessToken(request, cookieResponse, dependencies)
      if (session.failure) {
        return session.failure
      }

      const identityUrl = readBackendUrl(dependencies.backendUrl, identityPath)
      if (!identityUrl) {
        dependencies.logError("Identity backend URL is missing or invalid")
        return jsonError("Identity verification is unavailable", 503, cookieResponse)
      }

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), dependencies.timeoutMs)
      try {
        const backendResponse = await dependencies.fetch(identityUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          cache: "no-store",
          redirect: "error",
          signal: controller.signal,
        })

        if (backendResponse.status === 401) {
          return jsonError("Authentication required", 401, cookieResponse)
        }
        if (!backendResponse.ok) {
          dependencies.logError("Identity backend rejected the request")
          return jsonError("Identity verification is unavailable", 502, cookieResponse)
        }

        const body: unknown = await readBoundedBackendJson(backendResponse)
        if (
          !body ||
          typeof body !== "object" ||
          typeof (body as Record<string, unknown>).sub !== "string" ||
          !(body as Record<string, string>).sub.trim()
        ) {
          dependencies.logError("Identity backend returned an invalid response")
          return jsonError("Identity verification is unavailable", 502, cookieResponse)
        }

        const subject = (body as { sub: string }).sub
        const result = NextResponse.json(
          { sub: subject },
          { headers: noStoreHeaders },
        )
        copySetCookies(cookieResponse, result)
        return result
      } catch {
        dependencies.logError("Identity backend request failed")
        return jsonError("Identity verification is unavailable", 502, cookieResponse)
      } finally {
        clearTimeout(timeout)
      }
    },

    async organizations(request: NextRequest): Promise<NextResponse> {
      if (!isSameOriginFetch(request)) {
        return jsonError("Request denied", 403)
      }

      const requestedIds = request.nextUrl.searchParams.getAll("organization_id")
      if (
        requestedIds.length > 1 ||
        (requestedIds.length === 1 && !organizationIdPattern.test(requestedIds[0]))
      ) {
        return jsonError("Invalid organization selection", 400)
      }

      const cookieResponse = new NextResponse(null, { headers: noStoreHeaders })
      const session = await getSupabaseAccessToken(request, cookieResponse, dependencies)
      if (session.failure) {
        return session.failure
      }

      const backendUrl = readBackendUrl(dependencies.backendUrl, organizationsPath)
      if (!backendUrl) {
        dependencies.logError("Membership backend URL is missing or invalid")
        return jsonError("Membership service unavailable", 503, cookieResponse)
      }
      if (requestedIds.length === 1) {
        backendUrl.searchParams.set("organization_id", requestedIds[0])
      }

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), dependencies.timeoutMs)
      try {
        const backendResponse = await dependencies.fetch(backendUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          cache: "no-store",
          redirect: "error",
          signal: controller.signal,
        })

        if (backendResponse.status === 401) {
          return jsonError("Authentication required", 401, cookieResponse)
        }
        if (backendResponse.status === 403) {
          return jsonError("Organization selection is not authorized", 403, cookieResponse)
        }
        if (!backendResponse.ok) {
          dependencies.logError("Membership backend rejected the request")
          return jsonError("Membership service unavailable", 502, cookieResponse)
        }

        let payload: unknown
        try {
          payload = await readBoundedBackendJson(backendResponse)
        } catch {
          dependencies.logError("Membership backend response could not be read")
          return jsonError("Membership service unavailable", 502, cookieResponse)
        }

        const organizations = validateOrganizationsResponse(payload)
        if (
          !organizations ||
          (requestedIds.length === 1 &&
            organizations.selected_organization_id?.toLowerCase() !==
              requestedIds[0].toLowerCase())
        ) {
          dependencies.logError("Membership backend returned an invalid response")
          return jsonError("Membership service unavailable", 502, cookieResponse)
        }

        const response = NextResponse.json(organizations, { headers: noStoreHeaders })
        copySetCookies(cookieResponse, response)
        return response
      } catch {
        dependencies.logError("Membership backend request failed")
        return jsonError("Membership service unavailable", 502, cookieResponse)
      } finally {
        clearTimeout(timeout)
      }
    },
  }
}
