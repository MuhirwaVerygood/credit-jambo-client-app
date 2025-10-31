"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, Smartphone, Leaf } from "lucide-react"
import Link from "next/link"
import { useLogin } from "@/lib/hooks/useAuth"
import { toast } from "react-hot-toast"
import { getDeviceId } from "@/lib/device-id"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceId: "",
  })

  const loginMutation = useLogin()

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

    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log('Login response:', data)
        router.push("/dashboard")
        router.refresh()
      },
      onError: (error: any) => {
        console.log('Login error:', error)
        if (error.response?.status === 403 && error.response?.data?.deviceStatus === "pending") {
          setError("Your device is pending verification. Please contact an administrator.")
        } else {
          setError(error.response?.data?.error || "Login failed")
        }
      },
    })
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-emerald-100">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 bg-[#29b81c] rounded-2xl flex items-center justify-center">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-balance">Welcome Back</CardTitle>
        <CardDescription className="text-base">Sign in to your Credit Jambo savings account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                disabled={loginMutation.isPending}
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
                disabled={loginMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceId">Device ID</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="deviceId" type="text" className="pl-10 bg-muted" value={formData.deviceId} disabled readOnly />
            </div>
            <p className="text-xs text-muted-foreground">Your device must be verified by an administrator</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-[#29b81c] hover:bg-[#25a518]" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#29b81c] hover:text-[#25a518] font-medium">
              Register here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

