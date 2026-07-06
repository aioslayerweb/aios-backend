"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui"

type ShellErrorBoundaryProps = {
  children: ReactNode
}

type ShellErrorBoundaryState = {
  hasError: boolean
}

export class ShellErrorBoundary extends Component<ShellErrorBoundaryProps, ShellErrorBoundaryState> {
  public constructor(props: ShellErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(): ShellErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("AIOS workspace shell error boundary caught error", error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[320px] w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-canvas p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-semantic-error" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">Workspace Error</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Something went wrong while rendering this workspace view.
            </p>
          </div>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Reload Workspace
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
