import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Shield, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#29b81c] rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-balance">Credit Jambo</h1>
              <p className="text-xs text-muted-foreground">Savings Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-[#29b81c] hover:bg-[#25a518]" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Secure & Trusted
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Your Trusted Partner for <span className="text-[#29b81c]">Savings Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join thousands of Rwandans who trust Credit Jambo to manage their savings securely. Start your financial
            journey today with our easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#29b81c] hover:bg-[#25a518] text-lg" asChild>
              <Link href="/register">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-transparent" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why Choose Credit Jambo?</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            We provide secure, reliable, and easy-to-use savings management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#29b81c]" />
              </div>
              <CardTitle>Secure & Protected</CardTitle>
              <CardDescription>
                Your savings are protected with bank-level security, SHA-512 encryption, and device verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#29b81c]" />
              </div>
              <CardTitle>Easy Transactions</CardTitle>
              <CardDescription>
                Deposit and withdraw funds instantly with our simple interface. Track every transaction in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#29b81c]" />
              </div>
              <CardTitle>Trusted by Many</CardTitle>
              <CardDescription>
                Join a community of savers across Rwanda who trust Credit Jambo for their financial needs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">How It Works</h2>
          <p className="text-lg text-muted-foreground text-pretty">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#29b81c] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Create Account</h3>
            <p className="text-muted-foreground">
              Sign up with your details and get a unique device ID for secure access
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#29b81c] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Get Verified</h3>
            <p className="text-muted-foreground">Wait for admin verification to ensure your account security</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#29b81c] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Start Saving</h3>
            <p className="text-muted-foreground">Deposit funds, track your balance, and watch your savings grow</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-[#29b81c] to-[#25a518] text-white border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Start Saving?</h2>
            <p className="text-xl mb-8 text-emerald-50 text-pretty">
              Join Credit Jambo today and take control of your financial future
            </p>
            <Button size="lg" className="bg-white text-[#29b81c] hover:bg-[#f0f9f0] text-lg" asChild>
              <Link href="/register">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#29b81c] rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Credit Jambo Ltd</p>
                <p className="text-sm text-muted-foreground">NM 233 St, Nyamagumba, Musanze - Rwanda</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">+250 788 268 451</p>
              <p className="text-sm text-muted-foreground">hello@creditjambo.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Credit Jambo Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
