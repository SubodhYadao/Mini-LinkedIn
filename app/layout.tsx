import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { logout } from "./actions/auth"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mini LinkedIn",
  description: "A mini LinkedIn-like community platform built with Next.js and Supabase.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userName: string | null = null
  if (user) {
    const { data: userData } = await supabase.from("users").select("name").eq("id", user.id).single()
    userName = userData?.name || user.email
    console.log("RootLayout: User logged in:", user.email, "Name:", userName)
  } else {
    console.log("RootLayout: No user logged in.")
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <header className="border-b py-4 px-6 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-primary">
                Mini LinkedIn
              </Link>
              <nav className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/profile">
                      <Button variant="ghost">Profile ({userName})</Button>
                    </Link>
                    <form action={logout}>
                      <Button type="submit" variant="outline">
                        Logout
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </>
                )}
              </nav>
            </header>
            <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
