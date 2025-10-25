"use client"

import type { RetailerRequest } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RequestDetailProps {
  request: RetailerRequest
  onClose: () => void
}

export function RequestDetail({ request, onClose }: RequestDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>View full request information</CardDescription>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Retailer/Collector Name</p>
            <p className="font-semibold">{request.retailerName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Product Name</p>
            <p className="font-semibold">{request.productName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{request.description}</p>
          </div>

          {request.uniqueId && (
            <div>
              <p className="text-sm text-muted-foreground">Unique ID</p>
              <p className="font-semibold">{request.uniqueId}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={request.status === "requested" ? "default" : "secondary"} className="capitalize">
              {request.status}
            </Badge>
          </div>

          {request.attendedBy && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Attended By</p>
              <p className="font-semibold">{request.attendedBy.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{request.attendedBy.role}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-xs font-medium">{formatDate(request.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="text-xs font-medium">{formatDate(request.updatedAt)}</p>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
