import type { ReactNode } from "react"
import { ApplicationLayout } from "./application-layout"
import { PageWrapper } from "./page-wrapper"
import { ShellErrorBoundary } from "./shell-error-boundary"
import { NavigationProvider } from "@/contexts/navigation-context"

type WorkspaceLayoutProps = {
  children: ReactNode
  baseHref?: string
  hideWorkspaceHeader?: boolean
}

export function WorkspaceLayout({ children, baseHref = "/app", hideWorkspaceHeader = false }: WorkspaceLayoutProps) {
  return (
    <NavigationProvider baseHref={baseHref} hideWorkspaceHeader={hideWorkspaceHeader}>
      <ShellErrorBoundary>
        <ApplicationLayout>
          <PageWrapper className={baseHref === "/demo-platform" ? "!px-2 md:!px-6 lg:!px-8 xl:!px-10" : undefined}>
            {children}
          </PageWrapper>
        </ApplicationLayout>
      </ShellErrorBoundary>
    </NavigationProvider>
  )
}
