"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import sweetalert from "sweetalert2"
import axios from "axios"

interface SignupProps {
  onAuth: (user: { id: string; name: string; email: string }) => void
  onSwitchToLogin: () => void
}

export default function Signup({ onAuth, onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    
    try {
      if (!validateForm()) {
        return
      }

      const { username, email, password, confirmPassword } = formData

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
      })

      if (response.status === 201) {
        sweetalert.fire({
          title: "สมัครสมาชิกสำเร็จ",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          icon: "success",
          confirmButtonText: "ไปหน้าเข้าสู่ระบบ"
        }).then(() => {
          onSwitchToLogin()
        })
      }

    } catch (error: any) {
      // จัดการ error response จาก server
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.error
        
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">สมัครสมาชิก</CardTitle>
          <p className="text-gray-600">สร้างบัญชีเพื่อเริ่มใช้งานนามบัตร AR</p>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="กรอก Username ของคุณ"
                className={errors.username ? "border-red-300" : ""}
                required
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            <div>
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="กรอกอีเมลของคุณ"
                className={errors.email ? "border-red-300" : ""}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                className={errors.password ? "border-red-300" : ""}
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className={errors.confirmPassword ? "border-red-300" : ""}
                required
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">มีบัญชีอยู่แล้ว? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
