"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { RetailerRequest } from "@/types"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RequestFormProps {
  request?: RetailerRequest
  onSubmit: (data: {
    retailerName: string;
    productName: string;
    description: string;
    uniqueId: string;
    attendedBy: string;
  }) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export function RequestForm({ request, onSubmit, onClose, isLoading = false }: RequestFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    retailerName: "",
    productName: "",
    description: "",
    uniqueId: ""
  })

  useEffect(() => {
    if (request) {
      setFormData({
        retailerName: request.retailerName,
        productName: request.productName,
        description: request.description,
        uniqueId: request.uniqueId || "",
      })
    }
  }, [request])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        retailerName: formData.retailerName,
        productName: formData.productName,
        description: formData.description,
        uniqueId: formData.uniqueId,
        attendedBy: user?.name || "",
      }
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <Card className="w-full max-w-md shadow-xl animate-in zoom-in-95">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{request ? "Edit Request" : "New Request"}</CardTitle>
            <CardDescription>
              {request ? "Update retailer request details" : "Create a new retailer request"}
            </CardDescription>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Retailer/Collector Name *</label>
              <Input
                placeholder="Enter retailer name"
                value={formData.retailerName}
                onChange={(e) => setFormData({ ...formData, retailerName: e.target.value })}
                required
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                placeholder="Enter product name"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground min-h-24 resize-none transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unique ID (Optional)</label>
              <Input
                placeholder="Enter unique ID"
                value={formData.uniqueId}
                onChange={(e) => setFormData({ ...formData, uniqueId: e.target.value })}
                disabled={isLoading}
                className="transition-colors"
              />
            </div>



            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-transparent transition-all hover:shadow-md"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 transition-all hover:shadow-md">
                {isLoading ? "Saving..." : "Save Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
