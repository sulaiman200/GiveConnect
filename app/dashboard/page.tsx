import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PhilanthropistDashboard } from "@/components/philanthropist-dashboard"
import { BeneficiaryPortal } from "@/components/beneficiary-portal"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const user = data.user
  const userType = user.user_metadata?.user_type as "philanthropist" | "beneficiary"
  const fullName = user.user_metadata?.full_name || user.email || "User"

  const handleLogout = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  if (userType === "philanthropist") {
    return <PhilanthropistDashboard user={fullName} onLogout={handleLogout} />
  }

  if (userType === "beneficiary") {
    return <BeneficiaryPortal user={fullName} onLogout={handleLogout} />
  }

  // Fallback if user type is not set
  redirect("/auth/profile-setup")
}
