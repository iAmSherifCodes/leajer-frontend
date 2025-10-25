"use client"

import { useState } from "react"
import type { RetailerRequest } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePermission } from "@/context/auth-context"
import { DeleteRequestDialog } from "./delete-request-dialog"
import { StatusEditDialog } from "./status-edit-dialog"

interface RequestGridProps {
  requests: RetailerRequest[]
  onEdit: (request: RetailerRequest) => void
  onDelete: (id: string) => void
  onView: (request: RetailerRequest) => void
  onStatusUpdate?: (requestId: string, newStatus: string) => void
  isLoading?: boolean
}

export function RequestGrid({
  requests,
  onEdit,
  onDelete,
  onView,
  onStatusUpdate,
  isLoading = false,
}: RequestGridProps) {
  const { hasPermission } = usePermission()
  const canEdit = hasPermission("edit_request")
  const canDelete = hasPermission("delete_request")
  const canView = hasPermission("view_requests")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequestForDelete, setSelectedRequestForDelete] = useState<RetailerRequest | null>(null)
  const [statusEditOpen, setStatusEditOpen] = useState(false)
  const [selectedRequestForStatus, setSelectedRequestForStatus] = useState<RetailerRequest | null>(null)

  const handleDeleteClick = (request: RetailerRequest) => {
    setSelectedRequestForDelete(request)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedRequestForDelete) {
      onDelete(selectedRequestForDelete.id)
      setDeleteDialogOpen(false)
      setSelectedRequestForDelete(null)
    }
  }

  const handleStatusEditClick = (request: RetailerRequest) => {
    setSelectedRequestForStatus(request)
    setStatusEditOpen(true)
  }

  const handleStatusSave = (requestId: string, newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(requestId, newStatus)
    }
  }

  if (!canView) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground">You don't have permission to view requests.</p>
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground">No requests found. Create one to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group flex flex-col"
          >
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-4">
                <Badge
                  variant={request.status === "requested" ? "default" : "secondary"}
                  className="flex-shrink-0 capitalize"
                >
                  {request.status}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(request)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusEditClick(request)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(request)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3 cursor-pointer mb-4" onClick={() => onView(request)}>
                {/* Product name at top */}
                <h3 className="font-semibold text-base text-balance group-hover:text-primary transition-colors">
                  {request.productName}
                </h3>

                {/* Description below product name */}
                <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>

                {/* Retailer name below description */}
                <p className="text-sm font-medium text-foreground">{request.retailerName}</p>

                <div className="space-y-1 pt-2">
                  {request.uniqueId && <p className="text-xs text-muted-foreground">ID: {request.uniqueId}</p>}
                  <p className="text-xs text-muted-foreground">
                    Date: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  {request.attendedBy && (
                    <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">
                      {request.attendedBy}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRequestForDelete && (
        <DeleteRequestDialog
          isOpen={deleteDialogOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteDialogOpen(false)
            setSelectedRequestForDelete(null)
          }}
          retailerName={selectedRequestForDelete.retailerName}
          isLoading={isLoading}
        />
      )}

      {selectedRequestForStatus && (
        <StatusEditDialog
          request={selectedRequestForStatus}
          onClose={() => {
            setStatusEditOpen(false)
            setSelectedRequestForStatus(null)
          }}
          onSave={handleStatusSave}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
