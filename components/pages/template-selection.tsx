"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface TemplateSelectionProps {
  onSelectTemplate: (templateId: string) => void
}

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Clean and minimalist design perfect for corporate professionals",
  },
  {
    id: "creative",
    name: "Creative Artist",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Vibrant and artistic design for creative professionals",
  },
  {
    id: "tech",
    name: "Tech Innovator",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Futuristic design ideal for tech industry professionals",
  },
  {
    id: "elegant",
    name: "Elegant Classic",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Sophisticated and timeless design for executive level",
  },
  {
    id: "startup",
    name: "Startup Founder",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Dynamic and energetic design for entrepreneurs",
  },
  {
    id: "consultant",
    name: "Business Consultant",
    preview: "/placeholder.svg?height=200&width=300",
    description: "Professional and trustworthy design for consultants",
  },
]

export default function TemplateSelection({ onSelectTemplate }: TemplateSelectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your AR Business Card Template</h1>
        <p className="text-lg text-gray-600">Select a template that matches your professional style</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <img
                src={template.preview || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <Button onClick={() => onSelectTemplate(template.id)} className="w-full">
                Select Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
