import type { ReactNode } from "react"
import { cx } from "@/components/aios/layout/utils"

function makeTypography(tag: keyof JSX.IntrinsicElements, className: string) {
  return function TypographyComponent({ children, className: extra }: { children: ReactNode; className?: string }) {
    const Component = tag
    return <Component className={cx(className, extra)}>{children}</Component>
  }
}

export const AIOSDisplayXL = makeTypography("h1", "public-display-xl")
export const AIOSDisplay = makeTypography("h1", "public-display-lg")
export const AIOSH1 = makeTypography("h1", "public-h1")
export const AIOSH2 = makeTypography("h2", "public-h2")
export const AIOSH3 = makeTypography("h3", "public-h3")
export const AIOSH4 = makeTypography("h4", "public-h4")
export const AIOSBodyLarge = makeTypography("p", "public-body-lg")
export const AIOSBody = makeTypography("p", "public-body")
export const AIOSSmall = makeTypography("p", "public-small")
export const AIOSCaption = makeTypography("p", "public-caption")
