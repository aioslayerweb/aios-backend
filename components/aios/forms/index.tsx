import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cx } from "@/components/aios/layout/utils"

export function AIOSFormGroup({ label, children, className, hint, error }: { label: string; children: ReactNode; className?: string; hint?: string; error?: string }) {
  return (
    <label className={cx("block text-sm font-medium text-[color:var(--public-color-text)]", className)}>
      {label}
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-xs text-[color:var(--public-color-danger)]">{error}</p> : hint ? <p className="mt-2 text-xs text-[color:var(--public-color-text-soft)]">{hint}</p> : null}
    </label>
  )
}

export function AIOSInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("public-input", props.className)} />
}

export function AIOSTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("public-input min-h-[160px] py-3", props.className)} />
}

export function AIOSSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx("public-input", props.className)} />
}

export function AIOSCheckbox({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={cx("flex items-center gap-3 text-sm text-[color:var(--public-color-text)]", className)}><input {...props} type="checkbox" className="h-4 w-4 rounded border-[color:var(--public-color-border)]" />{label}</label>
}

export function AIOSRadio({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={cx("flex items-center gap-3 text-sm text-[color:var(--public-color-text)]", className)}><input {...props} type="radio" className="h-4 w-4 border-[color:var(--public-color-border)]" />{label}</label>
}
