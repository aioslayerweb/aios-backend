"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useMarketplace() {
  const platform = useSDKPlatform()

  return {
    listings: platform.marketplace.listListings(),
    approvedListings: platform.marketplace.listListings(true),
    reviews: platform.marketplace.listReviews(),
    publishListing: platform.marketplace.publishListing.bind(platform.marketplace),
    addReview: platform.marketplace.addReview.bind(platform.marketplace),
  }
}
