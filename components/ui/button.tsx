import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/utils"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success"

type ButtonSize = "sm" | "md" | "lg" | "icon"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-text-inverse hover:bg-brand-hover",
  secondary: "border border-border bg-surface-canvas text-text-primary hover:bg-surface-muted",
  ghost: "bg-transparent text-text-secondary hover:bg-surface-muted",
  outline: "border border-border-strong bg-transparent text-text-primary hover:bg-surface-muted",
  danger: "bg-semantic-error text-text-inverse hover:opacity-90",
  success: "bg-semantic-success text-text-inverse hover:opacity-90",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10 p-0",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-fast ease-standard disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  )
})
