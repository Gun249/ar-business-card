"use client"

import { useState, useEffect } from "react"
import { api } from "../../../lib/api"
import LoadingSpinner from "../../ui/LoadingSpinner"
import Modal from "../../ui/Modal"
import type { User, Template, Category } from "@/types"

interface AdminTemplatesProps {
  user: User;
  onNavigate: (page: string) => void;
  showToast: (message: string, type: string) => void;
}

export default function AdminTemplates({ user, onNavigate, showToast }: AdminTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'id'>>({
    name: "",
    category: "popular",
    type: "vertical",
    fields: ["name", "title", "company", "phone", "email"],
  })

  const categories: Category[] = [
    { id: "popular", name: "ยอดนิยม" },
    { id: "creative", name: "สร้างสรรค์" },
    { id: "modern", name: "โมเดิร์น" },
  ]

  const availableFields = [
    { id: "name", name: "ชื่อ-นามสกุล" },
    { id: "title", name: "ตำแหน่ง" },
    { id: "company", name: "บริษัท" },
    { id: "phone", name: "เบอร์โทรศัพท์" },
    { id: "email", name: "อีเมล" },
    { id: "website", name: "เว็บไซต์" },
    { id: "portfolio", name: "พอร์ตโฟลิโอ" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "social", name: "โซเชียลมีเดีย" },
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const templatesData = await api.getTemplates()
      setTemplates(templatesData)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการโหลดเทมเพลต", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      showToast("กรุณากรอกชื่อเทมเพลต", "error")
      return
    }

    try {
      const createdTemplate = await api.createTemplate({
        ...newTemplate,
        thumbnail: "/placeholder.svg?height=200&width=150",
      })
      setTemplates([...templates, createdTemplate])
      showToast("สร้างเทมเพลตสำเร็จ", "success")
      setShowCreateModal(false)
      setNewTemplate({
        name: "",
        category: "popular",
        type: "vertical",
        fields: ["name", "title", "company", "phone", "email"],
      })
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการสร้างเทมเพลต", "error")
    }
  }

  const handleDeleteTemplate = async (): Promise<void> => {
    if (!templateToDelete) return
    
    try {
      await api.deleteTemplate(templateToDelete.id)
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id))
      showToast("ลบเทมเพลตสำเร็จ", "success")
      setShowDeleteModal(false)
      setTemplateToDelete(null)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการลบเทมเพลต", "error")
    }
  }

  const handleFieldToggle = (fieldId: string): void => {
    setNewTemplate((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldId) ? prev.fields.filter((f) => f !== fieldId) : [...prev.fields, fieldId],
    }))
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
              <button onClick={() => onNavigate("admin-dashboard")} className="text-gray-600 hover:text-gray-900">
                ← กลับ
              </button>
              <h1 className="text-xl font-semibold text-gray-900">จัดการเทมเพลต</h1>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              เพิ่มเทมเพลต
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {categories.find((c) => c.id === template.category)?.name} •{" "}
                  {template.type === "vertical" ? "แนวตั้ง" : "แนวนอน"}
                </p>
                <p className="text-xs text-gray-400 mb-3">ฟิลด์: {template.fields.length} รายการ</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setTemplateToDelete(template)
                      setShowDeleteModal(true)
                    }}
                    className="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Template Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="เพิ่มเทมเพลตใหม่">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเทมเพลต</label>
            <input
              type="text"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อเทมเพลต"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="เลือกหมวดหมู่"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
            <select
              value={newTemplate.type}
              onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="เลือกประเภท"
            >
              <option value="vertical">แนวตั้ง</option>
              <option value="horizontal">แนวนอน</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ฟิลด์ข้อมูล</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableFields.map((field) => (
                <label key={field.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.fields.includes(field.id)}
                    onChange={() => handleFieldToggle(field.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{field.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleCreateTemplate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              สร้างเทมเพลต
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="ยืนยันการลบเทมเพลต">
        <div className="space-y-4">
          <p className="text-gray-600">คุณแน่ใจหรือไม่ที่จะลบเทมเพลต "{templateToDelete?.name}"?</p>
          <p className="text-sm text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteTemplate}
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
