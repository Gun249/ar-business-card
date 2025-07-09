"use client"

import { useState, useEffect } from "react"
import { api } from "../../api.js"
import LoadingSpinner from "../../components/LoadingSpinner.jsx"
import Modal from "../../components/Modal.jsx"
import UserIcon from "../../components/icons/UserIcon.jsx"

export default function AdminUsers({ user, onNavigate, showToast }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const usersData = await api.getAllUsers()
      setUsers(usersData)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole)
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      showToast("อัปเดตสิทธิ์ผู้ใช้สำเร็จ")
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการอัปเดตสิทธิ์", "error")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await api.deleteUser(userToDelete.id)
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      showToast("ลบผู้ใช้สำเร็จ")
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการลบผู้ใช้", "error")
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
              <button onClick={() => onNavigate("admin-dashboard")} className="text-gray-600 hover:text-gray-900">
                ← กลับ
              </button>
              <h1 className="text-xl font-semibold text-gray-900">จัดการผู้ใช้</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                รายชื่อผู้ใช้ ({users.length} คน)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ใช้
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อีเมล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สิทธิ์
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่สมัคร
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userData.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userData.role}
                        onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                        disabled={userData.id === user.id}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="user">ผู้ใช้</option>
                        <option value="admin">ผู้ดูแลระบบ</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {userData.id !== user.id && (
                        <button
                          onClick={() => {
                            setUserToDelete(userData)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="ยืนยันการลบผู้ใช้">
        <div className="space-y-4">
          <p className="text-gray-600">คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "{userToDelete?.name}"?</p>
          <p className="text-sm text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteUser}
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
