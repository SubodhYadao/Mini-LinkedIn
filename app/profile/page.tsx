import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"
import { PostCard } from "@/components/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect } from "next/navigation"

export default async function MyProfilePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError.message)
    return <div className="text-center text-red-500">Error loading profile.</div>
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*, users(id, name, email)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (postsError) {
    console.error("Error fetching posts:", postsError.message)
    return <div className="text-center text-red-500">Error loading posts.</div>
  }

  const typedPosts =
    posts?.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.created_at,
      author: {
        id: post.users?.id || "",
        name: post.users?.name || null,
        email: post.users?.email || "Unknown User",
      },
    })) || []

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-2xl p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || profile?.email}`} />
          <AvatarFallback className="text-4xl">{profile?.name ? profile.name[0] : profile?.email[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{profile?.name || profile?.email}</h1>
        <p className="text-muted-foreground">{profile?.email}</p>
        <p className="mt-2 text-lg">{profile?.bio || "No bio yet."}</p>
      </Card>

      <Card className="w-full max-w-2xl p-6">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialName={profile?.name} initialBio={profile?.bio} />
        </CardContent>
      </Card>

      <h2 className="text-3xl font-bold mt-8">Your Posts</h2>
      <div className="w-full max-w-2xl space-y-6">
        {typedPosts.length === 0 ? (
          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle>No posts yet!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You haven&apos;t created any posts.</p>
            </CardContent>
          </Card>
        ) : (
          typedPosts.map((post) => <PostCard key={post.id} {...post} />)
        )}
      </div>
    </div>
  )
}
