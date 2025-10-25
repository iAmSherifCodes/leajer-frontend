"use client"

import { useState } from "react"
import type { RetailerRequest } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface StatusEditDialogProps {
  request: RetailerRequest
  onClose: () => void
  onSave: (requestId: string, newStatus: string) => void
  isLoading?: boolean
}

export function StatusEditDialog({ request, onClose, onSave, isLoading = false }: StatusEditDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(request.status)

  const handleSave = () => {
    if (selectedStatus !== request.status) {
      onSave(request.id, selectedStatus)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Edit Status</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Retailer: {request.retailerName}</p>
              <p className="text-sm text-muted-foreground mb-4">Product: {request.productName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "requested" | "returned" | "paid")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
