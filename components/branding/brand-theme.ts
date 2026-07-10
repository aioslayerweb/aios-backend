import { brandColors } from "./brand-colors";

export const brandTheme = {
  appName: "AIOS",
  titleTemplate: "%s | AIOS",
  defaultTitle: "AIOS",
  description:
    "AIOS enterprise operating system for executive intelligence, explainable recommendations, and autonomous workflows.",
  themeColor: brandColors.primary,
  fonts: {
    sans: ["Satoshi", "Plus Jakarta Sans", "Segoe UI", "SF Pro Text", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
    mono: ["IBM Plex Mono", "JetBrains Mono", "ui-monospace", "monospace"],
  },
} as const;
