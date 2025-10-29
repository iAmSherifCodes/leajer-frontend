"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, UserRole, Permission } from "@/types"
import { rolePermissions } from "@/types"
import { showToast } from '@/lib/toast'
import { cognitoAuth } from '@/lib/cognito'
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem("leajer_user")
      if (storedUser) {
        try {
          // Check if Cognito session is still valid
          await cognitoAuth.getCurrentUser()
          setUser(JSON.parse(storedUser))
        } catch (error) {
          // Token expired or invalid, clear local storage
          console.log("Token expired, logging out")
          localStorage.removeItem("leajer_user")
          localStorage.removeItem("leajer_token")
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuthStatus()

    // Check token validity every 5 minutes
    const interval = setInterval(async () => {
      if (user) {
        try {
          await cognitoAuth.getCurrentUser()
        } catch (error) {
          console.log("Token expired during session, logging out")
          showToast.error("Session expired. Please log in again.")
          await logout()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const result = await cognitoAuth.signIn(email, password)
      const cognitoUser = await cognitoAuth.getCurrentUser()
      const session = await cognitoAuth.getCurrentSession()

      if (!cognitoUser) {
        throw new Error("Failed to retrieve user after login")
      }

      if (!result.isSignedIn) {
        throw new Error("Login failed")
      }
      // Decode JWT idToken to get user's registered name
      let userName = email.split('@')[0] // fallback
      if (session?.tokens?.idToken) {
        try {
          const idTokenString = session.tokens.idToken.toString()
          const payload = jwtDecode<{ name?: string }>(idTokenString)

          userName = payload?.name? payload.name : userName
          localStorage.setItem('leajer_token', idTokenString)
        } catch (error) {
          console.error('Failed to decode JWT:', error)
        }
      }

      // Get actual role from Cognito groups
      const actualRole = await cognitoAuth.getUserRole(email)

      const user: User = {
        id: cognitoUser.userId,
        name: userName,
        email,
        role: actualRole
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

      await cognitoAuth.signUpSalesperson(email, password, name)
      showToast.success("Signup successful! Please check your email for verification code.")
    } catch (error) {
      console.error("Signup failed:", error)
      showToast.error("Signup failed. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const ownerSignup = async (email: string, password: string, name: string, confirmPassword: string) => {
    setIsLoading(true)
    try {
      if (password !== confirmPassword) {
        const message = "Passwords do not match"
        showToast.error(message)
        throw new Error(message)
      }

      await cognitoAuth.signUpOwner(email, password, name)
      showToast.success("Owner account created! Please check your email for verification code.")
    } catch (error) {
      console.error("Owner signup failed:", error)
      showToast.error("Owner signup failed. Please try again.")
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
      localStorage.removeItem("leajer_token")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, signup, ownerSignup }}>{children}</AuthContext.Provider>
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
