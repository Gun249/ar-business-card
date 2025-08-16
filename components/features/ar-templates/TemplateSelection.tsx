"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllARDisplayTemplates, getARDisplayTemplatesByCategory } from '@/lib/ar/display-templates'
import ARViewerPage from '../ar-viewer/ARViewerPage'
import { CardData } from '@/types/ar-templates'
import ColorSwatch from '@/components/ui/ColorSwatch'
import { getARTemplate } from '@/lib/ar/templates'

interface TemplateSelectionProps {
  onSelectTemplate: (templateId: string) => void
  cardData?: CardData // Optional card data for preview
  showPreview?: boolean // Option to show AR preview
}

export default function TemplateSelection({ onSelectTemplate, cardData, showPreview = true }: TemplateSelectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get AR Display templates from the new system
  const allTemplates = getAllARDisplayTemplates()
  const categories = ['all', 'floating', 'spread', 'hologram', 'interactive', 'minimal']

  // Debug logs
  console.log('🚀 AR Display Template Selection rendered')
  console.log('📋 All AR Display templates:', allTemplates)

  const filteredTemplates = selectedCategory === 'all' 
    ? allTemplates 
    : getARDisplayTemplatesByCategory(selectedCategory)
    
  console.log('📊 Filtered AR Display templates:', filteredTemplates)

  // Sample card data for preview if not provided
  const previewCardData: CardData = cardData || {
    username: "ตัวอย่าง นามบัตร",
    title: "AR Template Preview",
    profilePicture: "https://placehold.co/256x256/4A90E2/FFFFFF?text=AR",
    phone: "081-234-5678",
    email: "preview@example.com",
    company: "AR Demo Company",
    targetIndex: 0,
    templateId: previewTemplate || 'classic-business'
  }

  // Template preview rendering function (moved from TemplatePreview component)
  const renderTemplatePreview = (templateId: string, cardData: CardData, className: string = "") => {
    const template = getARTemplate(templateId);
    
    // For AR Display templates, we create a mock template object
    const arDisplayTemplate = allTemplates.find(t => t.id === templateId);
    
    if (!template && !arDisplayTemplate) {
      return (
        <div className={`w-full h-48 bg-red-200 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-red-500">Template "{templateId}" not found</span>
        </div>
      );
    }

    const renderPreview = () => {
      switch (templateId) {
        case 'classic-business':
          return (
            <div className="relative w-full min-h-[300px] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded z-20">
                CLASSIC
              </div>
              {/* Main Card */}
              <div className="absolute inset-4 bg-white rounded-lg shadow-lg border-2 border-blue-200">
                {/* Profile Picture */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {cardData.username.charAt(0)}
                  </div>
                </div>
                
                {/* Info */}
                <div className="ml-20 mt-4 space-y-1">
                  <div className="font-bold text-sm text-gray-800">{cardData.username}</div>
                  <div className="text-xs text-gray-600">{cardData.title}</div>
                  <div className="text-xs text-blue-600">{cardData.phone}</div>
                  <div className="text-xs text-blue-600 mt-1">{cardData.email}</div>
                  <div className="text-xs text-gray-500 mt-2">Company: {cardData.company || 'Professional Services'}</div>
                  <div className="text-xs text-gray-500">Website: {cardData.website || 'www.example.com'}</div>
                </div>
              </div>
              
              {/* Floating Panels */}
              <div className="absolute top-2 right-2 w-16 h-6 bg-blue-500 rounded opacity-80"></div>
              <div className="absolute bottom-2 left-2 w-12 h-6 bg-green-500 rounded opacity-80"></div>
              <div className="absolute bottom-2 right-2 w-14 h-6 bg-red-400 rounded opacity-80"></div>
              
              {/* Additional scrollable content */}
              <div className="absolute bottom-16 left-4 right-4 space-y-2">
                <div className="text-xs text-gray-600 bg-white/50 rounded p-2">
                  <div>📍 Address: 123 Business Street</div>
                  <div>🕒 Hours: Mon-Fri 9AM-5PM</div>
                  <div>💼 Services: Consulting, Development</div>
                  <div>🎯 Specialization: Digital Solutions</div>
                </div>
              </div>
            </div>
          );

        case 'modern-creative':
          return (
            <div className="relative w-full min-h-[350px] bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1 rounded z-20">
                MODERN
              </div>
              {/* Central Circle */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {cardData.username.charAt(0)}
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute -top-2 -right-2 w-8 h-4 bg-teal-400 rounded opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-4 bg-blue-400 rounded opacity-80 animate-pulse"></div>
              </div>
              
              {/* Info Cards */}
              <div className="absolute top-4 left-4 space-y-1">
                <div className="text-xs font-bold text-purple-800">{cardData.username}</div>
                <div className="text-xs text-purple-600">{cardData.title}</div>
                <div className="text-xs text-purple-600">{cardData.company || 'Creative Studio'}</div>
              </div>
              
              <div className="absolute top-24 right-4 space-y-1 text-right">
                <div className="text-xs text-blue-600">{cardData.phone}</div>
                <div className="text-xs text-blue-600">{cardData.email}</div>
                <div className="text-xs text-blue-600">{cardData.website || 'portfolio.com'}</div>
              </div>
              
              {/* Creative Content Section */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="bg-white/80 rounded-lg p-3 space-y-1">
                  <div className="text-xs font-semibold text-purple-800">🎨 Portfolio Highlights</div>
                  <div className="text-xs text-gray-600">• Web Design & Development</div>
                  <div className="text-xs text-gray-600">• Brand Identity Design</div>
                  <div className="text-xs text-gray-600">• Digital Marketing</div>
                  <div className="text-xs text-gray-600">• UI/UX Design</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg p-2">
                  <div className="text-xs text-purple-800">🏆 Awards: Creative Excellence 2024</div>
                </div>
              </div>
              
              {/* Particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-32 left-8 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
            </div>
          );

        case 'minimal-professional':
          return (
            <div className="relative w-full min-h-[320px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-lg">
              {/* Clean Layout */}
              <div className="absolute inset-6 bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Profile */}
                <div className="flex flex-col items-center pt-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                    {cardData.username.charAt(0)}
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-semibold text-xs text-gray-800">{cardData.username}</div>
                    <div className="text-xs text-gray-600">{cardData.title}</div>
                    <div className="text-xs text-blue-600">{cardData.phone}</div>
                    <div className="text-xs text-blue-600">{cardData.email}</div>
                    <div className="text-xs text-gray-500 mt-2">{cardData.company || 'Professional Services'}</div>
                  </div>
                </div>
                
                {/* Professional Details */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <div className="border-t border-gray-200 pt-2">
                    <div className="text-xs text-gray-600 text-center space-y-1">
                      <div>🌐 {cardData.website || 'www.professional.com'}</div>
                      <div>💼 Years of Experience: 5+</div>
                      <div>🎓 Certified Professional</div>
                      <div>📧 Contact for consultations</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle Ring */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-200 rounded-full opacity-40"></div>
            </div>
          );

        case 'interactive-modern':
          return (
            <div className="relative w-full min-h-[380px] bg-gradient-to-br from-purple-900 to-gray-900 overflow-hidden rounded-lg">
              {/* Glowing Card */}
              <div className="absolute inset-4 bg-gray-800 rounded-lg shadow-2xl border border-purple-500">
                {/* Profile with Glow */}
                <div className="absolute left-4 top-6">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/50">
                    {cardData.username.charAt(0)}
                  </div>
                </div>
                
                {/* Glowing Info */}
                <div className="ml-20 mt-6 space-y-1">
                  <div className="font-bold text-sm text-white">{cardData.username}</div>
                  <div className="text-xs text-purple-300">{cardData.title}</div>
                  <div className="text-xs text-blue-300">{cardData.email}</div>
                  <div className="text-xs text-green-300">{cardData.phone}</div>
                </div>
                
                {/* Interactive Content */}
                <div className="absolute top-24 left-4 right-4 space-y-2">
                  <div className="bg-gray-700/50 rounded p-2 space-y-1">
                    <div className="text-xs text-cyan-300">🚀 Interactive Features:</div>
                    <div className="text-xs text-gray-300">• 3D Model Viewer</div>
                    <div className="text-xs text-gray-300">• AR Portfolio Display</div>
                    <div className="text-xs text-gray-300">• Real-time Chat</div>
                    <div className="text-xs text-gray-300">• Digital Handshake</div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded p-2">
                    <div className="text-xs text-purple-200">💡 Innovation Score: 98/100</div>
                  </div>
                </div>
                
                {/* Interactive Buttons */}
                <div className="absolute bottom-4 left-4 space-x-2 flex">
                  <div className="w-12 h-6 bg-red-500 rounded opacity-80 shadow-lg shadow-red-500/50 flex items-center justify-center">
                    <span className="text-xs text-white">📞</span>
                  </div>
                  <div className="w-12 h-6 bg-purple-500 rounded opacity-80 shadow-lg shadow-purple-500/50 flex items-center justify-center">
                    <span className="text-xs text-white">💼</span>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded opacity-80 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                    <span className="text-xs text-white">🌐</span>
                  </div>
                </div>
              </div>
              
              {/* Animated Particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
              <div className="absolute top-8 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
          );

        case 'floating-card-3d':
          return (
            <div className="relative w-full min-h-[350px] bg-gradient-to-br from-sky-100 to-blue-200 overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-sky-500 text-white text-xs px-1 rounded z-20">
                3D FLOATING
              </div>
              
              {/* 3D Floating Card with Animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <div className="perspective-1000 transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
                  <div className="w-40 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-2xl relative">
                    {/* Card Content */}
                    <div className="absolute inset-2 bg-white/90 rounded-md p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {cardData.username.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-gray-800">{cardData.username}</div>
                          <div className="text-xs text-gray-600">{cardData.title}</div>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-blue-600">{cardData.phone}</div>
                        <div className="text-xs text-blue-600">{cardData.email}</div>
                      </div>
                    </div>
                    
                    {/* 3D Effect Shadow */}
                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/20 rounded-lg -z-10"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-1/4 right-8 w-4 h-4 bg-sky-400 rounded-full animate-bounce opacity-60"></div>
              
              {/* Rotation Indicator */}
              <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/70 rounded px-2 py-1">
                🔄 หมุนได้ 360°
              </div>
            </div>
          );

        case 'info-spread-radial':
          return (
            <div className="relative w-full min-h-[360px] bg-gradient-to-br from-green-100 to-teal-200 overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded z-20">
                RADIAL
              </div>
              
              {/* Central Profile */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {cardData.username.charAt(0)}
                </div>
                
                {/* Radial Info Cards */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-fade-in">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs font-bold text-gray-800">{cardData.username}</div>
                  </div>
                </div>
                
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 animate-fade-in delay-200">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs text-gray-600">{cardData.title}</div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 animate-fade-in delay-300">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs text-blue-600">{cardData.phone}</div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 left-20 transform -translate-y-1/2 animate-fade-in delay-400">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs text-blue-600">{cardData.email}</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-12 -left-8 animate-fade-in delay-500">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs text-gray-500">{cardData.company || 'Company'}</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-12 left-12 animate-fade-in delay-600">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                    <div className="text-xs text-gray-500">{cardData.website || 'Website'}</div>
                  </div>
                </div>
              </div>
              
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 border border-green-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute inset-4 border border-teal-300 rounded-full opacity-20 animate-pulse delay-300"></div>
              </div>
            </div>
          );

        case 'hologram-effect':
          return (
            <div className="relative w-full min-h-[370px] bg-gradient-to-br from-gray-900 to-black overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-cyan-500 text-white text-xs px-1 rounded z-20">
                HOLOGRAM
              </div>
              
              {/* Hologram Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
              
              {/* Main Hologram Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Hologram Border */}
                  <div className="w-48 h-32 border-2 border-cyan-400 rounded-lg bg-cyan-500/5 backdrop-blur-sm">
                    {/* Profile Section */}
                    <div className="flex items-center p-4 space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/50">
                        {cardData.username.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-cyan-300">{cardData.username}</div>
                        <div className="text-xs text-blue-300">{cardData.title}</div>
                        <div className="text-xs text-cyan-400">{cardData.phone}</div>
                        <div className="text-xs text-cyan-400">{cardData.email}</div>
                      </div>
                    </div>
                    
                    {/* Hologram Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/4 animate-pulse"></div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent absolute top-2/4 animate-pulse delay-150"></div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-3/4 animate-pulse delay-300"></div>
                    </div>
                  </div>
                  
                  {/* Hologram Particles */}
                  <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-200"></div>
                  <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-400"></div>
                  <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-600"></div>
                </div>
              </div>
              
              {/* Sci-Fi Elements */}
              <div className="absolute top-4 left-4 text-xs text-cyan-400 font-mono">
                [HOLOGRAM_ACTIVE]
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-blue-400 font-mono">
                SCAN_COMPLETE: 100%
              </div>
            </div>
          );

        case 'interactive-dashboard':
          return (
            <div className="relative w-full min-h-[400px] bg-gradient-to-br from-indigo-100 to-purple-200 overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-indigo-500 text-white text-xs px-1 rounded z-20">
                DASHBOARD
              </div>
              
              {/* Dashboard Header */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-white/90 rounded-lg p-3 shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {cardData.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{cardData.username}</div>
                      <div className="text-xs text-gray-600">{cardData.title}</div>
                    </div>
                    <div className="text-xs text-indigo-600">👤 Online</div>
                  </div>
                </div>
              </div>
              
              {/* Interactive Grid */}
              <div className="absolute top-20 left-4 right-4 bottom-16 grid grid-cols-2 gap-2">
                {/* Contact Button */}
                <div className="bg-white/80 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-lg">📞</div>
                    <div className="text-xs font-semibold text-gray-700">Call</div>
                    <div className="text-xs text-blue-600">{cardData.phone}</div>
                  </div>
                </div>
                
                {/* Email Button */}
                <div className="bg-white/80 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-lg">📧</div>
                    <div className="text-xs font-semibold text-gray-700">Email</div>
                    <div className="text-xs text-blue-600">Send</div>
                  </div>
                </div>
                
                {/* Portfolio Button */}
                <div className="bg-white/80 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-lg">🎨</div>
                    <div className="text-xs font-semibold text-gray-700">Portfolio</div>
                    <div className="text-xs text-purple-600">View</div>
                  </div>
                </div>
                
                {/* Connect Button */}
                <div className="bg-white/80 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-lg">🤝</div>
                    <div className="text-xs font-semibold text-gray-700">Connect</div>
                    <div className="text-xs text-green-600">Add</div>
                  </div>
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/80 rounded-lg p-2 flex justify-between items-center">
                  <div className="text-xs text-gray-600">🔥 {Math.floor(Math.random() * 100)} views today</div>
                  <div className="text-xs text-green-600">✓ Interactive Mode</div>
                </div>
              </div>
            </div>
          );

        case 'minimal-clean':
          return (
            <div className="relative w-full min-h-[300px] bg-gradient-to-br from-gray-50 to-white overflow-hidden rounded-lg">
              {/* Debug indicator */}
              <div className="absolute top-1 right-1 bg-gray-500 text-white text-xs px-1 rounded z-20">
                MINIMAL
              </div>
              
              {/* Clean Minimal Design */}
              <div className="absolute inset-8 flex flex-col justify-center items-center space-y-4">
                {/* Profile */}
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg">
                  {cardData.username.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-gray-900">{cardData.username}</div>
                  <div className="text-sm text-gray-600">{cardData.title}</div>
                  
                  <div className="w-16 h-px bg-gray-300 mx-auto my-3"></div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700">{cardData.phone}</div>
                    <div className="text-sm text-gray-700">{cardData.email}</div>
                  </div>
                  
                  {cardData.company && (
                    <div className="text-xs text-gray-500 mt-2">{cardData.company}</div>
                  )}
                </div>
                
                {/* Minimal Accent */}
                <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
              </div>
              
              {/* Subtle Corner Elements */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
            </div>
          );

        default:
          return (
            <div className="w-full min-h-[280px] bg-gray-200 rounded-lg flex flex-col items-center justify-center p-4">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">📋</div>
                <span className="text-gray-600 text-sm font-medium">{template?.name || arDisplayTemplate?.name || 'Unknown Template'}</span>
                <div className="text-xs text-gray-500 max-w-xs">
                  This template is under development. More content and interactive features will be available soon.
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-gray-700">👤 {cardData.username}</div>
                  <div className="text-xs text-gray-600">{cardData.title}</div>
                  <div className="text-xs text-blue-600">{cardData.email}</div>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className={`template-preview relative overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 ${className}`}>
        <div className="min-h-full">
          {renderPreview()}
          {/* Template Label */}
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
            {template?.name || arDisplayTemplate?.name || templateId}
          </div>
        </div>
      </div>
    );
  }

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    onSelectTemplate(templateId)
  }

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplate(templateId)
  }

  const handleClosePreview = () => {
    setPreviewTemplate(null)
  }

  // Show AR Preview
  if (previewTemplate && showPreview) {
    return (
      <div className="relative">
        <ARViewerPage 
          cardData={{...previewCardData, templateId: previewTemplate}} 
          templateId={previewTemplate}
        />
        <Button 
          onClick={handleClosePreview}
          className="absolute top-4 right-4 z-[10000] bg-red-500 hover:bg-red-600 text-white"
        >
          ปิด Preview
        </Button>
      </div>
    )
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 max-h-screen overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your AR Business Card Template</h1>
        <p className="text-lg text-gray-600">Select a template that matches your professional style and see AR preview</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-3">หมวดหมู่ Template:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
                size="sm"
              >
                {category === 'all' ? 'ทั้งหมด' : 
                 category === 'floating' ? 'ลอยตัว' :
                 category === 'spread' ? 'กระจาย' :
                 category === 'hologram' ? 'โฮโลแกรม' :
                 category === 'interactive' ? 'โต้ตอบได้' :
                 category === 'minimal' ? 'มินิมอล' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-800">
              ✓ เลือกแล้ว: {allTemplates.find(t => t.id === selectedTemplate)?.name}
            </h3>
            <p className="text-green-600">
              {allTemplates.find(t => t.id === selectedTemplate)?.description}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${
              selectedTemplate === template.id 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge 
                  variant="secondary"
                  className={getCategoryColor(template.category)}
                >
                  {getCategoryDisplayName(template.category)}
                </Badge>
              </div>
            </CardHeader>
            
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
              {renderTemplatePreview(template.id, previewCardData, "w-full h-full")}
            </div>

            <CardContent className="p-4 space-y-4 max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
              <p className="text-gray-600 text-sm">{template.description}</p>
              
              {/* Animation and Layout Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <div><strong>Type:</strong> {template.preview.type}</div>
                <div><strong>Animation:</strong> {template.preview.animation}</div>
                <div><strong>Layout:</strong> {template.preview.layout}</div>
              </div>

              <div className="space-y-2">
                {/* Preview Button */}
                {showPreview && (
                  <Button 
                    onClick={() => handlePreviewTemplate(template.id)}
                    variant="outline"
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                    size="sm"
                  >
                    👁️ ดู AR Preview
                  </Button>
                )}
                
                {/* Select Button */}
                <Button 
                  onClick={() => handleSelectTemplate(template.id)} 
                  className={`w-full ${
                    selectedTemplate === template.id 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {selectedTemplate === template.id ? '✓ เลือกแล้ว' : 'เลือก Template นี้'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            ไม่พบ Template ในหมวดหมู่นี้
          </h3>
          <p className="text-gray-400">ลองเปลี่ยนหมวดหมู่หรือเลือก "ทั้งหมด"</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>เลือก Template ที่ต้องการ แล้วคลิก "ดู AR Preview" เพื่อทดสอบการแสดงผล</p>
        <p>หรือเลือก Template เพื่อใช้ในการสร้างนามบัตร AR</p>
      </div>
    </div>
  )
}

// Helper functions
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    floating: 'bg-blue-100 text-blue-800',
    spread: 'bg-purple-100 text-purple-800',
    hologram: 'bg-cyan-100 text-cyan-800',
    interactive: 'bg-green-100 text-green-800',
    minimal: 'bg-gray-100 text-gray-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getCategoryDisplayName = (category: string): string => {
  const names: { [key: string]: string } = {
    floating: 'ลอยตัว',
    spread: 'กระจาย',
    hologram: 'โฮโลแกรม',
    interactive: 'โต้ตอบได้',
    minimal: 'มินิมอล',
  }
  return names[category] || category
}

const getTemplateIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    floating: '🌟',
    spread: '�',
    hologram: '🔮',
    interactive: '🎯',
    minimal: '📱',
  }
  return icons[category] || '🎭'
}
