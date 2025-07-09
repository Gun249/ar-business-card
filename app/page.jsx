"use client"

import { useState, useEffect } from "react"

// Mock API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const users = [
  {
    id: 1,
    email: "admin@example.com",
    name: "ผู้ดูแลระบบ",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    email: "user@example.com",
    name: "ผู้ใช้ทั่วไป",
    role: "user",
    createdAt: new Date("2024-01-15"),
  },
]

const templates = [
  {
    id: 1,
    name: "เทมเพลตธุรกิจคลาสสิค",
    category: "popular",
    type: "vertical",
    thumbnail: "/placeholder.svg?height=200&width=150",
    fields: ["name", "title", "company", "phone", "email", "website"],
  },
  {
    id: 2,
    name: "เทมเพลตสร้างสรรค์",
    category: "creative",
    type: "horizontal",
    thumbnail: "/placeholder.svg?height=150&width=200",
    fields: ["name", "title", "company", "phone", "email", "portfolio"],
  },
  {
    id: 3,
    name: "เทมเพลตมืออาชีพ",
    category: "popular",
    type: "vertical",
    thumbnail: "/placeholder.svg?height=200&width=150",
    fields: ["name", "title", "company", "phone", "email", "linkedin"],
  },
]

const cards = []

let currentUser = null

const api = {
  async login(credentials) {
    await delay(1000)
    const user = users.find((u) => u.email === credentials.email)
    if (!user) {
      throw new Error("ไม่พบผู้ใช้งานนี้ในระบบ")
    }
    currentUser = user
    return user
  },

  async logout() {
    await delay(500)
    currentUser = null
  },

  async getCurrentUser() {
    await delay(300)
    return currentUser
  },

  async getTemplates() {
    await delay(800)
    return templates
  },

  async getUserCards(userId) {
    await delay(600)
    return cards.filter((c) => c.userId === userId)
  },
}

// Components
function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      ></div>
    </div>
  )
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500"

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm`}>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function LoginPage({ onLogin, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await onLogin(formData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm text-gray-600">เข้าสู่ระบบเพื่อจัดการนามบัตร AR ของคุณ</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกอีเมลของคุณ"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่านของคุณ"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : "เข้าสู่ระบบ"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">ยังไม่มีบัญชี? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              สมัครสมาชิก
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">ข้อมูลสำหรับทดสอบ:</p>
            <p className="text-xs text-gray-500">Admin: admin@example.com</p>
            <p className="text-xs text-gray-500">User: user@example.com</p>
            <p className="text-xs text-gray-500">Password: อะไรก็ได้</p>
          </div>
        </form>
      </div>
    </div>
  )
}

function DashboardPage({ user, onLogout, onNavigate }) {
  const [templates, setTemplates] = useState([])
  const [userCards, setUserCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [templatesData, cardsData] = await Promise.all([api.getTemplates(), api.getUserCards(user.id)])
      setTemplates(templatesData)
      setUserCards(cardsData)
    } catch (error) {
      console.error("Failed to load data:", error)
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
              <h1 className="text-xl font-semibold text-gray-900">AR Business Card</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">สวัสดี, {user.name}</span>
              {user.role === "admin" && (
                <button
                  onClick={() => onNavigate("admin")}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            นามบัตรของฉัน
          </h2>

          {userCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {userCards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{card.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{card.data.name}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onNavigate("card-editor", card.id)}
                        className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => onNavigate("ar-viewer", card.id)}
                        className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        ดู AR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-600 mb-4">คุณยังไม่มีนามบัตร</p>
              <p className="text-sm text-gray-500">เลือกเทมเพลตด้านล่างเพื่อสร้างนามบัตรแรกของคุณ</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">เลือกเทมเพลต</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="bg-gray-100 rounded-t-lg overflow-hidden">
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
                    onClick={() => onNavigate("card-editor", template.id)}
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
    </div>
  )
}

function RegisterPage({ onNavigateToLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">สมัครสมาชิก</h2>
          <p className="mt-2 text-sm text-gray-600">สร้างบัญชีเพื่อเริ่มใช้งานนามบัตร AR</p>
        </div>

        <div className="mt-8 bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-600 mb-4">ฟีเจอร์สมัครสมาชิกจะเปิดให้ใช้งานเร็วๆ นี้</p>
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  )
}

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
