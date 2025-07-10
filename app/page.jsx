"use client"

import { useState, useEffect } from "react"
import RegisterPage from "@/components/pages/RegisterPage"
import DashboardPage from "@/components/pages/DashboardPage"
import LoginPage from "@/components/pages/LoginPage"

// Main App Component
export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)

  // เช็คข้อมูลผู้ใช้จาก localStorage ตอน load หน้า
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
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
    // ใช้ toast library หรือ alert ชั่วคราว
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
