"use client"

import { type ReactNode } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { RuntimeProvider } from "@/contexts/runtime-context"
import { AgentWorkspaceProvider } from "@/contexts/agent-workspace-context"
import { MemoryProvider } from "@/contexts/memory-context"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { AIAssistantProvider } from "@/contexts/ai-assistant-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { CommandPaletteProvider } from "@/contexts/command-palette-context"
import { RuntimeStatusProvider } from "@/contexts/runtime-status-context"
import { ActivityFeedProvider } from "@/contexts/activity-feed-context"
import { RuntimeLiveProvider } from "@/contexts/runtime-live-context"
import { GlobalSearchProvider } from "@/contexts/global-search-context"
import { ExecutiveWorkspaceProvider } from "@/contexts/executive-workspace-context"
import { DecisionEngineProvider } from "@/contexts/decision-engine-context"
import { GovernanceProvider } from "@/contexts/governance-context"
import { KnowledgeGraphProvider } from "@/contexts/knowledge-graph-context"
import { ExecutiveReportsProvider } from "@/contexts/executive-reports-context"
import { SecurityProvider } from "@/contexts/security-context"
import { RoleIntelligenceProvider } from "@/contexts/role-intelligence-context"
import { OrganizationIntelligenceProvider } from "@/contexts/organization-intelligence-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { PromptOSProvider } from "@/contexts/prompt-os-context"
import { WorkflowBuilderProvider } from "@/contexts/workflow-builder-context"
import { OrchestratorProvider } from "@/contexts/orchestrator-context"
import { PlanningEngineProvider } from "@/contexts/planning-engine-context"
import { WorkspaceProvider } from "@/contexts/workspace-context"
import { SidebarProvider } from "@/contexts/sidebar-context"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RuntimeProvider>
        <SupabaseProvider>
          <MemoryProvider>
            <WorkspaceProvider>
              <SidebarProvider>
                <AIAssistantProvider>
                  <NotificationProvider>
                    <CommandPaletteProvider>
                      <RuntimeStatusProvider>
                          <RuntimeLiveProvider>
                            <ActivityFeedProvider>
                              <AgentWorkspaceProvider>
                                <GlobalSearchProvider>
                                  <ExecutiveWorkspaceProvider>
                                    <IntegrationProvider>
                                      <PromptOSProvider>
                                        <WorkflowBuilderProvider>
                                          <OrchestratorProvider>
                                            <PlanningEngineProvider>
                                              <DecisionEngineProvider>
                                                <GovernanceProvider>
                                                  <KnowledgeGraphProvider>
                                                    <ExecutiveReportsProvider>
                                                      <SecurityProvider>
                                                        <RoleIntelligenceProvider>
                                                          <OrganizationIntelligenceProvider>{children}</OrganizationIntelligenceProvider>
                                                        </RoleIntelligenceProvider>
                                                      </SecurityProvider>
                                                    </ExecutiveReportsProvider>
                                                  </KnowledgeGraphProvider>
                                                </GovernanceProvider>
                                              </DecisionEngineProvider>
                                            </PlanningEngineProvider>
                                          </OrchestratorProvider>
                                        </WorkflowBuilderProvider>
                                      </PromptOSProvider>
                                    </IntegrationProvider>
                                  </ExecutiveWorkspaceProvider>
                                </GlobalSearchProvider>
                              </AgentWorkspaceProvider>
                            </ActivityFeedProvider>
                          </RuntimeLiveProvider>
                      </RuntimeStatusProvider>
                    </CommandPaletteProvider>
                  </NotificationProvider>
                </AIAssistantProvider>
              </SidebarProvider>
            </WorkspaceProvider>
          </MemoryProvider>
        </SupabaseProvider>
      </RuntimeProvider>
    </ThemeProvider>
  )
}
