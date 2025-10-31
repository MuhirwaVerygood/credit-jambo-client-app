"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Lock, Phone, Smartphone, Leaf, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRegister } from "@/lib/hooks/useAuth"
import { toast } from "react-hot-toast"
import { getDeviceId } from "@/lib/device-id"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    deviceId: "",
  })

  const registerMutation = useRegister()

  // Generate persistent device ID on component mount
  useState(() => {
    if (typeof window !== "undefined" && !formData.deviceId) {
      getDeviceId().then(deviceId => {
        setFormData((prev) => ({ ...prev, deviceId }))
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || "Registration failed")
      },
    })
  }

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-xl border-emerald-100">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-[#29b81c] rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Registration Successful!</CardTitle>
          <CardDescription className="text-base">
            Your account has been created. Please wait for an administrator to verify your device before logging in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-emerald-200 bg-emerald-50">
            <AlertDescription className="text-emerald-900">Redirecting to login page...</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-emerald-100">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 bg-[#29b81c] rounded-2xl flex items-center justify-center">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-balance">Create Account</CardTitle>
        <CardDescription className="text-base">Join Credit Jambo and start saving today</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+250 788 268 451"
                className="pl-10"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                disabled={registerMutation.isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceId">Device ID</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="deviceId" type="text" className="pl-10 bg-muted" value={formData.deviceId} disabled readOnly />
            </div>
            <p className="text-xs text-muted-foreground">Auto-generated and stored on your device</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-[#29b81c] hover:bg-[#25a518]" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[#29b81c] hover:text-[#25a518] font-medium">
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}