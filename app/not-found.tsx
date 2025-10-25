"use client"

import Link from "next/link"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="relative bg-primary/10 rounded-full p-6 border border-primary/20">
              <AlertCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="flex-1 sm:flex-none">
            <Button variant="default" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help? Contact support or return to{" "}
            <Link href="/dashboard" className="text-primary hover:underline font-medium">
              dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
