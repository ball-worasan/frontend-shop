# SHOP-002 — Shared UI

เปิด `/design-system` เพื่อดูส่วนประกอบและข้อมูลสมมติ หน้า preview ไม่ใช่หน้าร้านจริง

## โครงสร้าง

- `app/globals.css`: semantic color tokens, radius, container, focus และ reduced motion; spacing ใช้ Tailwind scale ตาม blueprint
- `app/layout.tsx`: Noto Sans Thai สำหรับข้อความ, Geist สำหรับราคา, Geist Mono สำหรับโค้ด
- `components/ui/`: Button, Input, Badge, Tabs, Modal, Skeleton, LoadingState, EmptyState, ErrorState
- `components/product-card.tsx`: การ์ดลิงก์เดียวพร้อมภาพ ราคา ประเภท และสต็อก
- `lib/products.ts`: discriminated union ของไอดี/ไอเท็ม เกมสมมติสองเกมและสินค้า 4 รายการ
- `public/images/product-placeholder.svg`: ภาพ placeholder ภายในโปรเจกต์

## วิธีใช้

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

<Button variant="secondary" loading={false}>ดำเนินการต่อ</Button>
<Input label="อีเมล" type="email" hint="ใช้ข้อมูลสมมติ" />
<ProductCard product={products[0]} />
```

- ใช้ Client Component เมื่อต้องส่ง event handlers; Input, Tabs และ Modal ประกาศ client boundary แล้ว
- Tabs รับ `items` ที่มี `value` ไม่ซ้ำ, `label`, `content`; รองรับลูกศรซ้าย/ขวา, Home/End และ roving tabindex
- Modal เป็น controlled component: ส่ง `open` และ `onClose`; ใช้ native dialog สำหรับ modal focus containment และ Escape พร้อมคืน focus หลังปิด ใช้ครั้งละหนึ่ง modal
- Input เชื่อม label/hint/error ด้วย ID อัตโนมัติ และรองรับ ID ที่ส่งเอง
- Button ใช้ `type="button"` เป็นค่าเริ่มต้น; แบบ submit ต้องระบุเอง; loading ปิดการกดซ้ำ
- ProductCard ไป `/products/[id]` โดยค่าเริ่มต้น; preview ส่ง `href` ไปหมายเหตุเพราะหน้าสินค้ายังไม่พัฒนา
- ชื่อเกมและสินค้าเป็นเรื่องสมมติ ไม่มี credentials หรือการชำระเงินจริง

## การตรวจ

รัน `bun run lint` และ `bun run build`
ตรวจ `/design-system` ที่ 390 และ 1440 px, กดลูกศรสลับ Tabs, เปิด Modal และทดสอบ Tab/Shift+Tab/Escape/การคืน focus
เปิด reduced motion เพื่อตรวจว่า animation ถูกลดลง

ฟอนต์ Google ดาวน์โหลดขณะ build ตามพฤติกรรม `next/font` และให้บริการจากแอปหลัง build; เครื่อง build ต้องเข้าถึงแหล่งฟอนต์ได้

### ผลตรวจรอบนี้

- ESLint: ผ่าน ไม่มี error/warning (ตรวจผ่าน ESLint API ด้วย configuration เดิม ครอบคลุม app, components, lib และ config รวม 13 ไฟล์)
- `bunx tsc --noEmit`: ผ่าน
- `git diff --check`: ผ่านสำหรับไฟล์ tracked ที่แก้ไข มีเพียงข้อความเตือน LF/CRLF
- `bun run build`: ไม่ผ่านเนื่องจากดาวน์โหลด Geist, Geist Mono และ Noto Sans Thai จาก Google Fonts ไม่ได้ในสภาพแวดล้อมนี้
- ผู้ใช้เปิดดูหน้า preview แล้ว; ยังไม่มีบันทึกผลตรวจ keyboard navigation, contrast ที่ render และภาพ responsive แยกตาม viewport
- ต้องรัน build ใน CI หรือเครื่องที่เข้าถึง Google Fonts ได้ก่อน merge; ห้ามตีความผล build ใน sandbox ว่าผ่าน
