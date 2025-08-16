// Simulated API with delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const users = [
  {
    id: 1,
    email: "admin@example.com",
    name: "ผู้ดูแลระบบ",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    email: "user@example.com",
    name: "Gun",
    role: "user",
    createdAt: new Date("2024-01-15"),
  },
]

const templates = [
  {
    id: 1,
    name: "เทมเพลตธุรกิจคลาสสิค",
    category: "popular",
    type: "vertical",
    thumbnail: "/placeholder.svg?height=200&width=150",
    fields: ["name", "title", "company", "phone", "email", "website"],
  },
  {
    id: 2,
    name: "เทมเพลตสร้างสรรค์",
    category: "creative",
    type: "horizontal",
    thumbnail: "/placeholder.svg?height=150&width=200",
    fields: ["name", "title", "company", "phone", "email", "portfolio"],
  },
  {
    id: 3,
    name: "เทมเพลตมืออาชีพ",
    category: "popular",
    type: "vertical",
    thumbnail: "/placeholder.svg?height=200&width=150",
    fields: ["name", "title", "company", "phone", "email", "linkedin"],
  },
  {
    id: 4,
    name: "เทมเพลตโมเดิร์น",
    category: "modern",
    type: "horizontal",
    thumbnail: "/placeholder.svg?height=150&width=200",
    fields: ["name", "title", "company", "phone", "email", "social"],
  },
]

const cards = [
  {
    id: 1,
    userId: 2,
    templateId: 1,
    name: "นามบัตรของฉัน",
    data: {
      name: "สมชาย ใจดี",
      username: "สมชาย ใจดี", // Add username for AR compatibility
      title: "นักพัฒนาซอฟต์แวร์",
      company: "บริษัท เทคโนโลยี จำกัด",
      phone: "02-123-4567",
      email: "somchai@tech.com",
      website: "www.tech.com",
      profilePicture: "/placeholder.svg?height=256&width=256", // Add profile picture
      targetIndex: 0, // AR marker target index
      templateId: 'classic-business', // AR Template ID
    },
    targetImage: "/placeholder.svg?height=300&width=300",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 2,
    userId: 2,
    templateId: 2,
    name: "นามบัตรสร้างสรรค์",
    data: {
      name: "วรรณิดา สวยงาม",
      username: "วรรณิดา สวยงาม",
      title: "นักออกแบบกราฟิก",
      company: "สตูดิโอออกแบบ",
      phone: "089-876-5432",
      email: "wannida@design.com",
      website: "www.designstudio.com",
      profilePicture: "/placeholder.svg?height=256&width=256",
      targetIndex: 1, // Different target index
      templateId: 'modern-creative', // Creative AR Template
    },
    targetImage: "/placeholder.svg?height=300&width=300",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: 3,
    userId: 2,
    templateId: 1,
    name: "นามบัตรธุรกิจ",
    data: {
      name: "ประพันธ์ ธุรกิจดี",
      username: "ประพันธ์ ธุรกิจดี",
      title: "ผู้อำนวยการ",
      company: "บริษัท ธุรกิจใหญ่ จำกัด",
      phone: "02-555-0123",
      email: "prapan@bigbusiness.com",
      website: "www.bigbusiness.com",
      profilePicture: "/placeholder.svg?height=256&width=256",
      targetIndex: 2, // Another different target index
      templateId: 'minimal-professional', // Minimal AR Template
    },
    targetImage: "/placeholder.svg?height=300&width=300",
    createdAt: new Date("2024-02-01"),
  },
]

let currentUser = null

export const api = {
  // Authentication
  async login(credentials) {
    await delay(1000)
    const user = users.find((u) => u.email === credentials.email)
    if (!user) {
      throw new Error("ไม่พบผู้ใช้งานนี้ในระบบ")
    }
    // In real app, check password
    currentUser = user
    return user
  },

  async register(userData) {
    await delay(1200)
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("อีเมลนี้ถูกใช้งานแล้ว")
    }

    const newUser = {
      id: users.length + 1,
      ...userData,
      role: "user",
      createdAt: new Date(),
    }
    users.push(newUser)
    currentUser = newUser
    return newUser
  },

  async loginWithGoogle() {
    await delay(1500)
    // Simulate Google OAuth
    const googleUser = {
      id: users.length + 1,
      email: "google.user@gmail.com",
      name: "ผู้ใช้ Google",
      role: "user",
      createdAt: new Date(),
    }
    users.push(googleUser)
    currentUser = googleUser
    return googleUser
  },

  async logout() {
    await delay(500)
    currentUser = null
  },

  async getCurrentUser() {
    await delay(300)
    return currentUser
  },

  // Templates
  async getTemplates(category = null) {
    await delay(800)
    if (category) {
      return templates.filter((t) => t.category === category)
    }
    return templates
  },

  async getTemplate(id) {
    await delay(500)
    const template = templates.find((t) => t.id === Number.parseInt(id))
    if (!template) {
      throw new Error("ไม่พบเทมเพลต")
    }
    return template
  },

  // Cards
  async getUserCards(userId) {
    await delay(600)
    return cards.filter((c) => c.userId === userId)
  },

  async getCard(id) {
    await delay(400)
    const card = cards.find((c) => c.id === Number.parseInt(id))
    if (!card) {
      throw new Error("ไม่พบนามบัตร")
    }
    return card
  },

  async createCard(cardData) {
    await delay(1000)
    const newCard = {
      id: cards.length + 1,
      ...cardData,
      createdAt: new Date(),
    }
    cards.push(newCard)
    return newCard
  },

  async updateCard(id, cardData) {
    await delay(800)
    const cardIndex = cards.findIndex((c) => c.id === Number.parseInt(id))
    if (cardIndex === -1) {
      throw new Error("ไม่พบนามบัตร")
    }
    cards[cardIndex] = { ...cards[cardIndex], ...cardData }
    return cards[cardIndex]
  },

  async deleteCard(id) {
    await delay(600)
    const cardIndex = cards.findIndex((c) => c.id === Number.parseInt(id))
    if (cardIndex === -1) {
      throw new Error("ไม่พบนามบัตร")
    }
    cards.splice(cardIndex, 1)
  },

  // AR Content
  async getARContent(cardId) {
    await delay(1200)
    const card = cards.find((c) => c.id === Number.parseInt(cardId))
    if (!card) {
      throw new Error("ไม่พบข้อมูล AR")
    }
    return {
      cardData: card.data,
      template: templates.find((t) => t.id === card.templateId),
      targetImage: card.targetImage,
      targetIndex: card.data.targetIndex || 0, // Include targetIndex in response
    }
  },

  // Get available target indices
  async getAvailableTargetIndices() {
    await delay(500)
    const usedIndices = cards.map(card => card.data.targetIndex || 0)
    const maxIndex = Math.max(...usedIndices, -1)
    return {
      used: usedIndices,
      next: maxIndex + 1,
      available: Array.from({length: 10}, (_, i) => i).filter(i => !usedIndices.includes(i))
    }
  },

  // Update card target index
  async updateCardTargetIndex(cardId, targetIndex) {
    await delay(800)
    const cardIndex = cards.findIndex((c) => c.id === Number.parseInt(cardId))
    if (cardIndex === -1) {
      throw new Error("ไม่พบนามบัตร")
    }
    
    // Check if target index is already used
    const existingCard = cards.find(c => c.data.targetIndex === targetIndex && c.id !== Number.parseInt(cardId))
    if (existingCard) {
      throw new Error(`Target Index ${targetIndex} ถูกใช้งานแล้วโดยนามบัตร "${existingCard.name}"`)
    }
    
    cards[cardIndex].data.targetIndex = targetIndex
    return cards[cardIndex]
  },

  // File upload simulation
  async uploadFile(file) {
    await delay(2000)

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("ขนาดไฟล์ต้องไม่เกิน 5MB")
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      throw new Error("รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น")
    }

    // Simulate upload
    return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(file.name)}`
  },

  // Admin functions
  async getAllUsers() {
    await delay(700)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    return users
  },

  async updateUserRole(userId, role) {
    await delay(600)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(userId))
    if (userIndex === -1) {
      throw new Error("ไม่พบผู้ใช้")
    }
    users[userIndex].role = role
    return users[userIndex]
  },

  async deleteUser(userId) {
    await delay(800)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(userId))
    if (userIndex === -1) {
      throw new Error("ไม่พบผู้ใช้")
    }
    users.splice(userIndex, 1)
  },

  async createTemplate(templateData) {
    await delay(1000)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    const newTemplate = {
      id: templates.length + 1,
      ...templateData,
      createdAt: new Date(),
    }
    templates.push(newTemplate)
    return newTemplate
  },

  async updateTemplate(id, templateData) {
    await delay(800)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    const templateIndex = templates.findIndex((t) => t.id === Number.parseInt(id))
    if (templateIndex === -1) {
      throw new Error("ไม่พบเทมเพลต")
    }
    templates[templateIndex] = { ...templates[templateIndex], ...templateData }
    return templates[templateIndex]
  },

  async deleteTemplate(id) {
    await delay(600)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    const templateIndex = templates.findIndex((t) => t.id === Number.parseInt(id))
    if (templateIndex === -1) {
      throw new Error("ไม่พบเทมเพลต")
    }
    templates.splice(templateIndex, 1)
  },

  // Statistics
  async getStats() {
    await delay(900)
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("ไม่มีสิทธิ์เข้าถึง")
    }
    return {
      totalUsers: users.length,
      totalCards: cards.length,
      totalTemplates: templates.length,
      activeUsers: users.filter((u) => u.role === "user").length,
      adminUsers: users.filter((u) => u.role === "admin").length,
    }
  },
}
