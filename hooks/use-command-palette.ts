"use client"

import { useCommandPaletteContext } from "@/contexts/command-palette-context"

export function useCommandPalette() {
  return useCommandPaletteContext()
}
