import type { Config } from "tailwindcss"
import { breakpoints, containers, radius, shadows } from "./theme/tokens"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./theme/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: `${breakpoints.sm}px`,
      md: `${breakpoints.md}px`,
      lg: `${breakpoints.lg}px`,
      xl: `${breakpoints.xl}px`,
      "2xl": `${breakpoints["2xl"]}px`,
      "3xl": `${breakpoints["3xl"]}px`,
      "4xl": `${breakpoints["4xl"]}px`,
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: containers.sm,
        md: containers.md,
        lg: containers.lg,
        xl: containers.xl,
        "2xl": containers["2xl"],
        "3xl": containers["3xl"],
        "4xl": containers["4xl"],
      },
    },
    extend: {
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          hover: "var(--color-brand-primary-hover)",
          active: "var(--color-brand-primary-active)",
          navy: "var(--color-brand-navy)",
          soft: "var(--color-brand-soft)",
          subtle: "var(--color-brand-subtle)",
        },
        surface: {
          app: "var(--color-bg-app)",
          canvas: "var(--color-bg-canvas)",
          raised: "var(--color-surface-raised)",
          muted: "var(--color-surface-muted)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",
        },
        semantic: {
          success: "var(--color-semantic-success)",
          warning: "var(--color-semantic-warning)",
          error: "var(--color-semantic-error)",
          info: "var(--color-semantic-info)",
        },
      },
      fontFamily: {
        sans: [
          "Satoshi",
          "Plus Jakarta Sans",
          "Segoe UI",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
        mono: ["IBM Plex Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
      },
      boxShadow: {
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        normal: "400ms",
        slow: "800ms",
      },
    },
  },
  plugins: [],
}

export default config
