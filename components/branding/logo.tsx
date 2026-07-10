import Image from "next/image";
import { brandAssets } from "./brand-assets";
import { cn } from "@/utils";

type BrandLogoVariant = "primary" | "square";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "primary",
  width = 142,
  height = 34,
  className,
  alt = "AIOS",
  priority = false,
}: BrandLogoProps) {
  const src = variant === "square" ? brandAssets.logoSquare : brandAssets.logoPrimary;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority={priority}
    />
  );
}
