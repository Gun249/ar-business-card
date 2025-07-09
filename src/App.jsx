"use client"

import { useState, useEffect } from "react"
import { api } from "./api.js"

// Pages
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import CardEditorPage from "./pages/CardEditorPage.jsx"
import ARViewerPage from "./pages/ARViewerPage.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import AdminUsers from "./pages/admin/AdminUsers.jsx"
import AdminTemplates from "./pages/admin/AdminTemplates.jsx"

// Components
import Toast from "./components/Toast.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"

export default function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [pageData, setPageData] = useState({})

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
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogin = async (credentials) => {
    try {
      const userData = await api.login(credentials)
      setUser(userData)
      setCurrentPage("dashboard")
      showToast("เข้าสู่ระบบสำเร็จ")
    } catch (error) {
      showToast(error.message, "error")
    }
  }

  const handleRegister = async (userData) => {
    try {
      const newUser = await api.register(userData)
      setUser(newUser)
      setCurrentPage("dashboard")
      showToast("สมัครสมาชิกสำเร็จ")
    } catch (error) {
      showToast(error.message, "error")
    }
  }

  const handleLogout = async () => {
    await api.logout()
    setUser(null)
    setCurrentPage("login")
    showToast("ออกจากระบบสำเร็จ")
  }

  const navigateTo = (page, data = {}) => {
    setCurrentPage(page)
    setPageData(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo("register")} />
      case "register":
        return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => navigateTo("login")} />
      case "dashboard":
        return <DashboardPage user={user} onNavigate={navigateTo} onLogout={handleLogout} showToast={showToast} />
      case "card-editor":
        return (
          <CardEditorPage
            user={user}
            templateId={pageData.templateId}
            cardId={pageData.cardId}
            onNavigate={navigateTo}
            showToast={showToast}
          />
        )
      case "ar-viewer":
        return <ARViewerPage cardId={pageData.cardId} onNavigate={navigateTo} />
      case "admin-dashboard":
        return <AdminDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />
      case "admin-users":
        return <AdminUsers user={user} onNavigate={navigateTo} showToast={showToast} />
      case "admin-templates":
        return <AdminTemplates user={user} onNavigate={navigateTo} showToast={showToast} />
      default:
        return <div>หน้าไม่พบ</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
