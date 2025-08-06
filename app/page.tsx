import { createSupabaseServerClient } from "@/lib/supabase/server"
import { CreatePostForm } from "@/components/create-post-form"
import { PostCard } from "@/components/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, users(id, name, email)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error.message)
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
      <h1 className="text-4xl font-bold text-center">Public Feed</h1>

      {user && (
        <div className="w-full max-w-2xl">
          <CreatePostForm />
        </div>
      )}

      <div className="w-full max-w-2xl space-y-6">
        {typedPosts.length === 0 ? (
          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle>No posts yet!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Be the first to create a post.</p>
            </CardContent>
          </Card>
        ) : (
          typedPosts.map((post) => <PostCard key={post.id} {...post} />)
        )}
      </div>
    </div>
  )
}
