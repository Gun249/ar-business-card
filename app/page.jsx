"use client"

import { useState, useEffect } from "react"
import RegisterPage from "@/components/pages/RegisterPage"
import DashboardPage from "@/components/pages/DashboardPage"
import LoginPage from "@/components/pages/LoginPage"
import CardEditorPage from "@/components/pages/CardEditorPage"
import ARViewerPage from "@/components/pages/ARViewerPage"
import { api } from "@/lib/api.js"
import LoadingSpinner from "@/components/ui/LoadingSpinner.jsx"
import Toast from "@/components/ui/Toastt.jsx"
// Mock API


// Components



// Main App Component
export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await api.getCurrentUser()
      if (userData) {
        setUser(userData)
        setCurrentPage("dashboard")
      }
    } catch (error) {
      console.log("No authenticated user")
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const handleLogin = async (credentials) => {
    try {
      const userData = await api.login(credentials)
      setUser(userData)
      setCurrentPage("dashboard")
      showToast("เข้าสู่ระบบสำเร็จ")
    } catch (error) {
      throw error
    }
  }

  const handleLogout = async () => {
    await api.logout()
    setUser(null)
    setCurrentPage("login")
    showToast("ออกจากระบบสำเร็จ")
  }

  const navigateTo = (page, id = null) => {
    setCurrentPage(page)
    // สำหรับอนาคต: เก็บ id สำหรับ card editor หรือ AR viewer
    console.log(`Navigating to ${page}`, id ? `with ID: ${id}` : "")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo("register")} />
      case "register":
        return <RegisterPage onNavigateToLogin={() => navigateTo("login")} />
      case "dashboard":
        return <DashboardPage user={user} onLogout={handleLogout} onNavigate={navigateTo} />
      default:
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo("register")} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
