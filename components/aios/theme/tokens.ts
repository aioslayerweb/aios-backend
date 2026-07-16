const PUBLIC_SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiospilot.com"

function publicUrl(path: string) {
  return new URL(path, PUBLIC_SITE_ORIGIN).toString()
}

export const aiosTheme = {
  colors: {
    primary: "#1976FF",
    primaryHover: "#0F68EE",
    primaryActive: "#0A58D1",
    navy: "#07133D",
    background: "#FFFFFF",
    backgroundSecondary: "#F7F9FC",
    surface: "rgba(255, 255, 255, 0.94)",
    surfaceGlass: "rgba(255, 255, 255, 0.72)",
    border: "#DCE5F6",
    borderStrong: "#C8D6F1",
    text: "#1E2E5A",
    textMuted: "#5F6F97",
    textSoft: "#7E8FB7",
    success: "#12A15A",
    warning: "#D38A17",
    danger: "#E25B52",
    neutral: "#8D9AB9",
  },
  spacing: {
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
    80: 80,
    96: 96,
    128: 128,
  },
  radius: {
    sm: 16,
    md: 22,
    lg: 30,
    xl: 40,
    pill: 999,
  },
  shadow: {
    soft: "0 18px 45px rgba(7, 19, 61, 0.06)",
    card: "0 24px 70px rgba(7, 19, 61, 0.08)",
    float: "0 32px 90px rgba(25, 118, 255, 0.14)",
    glass: "0 22px 60px rgba(7, 19, 61, 0.07)",
  },
  opacity: {
    subtle: 0.72,
    soft: 0.88,
    strong: 0.94,
  },
  typography: {
    displayXL: "clamp(3.5rem, 6vw, 6.5rem)",
    display: "clamp(3rem, 5vw, 5.25rem)",
    h1: "clamp(2.5rem, 4vw, 4.25rem)",
    h2: "clamp(2rem, 3vw, 3.25rem)",
    h3: "clamp(1.5rem, 2.2vw, 2.25rem)",
    h4: "clamp(1.25rem, 1.6vw, 1.5rem)",
    bodyLarge: "clamp(1.0625rem, 1.25vw, 1.25rem)",
    body: "1rem",
    small: "0.9375rem",
    caption: "0.75rem",
  },
  icons: {
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
  },
  motion: {
    hover: 0.2,
    state: 0.3,
    enter: 0.6,
    exit: 0.45,
    easing: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  zIndex: {
    header: 40,
    drawer: 80,
    modal: 100,
    overlay: 120,
  },
  borderWidth: {
    thin: 1,
    thick: 2,
  },
  containers: {
    default: 1200,
    large: 1340,
  },
} as const

export const aiosNavigationItems = [
  { label: "Home", href: publicUrl("/") },
  { label: "Universe", href: publicUrl("/universe") },
  { label: "Platform", href: publicUrl("/platform") },
  { label: "Architecture", href: publicUrl("/architecture") },
  { label: "Modules", href: publicUrl("/modules") },
  { label: "Products", href: publicUrl("/products") },
  { label: "Resources", href: publicUrl("/resources") },
  { label: "About", href: publicUrl("/about") },
  { label: "Contact", href: publicUrl("/contact") },
] as const

export const aiosFooterGroups = [
  {
    title: "Platform",
    links: [
      { label: "Universe", href: publicUrl("/universe") },
      { label: "Platform", href: publicUrl("/platform") },
      { label: "Architecture", href: publicUrl("/architecture") },
      { label: "Modules", href: publicUrl("/modules") },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Products", href: publicUrl("/products") },
      { label: "Resources", href: publicUrl("/resources") },
      { label: "About", href: publicUrl("/about") },
      { label: "Legal", href: publicUrl("/legal") },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Privacy", href: publicUrl("/privacy") },
      { label: "Terms", href: publicUrl("/terms") },
      { label: "Security", href: publicUrl("/security") },
      { label: "Pilot Program", href: publicUrl("/pilot") },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Book Demo", href: publicUrl("/contact") },
      { label: "Launch AIOS", href: publicUrl("/app") },
    ],
  },
] as const
