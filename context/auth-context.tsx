"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, UserRole, Permission } from "@/types"
import { rolePermissions } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("leajer_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with actual authentication
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("leajer_user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, confirmPassword: string) => {
    setIsLoading(true)
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Mock API call - replace with actual signup endpoint
      // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // });
      // const data = await response.json();

      const mockUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: "salesperson", // Salesperson signup only
      }

      setUser(mockUser)
      localStorage.setItem("leajer_user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("leajer_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function usePermission() {
  const { user } = useAuth()

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return rolePermissions[user.role].includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.some((p) => rolePermissions[user.role].includes(p))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.every((p) => rolePermissions[user.role].includes(p))
  }

  return { hasPermission, hasAnyPermission, hasAllPermissions, userRole: user?.role }
}
