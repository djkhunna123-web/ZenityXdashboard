# ZenityX

ZenityX เป็นเว็บสำหรับเก็บ feedback ของผู้เรียนแบบไม่ระบุชื่อ พร้อมแดชบอร์ดสำหรับอาจารย์และผู้ดูแลระบบ โดยใช้ React + Vite ฝั่งหน้าเว็บ และ Supabase สำหรับ auth/database

## เริ่มต้นใช้งานในเครื่อง

```sh
npm install
npm run dev
```

ถ้าคุณใช้งาน PowerShell แล้วเรียก `npm` ไม่ได้จาก execution policy ให้ใช้ `npm.cmd` แทน

## Environment Variables

สร้างไฟล์ `.env` จากตัวอย่างใน [.env.example](/E:/zenityx/.env.example)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## เอกสารสำคัญ

- ตั้งค่า database และ role: [SUPABASE_SETUP.md](/E:/zenityx/SUPABASE_SETUP.md)
- คู่มือ deploy ขึ้น Vercel: [DEPLOY_VERCEL.md](/E:/zenityx/DEPLOY_VERCEL.md)

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase
- TanStack Query
