"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Search,
  MapPin,
  Calendar,
  Package,
  LogOut,
  Filter,
  Send,
  CheckCircle,
  Mail,
  MessageCircle,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

interface BeneficiaryPortalProps {
  user: string
  onLogout: () => void
}

export function BeneficiaryPortal({ user, onLogout }: BeneficiaryPortalProps) {
  const { distributions, addRequest } = useAppStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDistribution, setSelectedDistribution] = useState<any>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    additionalInfo: "",
  })

  const categories = ["All", "Food", "Clothing", "Education", "Healthcare", "Housing", "Technology", "Other"]

  const filteredDistributions = distributions
    .filter((d) => d.status === "active")
    .filter((distribution) => {
      const matchesSearch =
        distribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distribution.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        !selectedCategory || selectedCategory === "All" || distribution.category === selectedCategory
      return matchesSearch && matchesCategory
    })

  const handleRequestSubmit = () => {
    if (!requestForm.name || !requestForm.email || !requestForm.reason) return

    addRequest({
      distributionId: selectedDistribution.id,
      name: requestForm.name,
      email: requestForm.email,
      phone: requestForm.phone,
      reason: requestForm.reason,
      additionalInfo: requestForm.additionalInfo,
      status: "pending",
    })

    setRequestForm({
      name: "",
      email: "",
      phone: "",
      reason: "",
      additionalInfo: "",
    })
    setIsRequestDialogOpen(false)
    setSelectedDistribution(null)

    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 5000)
  }

  const openRequestDialog = (distribution: any) => {
    setSelectedDistribution(distribution)
    setIsRequestDialogOpen(true)
  }

  const handleContactPhilanthropist = (distribution: any, method: "email" | "whatsapp") => {
    if (method === "email") {
      const subject = encodeURIComponent(`Inquiry about ${distribution.title}`)
      const body = encodeURIComponent(
        `Hi ${distribution.philanthropist},\n\nI'm interested in your distribution: ${distribution.title}\n\nCould you please provide more information?\n\nThank you!`,
      )
      window.open(`mailto:contact@example.com?subject=${subject}&body=${body}`)
    } else if (method === "whatsapp") {
      const message = encodeURIComponent(
        `Hi ${distribution.philanthropist}, I'm interested in your distribution: ${distribution.title}`,
      )
      window.open(`https://wa.me/1234567890?text=${message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GiveConnect</h1>
                <p className="text-sm text-gray-600">Find Resources & Support</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {showSuccessAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your request has been submitted successfully! The philanthropist will be notified and will contact you
              soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Available Resources</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for resources, items, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDistributions.length} available resource{filteredDistributions.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        <div className="grid gap-6">
          {filteredDistributions.map((distribution) => (
            <Card key={distribution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{distribution.title}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {distribution.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4 text-pretty">{distribution.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <span>{distribution.quantity} available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{distribution.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>Posted {distribution.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>By {distribution.philanthropist}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <span className="text-gray-600">Delivery:</span>
                      <Badge variant="secondary">{distribution.deliveryMethod}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactPhilanthropist(distribution, "email")}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactPhilanthropist(distribution, "whatsapp")}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Button onClick={() => openRequestDialog(distribution)} className="bg-green-600 hover:bg-green-700">
                      <Send className="w-4 h-4 mr-2" />
                      Request This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDistributions.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </Card>
        )}

        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Resource</DialogTitle>
              <DialogDescription>Submit your request for: {selectedDistribution?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={requestForm.phone}
                  onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <Label htmlFor="reason">Why do you need this resource? *</Label>
                <Textarea
                  id="reason"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  placeholder="Please explain your situation and why you need this resource"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={requestForm.additionalInfo}
                  onChange={(e) => setRequestForm({ ...requestForm, additionalInfo: e.target.value })}
                  placeholder="Any additional details that might help your request"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestSubmit} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
