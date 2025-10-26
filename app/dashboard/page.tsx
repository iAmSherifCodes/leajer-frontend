"use client"

import { useAuth, usePermission } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { RequestForm } from "@/components/request-form"
import { RequestList } from "@/components/request-list"
import { RequestGrid } from "@/components/request-grid"
import { RequestDetail } from "@/components/request-detail"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requestsAPI } from "@/services/api"
import type { RetailerRequest } from "@/types"
import { Plus, Search, Package, CheckCircle2, RotateCcw, List, Grid3x3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { showToast } from '@/lib/toast'

type ViewType = "list" | "grid"

const ITEMS_PER_PAGE = 6

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const { hasPermission } = usePermission()
  const router = useRouter()
  const [requests, setRequests] = useState<RetailerRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RetailerRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<RetailerRequest | undefined>()
  const [viewingRequest, setViewingRequest] = useState<RetailerRequest | undefined>()
  const [isSaving, setIsSaving] = useState(false)
  const [viewType, setViewType] = useState<ViewType>("grid")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    const filtered = requests.filter(
      (req) =>
        req.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.uniqueId && req.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())),
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredRequests(filtered)
    setCurrentPage(1)
  }, [searchTerm, requests])

  const loadRequests = async () => {
    try {
      setIsLoadingRequests(true)
      const data = await requestsAPI.getAll()
      setRequests(data)

    } catch (error) {
      console.error("Failed to load requests:", error)
      showToast.error('Failed to load requests. Please try again.')
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const handleCreateOrUpdate = async (data: {
    retailerName: string;
    productName: string;
    description: string;
    uniqueId: string;
    attendedBy: string;
  }) => {
    setIsSaving(true)
    try {
      const created = await requestsAPI.create(data)
      setRequests([created, ...requests])
      showToast.success('Request saved successfully')
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to save request:", error)
      showToast.error('Failed to save request. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsSaving(true)
      await requestsAPI.delete(id)
      setRequests(requests.filter((r) => r.id !== id))
      showToast.success('Request deleted successfully')
    } catch (error) {
      console.error("Failed to delete request:", error)
      showToast.error('Failed to delete request. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      setIsSaving(true)
      const request = requests.find((r) => r.id === requestId)
      if (request) {
        const updated = await requestsAPI.update(requestId, {
          status: newStatus,
        })
        setRequests(requests.map((r) => (r.id === updated.id ? updated : r)))
      }
      showToast.success('Status updated successfully')
    } catch (error) {
      console.error("Failed to update status:", error)
      showToast.error('Failed to update status. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (request: RetailerRequest) => {
    setEditingRequest(request)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingRequest(undefined)
  }

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalCount = requests.length
  const activeCount = requests.filter((r) => r.status === "requested").length
  const returnedCount = requests.filter((r) => r.status === "returned").length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-muted-foreground mt-1">Here's what's happening with your requests today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{totalCount}</p>
                    <p className="text-xs text-muted-foreground mt-2">All time requests</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{activeCount}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">Number of active requests</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Returned Requests</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{returnedCount}</p>
                    <p className="text-xs text-muted-foreground mt-2">Number of returned requests</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <RotateCcw className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Retailer Requests</CardTitle>
                  <CardDescription>Manage all retailer and collector requests</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <Button
                      variant={viewType === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setViewType("list")
                        setCurrentPage(1)
                      }}
                      className="gap-2"
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">List</span>
                    </Button>
                    <Button
                      variant={viewType === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setViewType("grid")
                        setCurrentPage(1)
                      }}
                      className="gap-2"
                    >
                      <Grid3x3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </Button>
                  </div>
                  {hasPermission("create_request") && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingRequest(undefined)
                        setIsFormOpen(true)
                      }}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      New Request
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by retailer, product, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-colors"
                />
              </div>

              {viewType === "list" ? (
                <RequestList
                  requests={paginatedRequests}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={setViewingRequest}
                  onStatusUpdate={handleStatusUpdate}
                  isLoading={isSaving}
                />
              ) : (
                <RequestGrid
                  requests={paginatedRequests}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={setViewingRequest}
                  onStatusUpdate={handleStatusUpdate}
                  isLoading={isSaving}
                />
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isSaving}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {isFormOpen && hasPermission("create_request") && (
        <RequestForm
          request={editingRequest}
          onSubmit={handleCreateOrUpdate}
          onClose={handleCloseForm}
          isLoading={isSaving}
        />
      )}

      {viewingRequest && <RequestDetail request={viewingRequest} onClose={() => setViewingRequest(undefined)} />}
    </div>
  )
}
