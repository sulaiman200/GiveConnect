"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Gift, Search, Plus, MapPin, Calendar, User } from "lucide-react"
import { PhilanthropistDashboard } from "@/components/philanthropist-dashboard"
import { BeneficiaryPortal } from "@/components/beneficiary-portal"

type UserType = "philanthropist" | "beneficiary" | null

export default function HomePage() {
  const [userType, setUserType] = useState<UserType>(null)
  const [currentUser, setCurrentUser] = useState<string>("")

  const handleLogin = (type: UserType, name: string) => {
    setUserType(type)
    setCurrentUser(name)
  }

  const handleLogout = () => {
    setUserType(null)
    setCurrentUser("")
  }

  if (userType === "philanthropist") {
    return <PhilanthropistDashboard user={currentUser} onLogout={handleLogout} />
  }

  if (userType === "beneficiary") {
    return <BeneficiaryPortal user={currentUser} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GiveConnect</h1>
                <p className="text-sm text-gray-600">Connecting hearts, changing lives</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Bridge the Gap Between
            <span className="text-blue-600"> Giving </span>
            and
            <span className="text-green-600"> Receiving</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-pretty">
            A modern platform that connects generous philanthropists with those in need, making charitable distribution
            transparent, efficient, and impactful.
          </p>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Philanthropist Card */}
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I Want to Give</CardTitle>
                <CardDescription className="text-gray-600">
                  Share your resources with those who need them most
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span>Create distribution listings</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Manage requests and claims</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Track distribution progress</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleLogin("philanthropist", "Demo Philanthropist")}
                >
                  Continue as Philanthropist
                </Button>
              </CardContent>
            </Card>

            {/* Beneficiary Card */}
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I Need Help</CardTitle>
                <CardDescription className="text-gray-600">
                  Find resources and support from generous donors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Search className="w-5 h-5 text-green-600" />
                    <span>Browse available resources</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>Filter by location and category</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-5 h-5 text-green-600" />
                    <span>Submit requests easily</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                  onClick={() => handleLogin("beneficiary", "Demo Beneficiary")}
                >
                  Continue as Beneficiary
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600">Items Distributed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Families Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Active Philanthropists</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
