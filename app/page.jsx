"use client"

import { useState, useEffect } from "react"
import RegisterPage from "@/components/pages/RegisterPage"
import DashboardPage from "@/components/pages/DashboardPage"
import LoginPage from "@/components/pages/LoginPage"
import dynamic from 'next/dynamic';

const ARCardViewer = dynamic(
  () => import('@/components/pages/ARViewerPage'),
  { ssr: false } // <-- คำสั่งสำคัญ! คือการบอกว่า "ไม่ต้องทำ Server-Side Rendering"
);

// Main App Component
// Main App Component
export default function HomePage() {
  // แก้ไขค่าเริ่มต้นตรงนี้ เพื่อให้เริ่มที่หน้า ar-viewer
  const [currentPage, setCurrentPage] = useState("ar-viewer")
  const [user, setUser] = useState(null)

  // เช็คข้อมูลผู้ใช้จาก localStorage ตอน load หน้า
  useEffect(() => {
    // โค้ดส่วนนี้จะยังไม่ทำงานเพราะเราเริ่มที่หน้า ar-viewer แต่ไม่เป็นไร
    const savedUser = localStorage.getItem('ar-viewer')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setCurrentPage("dashboard")
        console.log('Loaded user from localStorage:', userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setCurrentPage("login")
  }

  const showToast = (message, type) => {
    alert(`${type}: ${message}`)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <LoginPage 
            onNavigateToRegister={() => navigateTo("register")} 
            onNavigateToDashboard={handleLogin}
          />
        )
      case "register":
        return (
          <RegisterPage 
            onNavigateToLogin={() => navigateTo("login")} 
          />
        )
      case "dashboard":
        return (
          <DashboardPage 
            user={user}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )
      case "ar-viewer":
        // เมื่อ currentPage เป็น 'ar-viewer' มันจะแสดงผลหน้านี้
        return (
          <ARCardViewer />
        )
      default:
        return (
          <LoginPage 
            onNavigateToRegister={() => navigateTo("register")} 
            onNavigateToDashboard={handleLogin}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  )
}
