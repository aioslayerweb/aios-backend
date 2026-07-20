"use client"

import { type ReactNode, useMemo, useState } from "react"
import {
  Activity,
  Bot,
  Brain,
  Building2,
  Command,
  Database,
  Home,
  Lightbulb,
  LineChart,
  ListChecks,
  Menu,
  Workflow,
  Search,
  Settings,
  Sparkles,
  WalletCards,
  X,
  Network,
  BrainCircuit,
  ShieldCheck,
  Users,
  User,
  Shield,
  ClipboardList,
  KeyRound,
  PlugZap,
  Blocks,
  Wrench,
  FolderTree,
  FileText,
  HeartPulse,
  Route,
  Cpu,
  Code2,
  Atom,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AIOSCaption, AIOSH4, AIOSSmall } from "@/src/components/aios"
import {
  useAIStatus,
  useAIAssistant,
  useBreakpoint,
  useCommandPalette,
  useNotificationCenter,
  useSidebar,
  useWorkspace,
} from "@/hooks"
import { workspaceItems, cn } from "@/utils"
import { useKeyboardShortcuts } from "@/utils/keyboard"
import { drawerVariants, pageVariants } from "@/theme"
import { Avatar, Breadcrumb, Button, Dropdown, LoadingSpinner, StatusIndicator } from "@/components/ui"
import { CommandPalette } from "@/components/command-palette"
import { AIAssistantPanel } from "@/components/ai-assistant"
import { NotificationBell, NotificationDrawer, NotificationToastHost } from "@/components/notifications"
import { RuntimeStatusBar } from "@/components/runtime-status"
import { BrandLogo } from "@/components/branding"

const iconByKey = {
  home: Home,
  executive: Sparkles,
  commands: Command,
  corporate: Building2,
  blueprint: Network,
  qbi: Atom,
  sales: WalletCards,
  knowledge: Brain,
  memory: Database,
  agents: Bot,
  governance: ShieldCheck,
  integrations: PlugZap,
  decisions: BrainCircuit,
  intelligence: LineChart,
  activity: Activity,
  prompt: Sparkles,
  workflow: Workflow,
  orchestrator: Network,
  planning: BrainCircuit,
  insights: LineChart,
  reports: ListChecks,
  settings: Settings,
  mcp: PlugZap,
  "mcp-registry": Blocks,
  "mcp-tools": Wrench,
  "mcp-resources": FolderTree,
  "mcp-prompts": FileText,
  "mcp-health": HeartPulse,
  "mcp-gateway": Route,
  "runtime-center": Cpu,
  "developer-center": Code2,
  security: ShieldCheck,
  organizations: Users,
  users: User,
  teams: Users,
  roles: Shield,
  permissions: Shield,
  audit: ClipboardList,
  "api-keys": KeyRound,
  "sales-intelligence": WalletCards,
  "finance-intelligence": LineChart,
  operations: Workflow,
  hr: Users,
  "customer-intelligence": Users,
} as const

const workspaceLabels: Record<string, string> = {
  "/app": "Dashboard",
  "/app/executive": "Executive Center",
  "/app/commands": "Command Center",
  "/app/agents": "Agent Studio",
  "/app/workflows": "Workflow Builder",
  "/app/memory": "Memory Center",
  "/app/knowledge": "Knowledge Center",
  "/app/decisions": "Decision Center",
  "/app/intelligence": "Intelligence Center",
  "/app/corporate": "Organization Center",
  "/app/blueprint": "Business Blueprint Center",
  "/app/qbi": "QBI Center",
  "/app/sales-intelligence": "Sales Intelligence Center",
  "/app/finance-intelligence": "Finance Intelligence Center",
  "/app/operations": "Operations Intelligence Center",
  "/app/hr": "HR Intelligence Center",
  "/app/customer-intelligence": "Customer Intelligence Center",
  "/app/integrations": "Integrations",
  "/app/activity": "Activity",
  "/app/reports": "Reports",
  "/app/planning": "Planning",
  "/app/governance": "Governance",
  "/app/mcp": "MCP",
  "/app/mcp/registry": "MCP Registry",
  "/app/mcp/tools": "MCP Tools",
  "/app/mcp/resources": "MCP Resources",
  "/app/mcp/prompts": "MCP Prompts",
  "/app/mcp/health": "MCP Health",
  "/app/mcp/gateway": "MCP Gateway",
  "/app/prompt-os": "Prompt OS",
  "/app/security": "Security",
  "/app/settings": "Settings",
  "/app/organizations": "Organizations",
  "/app/users": "Users",
  "/app/teams": "Teams",
  "/app/roles": "Roles",
  "/app/permissions": "Permissions",
  "/app/audit": "Audit",
  "/app/api-keys": "API Keys",
  "/app/runtime-center": "Runtime Center",
  "/app/developer-center": "Developer Center",
}

function resolveWorkspaceLabel(pathname: string): string {
  if (workspaceLabels[pathname]) {
    return workspaceLabels[pathname]
  }

  const segments = pathname.split("/").filter(Boolean)
  const last = segments[segments.length - 1] ?? "workspace"
  return last
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function titleFromPath(pathname: string): string {
  return resolveWorkspaceLabel(pathname)
}

function breadcrumbItems(pathname: string): Array<{ label: string; href?: string }> {
  return [
    { label: "Home", href: "/app" },
    { label: resolveWorkspaceLabel(pathname) },
  ]
}

function WorkspaceHeader() {
  const pathname = usePathname()
  const title = titleFromPath(pathname)

  return (
    <div className="border-b border-border bg-surface-canvas px-4 py-4 md:px-6 lg:px-8">
      <AIOSCaption className="font-medium uppercase tracking-wide text-text-muted">Workspace</AIOSCaption>
      <AIOSH4 className="mt-1 text-brand-navy">{title}</AIOSH4>
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
  const { setOpen: setAIPanelOpen } = useAIAssistant()
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
            <AIOSSmall className="truncate font-semibold text-brand-navy">AIOS Workspace</AIOSSmall>
            <AIOSCaption className="truncate text-text-muted">{currentWorkspaceTitle}</AIOSCaption>
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

            <NotificationBell unreadCount={unreadCount} onClick={toggleDrawer} open={drawerOpen} />

            <div className="hidden items-center gap-1 md:flex">
              <StatusIndicator tone={isRunning ? "warning" : "success"} label={`AI ${aiStatus}`} />
              <StatusIndicator tone={memoryStatus === "synced" ? "success" : "warning"} label={`Memory ${memoryStatus}`} />
              <StatusIndicator tone={isConnected ? "success" : "error"} label={isConnected ? "Supabase online" : "Supabase offline"} />
            </div>

            <button
              type="button"
              onClick={() => setAIPanelOpen(true)}
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
        const Icon = iconByKey[item.icon as keyof typeof iconByKey] ?? Sparkles
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
              {item.status === "future" ? (
                <span
                  className={cn(
                    "rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted",
                    compact && "sr-only"
                  )}
                  aria-label={`${item.title} is a roadmap module`}
                >
                  {item.badgeLabel ?? "Roadmap"}
                </span>
              ) : null}
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.aside
      layout
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
      className={cn("hidden border-r border-border bg-surface-canvas lg:flex lg:flex-col", collapsed ? "lg:w-20" : "lg:w-72")}
      aria-label="Primary workspace navigation"
    >
      <div className="flex h-14 items-center justify-between px-3">
        <div className={cn("flex items-center", collapsed && "sr-only")}>
          <BrandLogo width={110} height={26} />
        </div>
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
        <div
          className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/40 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          role="presentation"
        >
          <motion.aside
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-80 max-w-[88vw] border-r border-border bg-surface-canvas"
            onClick={(event) => event.stopPropagation()}
            aria-label="Mobile workspace navigation drawer"
            aria-modal="true"
            role="dialog"
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <BrandLogo width={102} height={24} />
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

function ShellStatusBar() {
  return <RuntimeStatusBar />
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
  const { open: aiPanelOpen, setOpen: setAIPanelOpen } = useAIAssistant()
  const { drawerOpen, setDrawerOpen } = useNotificationCenter()
  const { isDesktop, isMobile } = useBreakpoint()
  const pathname = usePathname()

  useKeyboardShortcuts({
    "mod+k": open,
    escape: () => {
      close()
      setDrawerOpen(false)
    },
    n: () => setDrawerOpen(true),
  })

  const mobileNavItems = useMemo(() => [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/executive", label: "Executive", icon: Sparkles },
    { href: "/app/intelligence", label: "Intelligence", icon: LineChart },
    { href: "/app/agents", label: "Agents", icon: Bot },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ], [])

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen">
        <ShellSidebar />

        <div className={cn("flex min-h-screen min-w-0 flex-1 flex-col", drawerOpen && isDesktop && "pr-[360px]")}>
          <ShellTopBar />
          <WorkspaceHeader />
          <motion.main
            id="main-content"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="min-h-0 flex-1 overflow-y-auto bg-surface-app pb-20 lg:pb-0"
            aria-label="Main content area"
            tabIndex={-1}
          >
            {children}
          </motion.main>
          <ShellStatusBar />
        </div>

        <AIAssistantPanel mode="desktop" open={true} />
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[var(--z-header)] flex items-center justify-around border-t border-border bg-surface-canvas/95 pb-safe pt-2 backdrop-blur lg:hidden"
        aria-label="Mobile primary navigation"
      >
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                isActive
                  ? "text-brand-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <AIAssistantPanel
        mode={isMobile ? "mobile" : "tablet"}
        open={aiPanelOpen}
        onClose={() => setAIPanelOpen(false)}
      />

      <CommandPalette />
      <NotificationToastHost />
      <GlobalLoadingOverlay />
    </div>
  )
}
