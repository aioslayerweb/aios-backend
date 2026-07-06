import type { ReactNode } from "react"
import { ApplicationLayout } from "./application-layout"
import { PageWrapper } from "./page-wrapper"
import { ShellErrorBoundary } from "./shell-error-boundary"

type WorkspaceLayoutProps = {
  children: ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <ShellErrorBoundary>
      <ApplicationLayout>
        <PageWrapper>{children}</PageWrapper>
      </ApplicationLayout>
    </ShellErrorBoundary>
  )
}
