"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CameraIcon from "../icons/CameraIcon"
import ZapIcon from "../icons/ZapIcon"
import UserIcon from "../icons/UserIcon"
import ArrowRightIcon from "../icons/ArrowRightIcon"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation for Landing Page */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/placeholder-logo.svg"
                alt="AR Business Card Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AR Business Card</h1>
            </div>
            <Button onClick={onGetStarted} variant="outline">
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              เปลี่ยนโฉม
              <span className="text-blue-600"> นามบัตรของคุณ</span>
              <br />
              ด้วยเทคโนโลยี Augmented Reality
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              สร้างนามบัตร AR แบบอินเตอร์แอคทีฟที่มีชีวิตเมื่อสแกน แชร์ข้อมูลติดต่อ 
              โซเชียลมีเดีย และผลงานของคุณในรูปแบบที่น่าจดจำ
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              เริ่มต้นใช้งาน
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ทำไมต้องเลือกนามบัตร AR?</h2>
            <p className="text-lg text-gray-600">โดดเด่นจากคนอื่นด้วยเทคโนโลยีล้ำสมัย</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <CameraIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">ประสบการณ์แบบอินเตอร์แอคทีฟ</h3>
                <p className="text-gray-600">
                  ผู้ติดต่อสามารถสแกนนามบัตรของคุณด้วยโทรศัพท์เพื่อดูข้อมูลในรูปแบบ 3D ที่มีชีวิต
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <ZapIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">อัปเดตทันที</h3>
                <p className="text-gray-600">
                  อัปเดตข้อมูลของคุณได้ตลอดเวลา และนามบัตร AR จะอัปเดตให้โดยอัตโนมัติ
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <UserIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">เนตเวิร์กกิ้งที่ดีขึ้น</h3>
                <p className="text-gray-600">
                  สร้างความประทับใจครั้งแรกที่น่าจดจำ และให้ผู้ติดต่อจำคุณได้ไม่มีวันลืม
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">พร้อมสร้างนามบัตร AR ของคุณแล้วหรือยัง?</h2>
          <p className="text-xl text-blue-100 mb-8">
            เข้าร่วมกับผู้เชี่ยวชาญหลายพันคนที่ใช้ AR เพื่อเพิ่มศักยภาพในการสร้างเครือข่าย
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            เริ่มสร้างเลย
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
