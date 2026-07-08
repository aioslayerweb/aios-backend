"use client"

import { useKeyboardShortcuts as useNativeKeyboardShortcuts } from "@/utils/keyboard"

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useNativeKeyboardShortcuts(shortcuts)
}
