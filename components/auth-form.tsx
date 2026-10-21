"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Mode = "login" | "register" | "recover";
const titles = { login: "เข้าสู่ระบบ", register: "สมัครสมาชิก", recover: "กู้รหัสผ่าน" };

export function AuthForm({ mode }: { mode: Mode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (mode === "register" && password !== confirm) { setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน"); return; }
    setError("");
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setMessage(mode === "recover" ? "ตัวอย่างคำขอกู้รหัสผ่านเท่านั้น ไม่มีการส่งอีเมล" : mode === "register" ? "ตัวอย่างการสมัครเท่านั้น ยังไม่มีการสร้างบัญชีหรือบันทึกรหัสผ่าน" : "ระบบบัญชียังไม่เปิดใช้งาน คุณเลือกซื้อแบบผู้เยี่ยมชมได้");
    }, 250);
  }

  return (
    <main className="shop-container flex flex-1 items-center justify-center py-10 sm:py-16">
      <div className="card card-border w-full max-w-md rounded-card border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold text-accent">บัญชีผู้ใช้ · โหมดสาธิต</p>
        <h1 className="mt-2 text-3xl font-bold">{titles[mode]}</h1>
        <p className="mt-3 text-sm text-muted">กรอกข้อมูลสมมติเท่านั้น ไม่มีการยืนยันตัวตนหรือบันทึกรหัสผ่านจริง</p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          {mode === "register" && <div><label htmlFor="auth-name" className="mb-2 block font-semibold">ชื่อแสดง</label><input id="auth-name" name="name" required minLength={2} autoComplete="nickname" className="input min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground" /></div>}
          <div><label htmlFor="auth-email" className="mb-2 block font-semibold">อีเมลตัวอย่าง</label><input id="auth-email" name="email" type="email" required autoComplete="email" className="input min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground" /></div>
          {mode !== "recover" && <div><label htmlFor="auth-password" className="mb-2 block font-semibold">รหัสผ่านตัวอย่าง</label><div className="flex gap-2"><input id="auth-password" name="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="input min-h-12 min-w-0 flex-1 rounded-control border border-control-border bg-background px-3 text-foreground" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} className="btn btn-outline min-h-12 rounded-control border border-control-border px-3">{showPassword ? "ซ่อน" : "แสดง"}</button></div></div>}
          {mode === "register" && <div><label htmlFor="auth-confirm" className="mb-2 block font-semibold">ยืนยันรหัสผ่าน</label><input id="auth-confirm" name="confirm" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" value={confirm} onChange={(event) => { setConfirm(event.target.value); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "auth-error" : undefined} className="input min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground" /></div>}
          {error && <p id="auth-error" role="alert" className="text-sm text-danger">{error}</p>}
          {message && <p role="status" className="alert alert-info rounded-control border border-border bg-raised p-3 text-sm">{message}</p>}
          <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full rounded-control bg-primary font-semibold text-white disabled:opacity-50">{pending ? "กำลังตรวจข้อมูล..." : mode === "recover" ? "จำลองการขอลิงก์" : titles[mode]}</button>
        </form>
        <nav aria-label="ลิงก์บัญชี" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-accent">
          {mode !== "login" && <Link href="/login" className="hover:underline">เข้าสู่ระบบ</Link>}
          {mode !== "register" && <Link href="/register" className="hover:underline">สมัครสมาชิก</Link>}
          {mode !== "recover" && <Link href="/forgot-password" className="hover:underline">ลืมรหัสผ่าน</Link>}
        </nav>
        <Link href="/products" className="mt-5 inline-block text-sm text-muted hover:text-accent">เลือกซื้อแบบผู้เยี่ยมชม →</Link>
      </div>
    </main>
  );
}
