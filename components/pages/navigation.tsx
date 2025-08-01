"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, ArrowLeft, ChevronDown, CreditCard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/types"

interface NavigationProps {
  user: User
  onLogout: () => void
  currentPage: string
  onNavigate: (page: any) => void
}

export default function Navigation({ user, onLogout, currentPage, onNavigate }: NavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const canGoBack = currentPage !== "templates" && currentPage !== "my-cards" && currentPage !== "profile"

  const handleBack = () => {
    switch (currentPage) {
      case "upload":
        onNavigate("templates")
        break
      case "details":
        onNavigate("upload")
        break
      case "preview":
        onNavigate("details")
        break
    }
  }

  const handleLogoClick = () => {
    onNavigate("templates") // Navigate to homepage/dashboard
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDropdownItemClick = (action: string) => {
    setIsDropdownOpen(false)
    if (action === "logout") {
      onLogout()
    } else {
      onNavigate(action)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {/* Logo and Brand */}
            <div
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <img
                src="/images/holobizcard-logo.png"
                alt="HoloBizCard Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">HoloBizCard</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Menu - Only Create New */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant={currentPage === "templates" ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate("templates")}
              >
                Create New
              </Button>
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-sm">
                    {(user.name || user.username || user.email)
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name || user.username}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {(user.name || user.username || user.email)
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleDropdownItemClick("my-cards")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 mr-3 text-gray-500" />
                      My Business Cards
                    </button>
                    <button
                      onClick={() => handleDropdownItemClick("profile")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      Account Settings
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Sign Out */}
                  <button
                    onClick={() => handleDropdownItemClick("logout")}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
