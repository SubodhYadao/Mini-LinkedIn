"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

interface SignupData {
  email: string
  password: string
  name: string
}

interface LoginData {
  email: string
  password: string
}

export async function signup({ email, password, name }: SignupData) {
  if (!email || !password || !name) {
    console.error("Error: Missing required form fields (email, password, or name).")
    return { error: "Missing required fields. Please fill in all fields." }
  }

  const supabase = await createSupabaseServerClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    console.error("Signup error:", error.message)
    return { error: error.message }
  }

  if (data.user) {
    const { error: updateError } = await supabase.from("users").update({ name }).eq("id", data.user.id)

    if (updateError) {
      console.error("Error updating user name:", updateError.message)
      return { error: updateError.message }
    }
  }

  revalidatePath("/")
  redirect("/")
}

export async function login({ email, password }: LoginData) {
  if (!email || !password) {
    console.error("Error: Missing required form fields (email or password).")
    return { error: "Missing required fields. Please fill in all fields." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function logout(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
  }

  revalidatePath("/")
  redirect("/login")
}
