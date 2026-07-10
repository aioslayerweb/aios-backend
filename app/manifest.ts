import type { MetadataRoute } from "next";
import { brandAssets, brandTheme } from "@/components/branding";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandTheme.appName,
    short_name: brandTheme.appName,
    description: brandTheme.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F9FAFB",
    theme_color: brandTheme.themeColor,
    icons: [
      {
        src: brandAssets.favicon,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: brandAssets.logoSquare,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
