"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Calendar,
  Package,
  LogOut,
  Eye,
  CheckCircle,
  Mail,
  MessageCircle,
  Phone,
  Settings,
  User,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PhilanthropistDashboardProps {
  user: string
  onLogout?: () => void
}

export function PhilanthropistDashboard({ user, onLogout }: PhilanthropistDashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const {
    distributions,
    requests,
    addDistribution,
    updateDistribution,
    deleteDistribution,
    updateRequest,
    getDistributionRequests,
  } = useAppStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDistribution, setSelectedDistribution] = useState<any>(null)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)
  const [newDistribution, setNewDistribution] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    location: "",
    deliveryMethod: "",
  })

  const categories = ["Food", "Clothing", "Education", "Healthcare", "Housing", "Technology", "Other"]
  const deliveryMethods = ["Pickup", "Delivery", "Direct Transfer", "Mail"]

  const handleCreateDistribution = () => {
    if (!newDistribution.title || !newDistribution.category || !newDistribution.quantity) return

    addDistribution({
      title: newDistribution.title,
      description: newDistribution.description,
      category: newDistribution.category,
      quantity: Number.parseInt(newDistribution.quantity),
      location: newDistribution.location,
      deliveryMethod: newDistribution.deliveryMethod,
      status: "active",
      philanthropist: user,
    })

    setNewDistribution({
      title: "",
      description: "",
      category: "",
      quantity: "",
      location: "",
      deliveryMethod: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteDistribution = (id: string) => {
    deleteDistribution(id)
  }

  const toggleDistributionStatus = (id: string) => {
    const distribution = distributions.find((d) => d.id === id)
    if (distribution) {
      updateDistribution(id, {
        status: distribution.status === "active" ? "paused" : "active",
      })
    }
  }

  const handleRequestAction = (requestId: string, action: "approve" | "reject" | "fulfill") => {
    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "fulfilled"
    updateRequest(requestId, { status: newStatus })
  }

  const openRequestsDialog = (distribution: any) => {
    setSelectedDistribution(distribution)
    setIsRequestsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "fulfilled":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "fulfilled":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleContactBeneficiary = (request: any, method: "email" | "whatsapp" | "call") => {
    if (method === "email") {
      window.open(`mailto:${request.email}?subject=Regarding your request for ${selectedDistribution?.title}`)
    } else if (method === "whatsapp") {
      const message = encodeURIComponent(
        `Hi ${request.name}, regarding your request for ${selectedDistribution?.title}...`,
      )
      window.open(`https://wa.me/${request.phone.replace(/[^0-9]/g, "")}?text=${message}`)
    } else if (method === "call") {
      window.open(`tel:${request.phone}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GiveConnect</h1>
                <p className="text-sm text-gray-600">Philanthropist Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout || handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/delete-account" className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {distributions.filter((d) => d.status === "active").length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {distributions.reduce((sum, d) => sum + d.quantity, 0)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "fulfilled").length}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Distributions</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Distribution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Distribution</DialogTitle>
                <DialogDescription>Fill in the details for your new distribution listing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newDistribution.title}
                      onChange={(e) => setNewDistribution({ ...newDistribution, title: e.target.value })}
                      placeholder="e.g., Winter Clothing Drive"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newDistribution.category}
                      onValueChange={(value) => setNewDistribution({ ...newDistribution, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDistribution.description}
                    onChange={(e) => setNewDistribution({ ...newDistribution, description: e.target.value })}
                    placeholder="Describe what you're offering and any requirements"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newDistribution.quantity}
                      onChange={(e) => setNewDistribution({ ...newDistribution, quantity: e.target.value })}
                      placeholder="Number of items/spots"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryMethod">Delivery Method</Label>
                    <Select
                      value={newDistribution.deliveryMethod}
                      onValueChange={(value) => setNewDistribution({ ...newDistribution, deliveryMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location/Instructions</Label>
                  <Input
                    id="location"
                    value={newDistribution.location}
                    onChange={(e) => setNewDistribution({ ...newDistribution, location: e.target.value })}
                    placeholder="Pickup location or delivery instructions"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDistribution} className="bg-blue-600 hover:bg-blue-700">
                    Create Distribution
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {distributions.map((distribution) => (
            <Card key={distribution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{distribution.title}</h3>
                      <Badge className={getStatusColor(distribution.status)}>{distribution.status}</Badge>
                      <Badge variant="outline">{distribution.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{distribution.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{distribution.quantity} available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{distribution.requests} requests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{distribution.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {distribution.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openRequestsDialog(distribution)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Requests ({getDistributionRequests(distribution.id).length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleDistributionStatus(distribution.id)}>
                      {distribution.status === "active" ? "Pause" : "Activate"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDistribution(distribution.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {distributions.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No distributions yet</h3>
            <p className="text-gray-600 mb-6">Create your first distribution to start helping others</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Distribution
            </Button>
          </Card>
        )}

        <Dialog open={isRequestsDialogOpen} onOpenChange={setIsRequestsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Requests - {selectedDistribution?.title}</DialogTitle>
              <DialogDescription>Review and manage incoming requests for this distribution</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {getDistributionRequests(selectedDistribution?.id || "").length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests yet</h3>
                  <p className="text-gray-600">Requests will appear here when beneficiaries submit them</p>
                </div>
              ) : (
                getDistributionRequests(selectedDistribution?.id || "").map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{request.name}</h4>
                          <Badge className={getRequestStatusColor(request.status)}>{request.status}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{request.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{request.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted {new Date(request.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleContactBeneficiary(request, "email")}>
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactBeneficiary(request, "whatsapp")}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContactBeneficiary(request, "call")}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-1">Reason for Request:</h5>
                      <p className="text-gray-700 text-sm">{request.reason}</p>
                      {request.additionalInfo && (
                        <>
                          <h5 className="font-medium text-gray-900 mb-1 mt-3">Additional Information:</h5>
                          <p className="text-gray-700 text-sm">{request.additionalInfo}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleRequestAction(request.id, "approve")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRequestAction(request.id, "reject")}>
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleRequestAction(request.id, "fulfill")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Fulfilled
                        </Button>
                      )}
                      {request.status === "fulfilled" && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
