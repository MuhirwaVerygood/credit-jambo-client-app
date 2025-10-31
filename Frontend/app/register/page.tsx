import { RegisterForm } from "@/components/register-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <RegisterForm />
    </div>
  )
}