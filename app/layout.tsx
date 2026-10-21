import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const thai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GAME SHOP | ไอดีและไอเท็มเกม",
    template: "%s | GAME SHOP",
  },
  description: "เลือกดูไอดีและไอเท็มเกมจากร้านตัวอย่าง ข้อมูลสินค้าและการสั่งซื้อในช่วงพัฒนาเป็นข้อมูลจำลอง",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${thai.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-primary focus:px-4 focus:py-2 focus:text-white">ข้ามไปเนื้อหาหลัก</a>
        <Suspense fallback={<div className="min-h-18 border-b border-border bg-background" />}><SiteHeader /></Suspense>
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
