import { AgentSDKRegistry } from "@/src/sdk/agent-sdk/agent-sdk-registry"
import { DeveloperCLIRegistry } from "@/src/sdk/core/developer-cli"
import { developerExperienceProfile } from "@/src/sdk/core/developer-experience"
import { PublicAPIRegistry } from "@/src/sdk/core/public-api-registry"
import { ExtensionRegistry } from "@/src/sdk/extensions/extension-registry"
import { ExtensionLifecycleManager } from "@/src/sdk/extensions/extension-lifecycle"
import { KnowledgeProviderRegistry } from "@/src/sdk/knowledge-sdk/knowledge-provider-registry"
import { MarketplaceRegistry } from "@/src/sdk/marketplace/marketplace-registry"
import { ConnectorRegistry } from "@/src/sdk/mcp-sdk/connector-registry"
import { MemoryProviderRegistry } from "@/src/sdk/memory-sdk/memory-provider-registry"
import { PackageRegistry } from "@/src/sdk/packages/package-registry"
import { PluginRegistry } from "@/src/sdk/plugins/plugin-registry"
import { UIExtensionRegistry } from "@/src/sdk/ui-sdk/ui-extension-registry"
import { createSdkId, sdkNow } from "@/src/sdk/utils/sdk-id"
import { WorkflowSDKRegistry } from "@/src/sdk/workflow-sdk/workflow-sdk-registry"
import type { ExtensionSecurityProfile, SDKLanguageTarget, SDKModuleName, SDKPlatformState } from "@/src/sdk/types"

const sdkModules: SDKModuleName[] = [
  "core",
  "authentication",
  "organizations",
  "memory",
  "knowledge",
  "workflows",
  "agents",
  "models",
  "prompts",
  "policies",
  "runtime",
  "mcp",
  "events",
  "search",
  "analytics",
]

const languageTargets: SDKLanguageTarget[] = ["typescript", "python", "java", "go", "dotnet", "other"]

export class SDKPlatform {
  readonly publicApi = new PublicAPIRegistry()
  readonly plugins = new PluginRegistry()
  readonly extensions = new ExtensionRegistry()
  readonly packages = new PackageRegistry()
  readonly marketplace = new MarketplaceRegistry()
  readonly agents = new AgentSDKRegistry()
  readonly workflows = new WorkflowSDKRegistry()
  readonly knowledgeProviders = new KnowledgeProviderRegistry()
  readonly memoryProviders = new MemoryProviderRegistry()
  readonly connectors = new ConnectorRegistry()
  readonly uiExtensions = new UIExtensionRegistry()
  readonly extensionLifecycle = new ExtensionLifecycleManager()
  readonly developerCli = new DeveloperCLIRegistry()

  private readonly securityProfiles = new Map<string, ExtensionSecurityProfile>()

  constructor() {
    this.seedFoundation()
  }

  registerSecurityProfile(profile: ExtensionSecurityProfile): void {
    this.securityProfiles.set(profile.pluginId, profile)
  }

  snapshot(): SDKPlatformState {
    return {
      languageTargets,
      publicApis: this.publicApi.list(),
      plugins: this.plugins.list(),
      extensions: this.extensions.list(),
      agents: this.agents.list(),
      workflows: this.workflows.list(),
      knowledgeProviders: this.knowledgeProviders.list(),
      memoryProviders: this.memoryProviders.list(),
      connectors: this.connectors.list(),
      uiExtensions: this.uiExtensions.list(),
      packages: this.packages.list(),
      marketplaceListings: this.marketplace.listListings(),
      marketplaceReviews: this.marketplace.listReviews(),
      marketplacePolicies: this.marketplace.listPolicies(),
      marketplaceInstalls: this.marketplace.listInstalls(),
      securityProfiles: Array.from(this.securityProfiles.values()),
      developerTooling: developerExperienceProfile,
    }
  }

  private seedFoundation(): void {
    sdkModules.forEach((moduleName) => {
      this.publicApi.register({
        id: createSdkId(`api-${moduleName}`),
        module: moduleName,
        name: `${moduleName}.v1`,
        description: `Stable ${moduleName} SDK public surface`,
        version: { major: 1, minor: 0, patch: 0 },
        deprecated: false,
        backwardCompatibleSince: "1.0.0",
      })
    })

    this.plugins.register({
      id: createSdkId("plugin-enterprise-agent-pack"),
      name: "Enterprise Agent Pack",
      version: "1.0.0",
      author: "AIOS",
      organization: "AIOS Core",
      description: "Reference plugin for agent, workflow, and dashboard extensions.",
      scopes: ["agents", "workflows", "dashboards", "commands"],
      permissions: ["agents:execute", "workflows:register", "dashboards:extend"],
      minPlatformVersion: "1.0.0",
      signed: true,
    })

    const plugin = this.plugins.list()[0]
    if (plugin) {
      this.extensions.register({
        id: createSdkId("ext-agent-lifecycle"),
        pluginId: plugin.id,
        point: "lifecycle-hooks",
        title: "Agent lifecycle extension",
        enabled: true,
      })

      this.extensions.register({
        id: createSdkId("ext-command-registration"),
        pluginId: plugin.id,
        point: "command-registration",
        title: "Command pack extension",
        enabled: true,
      })

      this.uiExtensions.register({
        id: createSdkId("ui-runtime-center-widget"),
        pluginId: plugin.id,
        target: "runtime-center",
        title: "Runtime Center Plugin Widget",
        route: "/app/runtime-center/extensions/widget",
        enabled: true,
      })

      this.registerSecurityProfile({
        pluginId: plugin.id,
        sandboxed: true,
        permissionValidated: true,
        rbacCompliant: true,
        roleIntelligenceCompliant: true,
        tenantIsolationVerified: true,
        policyEnforced: true,
        auditLoggingEnabled: true,
        digitallySigned: true,
      })

      this.extensions.listByPlugin(plugin.id).forEach((extension) => {
        this.extensionLifecycle.transition(extension, "registered", "Extension registered")
        this.extensionLifecycle.transition(extension, "loaded", "Extension loaded")
        this.extensionLifecycle.transition(extension, "started", "Extension started")
      })
    }

    this.agents.register({
      id: createSdkId("agent-sdk-executive-advisor"),
      name: "Executive Advisor Agent",
      version: "1.0.0",
      metadata: {
        owner: "AIOS",
        organization: "AIOS Core",
        description: "Reference AIOS-native agent SDK package",
      },
      capabilities: [
        { id: "cap-decision", title: "Decision Guidance", description: "Guides executive decisions with evidence." },
      ],
      tools: ["decision.search", "report.generate"],
      prompts: ["executive-briefing-default"],
      policies: ["enterprise-baseline"],
      memoryAccess: "read-write",
      knowledgeAccess: "read-write",
      mcpAccess: "read",
      observabilityEnabled: true,
    })

    this.workflows.register({
      id: createSdkId("workflow-sdk-approval"),
      name: "Approval Workflow Pack",
      version: "1.0.0",
      triggers: ["event", "manual", "schedule"],
      conditions: ["policy-approved", "risk-below-threshold"],
      actions: ["route-approval", "notify-stakeholders", "persist-audit"],
      retries: 3,
      scheduling: "cron",
      approvalsRequired: true,
      rollbackSupported: true,
      validationRules: ["tenant-isolation", "rbac-compliance"],
    })

    this.knowledgeProviders.register({
      id: createSdkId("knowledge-sharepoint"),
      name: "SharePoint Knowledge Provider",
      providerType: "sharepoint",
      version: "1.0.0",
      supportsSearch: true,
      supportsSync: true,
    })

    this.memoryProviders.register({
      id: createSdkId("memory-hybrid"),
      name: "Hybrid Enterprise Memory Provider",
      providerType: "hybrid-storage",
      version: "1.0.0",
      supportsIsolation: true,
      supportsEncryption: true,
    })

    this.connectors.register({
      id: createSdkId("mcp-connector-enterprise-crm"),
      name: "Enterprise CRM MCP Connector",
      version: "1.0.0",
      authModes: ["oauth", "api-key"],
      supportsDiscovery: true,
      supportsHealthChecks: true,
      toolsExposed: ["crm.search", "crm.update"],
      resourcesExposed: ["crm.accounts", "crm.opportunities"],
      promptsExposed: ["crm-opportunity-summary"],
      supportsStreaming: true,
      compatibility: {
        minMcpVersion: "1.0.0",
      },
    })

    this.packages.register({
      name: "@aios/sdk-enterprise-agent-pack",
      version: "1.0.0",
      author: "AIOS",
      organization: "AIOS Core",
      dependencies: ["@aios/sdk-core"],
      permissions: ["agents:execute", "workflows:register"],
      capabilities: ["agent-lifecycle", "workflow-extensions", "dashboard-widgets"],
      compatibility: {
        minPlatformVersion: "1.0.0",
      },
      license: "Commercial",
      signature: "signed-sha256-reference",
      releaseHistory: [`1.0.0 (${sdkNow()})`],
    })

    this.marketplace.publishListing({
      id: createSdkId("listing-agent-pack"),
      packageName: "@aios/sdk-enterprise-agent-pack",
      version: "1.0.0",
      summary: "Enterprise-ready agent and workflow extension pack",
      category: "Agents",
      approved: true,
      installCount: 12,
      averageRating: 4.8,
      requiresOrgApproval: true,
    })

    const listing = this.marketplace.listListings()[0]
    if (listing) {
      this.marketplace.setOrganizationPolicy({
        organizationId: "org-default",
        requireApproval: true,
        allowUnsignedPackages: false,
        allowedCategories: ["Agents", "Workflows", "Developer Tools"],
        blockedPackages: [],
      })

      this.marketplace.addReview({
        id: createSdkId("review-agent-pack"),
        listingId: listing.id,
        reviewer: "platform-admin",
        rating: 5,
        comment: "Strong enterprise controls and onboarding quality.",
        createdAt: sdkNow(),
      })

      this.marketplace.install({
        id: createSdkId("install-agent-pack"),
        organizationId: "org-default",
        listingId: listing.id,
        version: listing.version,
        installedAt: sdkNow(),
        status: "installed",
      })
    }

    this.developerCli.registerCommand({
      name: "aios-sdk init",
      description: "Initialize an AIOS SDK extension package",
      category: "scaffold",
    })
    this.developerCli.registerCommand({
      name: "aios-sdk diagnose",
      description: "Run extension diagnostics and compatibility checks",
      category: "diagnostics",
    })
    this.developerCli.registerTemplate({
      id: createSdkId("template-agent"),
      name: "Agent SDK Template",
      description: "Starter template for AIOS-native agent extensions",
      language: "typescript",
    })
    this.developerCli.registerTemplate({
      id: createSdkId("template-workflow"),
      name: "Workflow SDK Template",
      description: "Starter template for workflow packages",
      language: "typescript",
    })
  }
}
