# AR Templates System - คู่มือการใช้งาน

## ภาพรวมของระบบ AR Templates

ระบบ AR Templates ช่วยให้คุณสามารถสร้างนามบัตร AR ที่มีรูปแบบการแสดงผลที่แตกต่างกันได้ โดยมี Template หลายแบบให้เลือกใช้

## ประเภทของ AR Templates

### 1. **Classic Business** (classic-business)
- **เหมาะสำหรับ**: มืออาชีพ บริษัท องค์กร
- **ลักษณะ**: Panel ลอยรอบนามบัตร สีน้ำเงิน-เขียว สุภาพ
- **แอนิเมชัน**: การลอยเบาๆ หมุนของขอบโปรไฟล์

### 2. **Modern Creative** (modern-creative)
- **เหมาะสำหรับ**: นักออกแบบ ศิลปิน ครีเอทีฟ
- **ลักษณะ**: Profile เป็นทรงกลม วงโคจรรอบ สีสันสดใส
- **แอนิเมชัน**: การหมุนโคจร อนุภาคลอย

### 3. **Minimal Professional** (minimal-professional)
- **เหมาะสำหรับ**: ผู้บริหาร CEO สายวิชาการ
- **ลักษณะ**: เรียบง่าย สะอาดตา โทนสีเย็น
- **แอนิเมชัน**: แอนิเมชันเรียบง่าย ไม่มากเกินไป

### 4. **Interactive Modern** (interactive-modern)
- **เหมาะสำหรับ**: Tech Startup นักพัฒนา IT
- **ลักษณะ**: ปุ่มโต้ตอบได้ เอฟเฟกต์เรืองแสง สีม่วง-แดง
- **แอนิเมชัน**: Glow effect อนุภาคเรืองแสง

## วิธีการใช้งาน

### การเลือก Template
```tsx
// ใช้ในหน้าเลือก Template
<TemplateSelection 
  onSelectTemplate={handleTemplateSelect}
  cardData={cardData}
  showPreview={true}
/>
```

### การใช้ Template ใน AR Viewer
```tsx
// ส่ง templateId ไป ARViewerPage
<ARViewerPage 
  cardData={cardData}
  templateId="modern-creative"
/>

// หรือระบุใน cardData
const cardData = {
  // ...ข้อมูลอื่นๆ
  templateId: "classic-business"
}
```

### การสร้าง Template ใหม่
```typescript
// ใน lib/ar-templates.ts
const newTemplate: ARTemplate = {
  id: 'my-custom-template',
  name: 'Custom Template',
  description: 'Template ที่กำหนดเอง',
  category: 'modern',
  colors: {
    primary: '#FF5733',
    secondary: '#33FF57',
    accent: '#3357FF',
    background: '#FFFFFF',
    text: '#000000'
  },
  layout: {
    type: 'floating-panels',
    spacing: 0.8,
    scale: 1.0
  },
  scene: (cardData) => `
    <!-- A-Frame scene HTML ของคุณ -->
    <a-plane color="${cardData.colors?.primary}" ...>
      <a-text value="${cardData.username}" ...></a-text>
    </a-plane>
  `
}
```

## การปรับแต่ง Template

### สีสัน (Colors)
```typescript
colors: {
  primary: '#007BFF',    // สีหลัก
  secondary: '#4A90E2',  // สีรอง  
  accent: '#50C878',     // สีเน้น
  background: '#FFFFFF', // สีพื้นหลัง
  text: '#333333'        // สีข้อความ
}
```

### Layout
```typescript
layout: {
  type: 'floating-panels', // ประเภท layout
  spacing: 0.7,           // ระยะห่าง
  scale: 1.0              // ขนาด
}
```

### แอนิเมชัน
```typescript
animations: [
  {
    type: 'float',    // ประเภทแอนิเมชัน
    duration: 2000,   // ระยะเวลา (ms)
    delay: 500,       // หน่วงเวลา (ms)
    loop: true        // ทำซ้ำ
  }
]
```

## A-Frame Elements ที่ใช้

### พื้นฐาน
- `<a-plane>` - พื้นผิวสี่เหลี่ยม
- `<a-circle>` - วงกลม
- `<a-sphere>` - ทรงกลม
- `<a-text>` - ข้อความ
- `<a-ring>` - วงแหวน

### แอนิเมชัน
```html
<a-entity 
  animation="property: position; to: 0 0.5 0; dur: 2000; loop: true; dir: alternate">
</a-entity>
```

### Materials
```html
<a-plane 
  material="shader: standard; emissive: #8E44AD; emissiveIntensity: 0.3">
</a-plane>
```

## การทดสอบ Template

### 1. ใช้ Template Demo Page
```bash
# เข้าหน้า TemplateDemoPage.tsx
```

### 2. ใช้ AR Test Page
```bash
# เข้าหน้า ARTestPage.tsx เพื่อทดสอบพร้อมฐานข้อมูล
```

### 3. ใช้ Template Selector
```bash
# เข้าหน้า ARTemplateSelector.tsx เพื่อดู Gallery
```

## ไฟล์ที่เกี่ยวข้อง

```
project/
├── types/
│   └── ar-templates.ts          # Type definitions
├── lib/
│   └── ar-templates.ts          # Template definitions
├── components/
│   ├── pages/
│   │   ├── template-selection.tsx   # Template selector
│   │   ├── ARViewerPage.tsx        # AR viewer
│   │   ├── ARTestPage.tsx          # Testing page
│   │   ├── ARTemplateSelector.tsx  # Template gallery
│   │   └── TemplateDemoPage.tsx    # Demo page
│   └── ui/
│       └── ColorSwatch.tsx         # Color display component
```

## Best Practices

### การออกแบบ Template
1. **ใช้สีที่เข้ากันได้** - เลือก Color Scheme ที่สบายตา
2. **แอนิเมชันพอดี** - ไม่มากเกินไปจนรบกวน
3. **ข้อมูลอ่านง่าย** - ตัวอักษรชัดเจน ขนาดเหมาะสม
4. **เข้ากับ Brand** - เลือก Template ที่เข้ากับตัวตนแบรนด์

### การใช้งาน
1. **ทดสอบก่อนใช้** - ใช้ AR Preview ดูผลลัพธ์
2. **เลือกตาม Context** - Business card vs Creative card
3. **คำนึงถึง Target Audience** - ผู้รับเป็นใคร อายุเท่าไหร่

### การพัฒนาต่อ
1. **เพิ่ม Template ใหม่** - สร้างตามความต้องการ
2. **ปรับปรุง Template เก่า** - อัปเดตตามเทรนด์
3. **เพิ่ม Animation** - ทำให้น่าสนใจมากขึ้น

## Troubleshooting

### Template ไม่แสดง
- ตรวจสอบ templateId ใน cardData
- ตรวจสอบว่า Template อยู่ใน AR_TEMPLATES registry

### AR ไม่ทำงาน
- ตรวจสอบ targetIndex
- ตรวจสอบไฟล์ targets.mind
- ตรวจสอบกล้องและ permissions

### สีไม่ตรงตาม Template
- ตรวจสอบ CSS classes ใน ColorSwatch
- ตรวจสอบ hex color values

---

*สำหรับข้อมูลเพิ่มเติม หรือต้องการสร้าง Template ใหม่ ติดต่อทีมพัฒนา*
