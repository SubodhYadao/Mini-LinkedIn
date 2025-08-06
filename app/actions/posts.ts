"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  const content = formData.get("content") as string
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content,
  })

  if (error) {
    console.error("Error creating post:", error.message)
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}
