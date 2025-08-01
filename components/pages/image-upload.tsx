"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, AlertTriangle, CheckCircle } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [validationStatus, setValidationStatus] = useState<"pending" | "valid" | "invalid" | null>(null)
  const [validationMessage, setValidationMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setUploadedImage(imageUrl)
        validateImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateImage = (file: File) => {
    setValidationStatus("pending")

    // Simulate validation process
    setTimeout(() => {
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      const isValidDimensions = true // Simulate dimension check

      if (!isValidType) {
        setValidationStatus("invalid")
        setValidationMessage("Invalid file type. Please upload a JPEG or PNG image.")
      } else if (!isValidSize) {
        setValidationStatus("invalid")
        setValidationMessage("File size too large. Please upload an image smaller than 5MB.")
      } else if (!isValidDimensions) {
        setValidationStatus("invalid")
        setValidationMessage(
          "Image dimensions not suitable for AR. Please use a high-resolution image with good contrast.",
        )
      } else {
        setValidationStatus("valid")
        setValidationMessage("Image is compatible with AR Maker system!")
      }
    }, 2000)
  }

  const handleContinue = () => {
    if (uploadedImage && validationStatus === "valid") {
      onImageUpload(uploadedImage)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Business Card Image</h1>
        <p className="text-lg text-gray-600">Upload the front image of your business card for AR enhancement</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          {!uploadedImage ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Click to upload your business card image</h3>
              <p className="text-gray-500 mb-4">Supports JPEG, PNG files up to 5MB</p>
              <Button variant="outline">Choose File</Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                title="Upload your business card image"
                aria-label="Upload your business card image"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded business card"
                  className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-md"
                />
              </div>

              {validationStatus === "pending" && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Validating image compatibility...</span>
                </div>
              )}

              {validationStatus === "valid" && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>{validationMessage}</span>
                </div>
              )}

              {validationStatus === "invalid" && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{validationMessage}</span>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedImage(null)
                    setValidationStatus(null)
                    setValidationMessage("")
                  }}
                  className="flex-1"
                >
                  Upload Different Image
                </Button>
                <Button onClick={handleContinue} disabled={validationStatus !== "valid"} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
