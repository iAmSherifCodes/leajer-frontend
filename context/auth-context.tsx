"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, UserRole, Permission } from "@/types"
import { rolePermissions } from "@/types"
import { showToast } from '@/lib/toast'
import { cognitoAuth } from '@/lib/cognito'

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
      const result = await cognitoAuth.signIn(email, password)
      const cognitoUser = await cognitoAuth.getCurrentUser()
      
      const user: User = {
        id: cognitoUser.userId,
        name: cognitoUser.signInDetails?.loginId?.split('@')[0] || email.split('@')[0],
        email,
        role,
      }

      setUser(user)
      showToast.success("Login successful")
      localStorage.setItem("leajer_user", JSON.stringify(user))
    } catch (error) {
      console.error("Login failed:", error)
      showToast.error("Login failed. Please check your credentials.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, confirmPassword: string) => {
    setIsLoading(true)
    try {
      if (password !== confirmPassword) {
        const message = "Passwords do not match"
        showToast.error(message)
        throw new Error(message)
      }

      await cognitoAuth.signUp(email, password, name)
      showToast.success("Signup successful! Please check your email for verification code.")
    } catch (error) {
      console.error("Signup failed:", error)
      showToast.error("Signup failed. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await cognitoAuth.signOut()
      setUser(null)
      localStorage.removeItem("leajer_user")
    } catch (error) {
      console.error("Logout failed:", error)
    }
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
  const role = (user: User) => {
    // if name contails admin then the user is admin
    if (user.name.includes("admin") || user.name.includes("Admin") || user.name.includes("ADMIN")) {
      user.role = "owner"
    } else { user.role = "salesperson" }
    return user.role
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    const userRole = role(user)
    return rolePermissions[userRole].includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false
    const userRole = role(user)
    return permissions.some((p) => rolePermissions[userRole
    ].includes(p))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false
    const userRole = role(user)
    return permissions.every((p) => rolePermissions[userRole].includes(p))
  }

  return { hasPermission, hasAnyPermission, hasAllPermissions, userRole: user?.role }
}
