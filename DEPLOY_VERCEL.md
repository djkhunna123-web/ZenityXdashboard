# Deploy to Vercel

คู่มือนี้ใช้สำหรับเอาโปรเจกต์ ZenityX ขึ้น Vercel โดยยังใช้ฐานข้อมูลและระบบล็อกอินจาก Supabase ตัวเดิม

## ภาพรวม

- Frontend: Vercel
- Database + Auth: Supabase
- Build command: `npm run build`
- Output directory: `dist`

## 1. เตรียม Supabase ให้พร้อม

ถ้ายังไม่ได้ตั้งฐานข้อมูล:

1. สร้างโปรเจกต์ใน Supabase
2. เปิด SQL Editor
3. รันไฟล์ [supabase/schema.sql](/E:/zenityx/supabase/schema.sql)
4. ถ้าต้องการบัญชีแอดมิน ให้สมัครผู้ใช้ก่อน 1 คน แล้วแก้อีเมลใน [supabase/admin-setup.sql](/E:/zenityx/supabase/admin-setup.sql) จากนั้นรันไฟล์นี้

## 2. เตรียมค่า Environment Variables

ต้องใช้ 2 ค่าเท่านั้นสำหรับฝั่งเว็บ:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

ดูตัวอย่างได้ที่ [.env.example](/E:/zenityx/.env.example)

หมายเหตุ:

- `VITE_SUPABASE_ANON_KEY` ใช้บน frontend ได้ตามปกติ
- ห้ามใส่ `service_role` key ลงบน Vercel

## 3. Deploy ขึ้น Vercel

1. Push โปรเจกต์นี้ขึ้น GitHub, GitLab หรือ Bitbucket
2. เข้า Vercel แล้วกด `Add New Project`
3. เลือก repository นี้
4. Vercel จะตรวจว่าเป็น Vite project ให้เอง
5. ตรวจค่าให้เป็น:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. เพิ่ม Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. กด Deploy

ไฟล์ [vercel.json](/E:/zenityx/vercel.json) ถูกเพิ่มไว้แล้วเพื่อช่วยเรื่อง SPA routing ของ React Router

## 4. ตั้งค่า Auth Redirect ใน Supabase

หลังจาก deploy แล้ว ให้เอาโดเมนจาก Vercel ไปใส่ใน Supabase:

1. ไปที่ Supabase Dashboard
2. เปิด `Authentication`
3. เข้าเมนู `URL Configuration`
4. ตั้งค่า `Site URL` เป็นโดเมนจริงของ Vercel เช่น:

```txt
https://your-project.vercel.app
```

5. เพิ่ม `Redirect URLs` อย่างน้อย:

```txt
https://your-project.vercel.app
https://your-project.vercel.app/login
```

ถ้ามี custom domain ให้เพิ่มโดเมนนั้นด้วย เช่น:

```txt
https://app.yourdomain.com
https://app.yourdomain.com/login
```

## 5. เช็กลิสต์หลัง deploy

เช็กตามลำดับนี้:

1. เปิดหน้าแรกของโดเมน Vercel ได้
2. เปิดหน้า `/login` ได้โดยไม่ขึ้น 404
3. สมัครบัญชีอาจารย์ได้
4. ถ้าเปิด email confirmation อยู่ ลิงก์ยืนยันกลับมาที่โดเมน Vercel ถูกต้อง
5. ล็อกอินด้วยบัญชีแอดมินได้
6. แอดมินอนุมัติอาจารย์ได้
7. อาจารย์สร้างคลาสได้
8. เปิดลิงก์ `/feedback/:classId` จากเว็บจริงได้
9. ส่ง feedback แล้วข้อมูลขึ้นใน dashboard

## 6. ถ้าเจอปัญหา

### เปิดหน้า route ตรง ๆ แล้ว 404

เช็กว่า Vercel ใช้ [vercel.json](/E:/zenityx/vercel.json) ล่าสุดแล้ว และ redeploy หลัง push

### ล็อกอินหรือยืนยันอีเมลแล้วเด้งผิดโดเมน

เช็ก `Site URL` และ `Redirect URLs` ใน Supabase ว่าเป็นโดเมน Vercel ปัจจุบัน

### เว็บขึ้น แต่เชื่อม Supabase ไม่ได้

เช็ก Environment Variables บน Vercel ว่าใส่ครบและ deploy ใหม่แล้ว

### Public feedback ใช้งานไม่ได้

เช็กว่า schema และ RLS จาก [supabase/schema.sql](/E:/zenityx/supabase/schema.sql) ถูก apply ครบแล้ว

## 7. คำสั่งสำหรับเช็กก่อน push

```sh
npm run build
```

ถ้า build ผ่านในเครื่อง ส่วนใหญ่ deploy บน Vercel จะผ่านด้วย
