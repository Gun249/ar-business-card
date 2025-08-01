"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import sweetalert from "sweetalert2"
import axios from "axios"


interface LoginProps {
  onAuth: (user: { id: string; name: string; email: string }) => void
  onSwitchToSignup: () => void
}

export default function Login({ onAuth, onSwitchToSignup }: LoginProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน")
      return
    } 
    
    setLoading(true)
    const { username, password } = formData
    
    try {
      const response = await axios.post(`http://localhost:5000/users/login`, {
        username, 
        password
      })
      
      if (!response.data) {
        setError("ไม่พบผู้ใช้ กรุณาลงทะเบียนก่อนเข้าสู่ระบบ")
        return
      } else if (response.data.error === 'รหัสผ่านไม่ถูกต้อง') {
        sweetalert.fire({
          title: "เข้าสู่ระบบล้มเหลว",
          text: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง"
        })
        return
      } else if (response.data) {
        sweetalert.fire({
          title: "เข้าสู่ระบบสำเร็จ",
          text: "ยินดีต้อนรับเข้าสู่ระบบ",
          icon: "success",
          confirmButtonText: "ตกลง"
        }).then(() => {
          onAuth({
            id: response.data.user?.id || response.data.id || "1",
            name: response.data.user?.name || response.data.username || username,
            email: response.data.user?.email || response.data.email || ""
          })
        })
        return
      }

    } catch (err) {
      console.error("Login error:", err)
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  } 
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
          <p className="text-gray-600">ยินดีต้อนรับกลับมา!</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
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
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="กรอกรหัสผ่านของคุณ"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">ยังไม่มีบัญชี? </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              สมัครสมาชิก
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
