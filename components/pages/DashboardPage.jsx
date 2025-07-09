"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api.js"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"
import Modal from "../ui/Modal.jsx"
import CardIcon from "../icons/CardIcon.jsx"

export default function DashboardPage({ user, onNavigate, onLogout, showToast }) {
  const [templates, setTemplates] = useState([])
  const [userCards, setUserCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  const categories = [
    { id: "all", name: "ทั้งหมด" },
    { id: "popular", name: "เทมเพลตยอดนิยม" },
    { id: "creative", name: "สร้างสรรค์" },
    { id: "modern", name: "โมเดิร์น" },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [templatesData, cardsData] = await Promise.all([api.getTemplates(), api.getUserCards(user.id)])
      setTemplates(templatesData)
      setUserCards(cardsData)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates =
    selectedCategory === "all" ? templates : templates.filter((t) => t.category === selectedCategory)

  const handleDeleteCard = async () => {
    try {
      await api.deleteCard(cardToDelete.id)
      setUserCards(userCards.filter((c) => c.id !== cardToDelete.id))
      showToast("ลบนามบัตรสำเร็จ")
      setShowDeleteModal(false)
      setCardToDelete(null)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการลบนามบัตร", "error")
    }
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
              <h1 className="text-xl font-semibold text-gray-900">AR Business Card</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">สวัสดี, {user.name}</span>
              {user.role === "admin" && (
                <button
                  onClick={() => onNavigate("admin-dashboard")}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  จัดการระบบ
                </button>
              )}
              <button onClick={onLogout} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CardIcon className="w-5 h-5 mr-2" />
              นามบัตรของฉัน
            </h2>
          </div>

          {userCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {userCards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{card.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{card.data.name}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onNavigate("card-editor", { cardId: card.id })}
                        className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => onNavigate("ar-viewer", { cardId: card.id })}
                        className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        ดู AR
                      </button>
                      <button
                        onClick={() => {
                          setCardToDelete(card)
                          setShowDeleteModal(true)
                        }}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border">
              <CardIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">คุณยังไม่มีนามบัตร</p>
              <p className="text-sm text-gray-500">เลือกเทมเพลตด้านล่างเพื่อสร้างนามบัตรแรกของคุณ</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">เลือกเทมเพลต</h2>

          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{template.type === "vertical" ? "แนวตั้ง" : "แนวนอน"}</p>
                  <button
                    onClick={() => onNavigate("card-editor", { templateId: template.id })}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    ใช้เทมเพลตนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="ยืนยันการลบ">
        <div className="space-y-4">
          <p className="text-gray-600">คุณแน่ใจหรือไม่ที่จะลบนามบัตร "{cardToDelete?.name}"?</p>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteCard}
              className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              ลบ
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
