"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api.js"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"
import CameraIcon from "../icons/CameraIcon.jsx"

export default function ARViewerPage({ cardId, onNavigate }) {
  const [arContent, setArContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [targetFound, setTargetFound] = useState(false)

  useEffect(() => {
    loadARContent()
  }, [cardId])

  const loadARContent = async () => {
    try {
      const content = await api.getARContent(cardId)
      setArContent(content)
    } catch (error) {
      console.error("Failed to load AR content:", error)
    } finally {
      setLoading(false)
    }
  }

  const simulateTargetFound = () => {
    setIsScanning(true)
    setTimeout(() => {
      setTargetFound(true)
      setIsScanning(false)
    }, 2000)
  }

  const resetViewer = () => {
    setTargetFound(false)
    setIsScanning(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-50 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate("dashboard")} className="text-white hover:text-gray-300">
            ← กลับ
          </button>
          <h1 className="text-lg font-semibold">AR Viewer</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Camera Simulation */}
      <div className="relative w-full h-screen bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Simulated camera feed background */}
        <div className="absolute inset-0 bg-gray-700 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-30"></div>
        </div>

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg">กำลังสแกนเป้าหมาย...</p>
            </div>
          </div>
        )}

        {/* Target found overlay */}
        {targetFound && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30">
            <div className="bg-white text-black rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 transform scale-110">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CameraIcon className="w-8 h-8 text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{arContent.cardData.name}</h2>

                <div className="space-y-2 text-gray-600">
                  <p className="font-medium">{arContent.cardData.title}</p>
                  <p>{arContent.cardData.company}</p>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  {arContent.cardData.phone && (
                    <div className="flex items-center justify-center space-x-2">
                      <span>📞</span>
                      <span>{arContent.cardData.phone}</span>
                    </div>
                  )}
                  {arContent.cardData.email && (
                    <div className="flex items-center justify-center space-x-2">
                      <span>✉️</span>
                      <span>{arContent.cardData.email}</span>
                    </div>
                  )}
                  {arContent.cardData.website && (
                    <div className="flex items-center justify-center space-x-2">
                      <span>🌐</span>
                      <span>{arContent.cardData.website}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      // Simulate saving contact
                      alert("บันทึกรายชื่อสำเร็จ!")
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    บันทึกรายชื่อ
                  </button>
                  <button
                    onClick={resetViewer}
                    className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    สแกนใหม่
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isScanning && !targetFound && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 border-2 border-white border-dashed rounded-lg mx-auto flex items-center justify-center">
                <img
                  src={arContent.targetImage || "/placeholder.svg"}
                  alt="Target"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
              <p className="text-lg">จ่องกล้องไปที่รูปภาพเป้าหมายด้านบน</p>
              <button
                onClick={simulateTargetFound}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                จำลองการพบเป้าหมาย
              </button>
            </div>
          </div>
        )}

        {/* Viewfinder */}
        {!targetFound && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white border-opacity-50 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
