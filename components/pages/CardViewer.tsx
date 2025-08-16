"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ARViewerPage from '@/components/features/ar-viewer/ARViewerPage';

/**
 * Example component showing how to use ARViewerPage with dynamic cardId
 */
const CardViewer: React.FC = () => {
  const [showAR, setShowAR] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Example cards available in the database
  const availableCards = [
    { id: 1, name: "นามบัตรของสมชาย", targetIndex: 0, owner: "สมชาย ใจดี" },
    { id: 2, name: "นามบัตรสร้างสรรค์", targetIndex: 1, owner: "วรรณิดา สวยงาม" },
    { id: 3, name: "นามบัตรธุรกิจ", targetIndex: 2, owner: "ประพันธ์ ธุรกิจดี" },
  ];

  const handleViewAR = (cardId: number) => {
    setSelectedCardId(cardId);
    setShowAR(true);
  };

  const handleCloseAR = () => {
    setShowAR(false);
    setSelectedCardId(null);
  };

  if (showAR && selectedCardId) {
    return (
      <div className="relative">
        <ARViewerPage cardId={selectedCardId} />
        <Button 
          onClick={handleCloseAR}
          className="absolute top-4 right-4 z-[10000] bg-red-500 hover:bg-red-600"
        >
          ปิด AR
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">เลือกนามบัตรเพื่อดู AR</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCards.map((card) => (
          <Card key={card.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>เจ้าของ: {card.owner}</CardDescription>
              <CardDescription>Target Index: {card.targetIndex}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleViewAR(card.id)}
                className="w-full"
              >
                ดู AR Experience
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">วิธีการใช้งาน:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>เลือกนามบัตรที่ต้องการดู AR Experience</li>
          <li>ระบบจะโหลดข้อมูลจากฐานข้อมูลตาม cardId</li>
          <li>AR จะใช้ Target Index ที่เฉพาะเจาะจงสำหรับแต่ละนามบัตร</li>
          <li>เล็งกล้องไปที่ Marker ที่ถูกต้องในไฟล์ .mind</li>
        </ol>
      </div>

      <div className="mt-6 p-6 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-bold mb-2">หมายเหตุสำหรับนักพัฒนา:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>ข้อมูลในฐานข้อมูลต้องมี <code>targetIndex</code> สำหรับแต่ละ card</li>
          <li>ไฟล์ <code>mind/targets.mind</code> ต้องมี marker หลายตัวที่สอดคล้องกับ index</li>
          <li>แต่ละ <code>targetIndex</code> จะอ้างอิงถึง marker ตัวที่ต่างกันในไฟล์ .mind</li>
          <li>สามารถส่ง <code>cardData</code> โดยตรงแทน <code>cardId</code> ได้หากต้องการ</li>
        </ul>
      </div>
    </div>
  );
};

export default CardViewer;
