"use client"

import { useState } from "react"
import { api } from "../../lib/api.js"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"
import axios from "axios"
import sweetalert from "sweetalert2"


export default function RegisterPage({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอก Username"
    }

    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง"
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน"
    } else if (formData.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const { username, email, password, confirmPassword } = formData
    
    try {
      if(!validateForm()){
        return
      }

      if (password !== confirmPassword) {
        sweetalert.fire({
          title: "รหัสผ่านไม่ตรงกัน",
          text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
          icon: "error",
          confirmButtonText: "ตกลง"
        })
        return
      }

      const response = await axios.post("http://localhost:5000/users/register", {
        username, 
        email, 
        password
      });

      if (response.status === 201) {
        sweetalert.fire({
          title: "สมัครสมาชิกสำเร็จ",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          icon: "success",
          confirmButtonText: "ไปหน้าเข้าสู่ระบบ"
        }).then(() => {
          onNavigateToLogin()
        })
      }

    } catch (error) {
      // จัดการ error response จาก server
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.error;
        
        if (errorMessage === 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว') {
          sweetalert.fire({
            title: "ชื่อผู้ใช้มีผู้ใช้งานแล้ว",
            text: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาใช้ชื่อผู้ใช้อื่น",
            icon: "error",
            confirmButtonText: "ตกลง"
          })
        } else if (errorMessage === 'อีเมลนี้ถูกใช้งานแล้ว') {
          sweetalert.fire({
            title: "อีเมลมีผู้ใช้งานแล้ว",
            text: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น",
            icon: "error",
            confirmButtonText: "ตกลง"
          })
        } else {
          sweetalert.fire({
            title: "ข้อมูลซ้ำ",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "ตกลง"
          })
        }
      } else if (error.response && error.response.status === 400) {
        sweetalert.fire({
          title: "ข้อมูลไม่ครบถ้วน",
          text: error.response.data.error || "กรุณากรอกข้อมูลให้ครบถ้วน",
          icon: "error",
          confirmButtonText: "ตกลง"
        })
      } else {
        sweetalert.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง"
        })
      }
    } finally {
      setLoading(false)
    }
  }
    
  const handleGoogleRegister = async () => {
    setLoading(true)
    try {
      const user = await api.loginWithGoogle()
      sweetalert.fire({
        title: "สมัครสมาชิกสำเร็จ",
        text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
        icon: "success",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ"
      }).then(() => {
        onNavigateToLogin()
      })
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">สมัครสมาชิก</h2>
          <p className="mt-2 text-sm text-gray-600">สร้างบัญชีเพื่อเริ่มใช้งานนามบัตร AR</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.username ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="กรอก Username ของคุณ"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="กรอกอีเมลของคุณ"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : "สมัครสมาชิก"}
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
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
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
              สมัครด้วย Google
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">มีบัญชีอยู่แล้ว? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
