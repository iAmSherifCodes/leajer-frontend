'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { showToast } from '@/lib/toast'
import { cognitoAuth } from '@/lib/cognito'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

function VerifyContent() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      showToast.error('Please enter the verification code')
      return
    }

    setIsLoading(true)
    try {
      console.log('Verifying with email:', email, 'code:', code)
      await cognitoAuth.confirmSignUp(email, code)
      showToast.success('Email verified successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Verification error:', error)
      const errorMessage = error.message || 'Invalid verification code. Please try again.'
      showToast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      console.log('Resending code to:', email)
      await cognitoAuth.resendCode(email)
      showToast.success('Verification code sent!')
    } catch (error: any) {
      console.error('Resend error:', error)
      const errorMessage = error.message || 'Failed to resend code. Please try again.'
      showToast.error(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription className="mt-2">
              We've sent a verification code to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link href="/signup" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-muted-foreground">Loading...</p></div></div>}>
      <VerifyContent />
    </Suspense>
  )
}