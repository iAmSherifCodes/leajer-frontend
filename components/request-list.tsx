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

interface RequestListProps {
  requests: RetailerRequest[]
  onEdit: (request: RetailerRequest) => void
  onDelete: (id: string) => void
  onView: (request: RetailerRequest) => void
  onStatusUpdate?: (requestId: string, newStatus: string) => void
  isLoading?: boolean
}

export function RequestList({
  requests,
  onEdit,
  onDelete,
  onView,
  onStatusUpdate,
  isLoading = false,
}: RequestListProps) {
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
      <div className="space-y-3">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 space-y-2 cursor-pointer" onClick={() => onView(request)}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-balance group-hover:text-primary transition-colors">
                      {request.retailerName}
                    </h3>
                    <Badge
                      variant={request.status === "requested" ? "default" : "secondary"}
                      className="flex-shrink-0 capitalize"
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.productName}</p>
                  <p className="text-sm text-foreground line-clamp-2">{request.description}</p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {request.uniqueId && <p className="text-xs text-muted-foreground">ID: {request.uniqueId}</p>}
                    {request.attendedBy && (
                      <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Attended by: {request.attendedBy.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(request)}
                    disabled={isLoading}
                    className="gap-1 transition-all hover:shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusEditClick(request)}
                      disabled={isLoading}
                      className="gap-1 transition-all hover:shadow-md"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(request)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive gap-1 transition-all hover:shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
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
