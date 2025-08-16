# 📁 โครงสร้างโปรเจค AR Business Card

## 🎯 หลักการจัดระเบียบ
โปรเจคถูกจัดแยกตาม **ฟีเจอร์** เพื่อให้ง่ายต่อการหา แก้ไข และพัฒนา

## 📂 โครงสร้าง Directory

```
components/
├── features/              # 🎭 ฟีเจอร์หลักของแอป
│   ├── ar-templates/      # 🎨 AR Template System
│   │   ├── TemplateSelection.tsx
│   │   ├── ARDisplayPreview.tsx  
│   │   ├── TemplatePreview.tsx
│   │   └── index.ts
│   │
│   ├── ar-viewer/         # 📱 AR Viewer & Scanner
│   │   ├── ARViewerPage.tsx
│   │   └── index.ts
│   │
│   ├── business-card/     # 💼 Business Card Management
│   │   ├── ARDetailsInput.tsx
│   │   ├── MyBusinessCards.tsx
│   │   ├── FinalPreview.tsx
│   │   └── index.ts
│   │
│   ├── auth/             # 🔐 Authentication
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── index.ts
│   │
│   └── index.ts          # 📋 Main Features Export
│
├── ui/                   # 🧩 UI Components (Buttons, Cards, etc.)
├── icons/               # 🎨 Icon Components
└── pages/               # 📄 Remaining Pages

lib/
├── ar/                  # 🎭 AR Related Libraries
│   ├── templates.ts     # AR Template Definitions
│   ├── display-templates.ts  # AR Display Templates
│   └── index.ts
├── api.js              # 🌐 API Functions
└── utils.ts            # 🔧 Utility Functions
```

## 🚀 วิธีใช้งานใหม่

### Import Components แบบใหม่:
```typescript
// แบบเก่า (ซับซ้อน)
import TemplateSelection from '@/components/pages/template-selection'
import ARViewerPage from '@/components/pages/ARViewerPage'

// แบบใหม่ (เข้าใจง่าย)
import { TemplateSelection } from '@/components/features/ar-templates'
import { ARViewerPage } from '@/components/features/ar-viewer'

// หรือ import แบบ feature
import { 
  TemplateSelection,
  ARDisplayPreview 
} from '@/components/features/ar-templates'
```

### Import AR Libraries:
```typescript
// แบบเก่า
import { getAllARTemplates } from '@/lib/ar-templates'
import { getAllARDisplayTemplates } from '@/lib/ar-display-templates'

// แบบใหม่
import { 
  getAllARTemplates,
  getAllARDisplayTemplates 
} from '@/lib/ar'
```

## 📋 Features อธิบาย

### 🎨 **AR Templates**
- การเลือก Template AR
- Preview ของ Template
- การแสดงผล AR แบบต่างๆ

### 📱 **AR Viewer** 
- หน้าสแกน AR
- การแสดงผล AR จริง
- การจัดการ MindAR

### 💼 **Business Card**
- การสร้างนามบัตร
- การจัดการนามบัตรของตัวเอง  
- Preview สุดท้าย

### 🔐 **Auth**
- Login/Register
- การจัดการผู้ใช้

## 💡 ข้อดีของโครงสร้างใหม่

1. **🎯 แยกตามฟีเจอร์** - ง่ายต่อการหา
2. **📦 Import ง่าย** - ใช้ index files
3. **🔧 แก้ไขง่าย** - รู้ว่าไฟล์อยู่ที่ไหน
4. **📈 Scale ได้** - เพิ่มฟีเจอร์ใหม่ง่าย
5. **👥 ทำงานร่วมกันง่าย** - ไม่ปะรำกัน

## 🔄 การ Migrate

หากมีไฟล์ที่ import path เก่า ให้เปลี่ยนเป็น:
```typescript
// เปลี่ยนจาก
'@/components/pages/...'
'@/lib/ar-templates'

// เป็น  
'@/components/features/...'
'@/lib/ar'
```
