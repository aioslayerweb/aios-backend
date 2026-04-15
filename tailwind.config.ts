import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#bfe3fd",
          300: "#93d1fb",
          400: "#5fb5f7",
          500: "#3b96f2",
          600: "#2578e7",
          700: "#1d63d5",
          800: "#1e50ac",
          900: "#1e4488",
          950: "#172b53",
        },
        navy: {
          700: "#1a3a6b",
          800: "#142d56",
          900: "#0f2040",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
