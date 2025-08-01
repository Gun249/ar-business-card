"use client"

import { useState, useEffect } from "react"
import RegisterPage from "@/components/pages/RegisterPage"
import LoginPage from "@/components/pages/LoginPage"
import LandingPage from "@/components/pages/landing-page"
import MyBusinessCards from "@/components/pages/my-business-cards"
import UserProfile from "@/components/pages/user-profile"
import TemplateSelection from "@/components/pages/template-selection"
import Navigation from "@/components/pages/navigation"
import dynamic from 'next/dynamic';
import type { User, BusinessCard, PageType, ToastType } from "@/types"

const ARCardViewer = dynamic(
  () => import('@/components/pages/ARViewerPage'),
  { ssr: false } // <-- คำสั่งสำคัญ! คือการบอกว่า "ไม่ต้องทำ Server-Side Rendering"
);

// Main App Component
export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing")
  const [user, setUser] = useState<User | null>(null)
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])

  // เช็คข้อมูลผู้ใช้จาก localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        console.log('Loaded user from localStorage:', userData)
        // ถ้ามี user แล้วให้ไปที่หน้า my-cards
        setCurrentPage("my-cards")
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }

    // โหลดข้อมูลนามบัตร
    const savedCards = localStorage.getItem('businessCards')
    if (savedCards) {
      try {
        const cardsData = JSON.parse(savedCards)
        setBusinessCards(cardsData)
      } catch (error) {
        console.error('Error parsing business cards:', error)
      }
    }
  }, [])

  const navigateTo = (page: PageType): void => {
    setCurrentPage(page)
  }

  const handleLogin = (userData: User): void => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage("my-cards")
  }

  const handleLogout = (): void => {
    setUser(null)
    setBusinessCards([])
    localStorage.removeItem('user')
    localStorage.removeItem('businessCards')
    setCurrentPage("landing")
  }

  const showToast = (message: string, type: ToastType): void => {
    alert(`${type}: ${message}`)
  }

  // ฟังก์ชันเริ่มต้นใช้งาน
  const handleGetStarted = () => {
    if (user) {
      setCurrentPage("my-cards")
    } else {
      setCurrentPage("login")
    }
  }

  // ฟังก์ชันเลือก template
  const handleSelectTemplate = (templateId: string) => {
    console.log('Selected template:', templateId)
    setCurrentPage("my-cards")
  }

  // ฟังก์ชันลบการ์ด
  const handleDeleteCard = (cardId: string) => {
    const updatedCards = businessCards.filter(card => card.id !== cardId)
    setBusinessCards(updatedCards)
    localStorage.setItem('businessCards', JSON.stringify(updatedCards))
  }

  // ฟังก์ชันอัพเดทโปรไฟล์
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    console.log('Profile updated:', updatedUser)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />
      
      case "login":
        return (
          <LoginPage 
            onSwitchToSignup={() => navigateTo("register")} 
            onAuth={handleLogin}
          />
        )
      
      case "register":
        return (
          <RegisterPage 
            onSwitchToLogin={() => navigateTo("login")} 
            onAuth={handleLogin}
          />
        )
      
      case "templates":
        return <TemplateSelection onSelectTemplate={handleSelectTemplate} />
      
      case "my-cards":
        return (
          <div className="min-h-screen bg-background">
            {user && (
              <Navigation 
                user={user}
                onLogout={handleLogout}
                currentPage={currentPage}
                onNavigate={(page: string) => navigateTo(page as PageType)}
              />
            )}
            <MyBusinessCards 
              cards={businessCards}
              onDeleteCard={handleDeleteCard}
              onNavigate={(page: string) => navigateTo(page as PageType)}
            />
          </div>
        )
      
      case "profile":
        return user ? (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLogout={handleLogout}
              currentPage={currentPage}
              onNavigate={(page: string) => navigateTo(page as PageType)}
            />
            <UserProfile 
              user={user}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        ) : (
          <LandingPage onGetStarted={handleGetStarted} />
        )
      
      case "ar-viewer":
        return <ARCardViewer />
      
      default:
        return <LandingPage onGetStarted={handleGetStarted} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  )
}
