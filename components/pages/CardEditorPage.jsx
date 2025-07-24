"use client"

import { useState, useEffect } from "react"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"

export default function CardEditorPage({ user, templateId, cardId, onNavigate, showToast }) {
  const [template, setTemplate] = useState(null)
  const [cardData, setCardData] = useState({})
  const [cardName, setCardName] = useState("")
  const [targetImage, setTargetImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [templateId, cardId])

  const loadData = async () => {
    try {
      if (cardId) {
        // Edit existing card
        const card = await api.getCard(cardId)
        const templateData = await api.getTemplate(card.templateId)
        setTemplate(templateData)
        setCardData(card.data)
        setCardName(card.name)
        setTargetImage(card.targetImage)
      } else if (templateId) {
        // Create new card
        const templateData = await api.getTemplate(templateId)
        setTemplate(templateData)
        setCardName(`นามบัตรจาก ${templateData.name}`)

        // Initialize empty data
        const initialData = {}
        templateData.fields.forEach((field) => {
          initialData[field] = ""
        })
        setCardData(initialData)
      }
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error")
      onNavigate("dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await api.uploadFile(file)
      setTargetImage(imageUrl)
      showToast("อัปโหลดรูปภาพสำเร็จ")
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    // Validation
    const requiredFields = template.fields.filter((field) => ["name", "email", "phone"].includes(field))

    const missingFields = requiredFields.filter((field) => !cardData[field]?.trim())
    if (missingFields.length > 0) {
      showToast("กรุณากรอกข้อมูลที่จำเป็น: " + missingFields.join(", "), "error")
      return
    }

    if (!targetImage) {
      showToast("กรุณาอัปโหลดรูปภาพเป้าหมาย AR", "error")
      return
    }

    setSaving(true)
    try {
      const saveData = {
        userId: user.id,
        templateId: template.id,
        name: cardName,
        data: cardData,
        targetImage,
      }

      if (cardId) {
        await api.updateCard(cardId, saveData)
        showToast("บันทึกนามบัตรสำเร็จ")
      } else {
        await api.createCard(saveData)
        showToast("สร้างนามบัตรสำเร็จ")
      }

      onNavigate("dashboard")
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการบันทึก", "error")
    } finally {
      setSaving(false)
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      name: "ชื่อ-นามสกุล",
      title: "ตำแหน่ง",
      company: "บริษัท",
      phone: "เบอร์โทรศัพท์",
      email: "อีเมล",
      website: "เว็บไซต์",
      portfolio: "พอร์ตโฟลิโอ",
      linkedin: "LinkedIn",
      social: "โซเชียลมีเดีย",
    }
    return labels[field] || field
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => onNavigate("dashboard")} className="text-gray-600 hover:text-gray-900">
                ← กลับ
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{cardId ? "แก้ไขนามบัตร" : "สร้างนามบัตรใหม่"}</h1>
              {template && <span className="text-sm text-gray-500">({template.name})</span>}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <LoadingSpinner size="sm" /> : "บันทึก"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลนามบัตร</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อนามบัตร</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ตั้งชื่อให้นามบัตรของคุณ"
                  />
                </div>

                {template?.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getFieldLabel(field)}
                      {["name", "email", "phone"].includes(field) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={cardData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`กรอก${getFieldLabel(field)}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AR Target Image Upload */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">รูปภาพเป้าหมาย AR</h2>
              <p className="text-sm text-gray-600 mb-4">
                อัปโหลดรูปภาพที่จะใช้เป็นเป้าหมายสำหรับ AR (ควรเป็นรูปที่มีรายละเอียดชัดเจน ไม่เบลอ และมีสีสันที่หลากหลาย)
              </p>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {targetImage ? (
                    <div className="space-y-4">
                      <img
                        src={targetImage || "/placeholder.svg"}
                        alt="Target"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                      <p className="text-sm text-green-600">รูปภาพถูกอัปโหลดแล้ว</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="target-image"
                  />
                  <label
                    htmlFor="target-image"
                    className={`inline-block px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${
                      uploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? <LoadingSpinner size="sm" /> : targetImage ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
                  </label>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• รองรับไฟล์ JPG และ PNG เท่านั้น</p>
                  <p>• ขนาดไฟล์ไม่เกิน 5MB</p>
                  <p>• ควรเป็นรูปที่มีความคมชัดและรายละเอียดที่ชัดเจน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ตัวอย่างนามบัตร</h2>

              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                <div
                  className={`bg-white rounded-lg shadow-lg p-6 ${
                    template?.type === "horizontal" ? "w-80 h-48" : "w-64 h-80"
                  } flex flex-col justify-center`}
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{cardData.name || "ชื่อ-นามสกุล"}</h3>
                    <p className="text-sm text-gray-600">{cardData.title || "ตำแหน่ง"}</p>
                    <p className="text-sm text-gray-600">{cardData.company || "บริษัท"}</p>
                    <div className="pt-2 space-y-1 text-xs text-gray-500">
                      {cardData.phone && <p>📞 {cardData.phone}</p>}
                      {cardData.email && <p>✉️ {cardData.email}</p>}
                      {cardData.website && <p>🌐 {cardData.website}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">นี่เป็นเพียงตัวอย่าง การแสดงผลจริงจะขึ้นอยู่กับเทมเพลตที่เลือก</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
