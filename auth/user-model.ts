export type TemporaryAuthUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

export function createTemporaryAuthUser(input: Partial<TemporaryAuthUser> & Pick<TemporaryAuthUser, "email">): TemporaryAuthUser {
  const localPart = input.email.split("@")[0] ?? "user"
  const generatedId = input.id ?? `user-${localPart.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
  const generatedName = input.name ?? localPart.replace(/[-_.]/g, " ").replace(/\b\w/g, (match) => match.toUpperCase())

  return {
    id: generatedId,
    name: generatedName,
    email: input.email,
    image: input.image ?? null,
  }
}
