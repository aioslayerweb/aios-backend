import type {
  MarketplaceInstallRecord,
  MarketplaceListing,
  MarketplaceReview,
  OrganizationMarketplacePolicy,
} from "@/src/sdk/types"

export class MarketplaceRegistry {
  private readonly listings = new Map<string, MarketplaceListing>()
  private readonly reviews = new Map<string, MarketplaceReview>()
  private readonly policies = new Map<string, OrganizationMarketplacePolicy>()
  private readonly installs = new Map<string, MarketplaceInstallRecord>()

  publishListing(listing: MarketplaceListing): void {
    this.listings.set(listing.id, listing)
  }

  addReview(review: MarketplaceReview): void {
    this.reviews.set(review.id, review)
  }

  listListings(approvedOnly = false): MarketplaceListing[] {
    const all = Array.from(this.listings.values())
    return approvedOnly ? all.filter((listing) => listing.approved) : all
  }

  listReviews(listingId?: string): MarketplaceReview[] {
    const all = Array.from(this.reviews.values())
    return listingId ? all.filter((review) => review.listingId === listingId) : all
  }

  setOrganizationPolicy(policy: OrganizationMarketplacePolicy): void {
    this.policies.set(policy.organizationId, policy)
  }

  listPolicies(): OrganizationMarketplacePolicy[] {
    return Array.from(this.policies.values())
  }

  install(record: MarketplaceInstallRecord): MarketplaceInstallRecord {
    const listing = this.listings.get(record.listingId)
    const policy = this.policies.get(record.organizationId)

    if (!listing) {
      const blocked = { ...record, status: "blocked" as const, reason: "Listing not found" }
      this.installs.set(blocked.id, blocked)
      return blocked
    }

    if (policy) {
      if (policy.blockedPackages.includes(listing.packageName)) {
        const blocked = { ...record, status: "blocked" as const, reason: "Package blocked by organization policy" }
        this.installs.set(blocked.id, blocked)
        return blocked
      }
      if (!policy.allowUnsignedPackages && !listing.approved) {
        const blocked = { ...record, status: "blocked" as const, reason: "Organization policy requires approved/signed packages" }
        this.installs.set(blocked.id, blocked)
        return blocked
      }
    }

    this.installs.set(record.id, record)
    return record
  }

  updateInstall(id: string, version: string): MarketplaceInstallRecord | undefined {
    const install = this.installs.get(id)
    if (!install) {
      return undefined
    }
    const updated = {
      ...install,
      version,
      status: "updated" as const,
    }
    this.installs.set(id, updated)
    return updated
  }

  listInstalls(organizationId?: string): MarketplaceInstallRecord[] {
    const all = Array.from(this.installs.values())
    return organizationId ? all.filter((install) => install.organizationId === organizationId) : all
  }

  updateApproval(listingId: string, approved: boolean): MarketplaceListing | undefined {
    const listing = this.listings.get(listingId)
    if (!listing) {
      return undefined
    }
    const updated = { ...listing, approved }
    this.listings.set(listingId, updated)
    return updated
  }
}
