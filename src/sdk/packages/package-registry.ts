import type { PackageMetadata } from "@/src/sdk/types"

export class PackageRegistry {
  private readonly packages = new Map<string, PackageMetadata>()

  register(metadata: PackageMetadata): void {
    this.packages.set(this.composeKey(metadata.name, metadata.version), metadata)
  }

  list(): PackageMetadata[] {
    return Array.from(this.packages.values())
  }

  find(name: string, version: string): PackageMetadata | undefined {
    return this.packages.get(this.composeKey(name, version))
  }

  private composeKey(name: string, version: string): string {
    return `${name}@${version}`
  }
}
