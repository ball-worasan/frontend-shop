import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="shop-container grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md space-y-3">
          <Link href="/" className="font-display text-xl font-bold tracking-wide">GAME <span className="text-accent">SHOP</span></Link>
          <p className="text-sm text-muted">ร้านตัวอย่างสำหรับไอดีและไอเท็มเกม ข้อมูลสินค้าและการสั่งซื้อในช่วงพัฒนาเป็นข้อมูลจำลอง</p>
        </div>
        <nav aria-label="ลิงก์สินค้า" className="grid content-start gap-3 text-sm">
          <h2 className="font-semibold">เลือกซื้อ</h2>
          <Link href="/products" className="text-muted hover:text-accent">สินค้าทั้งหมด</Link>
          <Link href="/orders" className="text-muted hover:text-accent">คำสั่งซื้อ</Link>
        </nav>
        <nav aria-label="ลิงก์ช่วยเหลือ" className="grid content-start gap-3 text-sm">
          <h2 className="font-semibold">ข้อมูลร้าน</h2>
          <Link href="/help" className="text-muted hover:text-accent">วิธีซื้อและช่วยเหลือ</Link>
          <Link href="/help#terms" className="text-muted hover:text-accent">เงื่อนไขตัวอย่าง</Link>
        </nav>
      </div>
      <div className="shop-container border-t border-border py-5 text-xs text-muted">GAME SHOP · เว็บไซต์ตัวอย่าง</div>
    </footer>
  );
}
