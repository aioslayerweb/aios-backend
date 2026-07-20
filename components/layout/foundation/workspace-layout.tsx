import type { ReactNode } from "react"
import { ApplicationLayout } from "./application-layout"
import { PageWrapper } from "./page-wrapper"
import { ShellErrorBoundary } from "./shell-error-boundary"
import { NavigationProvider } from "@/contexts/navigation-context"

type WorkspaceLayoutProps = {
  children: ReactNode
  baseHref?: string
}

export function WorkspaceLayout({ children, baseHref = "/app" }: WorkspaceLayoutProps) {
  return (
    <NavigationProvider baseHref={baseHref}>
      <ShellErrorBoundary>
        <ApplicationLayout>
          <PageWrapper>{children}</PageWrapper>
        </ApplicationLayout>
      </ShellErrorBoundary>
    </NavigationProvider>
  )
}
