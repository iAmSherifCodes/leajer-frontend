'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { AlertCircle, Crown, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cognitoAuth } from '@/lib/cognito'
import { showToast } from '@/lib/toast'

export default function OwnerSignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }

    const uppercaseRegex = /[A-Z]/
    const lowercaseRegex = /[a-z]/
    const numberRegex = /[0-9]/
    const specialRegex = /[!@#$%^&*(),.?":{}|<>]/
    
    if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || 
        !numberRegex.test(password) || !specialRegex.test(password)) {
      setError('Password must contain uppercase, lowercase, number, and special character')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await cognitoAuth.signUpOwner(email, password, `admin-${name}`)
      showToast.success('Owner account created! Please check your email for verification code.')
      router.push(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-950/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-amber-200 dark:border-amber-800">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-2xl font-bold">Leajer</h1>
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <CardDescription>Create your owner account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="owner@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="transition-colors"
              />
              <p className="text-xs text-muted-foreground">At least 8 characters with uppercase, lowercase & number</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Owner Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            <Link href="/">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Sign In
              </Button>
            </Link>

            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                You will be registered as an <span className="font-semibold text-amber-700 dark:text-amber-400">Owner</span> with full administrative privileges.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}