# GAME SHOP

Next.js storefront สำหรับทดลองเลือกซื้อไอดีและไอเท็มเกมด้วยข้อมูลสมมติ ไม่มี backend, การรับเงิน, ระบบบัญชี หรือการส่งมอบสินค้าจริง

## พัฒนาในเครื่อง

```bash
bun install --frozen-lockfile
bun run dev
bun run lint
bunx tsc --noEmit
bun run test
bun run build
```

เปิด `http://localhost:3000` แล้วทดลองเส้นทาง `/products` → `/products/demo-003` → `/checkout?product=demo-003&quantity=2` → `/orders` หน้า `/login`, `/register`, `/forgot-password` และ `/help` เป็นโหมดสาธิตเช่นกัน

## ข้อมูลคำสั่งซื้อสาธิต

คำสั่งซื้อเก็บใน `localStorage` ของเบราว์เซอร์ภายใต้ schema version 1 เท่านั้น Reload แล้วรายการยังอยู่ แต่เปลี่ยนเบราว์เซอร์หรืออุปกรณ์จะไม่เห็นรายการเดิม ใช้ปุ่ม “ล้างข้อมูลสาธิต” บนหน้า `/orders` เพื่อลบข้อมูลนี้ อย่ากรอกข้อมูลส่วนตัว รหัสผ่านจริง หรือรหัสเกมจริงในฟอร์มตัวอย่าง

ข้อมูลสินค้าอยู่ใน `lib/products.ts`; ตัวกรองอยู่ใน `lib/catalog.ts`; การตรวจจำนวนและข้อมูลคำสั่งซื้อจำลองอยู่ใน `lib/demo-orders.ts` ภาพสินค้าใน fixtures เป็นภาพประกอบ placeholder ไม่ใช่ภาพสินค้าเกมจริง

UI ใช้ Tailwind CSS และชื่อคลาส daisyUI ตาม skill ใน `.agents/skills/daisyui` ขณะนี้แพ็กเกจ daisyUI ยังไม่ได้ติดตั้งเพราะ registry เข้าถึงไม่ได้ จึงมี Tailwind fallback สำหรับหน้าใหม่ ต้องตรวจธีมและ component อีกครั้งหลังติดตั้ง daisyUI 5
