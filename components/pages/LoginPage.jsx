"use client"

import { useState } from "react"
import { api } from "../../lib/api.js"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"
import sweetalert from "sweetalert2"
import axios from "axios"


export default function LoginPage({ onNavigateToRegister, onNavigateToDashboard }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน")
      return
    } 
    const { username, password } = formData
    try{
      const response = await axios.post(`http://localhost:5000/users/login`, {
        username, 
        password
      })
      if (!response.data) {
        setError("ไม่พบผู้ใช้ กรุณาลงทะเบียนก่อนเข้าสู่ระบบ")
        return
      } else if (response.data.error ==='รหัสผ่านไม่ถูกต้อง') {
        sweetalert.fire({
          title: "เข้าสู่ระบบล้มเหลว",
          text: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง"
        })
        return
      } else if (response.data){
        sweetalert.fire({
          title: "เข้าสู่ระบบสำเร็จ",
          text: "ยินดีต้อนรับเข้าสู่ระบบ",
          icon: "success",
          confirmButtonText: "ตกลง"
        }).then(() => {
          onNavigateToDashboard(response.data.user || response.data)
        })
        return
      }
      setLoading(true)

    } catch (err) {
      console.error("Login error:", err)
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const user = await api.loginWithGoogle()
      sweetalert.fire({
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับกลับมา",
        icon: "success",
        confirmButtonText: "ตกลง"
      }).then(() => {
        localStorage.setItem('user', JSON.stringify(user))
        onNavigateToDashboard()
      })
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : "เข้าสู่ระบบ"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              เข้าสู่ระบบด้วย Google
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
        </form>
      </div>
    </div>
  )
}
