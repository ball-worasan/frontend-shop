# SHOP-003 — Site shell and navigation

โครงหน้าใช้ `SiteHeader` และ `SiteFooter` ใน root layout ทุก route พร้อมปุ่มข้ามไปเนื้อหาหลัก ฟอนต์และสีจาก SHOP-002 และ metadata ภาษาไทย ชื่อร้าน `GAME SHOP` ยังเป็นชื่อชั่วคราว

## Navigation

| จุดเข้า | ปลายทาง | สถานะตอนนี้ |
|---|---|---|
| โลโก้ / หน้าแรก | `/` | หน้าแนะนำร้านแบบย่อ |
| สินค้าทั้งหมด / ช่องค้นหา | `/products`, `/products?q=...` | แสดงและค้นข้อมูลจำลอง |
| เลือกเกม | `/products?game=...` | กรองข้อมูลจำลองตามเกม |
| คำสั่งซื้อ | `/orders` | หน้า empty state ที่อธิบายว่ายังไม่มีระบบซื้อ |
| บัญชีผู้ใช้ | `/login` | หน้าแจ้งว่าฟอร์มบัญชียังไม่เปิด |
| ช่วยเหลือ / เงื่อนไข | `/help`, `/help#terms` | คำตอบและเงื่อนไขตัวอย่าง |

หน้า `/products` ในงานนี้เป็นผลลัพธ์ค้นหาพื้นฐานเพื่อให้เมนูมีปลายทางจริง ตัวกรองเต็มรูปแบบและการ์ดสินค้าอยู่ใน SHOP-005; รายละเอียด/ซื้ออยู่ใน SHOP-006; บัญชีอยู่ใน SHOP-007; คำสั่งซื้ออยู่ใน SHOP-009; ช่วยเหลือเต็มรูปแบบอยู่ใน SHOP-010

Desktop มี navigation, เมนูเกม และ search ใน header; mobile ใช้ native dialog เป็น drawer พร้อม Escape, backdrop/ปุ่มปิด และคืน focus ไปปุ่มเปิดเมนู ช่องค้นหามือถือเปิดแยกและ focus ที่ input ใช้ GET form เพื่อให้ URL ค้นหาแชร์ได้

## ตรวจสอบ

- TypeScript route generation และ `tsc --noEmit` ผ่าน
- ESLint ผ่าน ไม่มี warning หลังแก้ ref cleanup
- HTTP จาก dev server: `/`, `/products`, `/orders`, `/login`, `/help`, `/icon.svg` ตอบ 200
- ตรวจผลค้นหา `q=Diamond`, ตัวกรอง `game=rune-valley` และกรณีไม่พบสินค้าแล้ว
- `bun run build` ยังติดการดาวน์โหลด Geist และ Noto Sans Thai จาก Google Fonts ใน sandbox เดียวกับ SHOP-002; ต้องรันบน CI/เครื่องที่มี network
- ยังไม่มีภาพทดสอบ viewport หรือบันทึก interaction จาก browser automation เนื่องจาก sandbox ปฏิเสธการเริ่ม Chrome; ให้ตรวจ drawer และความกว้าง 390/1440 px ในการ review

เมื่อ merge งาน release pipeline SHOP-013 ภายหลัง ต้องปรับข้อความที่ `scripts/smoke.mjs` คาดหวังจากหน้า Next.js เริ่มต้นเป็นหัวข้อหน้าแรกใหม่นี้ ก่อนให้ PR checks รัน
