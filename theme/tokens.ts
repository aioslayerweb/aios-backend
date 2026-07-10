export const colors = {
  brand: {
    primary: "#1C82F2",
    primaryHover: "#176EEA",
    primaryActive: "#125CC7",
    navy: "#02154A",
    blueSoft: "#4DA1FB",
    blueSubtle: "#EAF4FF",
  },
  semantic: {
    success: "#1F9D67",
    successSoft: "#EAF8F1",
    successText: "#0E5A3A",
    warning: "#C88719",
    warningSoft: "#FFF6E8",
    warningText: "#7A4C08",
    error: "#C73E3A",
    errorSoft: "#FDEDED",
    errorText: "#7F1D1D",
    info: "#1C82F2",
    infoSoft: "#EAF4FF",
    infoText: "#124EA8",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
} as const

export const typography = {
  families: {
    display: ["Satoshi", "Plus Jakarta Sans", "Segoe UI", "SF Pro Text", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
    body: ["Satoshi", "Plus Jakarta Sans", "Segoe UI", "SF Pro Text", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
    mono: ["IBM Plex Mono", "JetBrains Mono", "ui-monospace", "monospace"],
  },
  sizes: {
    hero: "64px",
    h1: "36px",
    h2: "30px",
    h3: "24px",
    h4: "20px",
    h5: "18px",
    h6: "16px",
    bodyLg: "18px",
    body: "16px",
    bodySm: "14px",
    caption: "12px",
  },
  lineHeights: {
    hero: "72px",
    h1: "44px",
    h2: "38px",
    h3: "32px",
    h4: "28px",
    h5: "26px",
    h6: "24px",
    bodyLg: "30px",
    body: "26px",
    bodySm: "22px",
    caption: "18px",
  },
} as const

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
  7: "40px",
  8: "48px",
  9: "64px",
  10: "80px",
  11: "96px",
  12: "120px",
} as const

export const radius = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  pill: "999px",
} as const

export const shadows = {
  sm: "0 1px 2px rgba(2, 21, 74, 0.06)",
  md: "0 6px 16px rgba(2, 21, 74, 0.08)",
  lg: "0 12px 32px rgba(2, 21, 74, 0.12)",
} as const

export const zIndex = {
  base: 0,
  header: 40,
  sidebar: 45,
  floatingPanel: 60,
  notification: 70,
  drawer: 80,
  commandPalette: 90,
  modal: 100,
} as const

export const motion = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
  },
  easing: {
    standard: [0.22, 0.61, 0.36, 1],
    in: [0.4, 0, 1, 1],
    out: [0, 0, 0.2, 1],
  },
} as const

export const breakpoints = {
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
  "3xl": 1920,
  "4xl": 2560,
} as const

export const containers = {
  sm: "100%",
  md: "100%",
  lg: "1200px",
  xl: "1280px",
  "2xl": "1440px",
  "3xl": "1600px",
  "4xl": "1760px",
} as const

export const grid = {
  columns: {
    mobile: 4,
    tablet: 8,
    laptop: 12,
    desktop: 12,
  },
  gutters: {
    mobile: "12px",
    tablet: "16px",
    desktop: "24px",
  },
} as const
