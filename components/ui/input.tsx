import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { cn } from "@/utils"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("aios-input w-full", className)} {...props} />
  }
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn("aios-input min-h-28 w-full", className)} {...props} />
  }
)
