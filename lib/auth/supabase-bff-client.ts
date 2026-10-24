"use client"

export type VerifiedSupabaseIdentity = {
  sub: string
}

export type OrganizationMembership = {
  organization_id: string
  organization_name: string
  role: "org_admin" | "member"
}

export type MyOrganizations = {
  memberships: OrganizationMembership[]
  selected_organization_id: string | null
  selection_required: boolean
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function signInWithSupabase(email: string, password: string): Promise<void> {
  const response = await fetch("/api/auth/supabase/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Supabase sign-in failed")
  }
}

export async function getVerifiedSupabaseIdentity(): Promise<VerifiedSupabaseIdentity | null> {
  const response = await fetch("/api/v1/security/identity", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  })

  if (response.status === 401) {
    return null
  }
  if (!response.ok) {
    throw new Error("Identity verification failed")
  }

  const body = await readJson(response)
  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as Record<string, unknown>).sub !== "string" ||
    !(body as Record<string, string>).sub.trim()
  ) {
    throw new Error("Identity verification failed")
  }

  return { sub: (body as { sub: string }).sub }
}

export async function getMyOrganizations(
  organizationId?: string,
): Promise<MyOrganizations> {
  const query = organizationId
    ? `?organization_id=${encodeURIComponent(organizationId)}`
    : ""
  const response = await fetch(`/api/v1/me/organizations${query}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Organization membership lookup failed")
  }

  const body = await readJson(response)
  if (!body || typeof body !== "object") {
    throw new Error("Organization membership response is invalid")
  }
  const payload = body as Record<string, unknown>
  if (
    !Array.isArray(payload.memberships) ||
    !(payload.selected_organization_id === null ||
      typeof payload.selected_organization_id === "string") ||
    typeof payload.selection_required !== "boolean"
  ) {
    throw new Error("Organization membership response is invalid")
  }

  const memberships: OrganizationMembership[] = []
  const organizationIds = new Set<string>()
  for (const entry of payload.memberships) {
    if (!entry || typeof entry !== "object") {
      throw new Error("Organization membership response is invalid")
    }
    const membership = entry as Record<string, unknown>
    if (
      typeof membership.organization_id !== "string" ||
      typeof membership.organization_name !== "string" ||
      !membership.organization_name.trim() ||
      (membership.role !== "org_admin" && membership.role !== "member") ||
      organizationIds.has(membership.organization_id)
    ) {
      throw new Error("Organization membership response is invalid")
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
    (memberships.length === 1 &&
      selectedOrganizationId !== memberships[0].organization_id) ||
    (memberships.length === 0 && selectedOrganizationId !== null)
  ) {
    throw new Error("Organization membership response is invalid")
  }

  return {
    memberships,
    selected_organization_id: selectedOrganizationId,
    selection_required: payload.selection_required,
  }
}

export async function signOutSupabase(): Promise<void> {
  const response = await fetch("/api/auth/supabase/logout", {
    method: "POST",
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("Supabase sign-out failed")
  }
}
