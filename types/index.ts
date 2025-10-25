export type UserRole = "owner" | "salesperson"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface RetailerRequest {
  id: string
  retailerName: string
  productName: string
  description: string
  uniqueId?: string
  status: "requested" | "returned" | "paid"
  attendedBy?: {
    id: string
    name: string
    role: UserRole
  }
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (email: string, password: string, name: string, confirmPassword: string) => Promise<void>
  logout: () => void
}

export type Permission =
  | "view_requests"
  | "create_request"
  | "edit_request"
  | "delete_request"
  | "view_all_requests"
  | "export_requests"

export const rolePermissions: Record<UserRole, Permission[]> = {
  owner: ["view_requests", "create_request", "edit_request", "delete_request", "view_all_requests", "export_requests"],
  salesperson: ["view_requests", "create_request", "edit_request", "view_all_requests"],
}
