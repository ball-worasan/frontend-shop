"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/products";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/orders", label: "คำสั่งซื้อ" },
  { href: "/help", label: "ช่วยเหลือ" },
];

function Brand() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2 font-display text-lg font-bold tracking-wide text-foreground" aria-label="GAME SHOP หน้าแรก">
      <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-control bg-primary text-white">
        <svg viewBox="0 0 32 32" fill="none" className="size-6"><path d="M16 3 29 16 16 29 3 16 16 3Z" stroke="currentColor" strokeWidth="2"/><path d="m16 9 7 7-7 7-7-7 7-7Z" fill="currentColor"/></svg>
      </span>
      <span>GAME <span className="text-accent">SHOP</span></span>
    </Link>
  );
}

function SearchForm({ onSubmit, inputRef }: { onSubmit?: () => void; inputRef?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <form action="/products" method="get" onSubmit={onSubmit} role="search" className="flex w-full items-center gap-2">
      <label htmlFor={inputRef ? "mobile-product-search" : "desktop-product-search"} className="sr-only">ค้นหาสินค้า</label>
      <input ref={inputRef} id={inputRef ? "mobile-product-search" : "desktop-product-search"} name="q" type="search" placeholder="ค้นหาไอดีหรือไอเท็ม" autoComplete="off"
        className="min-h-12 min-w-0 flex-1 rounded-control border border-control-border bg-surface px-4 text-base text-foreground placeholder:text-muted" />
      <button type="submit" className="min-h-12 rounded-control bg-primary px-4 font-semibold text-white hover:bg-primary-hover">ค้นหา</button>
    </form>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!menuOpen || !dialog) return;
    const trigger = menuButtonRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="shop-container flex min-h-18 items-center gap-5">
        <Brand />
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-5 lg:flex">
          {links.slice(0, 2).map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
              className={`whitespace-nowrap text-sm font-medium hover:text-accent ${pathname === link.href ? "text-accent" : "text-muted"}`}>{link.label}</Link>
          ))}
          <details key={pathname} className="group relative">
            <summary className="cursor-pointer list-none text-sm font-medium text-muted hover:text-accent">เลือกเกม <span aria-hidden="true">⌄</span></summary>
            <div className="absolute left-0 top-full mt-4 min-w-48 rounded-card border border-border bg-surface p-2 shadow-xl">
              {games.map((game) => <Link key={game.slug} href={`/games/${game.slug}`} className="block rounded-control px-3 py-3 text-sm hover:bg-raised">{game.name}</Link>)}
            </div>
          </details>
        </nav>
        <div className="ml-auto hidden min-w-48 max-w-sm flex-1 md:block"><SearchForm /></div>
        <nav aria-label="บัญชีและความช่วยเหลือ" className="hidden items-center gap-4 xl:flex">
          <Link href="/orders" aria-current={pathname === "/orders" ? "page" : undefined} className="whitespace-nowrap text-sm text-muted hover:text-accent">คำสั่งซื้อ</Link>
          <Link href="/help" aria-current={pathname === "/help" ? "page" : undefined} className="whitespace-nowrap text-sm text-muted hover:text-accent">ช่วยเหลือ</Link>
        </nav>
        <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className="hidden min-h-11 shrink-0 items-center rounded-control border border-control-border px-4 text-sm font-semibold hover:bg-raised md:inline-flex">บัญชีผู้ใช้</Link>
        <button type="button" onClick={() => setSearchOpen((value) => !value)} aria-label={searchOpen ? "ปิดช่องค้นหา" : "เปิดช่องค้นหา"} aria-expanded={searchOpen}
          aria-controls="mobile-search-panel" className="ml-auto inline-flex size-11 items-center justify-center rounded-control text-foreground hover:bg-raised md:hidden">
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
        <button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(true)} aria-label="เปิดเมนู" aria-haspopup="dialog"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-foreground hover:bg-raised lg:hidden">
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div id="mobile-search-panel" hidden={!searchOpen} className="shop-container pb-4 md:hidden"><SearchForm inputRef={searchRef} onSubmit={() => setSearchOpen(false)} /></div>
      <dialog ref={menuRef} aria-label="เมนูมือถือ" onCancel={(event) => { event.preventDefault(); setMenuOpen(false); }}
        onClick={(event) => { if (event.target === menuRef.current) setMenuOpen(false); }}
        className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-dvh w-[min(85vw,360px)] border-l border-border bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/70">
        <div className="mb-8 flex items-center justify-between gap-3">
          <span className="font-semibold">เมนู</span>
          <button type="button" onClick={() => setMenuOpen(false)} className="min-h-11 rounded-control px-3 hover:bg-raised" aria-label="ปิดเมนู">ปิด ×</button>
        </div>
        <nav aria-label="เมนูมือถือ" className="grid gap-1">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={pathname === link.href ? "page" : undefined}
            className={`rounded-control px-3 py-3 font-medium hover:bg-raised ${pathname === link.href ? "bg-raised text-accent" : "text-foreground"}`}>{link.label}</Link>)}
          <div className="my-3 border-t border-border" />
          <p className="px-3 text-sm text-muted">เลือกเกม</p>
          {games.map((game) => <Link key={game.slug} href={`/products?game=${game.slug}`} onClick={() => setMenuOpen(false)} className="rounded-control px-3 py-3 hover:bg-raised">{game.name}</Link>)}
          <div className="my-3 border-t border-border" />
          <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-control px-3 py-3 font-medium text-accent hover:bg-raised">บัญชีผู้ใช้</Link>
        </nav>
      </dialog>
    </header>
  );
}
