"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createPost } from "@/app/actions/posts"
import { toast } from "sonner"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function CreatePostForm() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("CreatePostForm: Client-side user:", user ? user.email : "No user logged in.")
    }
    checkUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error("Post content cannot be empty.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("content", content)

    const result = await createPost(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      setContent("")
      toast.success("Post created successfully!")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full"
        disabled={isSubmitting}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Create Post"}
      </Button>
    </form>
  )
}
