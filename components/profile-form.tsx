"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateProfile } from "@/app/actions/users"
import { toast } from "sonner"

interface ProfileFormProps {
  initialName: string | null
  initialBio: string | null
}

export function ProfileForm({ initialName, initialBio }: ProfileFormProps) {
  const [name, setName] = useState(initialName || "")
  const [bio, setBio] = useState(initialBio || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("bio", bio)

    const result = await updateProfile(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Profile updated successfully!")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
          Bio
        </label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
