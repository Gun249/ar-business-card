# AR Business Card - Target Index และฐานข้อมูล

## ภาพรวมของระบบ

ระบบ AR Business Card รองรับการใช้งาน **Multiple Target Index** ซึ่งหมายความว่าแต่ละนามบัตรสามารถใช้ Marker (เป้าหมาย) ที่แตกต่างกันในไฟล์ `.mind` ได้

## วิธีการทำงาน

### 1. ไฟล์ .mind และ Target Index

```
mind/targets.mind  // ไฟล์นี้ประกอบด้วย:
├── Target 0 (Index 0) - Marker สำหรับนามบัตรที่ 1
├── Target 1 (Index 1) - Marker สำหรับนามบัตรที่ 2  
├── Target 2 (Index 2) - Marker สำหรับนามบัตรที่ 3
└── Target N (Index N) - และอื่นๆ
```

### 2. โครงสร้างข้อมูลในฐานข้อมูล

```javascript
// ตัวอย่างข้อมูลในฐานข้อมูล (lib/api.js)
const cards = [
  {
    id: 1,
    userId: 2,
    templateId: 1,
    name: "นามบัตรของสมชาย",
    data: {
      name: "สมชาย ใจดี",
      title: "นักพัฒนาซอฟต์แวร์",
      phone: "02-123-4567",
      email: "somchai@tech.com",
      profilePicture: "/placeholder.svg",
      targetIndex: 0  // <- สำคัญ! บอกว่าใช้ Target Index 0
    },
    targetImage: "/placeholder.svg",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 2,
    // ...ข้อมูลอื่นๆ
    data: {
      // ...
      targetIndex: 1  // <- ใช้ Target Index 1 (Marker ตัวที่ 2)
    }
  }
]
```

### 3. การใช้งาน ARViewerPage Component

#### วิธีที่ 1: ส่ง cardId (แนะนำ)
```tsx
// ดึงข้อมูลจากฐานข้อมูลอัตโนมัติ
<ARViewerPage cardId={1} />
```

#### วิธีที่ 2: ส่ง cardData โดยตรง
```tsx
// ส่งข้อมูลเข้าไปตรงๆ
<ARViewerPage cardData={{
  username: "สมชาย ใจดี",
  title: "นักพัฒนาซอฟต์แวร์", 
  phone: "02-123-4567",
  email: "somchai@tech.com",
  profilePicture: "/placeholder.svg",
  targetIndex: 2  // <- ระบุ Target Index ที่ต้องการ
}} />
```

## ขั้นตอนการพัฒนา

### 1. การเตรียม Mind File
1. ใช้ MindAR Image Tracking เพื่อสร้างไฟล์ `.mind`
2. อัปโหลดรูป Marker หลายๆ รูป (แต่ละรูปจะได้ Index ต่างกัน)
3. ดาวน์โหลดไฟล์ `targets.mind` 
4. วางไฟล์ใน `public/mind/targets.mind`

### 2. การกำหนด Target Index ในฐานข้อมูล
```javascript
// เพิ่ม targetIndex ในข้อมูล card
const newCard = {
  id: nextId,
  userId: currentUserId,
  data: {
    // ...ข้อมูลอื่นๆ
    targetIndex: 0  // เริ่มจาก 0, 1, 2, 3...
  }
}
```

### 3. การใช้งานในหน้าเว็บ
```tsx
// ในหน้า My Business Cards
const handleViewAR = (cardId: string) => {
  setShowARViewer(cardId)  // เก็บ cardId
}

// ในส่วน render
{showARViewer && (
  <ARViewerPage cardId={parseInt(showARViewer)} />
)}
```

## ตัวอย่างการใช้งาน

### Scenario 1: ร้านอาหาร
- Card 1 (Index 0): เมนูหลัก
- Card 2 (Index 1): เมนูเครื่องดื่ม  
- Card 3 (Index 2): โปรโมชั่น

### Scenario 2: บริษัท
- Card 1 (Index 0): ประธานบริษัท
- Card 2 (Index 1): ผู้อำนวยการ
- Card 3 (Index 2): หัวหน้าฝ่าย

## การ Debug และ Troubleshooting

### ปัญหาที่พบบ่อย
1. **AR ไม่ทำงาน**: ตรวจสอบว่า `targetIndex` ในฐานข้อมูลตรงกับจำนวน Target ในไฟล์ `.mind`
2. **Marker ไม่เจอ**: ตรวจสอบว่า Target Index ถูกต้อง
3. **ข้อมูลไม่แสดง**: ตรวจสอบ API response และโครงสร้างข้อมูล

### การ Test
```javascript
// ตรวจสอบข้อมูลที่ได้จาก API
const testCard = await api.getARContent(cardId)
console.log('Target Index:', testCard.cardData.targetIndex)
console.log('Card Data:', testCard.cardData)
```

## Best Practices

1. **กำหนด Target Index อย่างมีระบบ**: เริ่มจาก 0 และเพิ่มขึ้นเรื่อยๆ
2. **สำรองข้อมูล**: เก็บไฟล์ `.mind` และข้อมูล Marker ไว้
3. **ทดสอบทุก Target**: ตรวจสอบว่าทุก Index ทำงานได้
4. **Document ทุกอย่าง**: บันทึกว่า Index ไหนใช้สำหรับอะไร

## File Structure
```
project/
├── public/
│   └── mind/
│       └── targets.mind          // ไฟล์ AR Targets
├── lib/
│   └── api.js                   // ฐานข้อมูล + targetIndex
├── components/
│   └── pages/
│       ├── ARViewerPage.tsx     // AR Component
│       ├── my-business-cards.tsx // หน้าจัดการนามบัตร
│       └── CardViewer.tsx       // ตัวอย่างการใช้งาน
```

## การขยายระบบ

เมื่อต้องการเพิ่ม Target ใหม่:
1. เพิ่มรูป Marker ใหม่ใน MindAR
2. สร้างไฟล์ `.mind` ใหม่
3. อัปเดตฐานข้อมูลให้รองรับ Index ใหม่
4. ทดสอบการทำงาน

---

*หมายเหตุ: ระบบนี้ออกแบบมาให้รองรับการขยายตัวได้ง่าย โดยสามารถเพิ่ม Target Index และนามบัตรใหม่ได้ไม่จำกัด*
