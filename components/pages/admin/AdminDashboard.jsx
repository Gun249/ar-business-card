"use client"

import { useState, useEffect } from "react"
import { api } from "../../../lib/api.js"
import LoadingSpinner from "../../ui/LoadingSpinner.jsx"
import UserIcon from "../../icons/UserIcon.jsx"
import CardIcon from "../../icons/CardIcon.jsx"
import TemplateIcon from "../../icons/TemplateIcon.jsx"
import StatsIcon from "../../icons/StatsIcon.jsx"

export default function AdminDashboard({ user, onNavigate, onLogout }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const statsData = await api.getStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
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
              <h1 className="text-xl font-semibold text-gray-900">จัดการระบบ</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                กลับสู่หน้าหลัก
              </button>
              <span className="text-sm text-gray-600">สวัสดี, {user.username}</span>
              <button onClick={onLogout} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CardIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">นามบัตรทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TemplateIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">เทมเพลต</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <StatsIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ผู้ดูแลระบบ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <UserIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">จัดการผู้ใช้</h3>
            </div>
            <p className="text-gray-600 mb-4">ดูรายชื่อผู้ใช้ แก้ไขสิทธิ์ และจัดการบัญชีผู้ใช้</p>
            <button
              onClick={() => onNavigate("admin-users")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              จัดการผู้ใช้
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <TemplateIcon className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">จัดการเทมเพลต</h3>
            </div>
            <p className="text-gray-600 mb-4">เพิ่ม แก้ไข และลบเทมเพลตนามบัตร</p>
            <button
              onClick={() => onNavigate("admin-templates")}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              จัดการเทมเพลต
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <StatsIcon className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">รายงานและสถิติ</h3>
            </div>
            <p className="text-gray-600 mb-4">ดูสถิติการใช้งานและรายงานต่างๆ</p>
            <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
              เร็วๆ นี้
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
