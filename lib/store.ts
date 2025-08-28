"use client"

import { create } from "zustand"

export interface Distribution {
  id: string
  title: string
  description: string
  category: string
  quantity: number
  location: string
  deliveryMethod: string
  status: "active" | "fulfilled" | "paused"
  requests: number
  createdAt: string
  philanthropist: string
}

export interface Request {
  id: string
  distributionId: string
  name: string
  email: string
  phone: string
  reason: string
  additionalInfo: string
  status: "pending" | "approved" | "fulfilled" | "rejected"
  submittedAt: string
}

interface AppState {
  distributions: Distribution[]
  requests: Request[]
  addDistribution: (distribution: Omit<Distribution, "id" | "requests" | "createdAt">) => void
  updateDistribution: (id: string, updates: Partial<Distribution>) => void
  deleteDistribution: (id: string) => void
  addRequest: (request: Omit<Request, "id" | "submittedAt">) => void
  updateRequest: (id: string, updates: Partial<Request>) => void
  getDistributionRequests: (distributionId: string) => Request[]
}

export const useAppStore = create<AppState>((set, get) => ({
  distributions: [
    {
      id: "1",
      title: "Winter Clothing Drive",
      description: "Warm jackets, sweaters, and winter accessories for families in need",
      category: "Clothing",
      quantity: 50,
      location: "Downtown Community Center",
      deliveryMethod: "Pickup",
      status: "active",
      requests: 2,
      createdAt: "2024-01-15",
      philanthropist: "Sarah Johnson",
    },
    {
      id: "2",
      title: "Educational Scholarships",
      description: "Financial assistance for college-bound students from low-income families",
      category: "Education",
      quantity: 5,
      location: "Online Application",
      deliveryMethod: "Direct Transfer",
      status: "active",
      requests: 1,
      createdAt: "2024-01-10",
      philanthropist: "Education Foundation",
    },
    {
      id: "3",
      title: "Fresh Groceries Weekly",
      description: "Weekly grocery packages with fresh produce, dairy, and essentials",
      category: "Food",
      quantity: 25,
      location: "Community Kitchen",
      deliveryMethod: "Pickup",
      status: "active",
      requests: 0,
      createdAt: "2024-01-12",
      philanthropist: "Local Food Bank",
    },
    {
      id: "4",
      title: "Laptop Donation Program",
      description: "Refurbished laptops for students and job seekers",
      category: "Technology",
      quantity: 8,
      location: "Tech Center",
      deliveryMethod: "Pickup",
      status: "active",
      requests: 0,
      createdAt: "2024-01-08",
      philanthropist: "Tech for Good",
    },
  ],
  requests: [
    {
      id: "1",
      distributionId: "1",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@email.com",
      phone: "+1-555-0123",
      reason: "Single mother of two young children who need warm winter clothing for school",
      additionalInfo: "Children are ages 6 and 8, sizes 6T and 8T",
      status: "pending",
      submittedAt: "2024-01-16T10:30:00Z",
    },
    {
      id: "2",
      distributionId: "1",
      name: "James Wilson",
      email: "j.wilson@email.com",
      phone: "+1-555-0124",
      reason: "Recently unemployed and need winter clothes for job interviews",
      additionalInfo: "Size Large, professional attire preferred",
      status: "approved",
      submittedAt: "2024-01-16T14:15:00Z",
    },
    {
      id: "3",
      distributionId: "2",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1-555-0125",
      reason: "First-generation college student with financial hardship",
      additionalInfo: "Studying Computer Science, GPA 3.8, part-time job not covering expenses",
      status: "pending",
      submittedAt: "2024-01-15T09:20:00Z",
    },
  ],

  addDistribution: (distribution) => {
    const newDistribution: Distribution = {
      ...distribution,
      id: Date.now().toString(),
      requests: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    set((state) => ({
      distributions: [newDistribution, ...state.distributions],
    }))
  },

  updateDistribution: (id, updates) => {
    set((state) => ({
      distributions: state.distributions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }))
  },

  deleteDistribution: (id) => {
    set((state) => ({
      distributions: state.distributions.filter((d) => d.id !== id),
      requests: state.requests.filter((r) => r.distributionId !== id),
    }))
  },

  addRequest: (request) => {
    const newRequest: Request = {
      ...request,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }

    set((state) => {
      // Update the distribution's request count
      const updatedDistributions = state.distributions.map((d) =>
        d.id === request.distributionId ? { ...d, requests: d.requests + 1 } : d,
      )

      return {
        requests: [...state.requests, newRequest],
        distributions: updatedDistributions,
      }
    })

    // Log notifications
    console.log("[v0] Request submitted:", { request: newRequest })
    console.log("[v0] Sending email notification to philanthropist about new request")
    console.log(`[v0] Sending confirmation email to ${request.email}`)
  },

  updateRequest: (id, updates) => {
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }))

    // Log notification for status changes
    const request = get().requests.find((r) => r.id === id)
    if (request && updates.status) {
      console.log(`[v0] Sending ${updates.status} notification to ${request.email}`)
    }
  },

  getDistributionRequests: (distributionId) => {
    return get().requests.filter((req) => req.distributionId === distributionId)
  },
}))
