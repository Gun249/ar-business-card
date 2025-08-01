"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Save, Play, ExternalLink, Sparkles, Volume2, RotateCcw, Phone, Mail, Globe } from "lucide-react"
import type { BusinessCard } from "@/types"

interface FinalPreviewProps {
  businessCard: BusinessCard
  onSave: () => void
}

export default function FinalPreview({ businessCard, onSave }: FinalPreviewProps) {
  const [scanningPhase, setScanningPhase] = useState<"idle" | "detecting" | "scanning" | "active">("idle")
  const [arAnimationPhase, setArAnimationPhase] = useState(0)

  const simulateScan = () => {
    setScanningPhase("detecting")
    setTimeout(() => setScanningPhase("scanning"), 1000)
    setTimeout(() => setScanningPhase("active"), 3000)
  }

  const resetPreview = () => {
    setScanningPhase("idle")
    setArAnimationPhase(0)
  }

  // AR Animation cycle when active
  useEffect(() => {
    if (scanningPhase === "active") {
      const interval = setInterval(() => {
        setArAnimationPhase((prev) => (prev + 1) % 4)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [scanningPhase])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AR Business Card Experience</h1>
        <p className="text-lg text-gray-600">
          Experience the full AR scanning process - from detection to interactive experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced AR Scanner Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>AR Scanner Experience</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetPreview}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Realistic Phone Interface */}
            <div className="bg-gray-900 rounded-3xl p-4 max-w-sm mx-auto shadow-2xl">
              {/* Phone Status Bar */}
              <div className="flex justify-between items-center text-white text-xs px-2 py-1">
                <span>9:41</span>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Camera Viewfinder */}
              <div className="bg-black rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative">
                  {/* Physical Business Card */}
                  <div className="absolute inset-8 transform perspective-1000">
                    <div
                      className={`bg-white rounded-lg shadow-2xl relative overflow-hidden transition-all duration-1000 ${
                        scanningPhase === "scanning" ? "animate-pulse" : ""
                      }`}
                    >
                      {businessCard.frontImage ? (
                        <img
                          src={businessCard.frontImage || "/placeholder.svg"}
                          alt="Physical business card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-4 text-center">
                          <div className="text-sm font-bold text-gray-800">{businessCard.name}</div>
                          <div className="text-xs text-blue-600">{businessCard.role}</div>
                          {businessCard.company && <div className="text-xs text-gray-600">{businessCard.company}</div>}
                        </div>
                      )}

                      {/* Detection Phase */}
                      {scanningPhase === "detecting" && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <div className="text-white text-xs font-medium animate-pulse">Detecting card...</div>
                        </div>
                      )}

                      {/* Scanning Phase */}
                      {scanningPhase === "scanning" && (
                        <>
                          <div className="absolute inset-0 border-2 border-blue-400 animate-pulse"></div>
                          <div className="absolute inset-0">
                            <div className="w-full h-0.5 bg-blue-400 animate-pulse absolute top-0"></div>
                            <div className="w-full h-0.5 bg-blue-400 animate-pulse absolute bottom-0"></div>
                            <div className="w-0.5 h-full bg-blue-400 animate-pulse absolute left-0"></div>
                            <div className="w-0.5 h-full bg-blue-400 animate-pulse absolute right-0"></div>
                          </div>
                          {/* Scanning Grid */}
                          <div className="absolute inset-0 opacity-40">
                            <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="border border-blue-300"
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* AR Active Phase */}
                      {scanningPhase === "active" && (
                        <>
                          {/* Corner Detection Markers */}
                          <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
                          <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
                          <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
                          <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>
                        </>
                      )}
                    </div>

                    {/* AR Floating Elements - Only when active */}
                    {scanningPhase === "active" && (
                      <>
                        {/* 3D Profile Avatar */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                          <div
                            className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-1000 ${
                              arAnimationPhase === 0 ? "animate-bounce scale-110" : "animate-pulse"
                            }`}
                          >
                            <span className="text-white font-bold text-lg">
                              {businessCard.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          {/* Floating Name Tag */}
                          <div className="absolute top-18 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
                            {businessCard.name}
                            <div className="text-xs text-blue-300">{businessCard.role}</div>
                          </div>
                        </div>

                        {/* Interactive Action Buttons */}
                        {businessCard.phone && (
                          <div
                            className={`absolute -left-8 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-1000 ${
                              arAnimationPhase === 1 ? "scale-125 animate-bounce" : "scale-100"
                            }`}
                          >
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                              <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                              Call Now
                            </div>
                          </div>
                        )}

                        {businessCard.email && (
                          <div
                            className={`absolute -right-8 top-1/4 z-10 transition-all duration-1000 ${
                              arAnimationPhase === 2 ? "scale-125 animate-bounce" : "scale-100"
                            }`}
                          >
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                              <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                              Send Email
                            </div>
                          </div>
                        )}

                        {businessCard.website && (
                          <div
                            className={`absolute -right-8 bottom-1/4 z-10 transition-all duration-1000 ${
                              arAnimationPhase === 3 ? "scale-125 animate-bounce" : "scale-100"
                            }`}
                          >
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                              Visit Site
                            </div>
                          </div>
                        )}

                        {/* Social Media Floating Below */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
                          {businessCard.linkedin && (
                            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-xl animate-bounce cursor-pointer hover:scale-125 transition-transform">
                              <span className="text-white text-sm font-bold">in</span>
                            </div>
                          )}
                          {businessCard.twitter && (
                            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center shadow-xl animate-bounce cursor-pointer hover:scale-125 transition-transform">
                              <span className="text-white text-sm">𝕏</span>
                            </div>
                          )}
                        </div>

                        {/* Floating Information Panel */}
                        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-95 text-white rounded-xl p-4 min-w-56 shadow-2xl z-10">
                          <div className="text-center space-y-2">
                            <div className="font-bold text-base">{businessCard.name}</div>
                            <div className="text-blue-300 text-sm">{businessCard.role}</div>
                            {businessCard.company && (
                              <div className="text-gray-300 text-sm">{businessCard.company}</div>
                            )}
                            <div className="flex justify-center space-x-2 mt-3">
                              <Badge className="bg-green-600 text-xs animate-pulse">Available</Badge>
                              <Badge className="bg-blue-600 text-xs animate-pulse">Connect</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Animated Particles */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full animate-ping`}
                            style={{
                              backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][i % 4],
                              top: `${20 + i * 10}%`,
                              left: `${10 + i * 15}%`,
                              animationDelay: `${i * 0.3}s`,
                            }}
                          ></div>
                        ))}

                        {/* 3D Rotating Elements */}
                        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded transform rotate-45 animate-spin shadow-lg"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse shadow-lg"></div>
                      </>
                    )}
                  </div>

                  {/* Camera UI Status */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    {scanningPhase === "idle" && (
                      <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        Point at business card
                      </span>
                    )}
                    {scanningPhase === "detecting" && (
                      <>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs">Detecting...</span>
                      </>
                    )}
                    {scanningPhase === "scanning" && (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs">Scanning AR markers...</span>
                      </>
                    )}
                    {scanningPhase === "active" && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-medium">AR ACTIVE</span>
                      </>
                    )}
                  </div>

                  {scanningPhase === "active" && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white rounded-lg px-3 py-1">
                      <div className="flex items-center space-x-1 text-xs">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>Interactive Mode</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="bg-black p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {scanningPhase === "active" && (
                      <>
                        <Volume2 className="w-4 h-4 text-white" />
                        <span className="text-white text-xs">AR Audio</span>
                      </>
                    )}
                  </div>
                  <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                  </div>
                  <div className="w-8"></div>
                </div>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="text-center mt-6 space-y-4">
              {scanningPhase === "idle" && (
                <Button onClick={simulateScan} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start AR Scan Simulation
                </Button>
              )}

              <p className="text-sm text-gray-600">
                {scanningPhase === "idle" && "Click to simulate the complete AR scanning experience"}
                {scanningPhase === "detecting" && "Camera is detecting the business card..."}
                {scanningPhase === "scanning" && "Analyzing AR markers and loading 3D content..."}
                {scanningPhase === "active" &&
                  "Full AR experience active! Interactive elements are floating above the card."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AR Experience Details */}
        <Card>
          <CardHeader>
            <CardTitle>AR Experience Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Real-time Card Detection</h4>
                  <p className="text-sm text-gray-600">
                    Advanced computer vision detects and tracks your physical business card in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">3D Floating Avatar</h4>
                  <p className="text-sm text-gray-600">
                    Your personalized 3D avatar appears above the card with animated interactions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Interactive Action Buttons</h4>
                  <p className="text-sm text-gray-600">
                    Floating buttons for instant calling, emailing, and website visits with haptic feedback
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dynamic Animations</h4>
                  <p className="text-sm text-gray-600">
                    Particle effects, smooth transitions, and responsive animations create an engaging experience
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-3">Your AR Card Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{businessCard.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{businessCard.role}</span>
                </div>
                {businessCard.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{businessCard.company}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Interactive Elements:</span>
                  <span className="font-medium">
                    {
                      [
                        businessCard.website && "Website",
                        businessCard.linkedin && "LinkedIn",
                        businessCard.twitter && "Twitter",
                        businessCard.email && "Email",
                        businessCard.phone && "Phone",
                      ].filter(Boolean).length
                    }{" "}
                    actions
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={onSave} size="lg" className="w-full bg-green-600 hover:bg-green-700">
              <Save className="w-5 h-5 mr-2" />
              Save AR Business Card
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
