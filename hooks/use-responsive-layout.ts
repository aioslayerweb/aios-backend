"use client";

import { useBreakpoint } from "@/hooks";

export function useResponsiveLayout() {
  const { isMobile, isTablet } = useBreakpoint();

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}
