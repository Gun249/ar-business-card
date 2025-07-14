// components/pages/ARCardViewer.jsx
"use client"; // คำสั่งสำคัญ! บอกให้ Next.js รู้ว่านี่คือ Client Component

import React from 'react';


// --- นี่คือส่วนของข้อมูลจำลอง (Mock Data) ---
// คุณสามารถเปลี่ยนข้อความหรือ URL รูปภาพตรงนี้ได้เลย
const MOCK_CARD_DATA = {
  username: "Gunnapat",
  title: "Full-Stack Developer",
  profilePicture: "/placeholder.svg?width=150&height=150&text=Me", // ใช้ placeholder หรือใส่ URL รูปของคุณเอง
  phone: "081-234-5678",
  email: "gun.dev@example.com"
};
// -----------------------------------------

const ARCardViewer = () => {
  // ในเวอร์ชันนี้เราไม่ต้องใช้ useEffect หรือ fetch
  // เพราะเราใช้ข้อมูลจำลองที่กำหนดไว้ข้างบน

  return (
    // a-scene คือพื้นที่ทั้งหมดของ AR
    <a-scene
      // mindar-image คือส่วนที่กำหนดค่าของ MindAR
      // 1. imageTargetSrc: บอกว่าให้ใช้ไฟล์ Target ที่ไหน (สำคัญมาก! แก้ชื่อไฟล์ให้ตรง)
      // 2. autoStart: ให้เริ่มทำงานทันที
      // 3. uiScanning: ซ่อน UI รูปแสกนของ MindAR (เราจะสร้างเองถ้าต้องการ)
      mindar-image="imageTargetSrc: mind/targets.mind; autoStart: true; uiScanning: no; uiError: no;"
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
    
      {/* a-camera คือมุมมองของผู้ใช้ */}
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      {/* a-entity คือ "สิ่งที่ลอยอยู่" เมื่อเจอ Target (นามบัตรจริง) */}
      {/* targetIndex="0" หมายถึง Target รูปแรกในไฟล์ .mind */}
      <a-entity mindar-image-target="targetIndex: 0">

        {/* ต่อไปนี้คือ Component ของ A-Frame สำหรับแสดงผล 3D */}

        {/* แสดงชื่อผู้ใช้ */}
        <a-text
          value={MOCK_CARD_DATA.username}
          color="#333333"
          align="center"
          width="2.5"
          position="0 0.8 0"
        ></a-text>

         {/* แสดงตำแหน่ง */}
         <a-text
          value={MOCK_CARD_DATA.title}
          color="#555555"
          align="center"
          width="2"
          position="0 0.65 0"
        ></a-text>

        {/* แสดงรูปโปรไฟล์ */}
        <a-image
          src={MOCK_CARD_DATA.profilePicture}
          width="0.5"
          height="0.5"
          position="0 0.2 0"
        ></a-image>

         {/* สามารถเพิ่มปุ่มหรือข้อมูลอื่นๆ ได้ที่นี่ */}

      </a-entity>
    </a-scene>
  );
};

export default ARCardViewer;