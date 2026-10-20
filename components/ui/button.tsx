import type { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};
const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-control-border bg-surface text-foreground hover:bg-raised",
  ghost: "text-accent hover:bg-raised",
};
export function Button({ variant = "primary", loading = false, disabled, children, className = "", type = "button", ...props }: Props) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 py-2 text-base font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}>
      {loading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
      {loading && <span className="sr-only"> กำลังดำเนินการ</span>}
    </button>
  );
}
