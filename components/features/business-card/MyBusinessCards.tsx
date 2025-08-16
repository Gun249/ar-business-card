"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Plus, Calendar, Search, Smartphone, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ARViewerPage from "./ARViewerPage"
import type { BusinessCard } from "@/types"

interface MyBusinessCardsProps {
  cards: BusinessCard[]
  onDeleteCard: (cardId: string) => void
  onNavigate: (page: string) => void
}

export default function MyBusinessCards({ cards, onDeleteCard, onNavigate }: MyBusinessCardsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [previewCard, setPreviewCard] = useState<string | null>(null)
  const [showARViewer, setShowARViewer] = useState<string | null>(null) // New state for AR viewer

  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.role && card.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      card.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (cardId: string) => {
    onDeleteCard(cardId)
    setDeleteConfirm(null)
  }

  const handleViewAR = (cardId: string) => {
    setShowARViewer(cardId)
  }

  const handleCloseAR = () => {
    setShowARViewer(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      modern: "Modern Professional",
      creative: "Creative Artist",
      tech: "Tech Innovator",
      elegant: "Elegant Classic",
      startup: "Startup Founder",
      consultant: "Business Consultant",
    }
    return templates[templateId] || "Custom Template"
  }

  if (showARViewer) {
    return (
      <div className="relative">
        <ARViewerPage cardId={parseInt(showARViewer)} />
        <Button 
          onClick={handleCloseAR}
          className="absolute top-4 right-4 z-[10000] bg-red-500 hover:bg-red-600 text-white"
        >
          ปิด AR
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AR Business Cards</h1>
          <p className="text-gray-600">Manage your interactive AR business card collection</p>
        </div>
        <Button onClick={() => onNavigate("templates")} className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create New AR Card
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your AR cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{cards.length} AR cards</span>
          <span>•</span>
          <span>{cards.reduce((sum, card) => sum + (card.scanCount || 0), 0)} total scans</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            {cards.length === 0 ? (
              <div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No AR Business Cards Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first interactive AR business card to revolutionize your networking
                </p>
                <Button onClick={() => onNavigate("templates")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First AR Card
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 flex items-center space-x-2">
                      <span>{card.name}</span>
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    </CardTitle>
                    <p className="text-sm text-blue-600 font-medium">{card.role}</p>
                    {card.company && <p className="text-sm text-gray-600">{card.company}</p>}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100">
                    {getTemplateDisplayName(card.templateId || card.template)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* AR Card Preview */}
                <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg flex items-center justify-center overflow-hidden relative group">
                  {card.frontImage ? (
                    <img
                      src={card.frontImage || "/placeholder.svg"}
                      alt={`${card.name}'s AR business card`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-gray-600">
                          {card.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">AR Business Card</p>
                    </div>
                  )}

                  {/* AR Indicators */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  </div>

                  {/* AR Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="text-xs bg-black bg-opacity-70 text-white">AR</Badge>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(card.createdAt || new Date().toISOString())}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Smartphone className="w-4 h-4" />
                    <span>{card.scanCount || 0} scans</span>
                  </div>
                </div>

                {/* Interactive Elements Count */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Interactive Elements:</span>
                  <span className="font-medium">
                    {
                      [
                        card.website && "Website",
                        card.linkedin && "LinkedIn",
                        card.twitter && "Twitter",
                        card.email && "Email",
                      ].filter(Boolean).length
                    }{" "}
                    buttons
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
                    onClick={() => setPreviewCard(previewCard === card.id ? null : card.id!)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {previewCard === card.id ? "Hide" : "Preview"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    onClick={() => handleViewAR(card.id!)}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    View AR
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(card.id!)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* AR Preview */}
                {previewCard === card.id && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-dashed border-blue-200">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-700">
                        <Smartphone className="w-4 h-4" />
                        <span>AR Scanner View</span>
                      </div>
                      <div className="bg-white rounded p-3 shadow-sm relative">
                        <div className="text-xs text-gray-600 mb-2">When scanned, users will see:</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>3D floating elements</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Interactive social buttons</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Real-time contact info</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation */}
                {deleteConfirm === card.id && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 text-sm">
                      <div className="mb-3">Delete AR card "{card.name}"? This action cannot be undone.</div>
                      <div className="flex space-x-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id!)}>
                          Delete
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
