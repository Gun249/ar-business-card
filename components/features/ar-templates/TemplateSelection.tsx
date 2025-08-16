"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllARDisplayTemplates, getARDisplayTemplatesByCategory } from '@/lib/ar/display-templates'
import ARViewerPage from '../ar-viewer/ARViewerPage'
import { CardData } from '@/types/ar-templates'
import ColorSwatch from '@/components/ui/ColorSwatch'
import ARDisplayPreview from './ARDisplayPreview'

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
              <ARDisplayPreview
                templateId={template.id}
                cardData={previewCardData}
                className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
              />
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
