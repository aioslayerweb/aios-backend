import { getSDKPlatform } from "@/src/sdk/core/sdk-singleton"
import type {
  AgentSDKDefinition,
  ExtensionContribution,
  MarketplaceInstallRecord,
  MarketplaceListing,
  PackageMetadata,
  PluginManifest,
  StablePublicAPI,
  WorkflowSDKDefinition,
} from "@/src/sdk/types"

// Public SDK client intentionally exposes only approved stable surfaces.
export class SDKPublicClient {
  private readonly platform = getSDKPlatform()

  listPublicAPIs(): StablePublicAPI[] {
    return this.platform.publicApi.listActive()
  }

  listPlugins(): PluginManifest[] {
    return this.platform.plugins.listSignedOnly()
  }

  listExtensions(): ExtensionContribution[] {
    return this.platform.extensions.list()
  }

  listPackages(): PackageMetadata[] {
    return this.platform.packages.list()
  }

  listMarketplaceListings(approvedOnly = true): MarketplaceListing[] {
    return this.platform.marketplace.listListings(approvedOnly)
  }

  listMarketplaceInstalls(): MarketplaceInstallRecord[] {
    return this.platform.marketplace.listInstalls()
  }

  listAgentSDKs(): AgentSDKDefinition[] {
    return this.platform.agents.list()
  }

  listWorkflowSDKs(): WorkflowSDKDefinition[] {
    return this.platform.workflows.list()
  }
}
