import Link from "next/link";

export default function GameNotFound() {
  return (
    <main className="shop-container flex-1 py-16">
      <h1 className="text-3xl font-bold">ไม่พบเกมนี้</h1>
      <p className="mt-3 text-muted">เกมที่เลือกยังไม่มีหน้าร้านในข้อมูลตัวอย่าง</p>
      <Link href="/products" className="btn btn-primary mt-6 inline-flex min-h-11 items-center rounded-control bg-primary px-5 font-semibold text-white">เลือกดูสินค้าทั้งหมด</Link>
    </main>
  );
}
