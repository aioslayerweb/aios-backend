export type Semver = {
  major: number
  minor: number
  patch: number
}

export function parseSemver(value: string): Semver | null {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    return null
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

export function bumpPatch(version: string): string {
  const parsed = parseSemver(version)
  if (!parsed) {
    return version
  }

  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`
}

export function bumpMinor(version: string): string {
  const parsed = parseSemver(version)
  if (!parsed) {
    return version
  }

  return `${parsed.major}.${parsed.minor + 1}.0`
}

export function bumpMajor(version: string): string {
  const parsed = parseSemver(version)
  if (!parsed) {
    return version
  }

  return `${parsed.major + 1}.0.0`
}
