"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api.js"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"
import Modal from "../ui/Modal.jsx"
import CardIcon from "../icons/CardIcon.jsx"
import CardEditorPage from "./CardEditorPage.jsx"

export default function DashboardPage({ user, onNavigate, onLogout, showToast }) {
  const [templates, setTemplates] = useState([])
  const [userCards, setUserCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)
  console.log("User data:", user)

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CardIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AR Business Card
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user.username?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">สวัสดี, {user.username}</span>
              </div>
              {user.role === "admin" && (
                <button
                  onClick={() => onNavigate("admin-dashboard")}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  จัดการระบบ
                </button>
              )}
              <button 
                onClick={onLogout} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ, {user.username}!</h2>
                <p className="text-gray-600">จัดการและสร้างนามบัตร AR ของคุณได้ที่นี่</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userCards.length}</div>
                  <div className="text-sm text-gray-500">นามบัตร</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{templates.length}</div>
                  <div className="text-sm text-gray-500">เทมเพลต</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <CardIcon className="w-6 h-6 text-white" />
              </div>
              นามบัตรของฉัน
            </h2>
            <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              {userCards.length} รายการ
            </div>
          </div>

          {userCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {userCards.map((card) => (
                <div key={card.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <CardIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{card.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{card.data.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onNavigate(CardEditorPage, { cardId: card.id })}
                        className="px-3 py-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => onNavigate("ar-viewer", { cardId: card.id })}
                        className="px-3 py-2 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium"
                      >
                        ดู AR
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setCardToDelete(card)
                        setShowDeleteModal(true)
                      }}
                      className="w-full mt-2 px-3 py-2 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CardIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีนามบัตร</h3>
              <p className="text-gray-600 mb-4">เริ่มต้นสร้างนามบัตร AR แรกของคุณ</p>
              <p className="text-sm text-gray-500">เลือกเทมเพลตด้านล่างเพื่อเริ่มต้น</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              เลือกเทมเพลต
            </h2>
            <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              {filteredTemplates.length} เทมเพลต
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                  <img
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.type === "vertical" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {template.type === "vertical" ? "แนวตั้ง" : "แนวนอน"}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate("card-editor", { templateId: template.id })}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
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
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">คุณแน่ใจหรือไม่?</h3>
              <p className="text-gray-600">การลบนามบัตร "{cardToDelete?.name}" ไม่สามารถยกเลิกได้</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteCard}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ลบนามบัตร
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-300 transition-all duration-300"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
