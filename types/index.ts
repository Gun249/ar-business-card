// Shared TypeScript types for the AR Business Card application

export interface User {
  id: string | number;
  name?: string;
  email: string;
  avatar?: string;
  username?: string;
  role?: string;
  createdAt?: string | Date;
  isActive?: boolean;
}

export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  template: string;
  templateId?: string;
  createdAt: string;
  isActive: boolean;
  // Additional fields for AR functionality
  role?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  frontImage?: string;
  scanCount?: number;
}

export interface Template {
  id: string | number;
  name: string;
  category: string;
  type: string;
  fields: string[];
  thumbnail?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Stats {
  totalUsers: number;
  totalCards: number;
  totalTemplates: number;
  adminUsers: number;
}

export type PageType = "landing" | "login" | "register" | "templates" | "my-cards" | "profile" | "ar-viewer";
export type ToastType = "success" | "error" | "info" | "warning";
