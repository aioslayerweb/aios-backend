"use client"

import { type ReactNode } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { RuntimeProvider } from "@/contexts/runtime-context"
import { MemoryProvider } from "@/contexts/memory-context"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { CommandPaletteProvider } from "@/contexts/command-palette-context"
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
                <NotificationProvider>
                  <CommandPaletteProvider>{children}</CommandPaletteProvider>
                </NotificationProvider>
              </SidebarProvider>
            </WorkspaceProvider>
          </MemoryProvider>
        </SupabaseProvider>
      </RuntimeProvider>
    </ThemeProvider>
  )
}
