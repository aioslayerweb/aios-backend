import assert from "node:assert/strict"
import { test } from "node:test"
import { NextRequest, NextResponse } from "next/server"
import {
  createSupabaseBffHandlers,
  type SupabaseAuthClient,
} from "@/lib/auth/supabase-bff"
import {
  createSupabaseCookieMethods,
  validateSupabaseConfiguration,
} from "@/lib/auth/supabase-server"

const identityPath = "/api/v1/security/identity"
const loginPath = "/api/auth/supabase/login"
const syntheticToken = "synthetic-access-token"

function makeRequest(
  path: string,
  options: {
    method?: string
    headers?: Record<string, string>
    body?: string
  } = {},
) {
  return new NextRequest(`http://localhost${path}`, {
    method: options.method ?? "GET",
    headers: options.headers,
    body: options.body,
  })
}

function makeClient(overrides: Partial<SupabaseAuthClient["auth"]> = {}): SupabaseAuthClient {
  return {
    auth: {
      async signInWithPassword() {
        return {
          data: { session: { access_token: syntheticToken }, user: { id: "synthetic-user" } },
          error: null,
        }
      },
      async getSession() {
        return {
          data: {
            session: {
              access_token: syntheticToken,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              refresh_token: "synthetic-refresh-token",
            },
          },
          error: null,
        }
      },
      async refreshSession() {
        return {
          data: {
            session: {
              access_token: "rotated-access-token",
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              refresh_token: "rotated-refresh-token",
            },
          },
          error: null,
        }
      },
      async signOut() {
        return { error: null }
      },
      ...overrides,
    },
  }
}

function sameOriginHeaders(contentType?: string) {
  return {
    Origin: "http://localhost",
    ...(contentType ? { "Content-Type": contentType } : {}),
  }
}

function responseCookies(response: Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] }
  return headers.getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""]
}

function makeCookieClient(client: SupabaseAuthClient = makeClient()) {
  return (_request: NextRequest, response: NextResponse) => {
    response.cookies.set("sb-session", "opaque-test-session", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })
    return client
  }
}

test("Supabase login stores session cookies and returns no credential or token values", async () => {
  let receivedCredentials: { email: string; password: string } | null = null
  const client = makeClient({
    async signInWithPassword(credentials) {
      receivedCredentials = credentials
      return {
        data: { session: { access_token: syntheticToken }, user: { id: "synthetic-user" } },
        error: null,
      }
    },
  })
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(client),
    logError: () => undefined,
  })

  const response = await handlers.login(
    makeRequest(loginPath, {
      method: "POST",
      headers: sameOriginHeaders("application/json"),
      body: JSON.stringify({ email: "pilot@example.test", password: "synthetic-password" }),
    }),
  )

  assert.equal(response.status, 200)
  const body = await response.json()
  assert.deepEqual(body, { authenticated: true })
  assert.deepEqual(receivedCredentials, {
    email: "pilot@example.test",
    password: "synthetic-password",
  })
  assert.match(responseCookies(response).join(";"), /HttpOnly/i)
  assert.doesNotMatch(JSON.stringify(body), /token|password|synthetic/i)
  assert.match(response.headers.get("cache-control") ?? "", /no-store/)
})

test("login rejects cross-origin requests before contacting Supabase", async () => {
  let clientCreated = false
  const handlers = createSupabaseBffHandlers({
    createClient: () => {
      clientCreated = true
      return makeClient()
    },
    logError: () => undefined,
  })

  const response = await handlers.login(
    makeRequest(loginPath, {
      method: "POST",
      headers: {
        Origin: "https://attacker.example",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "pilot@example.test", password: "synthetic-password" }),
    }),
  )

  assert.equal(response.status, 403)
  assert.equal(clientCreated, false)
  assert.equal((await response.json() as { sub?: string }).sub, undefined)
})

test("login rejects malformed and oversized credential bodies", async () => {
  const handlers = createSupabaseBffHandlers({
    createClient: () => {
      throw new Error("Must not create client for malformed credentials")
    },
    logError: () => undefined,
  })

  const malformed = await handlers.login(
    makeRequest(loginPath, {
      method: "POST",
      headers: sameOriginHeaders("application/json"),
      body: "{",
    }),
  )
  assert.equal(malformed.status, 400)

  const oversized = await handlers.login(
    makeRequest(loginPath, {
      method: "POST",
      headers: { ...sameOriginHeaders("application/json"), "Content-Length": "9000" },
      body: JSON.stringify({ email: "pilot@example.test", password: "synthetic-password" }),
    }),
  )
  assert.equal(oversized.status, 400)
})

test("login does not report success when the session cookie was not persisted", async () => {
  const handlers = createSupabaseBffHandlers({
    createClient: () => makeClient(),
    logError: () => undefined,
  })

  const response = await handlers.login(
    makeRequest(loginPath, {
      method: "POST",
      headers: sameOriginHeaders("application/json"),
      body: JSON.stringify({ email: "pilot@example.test", password: "synthetic-password" }),
    }),
  )

  assert.equal(response.status, 503)
  assert.equal((await response.json() as { authenticated?: boolean }).authenticated, undefined)
})

test("identity denies missing sessions without calling the backend or returning identity data", async () => {
  let backendCalled = false
  const handlers = createSupabaseBffHandlers({
    createClient: () =>
      makeClient({
        async getSession() {
          return { data: { session: null }, error: null }
        },
      }),
    backendUrl: "http://localhost:8000",
    fetch: async () => {
      backendCalled = true
      throw new Error("Backend must not be called")
    },
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 401)
  assert.equal(backendCalled, false)
  assert.equal((await response.json() as { sub?: string }).sub, undefined)
})

test("identity forwards the server-held bearer token and returns only the verified subject", async () => {
  let requestedUrl = ""
  let authorization = ""
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(),
    backendUrl: "http://localhost:8000",
    fetch: async (input, init) => {
      requestedUrl = String(input)
      authorization = new Headers(init?.headers).get("authorization") ?? ""
      return Response.json({
        sub: "synthetic-user",
        email: "must-not-be-forwarded@example.test",
        role: "must-not-be-forwarded",
      })
    },
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { sub: "synthetic-user" })
  assert.equal(requestedUrl, `http://localhost:8000${identityPath}`)
  assert.equal(authorization, `Bearer ${syntheticToken}`)
  assert.match(responseCookies(response).join(";"), /HttpOnly/i)
  assert.match(response.headers.get("cache-control") ?? "", /no-store/)
})

test("identity refreshes near-expiry sessions and forwards the rotated access token", async () => {
  let refreshToken = ""
  let authorization = ""
  const client = makeClient({
    async getSession() {
      return {
        data: {
          session: {
            access_token: "expiring-access-token",
            expires_at: Math.floor(Date.now() / 1000) + 10,
            refresh_token: "rotating-refresh-token",
          },
        },
        error: null,
      }
    },
    async refreshSession(session) {
      refreshToken = session.refresh_token
      return {
        data: {
          session: {
            access_token: "rotated-access-token",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            refresh_token: "rotated-refresh-token",
          },
        },
        error: null,
      }
    },
  })
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(client),
    backendUrl: "http://localhost:8000",
    fetch: async (_input, init) => {
      authorization = new Headers(init?.headers).get("authorization") ?? ""
      return Response.json({ sub: "synthetic-user" })
    },
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 200)
  assert.equal(refreshToken, "rotating-refresh-token")
  assert.equal(authorization, "Bearer rotated-access-token")
})

test("identity denies an expired session when refresh fails", async () => {
  let backendCalled = false
  const handlers = createSupabaseBffHandlers({
    createClient: () =>
      makeClient({
        async getSession() {
          return {
            data: {
              session: {
                access_token: "expired-access-token",
                expires_at: Math.floor(Date.now() / 1000) - 1,
                refresh_token: "expired-refresh-token",
              },
            },
            error: null,
          }
        },
        async refreshSession() {
          return { data: { session: null }, error: new Error("synthetic refresh denial") }
        },
      }),
    backendUrl: "http://localhost:8000",
    fetch: async () => {
      backendCalled = true
      throw new Error("Backend must not be called")
    },
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 401)
  assert.equal(backendCalled, false)
})

test("identity rejects cross-site fetches and never calls the backend", async () => {
  let backendCalled = false
  const handlers = createSupabaseBffHandlers({
    createClient: () => makeClient(),
    backendUrl: "http://localhost:8000",
    fetch: async () => {
      backendCalled = true
      throw new Error("Backend must not be called")
    },
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, {
      headers: {
        Origin: "http://localhost",
        "Sec-Fetch-Site": "cross-site",
      },
    }),
  )

  assert.equal(response.status, 403)
  assert.equal(backendCalled, false)
})

test("identity fails closed when backend configuration is missing or malformed", async () => {
  for (const backendUrl of [undefined, "http://backend.example", "https://user:pass@example.test"]) {
    let backendCalled = false
    const handlers = createSupabaseBffHandlers({
      createClient: () => makeClient(),
      backendUrl,
      fetch: async () => {
        backendCalled = true
        throw new Error("Backend must not be called")
      },
      logError: () => undefined,
    })

    const response = await handlers.identity(
      makeRequest(identityPath, { headers: sameOriginHeaders() }),
    )
    assert.equal(response.status, 503)
    assert.equal(backendCalled, false)
    assert.equal((await response.json() as { sub?: string }).sub, undefined)
  }
})

test("identity maps backend denial to an authentication error without identity data", async () => {
  const handlers = createSupabaseBffHandlers({
    createClient: () => makeClient(),
    backendUrl: "http://localhost:8000",
    fetch: async () => new Response(null, { status: 401 }),
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 401)
  assert.equal((await response.json() as { sub?: string }).sub, undefined)
})

test("organization BFF forwards only the configured membership request and filters the response", async () => {
  let requestedUrl = ""
  let authorization = ""
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(),
    backendUrl: "http://localhost:8000",
    fetch: async (input, init) => {
      requestedUrl = String(input)
      authorization = new Headers(init?.headers).get("authorization") ?? ""
      return Response.json({
        memberships: [
          {
            organization_id: "10000000-0000-4000-8000-000000000001",
            organization_name: "Northwind",
            role: "member",
            private_claim: "must-not-be-forwarded",
          },
        ],
        selected_organization_id: "10000000-0000-4000-8000-000000000001",
        selection_required: false,
        user_id: "must-not-be-forwarded",
      })
    },
    logError: () => undefined,
  })

  const response = await handlers.organizations(
    makeRequest(
      `/api/v1/me/organizations?organization_id=10000000-0000-4000-8000-000000000001&user_id=forged&role=org_admin`,
      { headers: sameOriginHeaders() },
    ),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    memberships: [
      {
        organization_id: "10000000-0000-4000-8000-000000000001",
        organization_name: "Northwind",
        role: "member",
      },
    ],
    selected_organization_id: "10000000-0000-4000-8000-000000000001",
    selection_required: false,
  })
  assert.equal(
    requestedUrl,
    "http://localhost:8000/api/v1/me/organizations?organization_id=10000000-0000-4000-8000-000000000001",
  )
  assert.equal(authorization, `Bearer ${syntheticToken}`)
  assert.match(response.headers.get("cache-control") ?? "", /no-store/)
})

test("organization BFF rejects missing Supabase sessions before calling the backend", async () => {
  let backendCalled = false
  const handlers = createSupabaseBffHandlers({
    createClient: () =>
      makeClient({
        async getSession() {
          return { data: { session: null }, error: null }
        },
      }),
    backendUrl: "http://localhost:8000",
    fetch: async () => {
      backendCalled = true
      throw new Error("Backend must not be called")
    },
    logError: () => undefined,
  })

  const response = await handlers.organizations(
    makeRequest("/api/v1/me/organizations", {
      headers: {
        ...sameOriginHeaders(),
        Cookie: "authjs.session-token=synthetic-demo-session",
        "Sec-Fetch-Site": "same-origin",
      },
    }),
  )

  assert.equal(response.status, 401)
  assert.equal(backendCalled, false)
  assert.equal((await response.json() as { memberships?: unknown }).memberships, undefined)
})

test("organization BFF rejects malformed, repeated, or unauthorized selections", async () => {
  let backendCalled = false
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(),
    backendUrl: "http://localhost:8000",
    fetch: async () => {
      backendCalled = true
      return new Response(null, { status: 403 })
    },
    logError: () => undefined,
  })

  const malformed = await handlers.organizations(
    makeRequest("/api/v1/me/organizations?organization_id=not-a-uuid", {
      headers: sameOriginHeaders(),
    }),
  )
  const repeated = await handlers.organizations(
    makeRequest(
      "/api/v1/me/organizations?organization_id=10000000-0000-4000-8000-000000000001&organization_id=10000000-0000-4000-8000-000000000002",
      { headers: sameOriginHeaders() },
    ),
  )
  assert.equal(malformed.status, 400)
  assert.equal(repeated.status, 400)
  assert.equal(backendCalled, false)

  const unauthorized = await handlers.organizations(
    makeRequest(
      "/api/v1/me/organizations?organization_id=10000000-0000-4000-8000-000000000099",
      { headers: sameOriginHeaders() },
    ),
  )
  assert.equal(unauthorized.status, 403)
  assert.equal((await unauthorized.json() as { memberships?: unknown }).memberships, undefined)
})

test("organization BFF fails closed on unsupported roles and malformed payloads", async () => {
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(),
    backendUrl: "http://localhost:8000",
    fetch: async () =>
      Response.json({
        memberships: [
          {
            organization_id: "10000000-0000-4000-8000-000000000001",
            organization_name: "Northwind",
            role: "owner",
          },
        ],
        selected_organization_id: "10000000-0000-4000-8000-000000000001",
        selection_required: false,
      }),
    logError: () => undefined,
  })

  const response = await handlers.organizations(
    makeRequest("/api/v1/me/organizations", { headers: sameOriginHeaders() }),
  )
  assert.equal(response.status, 502)
  assert.equal((await response.json() as { memberships?: unknown }).memberships, undefined)
})

test("identity rejects malformed backend identity responses", async () => {
  const handlers = createSupabaseBffHandlers({
    createClient: () => makeClient(),
    backendUrl: "http://localhost:8000",
    fetch: async () => Response.json({ sub: " ", claims: ["private"] }),
    logError: () => undefined,
  })

  const response = await handlers.identity(
    makeRequest(identityPath, { headers: sameOriginHeaders() }),
  )

  assert.equal(response.status, 502)
  assert.equal((await response.json() as { sub?: string }).sub, undefined)
})

test("logout clears the local Supabase session and returns no session data", async () => {
  let scope = ""
  const client = makeClient({
    async signOut(options) {
      scope = options.scope
      return { error: null }
    },
  })
  const handlers = createSupabaseBffHandlers({
    createClient: makeCookieClient(client),
    logError: () => undefined,
  })

  const response = await handlers.logout(
    makeRequest("/api/auth/supabase/logout", {
      method: "POST",
      headers: sameOriginHeaders(),
    }),
  )

  assert.equal(response.status, 204)
  assert.equal(scope, "local")
  assert.match(responseCookies(response).join(";"), /HttpOnly/i)
  assert.equal(await response.text(), "")
})

test("Supabase cookie methods enforce HttpOnly, SameSite, secure production cookies and root path", () => {
  const originalNodeEnv = Object.getOwnPropertyDescriptor(process.env, "NODE_ENV")
  try {
    Object.defineProperty(process.env, "NODE_ENV", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: "production",
    })
    const request = makeRequest(identityPath)
    const response = new NextResponse(null)
    const methods = createSupabaseCookieMethods(request, response)
    assert.ok(methods.setAll)

    methods.setAll(
      [
        {
          name: "sb-session",
          value: "synthetic-cookie",
          options: {
            httpOnly: false,
            sameSite: "none",
            secure: false,
            path: "/untrusted",
          },
        },
      ],
      { "Cache-Control": "private, no-store" },
    )

    const cookie = responseCookies(response).join(";")
    assert.match(cookie, /HttpOnly/i)
    assert.match(cookie, /SameSite=Lax/i)
    assert.match(cookie, /Secure/i)
    assert.match(cookie, /Path=\//i)
    assert.doesNotMatch(cookie, /Path=\/untrusted/i)
  } finally {
    if (originalNodeEnv) {
      Object.defineProperty(process.env, "NODE_ENV", originalNodeEnv)
    } else {
      Reflect.deleteProperty(process.env, "NODE_ENV")
    }
  }
})

test("Supabase configuration rejects missing, malformed, and insecure production settings", () => {
  assert.throws(() => validateSupabaseConfiguration(undefined, undefined, "production"))
  assert.throws(() => validateSupabaseConfiguration("not-a-url", "synthetic-anon-key", "development"))
  assert.throws(() =>
    validateSupabaseConfiguration("http://supabase.example.test", "synthetic-anon-key", "development"),
  )
  assert.throws(() =>
    validateSupabaseConfiguration("http://localhost:54321", "synthetic-anon-key", "production"),
  )
  assert.throws(() =>
    validateSupabaseConfiguration("https://user:pass@supabase.example.test", "synthetic-anon-key", "production"),
  )
  assert.deepEqual(
    validateSupabaseConfiguration("http://localhost:54321", "synthetic-anon-key", "development"),
    {
      supabaseUrl: "http://localhost:54321",
      supabaseAnonKey: "synthetic-anon-key",
    },
  )
})
