"use client"

import { type ReactNode, useMemo, useState } from "react"
import {
  Bot,
  Brain,
  Building2,
  Database,
  Home,
  Lightbulb,
  LineChart,
  ListChecks,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  useAIStatus,
  useBreakpoint,
  useCommandPalette,
  useNotificationCenter,
  useSidebar,
  useWorkspace,
} from "@/hooks"
import { workspaceItems, cn } from "@/utils"
import { useKeyboardShortcuts } from "@/utils/keyboard"
import { drawerVariants, pageVariants, panelVariants, slideUpVariants } from "@/theme"
import { Avatar, Breadcrumb, Button, Dropdown, LoadingSpinner, StatusIndicator } from "@/components/ui"
import { CommandPalette } from "@/components/command-palette"
import { NotificationBell, NotificationDrawer, NotificationToastHost } from "@/components/notifications"

const iconByKey = {
  home: Home,
  executive: Sparkles,
  corporate: Building2,
  sales: WalletCards,
  knowledge: Brain,
  memory: Database,
  agents: Bot,
  insights: LineChart,
  reports: ListChecks,
  settings: Settings,
} as const

function titleFromPath(pathname: string): string {
  if (pathname === "/app") {
    return "Home"
  }

  const segments = pathname.split("/").filter(Boolean)
  const last = segments[segments.length - 1] ?? "workspace"
  return last.charAt(0).toUpperCase() + last.slice(1)
}

function breadcrumbItems(pathname: string): Array<{ label: string; href?: string }> {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) {
    return [{ label: "Home", href: "/" }]
  }

  const items: Array<{ label: string; href?: string }> = [{ label: "AIOS", href: "/app" }]
  let href = ""

  for (let index = 0; index < segments.length; index += 1) {
    href += `/${segments[index]}`
    const raw = segments[index]
    const label = raw.charAt(0).toUpperCase() + raw.slice(1)
    items.push({
      label,
      href: index === segments.length - 1 ? undefined : href,
    })
  }

  return items
}

function WorkspaceHeader() {
  const pathname = usePathname()
  const title = titleFromPath(pathname)

  return (
    <div className="border-b border-border bg-surface-canvas px-4 py-4 md:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Workspace</p>
      <h1 className="mt-1 text-2xl font-semibold text-brand-navy">{title}</h1>
      <div className="mt-3">
        <Breadcrumb items={breadcrumbItems(pathname)} />
      </div>
    </div>
  )
}

function ShellTopBar() {
  const pathname = usePathname()
  const { isMobile, isTablet } = useBreakpoint()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileAiPanelOpen, setMobileAiPanelOpen] = useState(false)
  const { open } = useCommandPalette()
  const { unreadCount, drawerOpen, toggleDrawer, setDrawerOpen } = useNotificationCenter()
  const { aiStatus, memoryStatus, isConnected, isRunning } = useAIStatus()

  const currentWorkspaceTitle = useMemo(() => titleFromPath(pathname), [pathname])
  const breadcrumbs = useMemo(() => breadcrumbItems(pathname), [pathname])

  const quickActions = [
    {
      id: "new-insight",
      label: "New Insight",
      onSelect: () => open(),
    },
    {
      id: "start-agent",
      label: "Start Agent",
      onSelect: () => open(),
    },
    {
      id: "sync-memory",
      label: "Sync Memory",
      onSelect: () => open(),
    },
  ]

  return (
    <>
      <header className="sticky top-0 z-[var(--z-header)] border-b border-border bg-surface-canvas/90 backdrop-blur-sm">
        <div className="flex min-h-16 items-center gap-2 px-4 py-2 md:px-6 lg:px-8">
          {isMobile || isTablet ? (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open workspace navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
          ) : null}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-navy">AIOS Workspace</p>
            <p className="truncate text-xs text-text-muted">{currentWorkspaceTitle}</p>
            <div className="hidden lg:block">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>

          <button
            type="button"
            onClick={open}
            className="ml-2 inline-flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-border px-3 text-sm text-text-secondary hover:bg-surface-muted md:max-w-sm"
            aria-label="Open global search and command palette"
          >
            <Search className="h-4 w-4" />
            <span className="truncate">Search commands, modules, and signals</span>
            <span className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">⌘K</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Dropdown label="Quick Actions" items={quickActions} icon={<Lightbulb className="h-4 w-4" />} className="hidden md:block" />

            <NotificationBell unreadCount={unreadCount} onClick={toggleDrawer} />

            <div className="hidden items-center gap-1 md:flex">
              <StatusIndicator tone={isRunning ? "warning" : "success"} label={`AI ${aiStatus}`} />
              <StatusIndicator tone={memoryStatus === "synced" ? "success" : "warning"} label={`Memory ${memoryStatus}`} />
              <StatusIndicator tone={isConnected ? "success" : "error"} label={isConnected ? "Supabase online" : "Supabase offline"} />
            </div>

            <button
              type="button"
              onClick={() => setMobileAiPanelOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-surface-muted xl:hidden"
              aria-label="Open AI assistant panel"
            >
              <Bot className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 hover:bg-surface-muted"
              aria-label="Open user profile"
            >
              <Avatar name="AIOS Executive" className="h-7 w-7" />
              <span className="hidden text-xs font-medium text-text-secondary md:inline">Executive</span>
            </button>
          </div>
        </div>
      </header>

      <ShellMobileSidebarDrawer open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <ShellAdaptiveAiPanel open={mobileAiPanelOpen} onClose={() => setMobileAiPanelOpen(false)} />
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

function SidebarNavContent({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { setWorkspace } = useWorkspace()

  return (
    <nav className="flex-1 space-y-1 p-2" aria-label="Workspace modules">
      {workspaceItems.map((item) => {
        const Icon = iconByKey[item.icon]
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <motion.div key={item.key} whileHover={{ x: 2 }} transition={{ duration: 0.18 }}>
            <Link
              href={item.href}
              onClick={() => {
                setWorkspace(item.key)
                onNavigate?.()
              }}
              className={cn(
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                isActive
                  ? "bg-brand-subtle text-brand-navy"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              )}
              title={compact ? `${item.title} (${item.shortcut})` : undefined}
              aria-label={`${item.title} module`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className={cn(compact && "sr-only")}>{item.title}</span>
              <span className={cn("ml-auto rounded px-1.5 py-0.5 text-[10px] text-text-muted", compact && "sr-only")}>{item.shortcut}</span>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

function ShellSidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <motion.aside
      layout
      transition={{ duration: 0.2 }}
      className={cn("hidden border-r border-border bg-surface-canvas lg:flex lg:flex-col", collapsed ? "lg:w-20" : "lg:w-72")}
      aria-label="Primary workspace navigation"
    >
      <div className="flex h-14 items-center justify-between px-3">
        <span className={cn("text-sm font-semibold text-brand-navy", collapsed && "sr-only")}>AIOS</span>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <SidebarNavContent compact={collapsed} />
    </motion.aside>
  )
}

function ShellMobileSidebarDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/40 lg:hidden" onClick={onClose}>
          <motion.aside
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-80 max-w-[88vw] border-r border-border bg-surface-canvas"
            onClick={(event) => event.stopPropagation()}
            aria-label="Mobile workspace navigation drawer"
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold text-brand-navy">Navigation</span>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation drawer">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarNavContent onNavigate={onClose} />
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function AiPanelSections() {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-sm font-semibold text-brand-navy">AI Assistant</h2>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Current Context</h3>
        <p className="mt-1 text-sm text-text-secondary">Active workspace context and business signal summary placeholder.</p>
      </section>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">AI Suggestions</h3>
        <p className="mt-1 text-sm text-text-secondary">Recommended actions and confidence scores placeholder.</p>
      </section>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Running Agents</h3>
        <p className="mt-1 text-sm text-text-secondary">Agent execution stream placeholder.</p>
      </section>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Recent Memory</h3>
        <p className="mt-1 text-sm text-text-secondary">Latest memory writes and summaries placeholder.</p>
      </section>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Execution Status</h3>
        <p className="mt-1 text-sm text-text-secondary">Workflow execution progress placeholder.</p>
      </section>
      <section className="aios-card p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Future AI Conversation</h3>
        <p className="mt-1 text-sm text-text-secondary">Conversational assistant panel placeholder.</p>
      </section>
    </div>
  )
}

function ShellRightPanel() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      layout
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className={cn("hidden border-l border-border bg-surface-canvas xl:flex xl:flex-col", collapsed ? "xl:w-16" : "xl:w-96")}
      aria-label="AI assistant panel"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        <span className={cn("text-sm font-semibold text-brand-navy", collapsed && "sr-only")}>AI Panel</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((previous) => !previous)}
          aria-label={collapsed ? "Expand AI panel" : "Collapse AI panel"}
        >
          {collapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </Button>
      </div>

      {collapsed ? <div className="p-3 text-xs text-text-muted">AI</div> : <AiPanelSections />}
    </motion.aside>
  )
}

function ShellAdaptiveAiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isMobile } = useBreakpoint()

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/40 xl:hidden" onClick={onClose}>
          {isMobile ? (
            <motion.section
              variants={slideUpVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 max-h-[78vh] overflow-y-auto rounded-t-2xl border border-border bg-surface-canvas"
              onClick={(event) => event.stopPropagation()}
              aria-label="Mobile AI assistant bottom sheet"
            >
              <div className="flex h-12 items-center justify-between border-b border-border px-4">
                <span className="text-sm font-semibold text-brand-navy">AI Assistant</span>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close AI panel">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AiPanelSections />
            </motion.section>
          ) : (
            <motion.aside
              variants={drawerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="ml-auto h-full w-96 max-w-[88vw] border-l border-border bg-surface-canvas"
              onClick={(event) => event.stopPropagation()}
              aria-label="Tablet AI assistant slide-over panel"
            >
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="text-sm font-semibold text-brand-navy">AI Assistant</span>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close AI panel">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AiPanelSections />
            </motion.aside>
          )}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function ShellStatusBar() {
  const { aiStatus, memoryStatus, isConnected, isRunning } = useAIStatus()

  const statusItems: Array<{
    label: string
    value: string
    tone: "success" | "warning" | "error" | "info" | "neutral"
  }> = [
    { label: "AI Runtime", value: aiStatus, tone: isRunning ? "warning" : "success" },
    { label: "Memory", value: memoryStatus, tone: memoryStatus === "synced" ? "success" : "warning" },
    { label: "Supabase", value: isConnected ? "online" : "offline", tone: isConnected ? "success" : "error" },
    { label: "API", value: "healthy", tone: "success" },
    { label: "Sync", value: memoryStatus === "syncing" ? "active" : "idle", tone: memoryStatus === "syncing" ? "warning" : "neutral" },
    { label: "Background Tasks", value: isRunning ? "running" : "idle", tone: isRunning ? "warning" : "neutral" },
  ]

  return (
    <footer className="border-t border-border bg-surface-canvas px-4 py-2 text-xs md:px-6 lg:px-8" aria-label="System status bar">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {statusItems.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2 text-text-muted">
            <StatusIndicator tone={item.tone} label={`${item.label}: ${item.value}`} />
          </span>
        ))}
      </div>
    </footer>
  )
}

function GlobalLoadingOverlay() {
  const { isRunning, memoryStatus } = useAIStatus()
  const show = isRunning || memoryStatus === "syncing"

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="pointer-events-none fixed inset-0 z-[var(--z-floating)] flex items-center justify-center bg-slate-900/20"
          aria-live="polite"
          aria-label="Global loading state"
        >
          <div className="pointer-events-auto rounded-lg border border-border bg-surface-canvas px-4 py-3 shadow-lg">
            <LoadingSpinner label={isRunning ? "AI runtime executing" : "Memory syncing"} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

type ApplicationLayoutProps = {
  children: ReactNode
}

export function ApplicationLayout({ children }: ApplicationLayoutProps) {
  const { open, close } = useCommandPalette()

  useKeyboardShortcuts({
    "mod+k": open,
    escape: close,
  })

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <div className="flex min-h-screen">
        <ShellSidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <ShellTopBar />
          <WorkspaceHeader />
          <motion.main
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="min-h-0 flex-1 overflow-y-auto bg-surface-app"
            aria-label="Main content area"
          >
            {children}
          </motion.main>
          <ShellStatusBar />
        </div>

        <ShellRightPanel />
      </div>

      <CommandPalette />
      <NotificationToastHost />
      <GlobalLoadingOverlay />
    </div>
  )
}
