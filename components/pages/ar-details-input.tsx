"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Sparkles, Volume2, Phone, Mail, Globe } from "lucide-react"
import type { BusinessCard } from "../app/page"

interface ARDetailsInputProps {
  businessCard: BusinessCard
  onComplete: (details: Partial<BusinessCard>) => void
}

export default function ARDetailsInput({ businessCard, onComplete }: ARDetailsInputProps) {
  const [formData, setFormData] = useState({
    name: businessCard.name || "",
    role: businessCard.role || "",
    company: businessCard.company || "",
    email: businessCard.email || "",
    phone: businessCard.phone || "",
    website: businessCard.website || "",
    linkedin: businessCard.linkedin || "",
    twitter: businessCard.twitter || "",
  })

  const [arPreviewMode, setArPreviewMode] = useState<"static" | "ar">("static")
  const [arAnimationPhase, setArAnimationPhase] = useState(0)

  // AR Animation cycle
  useEffect(() => {
    if (arPreviewMode === "ar") {
      const interval = setInterval(() => {
        setArAnimationPhase((prev) => (prev + 1) % 4)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [arPreviewMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your AR Experience</h1>
        <p className="text-lg text-gray-600">
          Add your information and see how it will appear when someone scans your physical business card
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Job Title *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Preview AR Experience
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced AR Camera Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>AR Camera Preview</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={arPreviewMode === "static" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setArPreviewMode("static")}
                >
                  Camera
                </Button>
                <Button
                  variant={arPreviewMode === "ar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setArPreviewMode("ar")}
                >
                  AR Mode
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Realistic Phone Camera Interface */}
            <div className="bg-black rounded-3xl p-3 max-w-sm mx-auto shadow-2xl">
              {/* Phone Status Bar */}
              <div className="flex justify-between items-center text-white text-xs px-2 py-1">
                <span>9:41</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-2 border border-white rounded-sm">
                    <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Camera Viewfinder */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative">
                  {/* Physical Business Card in Camera View */}
                  <div className="absolute inset-8 transform perspective-1000 rotate-x-12">
                    <div className="bg-white rounded-lg shadow-2xl relative overflow-hidden">
                      {businessCard.frontImage ? (
                        <img
                          src={businessCard.frontImage || "/placeholder.svg"}
                          alt="Physical business card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-3 text-center">
                          <div className="text-sm font-bold text-gray-800">{formData.name || "Your Name"}</div>
                          <div className="text-xs text-blue-600">{formData.role || "Your Title"}</div>
                          {formData.company && <div className="text-xs text-gray-600">{formData.company}</div>}
                        </div>
                      )}

                      {/* AR Detection Overlay */}
                      {arPreviewMode === "ar" && (
                        <>
                          {/* Corner Detection Markers */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-blue-400 animate-pulse"></div>
                          <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-blue-400 animate-pulse"></div>
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-blue-400 animate-pulse"></div>
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-blue-400 animate-pulse"></div>

                          {/* Scanning Grid Overlay */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="grid grid-cols-4 grid-rows-3 h-full w-full">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="border border-blue-300 animate-pulse"></div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* AR Floating Elements */}
                    {arPreviewMode === "ar" && (
                      <>
                        {/* 3D Profile Avatar Floating Above Card */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-1000 ${
                              arAnimationPhase === 0 ? "animate-bounce" : "animate-pulse"
                            }`}
                          >
                            <span className="text-white font-bold text-sm">
                              {formData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "YN"}
                            </span>
                          </div>
                          {/* Floating Name Tag */}
                          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                            {formData.name || "Your Name"}
                          </div>
                        </div>

                        {/* Interactive Action Buttons Floating Around Card */}
                        {formData.phone && (
                          <div
                            className={`absolute -left-6 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${
                              arAnimationPhase === 1 ? "scale-110" : "scale-100"
                            }`}
                          >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer hover:scale-125 transition-transform">
                              <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                              Call
                            </div>
                          </div>
                        )}

                        {formData.email && (
                          <div
                            className={`absolute -right-6 top-1/3 transition-all duration-1000 ${
                              arAnimationPhase === 2 ? "scale-110" : "scale-100"
                            }`}
                          >
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer hover:scale-125 transition-transform">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                              Email
                            </div>
                          </div>
                        )}

                        {formData.website && (
                          <div
                            className={`absolute -right-6 bottom-1/3 transition-all duration-1000 ${
                              arAnimationPhase === 3 ? "scale-110" : "scale-100"
                            }`}
                          >
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer hover:scale-125 transition-transform">
                              <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                              Website
                            </div>
                          </div>
                        )}

                        {/* Social Media Icons Floating Below */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                          {formData.linkedin && (
                            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center shadow-lg animate-bounce cursor-pointer hover:scale-125 transition-transform">
                              <span className="text-white text-xs font-bold">in</span>
                            </div>
                          )}
                          {formData.twitter && (
                            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shadow-lg animate-bounce cursor-pointer hover:scale-125 transition-transform">
                              <span className="text-white text-xs">𝕏</span>
                            </div>
                          )}
                        </div>

                        {/* Floating Information Panel */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white rounded-lg p-3 min-w-48">
                          <div className="text-center space-y-1">
                            <div className="font-bold text-sm">{formData.name || "Your Name"}</div>
                            <div className="text-blue-300 text-xs">{formData.role || "Your Title"}</div>
                            {formData.company && <div className="text-gray-300 text-xs">{formData.company}</div>}
                            <div className="flex justify-center space-x-2 mt-2">
                              <Badge className="bg-green-600 text-xs">Available</Badge>
                              <Badge className="bg-blue-600 text-xs">Connect</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Animated Particles */}
                        <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-3 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>

                        {/* 3D Rotating Element */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded transform rotate-45 animate-spin"></div>
                      </>
                    )}
                  </div>

                  {/* Camera UI Elements */}
                  {arPreviewMode === "ar" && (
                    <>
                      {/* AR Status Indicator */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-medium">AR ACTIVE</span>
                      </div>

                      {/* AR Info Panel */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded px-2 py-1">
                        <div className="flex items-center space-x-1 text-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Business Card Detected</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="bg-black p-4 flex justify-center items-center space-x-6">
                  <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  {arPreviewMode === "ar" && (
                    <div className="flex items-center space-x-2 text-white text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>AR Audio On</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-6 space-y-3">
              <p className="text-sm text-gray-600">
                {arPreviewMode === "static"
                  ? "Camera view showing your physical business card"
                  : "AR experience with interactive 3D elements and floating content"}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>3D Avatar</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Action Buttons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Social Links</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
