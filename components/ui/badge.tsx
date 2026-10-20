import type { ReactNode } from "react";
const tones = {
  neutral: "bg-raised text-muted",
  accent: "bg-primary/20 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof tones }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}>{children}</span>;
}
