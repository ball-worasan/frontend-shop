"use client";
import { useId, type InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };
export function Input({ label, hint, error, id, className = "", "aria-describedby": describedBy, ...props }: Props) {
  const generated = useId();
  const inputId = id ?? generated;
  const description = [describedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">{label}</label>
      <input {...props} id={inputId} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={description}
        className={`min-h-12 w-full min-w-0 rounded-control border bg-background px-4 text-base text-foreground placeholder:text-muted disabled:opacity-50 ${error ? "border-danger" : "border-control-border"} ${className}`} />
      {hint && <p id={`${inputId}-hint`} className="text-sm text-muted">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="text-sm text-danger">{error}</p>}
    </div>
  );
}
