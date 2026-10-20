import type { ReactNode } from "react";
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-control bg-raised ${className}`} />;
}
export function LoadingState({ label = "กำลังโหลดข้อมูล" }: { label?: string }) {
  return <div role="status" className="space-y-4 p-6"><span className="text-muted">{label}</span><Skeleton className="h-6 w-2/3" /><Skeleton className="h-24 w-full" /></div>;
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="rounded-card border border-border bg-surface p-8 text-center"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-muted">{description}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
export function ErrorState({ title = "โหลดข้อมูลไม่สำเร็จ", description, action }: { title?: string; description: string; action?: ReactNode }) {
  return <div role="alert" className="rounded-card border border-danger/50 bg-surface p-6"><h2 className="text-xl font-semibold text-danger">{title}</h2><p className="mt-2 text-muted">{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}
