"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Heart, AlertTriangle } from "lucide-react"

export default function DeleteAccountPage() {
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router])

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (confirmText !== "DELETE") {
      setError("Please type 'DELETE' to confirm account deletion")
      setIsLoading(false)
      return
    }

    try {
      // First verify the password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      })

      if (signInError) {
        throw new Error("Invalid password. Please enter your current password.")
      }

      // Delete the user account
      const { error: deleteError } = await supabase.rpc("delete_user")

      if (deleteError) {
        // Fallback: sign out the user if deletion fails
        await supabase.auth.signOut()
        throw new Error("Account deletion failed. Please contact support.")
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GiveConnect</h1>
            </div>
          </div>
          <p className="text-gray-600">Account deletion</p>
        </div>

        <Card className="border-2 border-red-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Delete Account</CardTitle>
            <CardDescription>This action cannot be undone</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Warning:</strong> Deleting your account will permanently remove all your data, including
                distributions, requests, and profile information. This action cannot be reversed.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleDeleteAccount}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Current Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your current password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmText">
                    Type <strong>DELETE</strong> to confirm
                  </Label>
                  <Input
                    id="confirmText"
                    type="text"
                    placeholder="DELETE"
                    required
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading || confirmText !== "DELETE"}
                >
                  {isLoading ? "Deleting account..." : "Delete My Account"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm space-y-2">
                <div>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-700 underline underline-offset-4">
                    Cancel and go back to dashboard
                  </Link>
                </div>
                <div>
                  <Link href="/" className="text-gray-600 hover:text-gray-700 underline underline-offset-4">
                    Back to home
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
