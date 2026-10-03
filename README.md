# FilmLab — เว็บไซต์รับติดฟิล์มอาคาร

เว็บหน้าเดียว (HTML/CSS/JS ล้วน) ไม่ต้องติดตั้งอะไร เปิด `index.html` ในเบราว์เซอร์ได้เลย

## ก่อนเปิดใช้งานจริง

แก้ใน `index.html` ด้วย Find & Replace (`Ctrl + H`):

| ค้นหา | แทนที่ด้วย |
| --- | --- |
| `@filmlab` | LINE ID ของไลน์แอดบริษัท |

และตรวจสอบ:

- พื้นที่ให้บริการ (ตอนนี้ระบุ "กรุงเทพฯ และปริมณฑล")
- โลโก้บริษัทอยู่ที่ `assets/img/logo.png` และไอคอนแท็บเบราว์เซอร์ที่ `assets/img/favicon.png`
- รายชื่อแบรนด์ (ใส่เฉพาะแบรนด์ที่เป็นตัวแทนจำหน่ายจริง) — โลโก้อยู่ใน `assets/img/brands/`
- เพิ่มผลงาน: วางรูปไว้ใน `assets/img/works/` แล้วคัดลอกการ์ด `<a class="work">` ใน `index.html` ไปแก้ (รูปปกใช้ไฟล์ `-sm`, รูปทั้งหมดใส่ใน `data-photos`)

## โครงสร้าง

```
index.html            หน้าเว็บ
assets/css/style.css  สไตล์ทั้งหมด
assets/js/main.js     สไลเดอร์เทียบฟิล์ม, แท็บเลือกฟิล์ม, ฟอร์มส่งเข้า LINE
assets/img/brands/    โลโก้แบรนด์ฟิล์ม
assets/img/works/     รูปผลงาน
```

ชื่อแบรนด์และโลโก้เป็นเครื่องหมายการค้าของเจ้าของแต่ละราย

ภาพวิวกรุงเทพฯ ในสไลเดอร์ (`assets/img/hero/`): [Kirandeep Singh Walia / Pexels](https://www.pexels.com/photo/aerial-view-of-skyscrapers-in-bangkok-thailand-12768829/) ใช้ภายใต้ Pexels License (ใช้เชิงพาณิชย์ได้ฟรี)
