"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { useActionState } from "react"
import { toast } from "sonner"

// Define a type for the state returned by the action
type LoginActionState = { error: string } | { success: boolean } | null

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPendingTransition, startTransition] = useTransition()

  const [state, formAction, isPendingAction] = useActionState<
    LoginActionState, // Type for the state
    { email: string; password: string } // Type for the payload
  >(
    async (prevState: LoginActionState, payload: { email: string; password: string }) => {
      return login(payload)
    },
    null, // Initial state
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = { email, password }
    startTransition(() => {
      formAction(payload)
    })
  }

  // Type guard to safely access 'error' property
  if (state && "error" in state && state.error) {
    toast.error(state.error)
  }

  const isSubmitting = isPendingAction || isPendingTransition

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>Enter your email and password below to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
