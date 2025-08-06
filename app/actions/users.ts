"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string
  const bio = formData.get("bio") as string

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const { error } = await supabase.from("users").update({ name, bio }).eq("id", user.id)

  if (error) {
    console.error("Error updating profile:", error.message)
    return { error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}
