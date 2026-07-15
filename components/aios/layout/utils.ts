export type ClassValue = string | false | null | undefined

export function cx(...parts: ClassValue[]) {
  return parts.filter(Boolean).join(" ")
}
