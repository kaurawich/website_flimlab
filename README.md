# FilmLab — เว็บไซต์รับติดฟิล์มอาคาร

เว็บไซต์: **https://www.filmlabth.com** (GitHub Pages + โดเมน GoDaddy)

เว็บหน้าเดียว (HTML/CSS/JS ล้วน) ไม่ต้องติดตั้งอะไร เปิด `index.html` ในเบราว์เซอร์ได้เลย

ดีไซน์ที่ใช้อยู่: **แบบที่ 4 Editorial / Behance** (สีตาม Visual Brand Direction) — กรมท่า #18324B · ขาว · เทากระจก #657887 · ทองแชมเปญ #C5A66D,
ฟอนต์ LINE Seed Sans TH (ไทย, `assets/fonts/`, SIL OFL 1.1) + Manrope (อังกฤษ/ตัวเลข)

## ข้อมูลติดต่อ

- LINE: `@filmlab` — ปุ่ม LINE ทุกปุ่ม ฟอร์ม และ QR code (`assets/img/line-qr.svg`) ชี้ไปที่ไลน์แอดนี้
  ถ้าเปลี่ยน LINE ID: Find & Replace `@filmlab` ใน `index.html` และสร้าง QR ใหม่
- โทร: 080-563-5355 · เปิดทุกวัน 08:00–17:00 น.

## เพิ่ม / แก้ผลงาน

รายการผลงานทั้งหมดอยู่ในไฟล์เดียว: **`assets/js/works-data.js`** (1 บรรทัดต่อ 1 งาน, ลำดับในไฟล์ = ลำดับบนเว็บ เรียงจากซ้ายไปขวา)

1. วางรูปไว้ใน `assets/img/works/` ตั้งชื่อ `<รหัส>-1.jpg`, `<รหัส>-2.jpg` … (ไม่เกิน 1400px) และรูปปก `<รหัส>-1-sm.jpg` (ไม่เกิน 720px)
2. เพิ่มบรรทัดใน `works-data.js`: `id`, `title`, `type` (บ้าน / คอนโด / สำนักงาน / ร้านค้า), `film`, `photos`, `alt`

รูปต้นฉบับของบริษัทเก็บที่ `D:\Film Lab\ผลงาน` (1 โฟลเดอร์ต่อ 1 งาน, `ปก.jpg` = รูปปก)

## ตรวจสอบ

- พื้นที่ให้บริการ (ตอนนี้ระบุ "กรุงเทพฯ และปริมณฑล")
- โลโก้บริษัทอยู่ที่ `assets/img/logo.png` และไอคอนแท็บเบราว์เซอร์ที่ `assets/img/favicon.png`
- รายชื่อแบรนด์ (ใส่เฉพาะแบรนด์ที่เป็นตัวแทนจำหน่ายจริง) — โลโก้อยู่ใน `assets/img/brands/`

## ดีไซน์ที่เก็บไว้ (เปลี่ยนกลับได้)

ทุกแบบเก็บเป็น git tag (และ branch) ไว้ทั้งหมด:

| tag | branch | แบบ |
| --- | --- | --- |
| `design-0-before-v3` | — | เว็บจริงก่อนเปลี่ยน (สี CI กรมท่า/ฟ้า/ส้ม, ถึง 1 พ.ย. 2026) |
| `design-1-architect` | `redesign` | แบบที่ 1 แผ่นแบบสถาปนิก |
| `design-2-sunlit-window` | `redesign-b` | แบบที่ 2 หน้าต่างรับแสงแดด |
| `design-3-brand` | `redesign-c` | แบบที่ 3 ตาม Visual Brand Direction (เว็บจริง 1–11 พ.ย. 2026) |
| `design-4-behance` | `redesign-d` | แบบที่ 4 Editorial / Behance — **ใช้อยู่** (ตั้งแต่ 11 พ.ย. 2026) |

เปลี่ยนเว็บจริงเป็นแบบอื่น: นำไฟล์ของ tag นั้นมาไว้บน `main` แล้ว push
(ระวังผลงาน/ข้อมูลที่เพิ่มหลังจากวันที่ทำแบบนั้น ต้องย้ายตามไปด้วย)

## โครงสร้าง

```
index.html               หน้าเว็บ
assets/css/style.css     สไตล์ทั้งหมด
assets/js/main.js        สไลเดอร์เทียบฟิล์ม, แกลเลอรีผลงาน + ปุ่มกรอง, ดูรูปเต็มจอ, ฟอร์มส่งเข้า LINE
assets/js/works-data.js  รายการผลงาน
assets/fonts/            ฟอนต์ LINE Seed Sans TH
assets/img/brands/       โลโก้แบรนด์ฟิล์ม
assets/img/works/        รูปผลงาน
```

ชื่อแบรนด์และโลโก้เป็นเครื่องหมายการค้าของเจ้าของแต่ละราย

ภาพวิวกรุงเทพฯ ในสไลเดอร์ (`assets/img/hero/`): [Kirandeep Singh Walia / Pexels](https://www.pexels.com/photo/aerial-view-of-skyscrapers-in-bangkok-thailand-12768829/) ใช้ภายใต้ Pexels License (ใช้เชิงพาณิชย์ได้ฟรี)
